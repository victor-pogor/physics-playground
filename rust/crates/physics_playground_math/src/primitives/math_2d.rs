pub mod circle;

/// A marker trait for 2D primitives
pub trait Primitive2d {}

/// A trait for getting measurements of 2D shapes
pub trait Measured2d {
    /// Get the perimeter of the shape
    fn perimeter(&self) -> f32;

    /// Get the area of the shape
    fn area(&self) -> f32;
}
