use super::{Measured2d, Primitive2d};
use core::f32::consts::PI;

use crate::{
    Vec2,
    ops::{self, FloatPow},
};

/// A circle primitive, representing the set of points some distance from the origin
#[derive(Clone, Copy, Debug, PartialEq)]
pub struct Circle {
    /// The radius of the circle
    pub radius: f32,
}

impl Primitive2d for Circle {}

impl Default for Circle {
    /// Returns the default [`Circle`] with a radius of `0.5`.
    fn default() -> Self {
        Self { radius: 0.5 }
    }
}

impl Circle {
    /// Create a new [`Circle`] from a `radius`
    #[inline(always)]
    pub const fn new(radius: f32) -> Self {
        Self { radius }
    }

    /// Get the diameter of the circle
    #[inline(always)]
    pub fn diameter(&self) -> f32 {
        2.0 * self.radius
    }

    /// Finds the point on the circle that is closest to the given `point`.
    ///
    /// If the point is outside the circle, the returned point will be on the perimeter of the circle.
    /// Otherwise, it will be inside the circle and returned as is.
    #[inline(always)]
    pub fn closest_point(&self, point: Vec2) -> Vec2 {
        let distance_squared = point.length_squared();

        if distance_squared <= self.radius.squared() {
            // The point is inside the circle.
            point
        } else {
            // The point is outside the circle.
            // Find the closest point on the perimeter of the circle.
            let dir_to_point = point / ops::sqrt(distance_squared);
            self.radius * dir_to_point
        }
    }
}

impl Measured2d for Circle {
    /// Get the area of the circle
    #[inline(always)]
    fn area(&self) -> f32 {
        PI * self.radius.squared()
    }

    /// Get the perimeter or circumference of the circle
    #[inline(always)]
    #[doc(alias = "circumference")]
    fn perimeter(&self) -> f32 {
        2.0 * PI * self.radius
    }
}
