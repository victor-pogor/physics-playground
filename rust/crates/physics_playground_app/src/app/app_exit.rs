use std::num::NonZero;

#[derive(Event, BufferedEvent, Debug, Clone, Default, PartialEq, Eq)]
pub enum AppExit {
    #[default]
    Success,
    Error(NonZero<u8>),
}

impl AppExit {
    #[must_use]
    pub const fn error() -> Self {
        Self::Error(NonZero::<u8>::MIN)
    }

    #[must_use]
    pub const fn is_success(&self) -> bool {
        matches!(self, AppExit::Success)
    }

    #[must_use]
    pub const fn is_error(&self) -> bool {
        matches!(self, AppExit::Error(_))
    }

    #[must_use]
    pub const fn from_code(code: u8) -> Self {
        match NonZero::<u8>::new(code) {
            Some(code) => Self::Error(code),
            None => Self::Success,
        }
    }
}

impl From<u8> for AppExit {
    fn from(value: u8) -> Self {
        Self::from_code(value)
    }
}

#[cfg(feature = "std")]
impl Termination for AppExit {
    fn report(self) -> ExitCode {
        match self {
            AppExit::Success => ExitCode::SUCCESS,
            // We leave logging an error to our users
            AppExit::Error(value) => ExitCode::from(value.get()),
        }
    }
}
