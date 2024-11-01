import {lineInfo, magnitude, Vector2D, x, y} from "./vectors";

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
        const isTipTop = y(tip) > y(b)
        return isTipTop ? {triangle: [tip, b, c], angle} : {triangle: [tip, c, b], angle: angle + 180}
    }

    if (gradient === Number.POSITIVE_INFINITY) { // vertical line
        const isTipLeft = x(tip) < x(b);
        const [highY, lowY] = y(b) > y(c) ? [b, c] : [c, b]// vertically sort the base points
        return isTipLeft ? {triangle: [tip, lowY, highY], angle} : {triangle: [tip, highY, lowY], angle: angle + 180}
    }


    // y = mx + c
    // c = gradient * x1 - y1
    // y = gradient * x + (gradient * x1 - y1)
    //
    // y being the vertical point of intersection with the line
    const yIntersect = gradient * x(tip) + (y(b) - gradient * x(b));
    const aboveLine = y(tip) > yIntersect;

    if (gradient > 0) { // positive gradient
        return aboveLine ? {triangle: [tip, b, c], angle: angle} : {triangle: [tip, c, b], angle: angle + 180}
    }

    // negative gradient
    return aboveLine ? {triangle: [tip, b, c], angle: angle + 180} : {triangle: [tip, c, b], angle: angle}

    // FIXME test against this and delete
    // const isTipTopRight = x(tip) > x(b) && y(tip) > y(c);
    // return isTipTopRight ? {triangle: [tip, b, c], angle: angle + 180} : {triangle: [tip, c, b], angle: angle}
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
    if (x(b) > x(c)) { // ensure b is before c along the x-axis for consistent gradient
        [b, c] = [c, b];
    }
    return [a, b, c];
}
