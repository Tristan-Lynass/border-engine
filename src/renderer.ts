import {Camera} from './camera';
import {normaliseB, Triangle} from "./maths/triangles";
import {Vector2D} from "./maths/vectors";

const viewport = document.getElementById('viewport')!;
const {width, height} = viewport?.getBoundingClientRect();


export function render(camera: Camera, triangles: Triangle<Vector2D>[]): void {
    for (const triangle of triangles) {
        const e = document.createElement('div');
        e.setAttribute('class', 'triangle')
        e.setAttribute('style', css(triangle, camera))
        viewport.appendChild(e);
    }
}

function css(triangle: Triangle<Vector2D>, camera: Camera): string {
    const {vw, vh} = camera;
    const scaleScreenWidth = (x: number) => (width * (x / vw));
    const scaleScreenHeight = (x: number) => (height * (x / vh));

    const {triangle: [top, left, right,], angle} = normaliseB(triangle);

    const leftOffset = scaleScreenWidth(top[0]);
    const bottomOffset = scaleScreenHeight(top[1])

    return 'border-left-width:' + scaleScreenWidth(left[0])
        + 'px;border-right-width:' + scaleScreenWidth(right[0])
        + 'px;border-bottom-width:' + scaleScreenHeight(left[1])
        + 'px;left:' + leftOffset
        + 'px;bottom:' + bottomOffset
        + 'px;transform: rotate(' + (-angle) + 'deg);';
}
