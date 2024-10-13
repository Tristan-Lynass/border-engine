
import { Triangle, Vector2D, Vector3D } from './model';
import { Viewport, Camera } from './camera';
import { render } from './renderer';
// function magnitude(v1: Vector2D, v2: Vector2D): number {
//     return math.
// }

const triangles: Triangle<Vector3D>[] = [
    [
        [1, 1, 2.1],
        [1, .5, 2],
        [1, 1, .5],
    ]
];

// TODO: Calculate the viewport based on camera pos + direction
const viewport: Viewport = {
    bottomR: [-3, -3, -3],
    topR: [-3, -3, 3],
    topL: [-3, 3, 3],
    bottomL: [-3, 3, -3]
};

const camera = new Camera([-10, 0, 0], viewport);

render(camera, triangles.map(t =>[
    camera.project(t[0]),
    camera.project(t[1]),
    camera.project(t[2])
] as const))
