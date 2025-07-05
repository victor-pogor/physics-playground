mod app;

pub use app::*;

pub mod prelude {
    #[doc(hidden)]
    pub use crate::app::{App, AppExit};
}
