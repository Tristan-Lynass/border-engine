const RAD_CONVERSION_FACTOR = 180 / Math.PI;

export function radToDeg(rad: number): number {
    return rad * RAD_CONVERSION_FACTOR;
}