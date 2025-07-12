#[cfg(feature = "std")]
mod std_ops_for_no_std {
    //! Provides standardized names for [`f32`] operations which may not be
    //! supported on `no_std` platforms.
    //! On `std` platforms, this forwards directly to the implementations provided
    //! by [`std`].

    /// Returns the square root of a number.
    ///
    /// The result of this operation is guaranteed to be the rounded infinite-precision result.
    /// It is specified by IEEE 754 as `squareRoot` and guaranteed not to change.
    #[inline(always)]
    pub fn sqrt(x: f32) -> f32 {
        f32::sqrt(x)
    }
}

/// This extension trait covers shortfall in determinacy from the lack of a `libm` counterpart
/// to `f32::powi`. Use this for the common small exponents.
pub trait FloatPow {
    /// Squares the f32
    fn squared(self) -> Self;
    /// Cubes the f32
    fn cubed(self) -> Self;
}

impl FloatPow for f32 {
    #[inline]
    fn squared(self) -> Self {
        self * self
    }
    #[inline]
    fn cubed(self) -> Self {
        self * self * self
    }
}

#[cfg(feature = "std")]
pub use std_ops_for_no_std::*;
