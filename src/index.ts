import {Camera, Viewport} from './camera';
import {render} from './renderer';
import {Vector3D} from "./maths/vectors";
import {Triangle} from "./maths/triangles";

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
