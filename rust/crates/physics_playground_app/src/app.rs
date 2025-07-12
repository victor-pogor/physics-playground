pub mod app_exit;

pub use app_exit::*;

pub struct App {
    pub(crate) sub_apps: SubApps,
    /// The function that will manage the app's lifecycle.
    ///
    /// Bevy provides the [`WinitPlugin`] and [`ScheduleRunnerPlugin`] for windowed and headless
    /// applications, respectively.
    ///
    /// [`WinitPlugin`]: https://docs.rs/bevy/latest/bevy/winit/struct.WinitPlugin.html
    /// [`ScheduleRunnerPlugin`]: https://docs.rs/bevy/latest/bevy/app/struct.ScheduleRunnerPlugin.html
    pub(crate) runner: RunnerFn,
    default_error_handler: Option<ErrorHandler>,
}

impl App {
    pub fn new() -> App {
        App::default()
    }

    pub fn empty() -> App {
        Self {
            sub_apps: SubApps {
                main: SubApp::new(),
                sub_apps: HashMap::default(),
            },
            runner: Box::new(run_once),
            default_error_handler: None,
        }
    }
}

impl Debug for App {
    fn fmt(&self, f: &mut core::fmt::Formatter<'_>) -> core::fmt::Result {
        write!(f, "App {{ sub_apps: ")?;
        f.debug_map()
            .entries(self.sub_apps.sub_apps.iter())
            .finish()?;
        write!(f, "}}")
    }
}

impl Default for App {
    fn default() -> Self {
        let mut app = App::empty();
        app.sub_apps.main.update_schedule = Some(Main.intern());

        app.add_plugins(MainSchedulePlugin);
        app.add_systems(
            First,
            event_update_system
                .in_set(bevy_ecs::event::EventUpdateSystems)
                .run_if(bevy_ecs::event::event_update_condition),
        );
        app.add_event::<AppExit>();

        app
    }
}

type RunnerFn = Box<dyn FnOnce(App) -> AppExit>;

fn run_once(mut app: App) -> AppExit {
    while app.plugins_state() == PluginsState::Adding {
        #[cfg(not(all(target_arch = "wasm32", feature = "web")))]
        bevy_tasks::tick_global_task_pools_on_main_thread();
    }
    app.finish();
    app.cleanup();

    app.update();

    app.should_exit().unwrap_or(AppExit::Success)
}
