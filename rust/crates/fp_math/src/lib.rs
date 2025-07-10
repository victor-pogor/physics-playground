#![no_std]

//! Provides math types and functionality for the physics engine.
//!
//! The commonly used types are vectors like [`Vec2`] and [`Vec3`],
//! matrices like [`Mat2`], [`Mat3`] and [`Mat4`] and orientation representations
//! like [`Quat`].

pub mod ops;
pub mod primitives;

pub use glam::*;
