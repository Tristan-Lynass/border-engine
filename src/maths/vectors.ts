import * as math from "mathjs";
import {tanh} from "mathjs";
import {radToDeg} from "./trigonometry";

export type Vector3D = [number, number, number];
export type Vector2D = [number, number];

export type RotationMatrix3D = [Vector3D, Vector3D, Vector3D];


export function line(source: Vector3D, point: Vector3D, t: number): Vector3D {
    return math.add(source, math.multiply(t, math.subtract(point, source))) as Vector3D;
}

export function x(vector: Vector2D | Vector3D): number {
    return vector[0];
}

export function y(vector: Vector2D | Vector3D): number {
    return vector[1];
}

export function z(vector: Vector3D): number {
    return vector[2];
}


/**
 *
 * @param a
 * @param b
 *
 * @returns  The gradient and the angle formed by the x-axis and a given line (measured counterclockwise from the positive half of the x-axis)
 */
export function lineInfo(a: Vector2D, b: Vector2D): Readonly<{ gradient: number, angle: number }> {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    if (dx === 0) {
        return {gradient: Number.POSITIVE_INFINITY, angle: 90};
    }

    if (dy === 0) {
        return {gradient: 0, angle: 0};
    }

    const gradient = dy / dx;

    return {gradient, angle: (gradient < 0 ? 180 : 0) + radToDeg(tanh(gradient))};
}


export function magnitude(v1: Vector2D, v2: Vector2D): number {
    return math.norm(math.subtract(v2, v1)) as number; // TODO: address blind cast
}
