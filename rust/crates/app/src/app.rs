#[cfg(feature = "trace")]
use tracing::info_span;

#[cfg(feature = "std")]
use std::{
    panic::{catch_unwind, resume_unwind},
    process::{ExitCode, Termination},
};
