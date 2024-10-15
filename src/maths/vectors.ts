import * as math from "mathjs";

export type Vector3D = [number, number, number];
export type Vector2D = [number, number];


export function line(source: Vector3D, point: Vector3D, t: number): Vector3D {
    return math.add(source, math.multiply(t, math.subtract(point, source))) as Vector3D;
}