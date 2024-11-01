import * as math from 'mathjs';
import {line, RotationMatrix3D, Vector2D, Vector3D, x, y} from "../maths/vectors";
import {degToRad} from "../maths/trigonometry";

export interface Viewport {
    readonly bottomL: Vector3D;
    readonly topL: Vector3D;
    readonly bottomR: Vector3D;
    readonly topR: Vector3D;

    readonly u: Axis;
    readonly v: Axis;
}

export interface Axis {
    readonly direction: Vector3D;
    readonly length: number;
}

export interface CameraSnapshot {
    readonly position: Vector3D;
    readonly normal: Vector3D; // FIXME: Not used, should be used to point
    readonly rotation?: RotationMatrix3D;
    readonly fov: number;
    readonly viewportDepth: number;
    readonly aspectRatio: number;
}

export class Camera {

    private _location: CameraSnapshot;
    private _viewport: Viewport;

    constructor(location: CameraSnapshot) {
        this._location = location;
        this._viewport = this.calculateViewport();
    }

    set location(location: CameraSnapshot) {
        this._location = location;
        this._viewport = this.calculateViewport();
    }

    get location(): CameraSnapshot {
        return this._location;
    }

    get viewport(): Viewport {
        return this._viewport;
    }

    private calculateViewport(): Viewport {
        const {viewportDepth, aspectRatio, fov} = this.location;
        const height = 2 * viewportDepth * Math.tan(degToRad(fov / 2));
        const width = aspectRatio * height;

        // Simple way of turning each 2d viewport coordinate into a 3d scaled camera space vector
        const viewportMatrix: Vector3D = [width / 2, height / 2, -viewportDepth];

        const topL = this.viewportCoordinate([-1, 1], viewportMatrix);
        const topR = this.viewportCoordinate([1, 1], viewportMatrix);
        const bottomL = this.viewportCoordinate([-1, -1], viewportMatrix);
        const bottomR = this.viewportCoordinate([1, -1], viewportMatrix);

        const x = {
            topL,
            topR,
            bottomL,
            bottomR,
            u: {direction: math.subtract(bottomR, bottomL), length: width},
            v: {direction: math.subtract(topL, bottomL), length: height}
        };

        console.log(x);
        return x;
    }

    /**
     * v(cam) = cameraCoordinate * viewportMatrix   // The point vector in camera space
     * v(world) =rotation * v(cam) + position       // The point vector in world space
     *
     * FIXME: Factor in normal vector when calculating here
     * @param cameraCoordinate
     * @param viewportMatrix
     */
    private viewportCoordinate(cameraCoordinate: Vector2D,
                               viewportMatrix: Vector3D): Vector3D {
        const {rotation, position} = this.location;

        // Manual cross product
        const vCam: Vector3D = [x(cameraCoordinate) * x(viewportMatrix), y(cameraCoordinate) * y(viewportMatrix), y(viewportMatrix)]

        const rotated = rotation == null ? vCam : math.multiply(rotation, vCam);
        return math.add(rotated, position);
    }

    /**
     * Projects the 3D point in space onto a unit viewport.
     * @param point
     */
    project(point: Vector3D): Vector2D {
        const intersection = this.intersection(point);
        //  u (our new x-coord); u = (P . X) / (X . X)
        const uAxis = this.viewport.u.direction;
        const u = math.divide(math.dot(intersection, uAxis), math.dot(uAxis, uAxis));
        //  v (our new y-coord; v = (P . Y)/(Y . Y)
        const vAxis = this.viewport.v.direction;
        const v = math.divide(math.dot(intersection, vAxis), math.dot(vAxis, vAxis));

        // TODO: Remove rounding
        // Scale the raw values in our viewport, into values on a unit viewport
        return [
            math.round(u, 4),
            math.round(v, 4)
        ];
    }

    private intersection(point: Vector3D): Vector3D {
        // t = -n . (camera - topL) / n . (point - camera)

        // Step 1: Calculate n ⋅ (camera - topL)
        const dot1 = math.dot(this.location.normal, math.subtract(this.location.position, this.viewport.topL));

        // Step 2: Calculate n ⋅ (point - camera)
        const dot2 = math.dot(this.location.normal, math.subtract(point, this.location.position));

        // Step 3: Calculate t
        const t = math.divide(math.unaryMinus(dot1), dot2);


        return line(this.location.position, point, t);
    }
}
