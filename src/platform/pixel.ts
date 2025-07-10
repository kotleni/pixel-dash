const PIXEL_DEFAULT_COLOR = '#000000';

export interface Pixel {
    x: number;
    y: number;
    color: string;
}

export function createPixel(x: number, y: number): Pixel {
    return {x, y, color: PIXEL_DEFAULT_COLOR};
}
