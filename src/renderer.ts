import * as math from 'mathjs';
import {Camera} from './camera';
import {Triangle} from "./maths/triangles";
import {Vector2D} from "./maths/vectors";

const viewport = document.getElementById('viewport')!;
const { width, height } = viewport?.getBoundingClientRect();


export function render(camera: Camera, triangles: Triangle<Vector2D>[]): void {
    for (const t of triangles) {
        // a is the pivot, and b->c is the hypotenuse
        const [top, b, c] = normalise(t); // FIXME: guarentee left and right

        // First find out how to rotate the hypotenuse so it's parallel with the x-axis
        const rise = c[1] - b[1];
        const run = c[0] - b[0];
        const angle = math.atan(rise / run);
        console.log(`Angle = ${angle * 180 / Math.PI}`);


        const e = document.createElement('div');
        e.setAttribute('class', 'triangle')
        e.setAttribute('style', css(math.multiply(top, 10) as Vector2D, b, c, angle, camera))
        viewport.appendChild(e);

        console.log(`(${top[0]}, ${top[1]}), (${b[0]}, ${b[1]}), (${c[0]}, ${c[1]})`);
    }
}

function css(top: Vector2D, b: Vector2D, c: Vector2D, angle: number, camera: Camera): string {
    const { vw, vh } = camera;
    const scaleScreenWidth = (x: number) => (width * (x / vw));
    const scaleScreenHeight = (x: number) => (height * (x / vh));

    const leftOffset = scaleScreenWidth(top[0]);
    const bottomOffset = scaleScreenHeight(top[1])

    const rotationMatrix = rotate(angle);
    b = math.multiply(rotationMatrix, math.subtract(b, top));
    c = math.multiply(rotationMatrix, math.subtract(c, top));

    let left: Vector2D;
    let right: Vector2D;
    if (b[0] > c[0]) {
        left = c;
        right = b;
    } else {
        left = b;
        right = c;
    }
    
    return 'border-left-width:' + scaleScreenWidth(left[0])
        + 'px;border-right-width:' + scaleScreenWidth(right[0])
        + 'px;border-bottom-width:' + scaleScreenHeight(left[1])
        + 'px;left:' + leftOffset
        + 'px;bottom:' + bottomOffset
        + 'px;transform: rotate(' + (-angle) + 'rad);';
}

function rotate(theta: number): [[number, number], [number, number]] {
    return [
        [Math.cos(theta), -Math.sin(theta)],
        [Math.sin(theta), Math.cos(theta)]
    ];
}


/**
 * 
 * @param triangle 
 * @returns The input triangle, with the 0th point guarenteed to be the 'top' of the triangle, and the other two points representing the 'base'.
 */
function normalise(t: Triangle<Vector2D>): Triangle<Vector2D> {
    const [a, b, c] = t;

    const ab = magnitude(a, b);
    const bc = magnitude(b, c);
    const ca = magnitude(c, a);
    const max = Math.max(ab, bc, ca);

    if (max === ab) {
        return [c, a, b];
    }
    if (max === ca) {
        return [b, c, a];
    }
    return t;
}

function magnitude(v1: Vector2D, v2: Vector2D): number {
    return math.norm(math.subtract(v2, v1)) as number; // TODO: address blind cast
}