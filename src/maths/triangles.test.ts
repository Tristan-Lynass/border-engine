import {describe, expect, test} from "@jest/globals";
import {Vector2D} from "./vectors";
import {normaliseB, Triangle} from "./triangles";


describe('normaliseB', () => {
    test('normalises horizontal bases', () => {
        const pointingUp: Triangle<Vector2D> = [[3, 3], [1, 1], [5, 1]];
        expect(normaliseB(pointingUp)).toEqual({triangle: pointingUp, angle: 0});

        const pointingDown: Triangle<Vector2D> = [[3, -1], [1, 1], [5, 1]];
        const [tip, right, left] = pointingDown;
        expect(normaliseB(pointingDown)).toEqual({triangle: [tip, left, right], angle: 180});
    });

    test('normalises vertical bases', () => {
        const pointingLeft: Triangle<Vector2D> = [[-1, 3], [1, 1], [1, 5]];
        let [tip, left, right] = pointingLeft;
        expect(normaliseB(pointingLeft)).toEqual({triangle: [tip, left, right], angle: 90});

        const pointingRight: Triangle<Vector2D> = [[3, 3], [1, 1], [1, 5]];
        [tip, right, left] = pointingRight;
        expect(normaliseB(pointingRight)).toEqual({triangle: [tip, left, right], angle: 270});
    });

    test('normalises bases running bottom left <-> top right', () => {
        const pointingTopLeft: Triangle<Vector2D> = [[1, 1], [1.5, 3], [4, 3]];
        let [left, tip, right] = pointingTopLeft;
        expect(normaliseB(pointingTopLeft)).toEqual({triangle: [tip, left, right], angle: 33.39100314063857});

        const pointingBottomRight: Triangle<Vector2D> = [[1, 1], [3.5, 1.5], [4, 3]];
        [right, tip, left] = pointingBottomRight;
        expect(normaliseB(pointingBottomRight)).toEqual({triangle: [tip, left, right], angle: 213.39100314063857});
    });

    // FIXME: add tests that break the old logic
    test('normalises bases running top left <-> bottom right', () => {
        const pointingTopRight: Triangle<Vector2D> = [[1.5, 4.5], [4, 1.5], [4, 4]];
        let [left, right, tip] = pointingTopRight;
        expect(normaliseB(pointingTopRight)).toEqual({triangle: [tip, left, right], angle: 312.2351094465663});

        const pointingBottomLeft: Triangle<Vector2D> = [[1.5, 4.5], [4, 1.5], [1, 2]];
        [right, left, tip] = pointingBottomLeft;
        expect(normaliseB(pointingBottomLeft)).toEqual({triangle: [tip, left, right], angle: 132.23510944656627});
    });
});
