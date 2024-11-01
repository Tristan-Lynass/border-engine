// FIXME
// import {Camera, Viewport} from "./camera";
// import {describe, expect, test} from "@jest/globals"
// import {Vector3D} from "../maths/vectors";
// import {Triangle} from "../maths/triangles";
//
// const viewport: Viewport = {
//     bottomR: [-3, -3, -3],
//     topR: [-3, -3, 3],
//     topL: [-3, 3, 3],
//     bottomL: [-3, 3, -3]
// };
//
// const camera = new Camera([-10, 0, 0], viewport);
//
// describe('Camera', () => {
//     test('projects a 3D vector onto a VP 2D vector', () => {
//         const [a, b, c]: Triangle<Vector3D> = [
//             [1, 1, 2.1],
//             [1, .5, 2],
//             [1, 1, .5],
//         ];
//
//         expect(camera.project(a)).toEqual([-0.1061, 0.2227]);
//         expect(camera.project(b)).toEqual([-0.053, 0.2121,]);
//         expect(camera.project(c)).toEqual([-0.1061, 0.053]);
//     });
// });
