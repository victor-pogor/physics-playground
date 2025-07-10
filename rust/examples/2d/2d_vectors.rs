// use bevy::prelude::*;

// fn main() {
//     let mut app = App::new();
//     app.add_plugins((
//         DefaultPlugins,
//         #[cfg(not(target_arch = "wasm32"))]
//         Wireframe2dPlugin::default(),
//     ))
//     .add_systems(Startup, setup);
//     #[cfg(not(target_arch = "wasm32"))]
//     app.add_systems(Update, toggle_wireframe);
//     app.run();
// }

// const X_EXTENT: f32 = 900.;

// fn setup(
//     mut commands: Commands,
//     mut meshes: ResMut<Assets<Mesh>>,
//     mut materials: ResMut<Assets<ColorMaterial>>,
// ) {
//     commands.spawn(Camera2d);

//     let shapes = [
//         meshes.add(Circle::new(50.0)),
//     ];
//     let num_shapes = shapes.len();

//     for (i, shape) in shapes.into_iter().enumerate() {
//         // Distribute colors evenly across the rainbow.
//         let color = Color::hsl(360. * i as f32 / num_shapes as f32, 0.95, 0.7);

//         commands.spawn((
//             Mesh2d(shape),
//             MeshMaterial2d(materials.add(color)),
//             Transform::from_xyz(
//                 // Distribute shapes from -X_EXTENT/2 to +X_EXTENT/2.
//                 -X_EXTENT / 2. + i as f32 / (num_shapes - 1) as f32 * X_EXTENT,
//                 0.0,
//                 0.0,
//             ),
//         ));
//     }
// }

fn main() {
    println!(
        "This example is not meant to be run directly. Please refer to the documentation for usage instructions."
    );
}
