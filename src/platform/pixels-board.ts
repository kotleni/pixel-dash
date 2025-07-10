import {singleton} from 'tsyringe';
import {Chunk, CHUNK_SIZE, createChunk} from './chunk';

@singleton()
export class PixelsBoard {
    private chunks: Map<string, Chunk> = new Map();

    constructor() {
        this.createChunk(0, 0);
        console.log('Created default chunk at 0 0');
    }

    private _getChunkKey(x: number, y: number): string {
        return `${x},${y}`;
    }

    isChunkExist(x: number, y: number): boolean {
        const key = this._getChunkKey(x, y);
        return this.chunks.has(key);
    }

    getChunk(x: number, y: number): Chunk | undefined {
        const key = this._getChunkKey(x, y);
        return this.chunks.get(key);
    }

    createChunk(x: number, y: number): Chunk {
        const key = this._getChunkKey(x, y);
        const chunk = createChunk(x, y);
        this.chunks.set(key, chunk);
        return chunk;
    }

    updatePixel(x: number, y: number, color: string) {
        const chunkX = Math.floor(x / CHUNK_SIZE);
        const chunkY = Math.floor(y / CHUNK_SIZE);
        const chunk = this.getChunk(chunkX, chunkY);
        if (!chunk) {
            throw new Error(`Chunk not found at (${chunkX}, ${chunkY})`);
        }
        const pixel = chunk!.pixels.find(
            pixel => pixel.x === x % CHUNK_SIZE && pixel.y === y % CHUNK_SIZE,
        );
        if (pixel) {
            pixel.color = color;
        } else {
            throw new Error('Pixel not found');
        }
    }
}
