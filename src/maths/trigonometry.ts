const CONVERSION_FACTOR = 180 / Math.PI;

export function radToDeg(rad: number): number {
    return rad * CONVERSION_FACTOR;
}

export function degToRad(degrees: number): number {
    return degrees / CONVERSION_FACTOR;
}

