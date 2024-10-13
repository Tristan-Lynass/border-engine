import * as math from 'mathjs';
import { Triangle, Vector2D, Vector3D } from './model';

export interface Viewport {
    readonly bottomL: Vector3D;
    readonly topL: Vector3D;
    readonly bottomR: Vector3D;
    readonly topR: Vector3D;
}


export class Camera {
    readonly n: Vector3D;
    readonly origin: Vector3D;
    readonly uAxis: Vector3D;
    readonly vAxis: Vector3D;

    readonly vw: number;
    readonly vh: number

    constructor(readonly location: Vector3D, readonly viewport: Viewport) {
        this.origin = this.viewport.bottomL;
        this.n = math.cross(math.subtract(viewport.bottomL, viewport.topL), math.subtract(viewport.topR, viewport.topL)) as Vector3D;
        this.uAxis = math.subtract(this.viewport.bottomR, this.origin);
        this.vAxis = math.subtract(this.viewport.topL, this.origin);

        this.vw = math.norm(math.subtract(this.origin, viewport.bottomR)) as number;
        this.vh = math.norm(math.subtract(this.origin, viewport.topL)) as number;
    }

    project(point: Vector3D): Vector2D {
        const intersection = this.intersection(point);
        //  u (our new x-coord); u = (P . X) / (X . X)
        const u = math.divide(math.dot(intersection, this.uAxis), math.dot(this.uAxis, this.uAxis));
        //  v (our new y-coord; v = (P . Y)/(Y . Y)
        const v = math.divide(math.dot(intersection, this.vAxis), math.dot(this.vAxis, this.vAxis));
        return [math.round(u, 4), math.round(v, 4)];
    }

    private intersection(point: Vector3D): Vector3D {
        // t = -n . (camera - topL) / n . (point - camera)

        // Step 1: Calculate n ⋅ (camera - topL)
        const dot1 = math.dot(this.n, math.subtract(this.location, this.viewport.topL));

        // Step 2: Calculate n ⋅ (point - camera)
        const dot2 = math.dot(this.n, math.subtract(point, this.location));

        // Step 3: Calculate t
        const t = math.divide(math.unaryMinus(dot1), dot2);


        return this.line(point, t);
    }

    private line(point: Vector3D, t: number): Vector3D {
        return math.add(this.location, math.multiply(t, math.subtract(point, this.location))) as Vector3D;
    }
}
