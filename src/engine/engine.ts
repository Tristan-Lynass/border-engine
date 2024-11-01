import {Camera} from "./camera";
import {normaliseB, Triangle} from "../maths/triangles";
import {Vector2D, Vector3D, x, y} from "../maths/vectors";

export class DomEngine {

    private readonly viewport: HTMLElement;

    readonly camera = new Camera({
        position: [-10, 0, 0],
        normal: [0, 0, 1],
        fov: 120,
        viewportDepth: 5,
        aspectRatio: 1
    });

    private readonly domPool: HTMLElement[];

    constructor(anchor: HTMLElement) {
        this.viewport = document.createElement('div');
        this.viewport.setAttribute('class', 'viewport')
        anchor.appendChild(this.viewport);

        const e = document.createElement('div');
        e.setAttribute('class', 'triangle');
        this.viewport.appendChild(e);
        this.domPool = [e]
    }

    private readonly _triangles: Triangle<Vector3D>[] = [];

    set triangles(triangles: Triangle<Vector3D>[]) {
        this._triangles.push(...triangles);
    }

    render(): void {
        const {width, height} = this.viewport.getBoundingClientRect();

        this._triangles
            .map(t => {
                const x = [
                    this.camera.project(t[0]),
                    this.camera.project(t[1]),
                    this.camera.project(t[2])
                ] as const;
                console.log(`(${x[0][0]}, ${x[0][1]}), (${x[1][0]}, ${x[1][1]}), (${x[2][0]}, ${x[2][1]})`);
                return x;
            })
            .forEach((triangle, i) => {
                const e = this.domPool[i];
                e.setAttribute('style', this.css(triangle, width, height))
            });
    }

    private css(triangle: Triangle<Vector2D>, width: number, height: number): string {
        const {triangle: [top, left, right], angle} = normaliseB(triangle);
        console.log(top, left, right, angle);

        return 'border-left-width:' + (width * Math.abs(x(left)))
            + 'px;border-right-width:' + (width * Math.abs(x(right)))
            + 'px;border-bottom-width:' + (height * Math.abs(y(left)))
            + 'px;left:' + (width * x(top))
            + 'px;bottom:' + (height * y(top))
            + 'px;transform: rotate(' + (-angle) + 'deg);';
    }
}
