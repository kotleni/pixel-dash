import {createPixel, Pixel} from './pixel';

export const CHUNK_SIZE = 16;

export interface Chunk {
    pixels: Pixel[];
    x: number;
    y: number;
}

export function createChunk(x: number, y: number): Chunk {
    const pixels: Pixel[] = [];
    for (let i = 0; i < CHUNK_SIZE; i++) {
        for (let j = 0; j < CHUNK_SIZE; j++)
            pixels.push(createPixel(x * i, y * j));
    }
    return {pixels, x, y};
}
