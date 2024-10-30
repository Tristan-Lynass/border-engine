import {describe, expect, test} from "@jest/globals";
import {lineInfo} from "./vectors";


describe('lineInfo', () => {
    test('calculates gradient and angle of inclination', () => {
        const horizontal = lineInfo([1, 5], [2, 5]);
        expect(horizontal).toEqual({gradient: 0, angle: 0});

        const vertical = lineInfo([5, 1], [5, 2]);
        expect(vertical).toEqual({gradient: Number.POSITIVE_INFINITY, angle: 90});

        const positive = lineInfo([0, 0], [2, 5]);
        expect(positive).toEqual({gradient: 2.5, angle: 56.528835291338815});

        const negative = lineInfo([2, 5], [4, 1]);
        expect(negative).toEqual({gradient: -2, angle: 124.76528832744569});
    });
});
