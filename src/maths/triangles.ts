import {lineInfo, Vector2D} from "./vectors";
import * as math from "mathjs";

export type Triangle<T> = readonly [T, T, T];

export interface NormalisedTriangle {

    /**
     * The number of degrees the longest side needs to be rotated anti-clockwise to be parallel with the x-axis
     */
    readonly angle: number;

    /**
     * [0] is the point, [1] is the left corner of the longest side, [2] is the right corner of the longest side.
     */
    readonly triangle: Triangle<Vector2D>;

}

/**
 * Uses gradient analysis to determine the correct normalised form of the triangle and the longest-side's angle of inclination about the tip.
 * @param triangle
 */
export function normaliseB(triangle: Triangle<Vector2D>): NormalisedTriangle {
    triangle = normaliseLongestSide(triangle);
    const [tip, b, c] = triangle

    const {gradient, angle} = lineInfo(b, c);
    if (gradient === 0) { // horizontal line
        const isTipTop = tip[1] > b[1]
        return isTipTop ? {triangle: [tip, b, c], angle} : {triangle: [tip, c, b], angle: angle + 180}
    }

    if (gradient === Number.POSITIVE_INFINITY) { // vertical line
        const isTipLeft = tip[0] < b[0];
        const [highY, lowY] = b[1] > c[1] ? [b, c] : [c, b]// vertically sort the base points
        return isTipLeft ? {triangle: [tip, lowY, highY], angle} : {triangle: [tip, highY, lowY], angle: angle + 180}
    }


    // y = mx + c
    // c = gradient * x1 - y1
    // y = gradient * x + (gradient * x1 - y1)
    //
    // y being the vertical point of intersection with the line
    const y = gradient * tip[0] + (b[1] - gradient * b[0]);
    const aboveLine = tip[1] > y;

    if (gradient > 0) { // positive gradient
        return aboveLine ? {triangle: [tip, b, c], angle: angle} : {triangle: [tip, c, b], angle: angle + 180}
    }

    // negative gradient
    return aboveLine ? {triangle: [tip, b, c], angle: angle + 180} : {triangle: [tip, c, b], angle: angle}

    // FIXME test against this and delete
    // const isTipTopRight = tip[0] > b[0] && tip[1] > c[1];
    // return isTipTopRight ? {triangle: [tip, b, c], angle: angle + 180} : {triangle: [tip, c, b], angle: angle}
}

export function normaliseA(triangle: Triangle<Vector2D>): NormalisedTriangle {
    triangle = normaliseLongestSide(triangle);
    const [top, b, c] = triangle;
    let angle = normalisationAngle(triangle);
    const rotationMatrix = rotate(angle);

    const topR = math.multiply(rotationMatrix, top);
    const bR = math.multiply(rotationMatrix, math.subtract(b, top));

    let left: Vector2D;
    let right: Vector2D;

    // b.x < top.x then; b must be on the left
    if (bR[0] < topR[0]) {
        left = b;
        right = c;
    } else {
        left = c;
        right = b;
    }

    if (bR[1] > topR[1]) {
        // the triangle point is upside down, so flip the angle and the left & rights.
        angle += 180;
        [left, right] = [right, left];
    }

    return {triangle: [top, left, right], angle};
}


function normalisationAngle(triangle: Triangle<Vector2D>): number {
    const [_a, b, c] = triangle;
    const rise = c[1] - b[1];
    const run = c[0] - b[0];
    const angle = math.atan(rise / run) * 180 / Math.PI;
    console.log(`Angle = ${angle}`);
    return angle;
}

/**
 * @param triangle The triangle for which to find the longest side.
 * @returns The input triangle, with the 0th point guaranteed to be the 'top' of the triangle, and the other two points representing the 'base'.
 */
function normaliseLongestSide(triangle: Triangle<Vector2D>): Triangle<Vector2D> {
    const [a, b, c] = triangle;

    const ab = magnitude(a, b);
    const bc = magnitude(b, c);
    const ca = magnitude(c, a);
    const max = Math.max(ab, bc, ca);

    let normalised = triangle;
    if (max === ab) {
        normalised = [c, a, b];
    } else if (max === ca) {
        normalised = [b, c, a];
    }

    return normaliseBase(normalised);
}

function normaliseBase(triangle: Triangle<Vector2D>): Triangle<Vector2D> {
    let [a, b, c] = triangle;
    if (b[0] > c[0]) { // ensure b is before c along the x-axis for consistent gradient
        [b, c] = [c, b];
    }
    return [a, b, c];
}

function magnitude(v1: Vector2D, v2: Vector2D): number {
    return math.norm(math.subtract(v2, v1)) as number; // TODO: address blind cast
}

function rotate(theta: number): [[number, number], [number, number]] {
    return [
        [Math.cos(theta), -Math.sin(theta)],
        [Math.sin(theta), Math.cos(theta)]
    ];
}
