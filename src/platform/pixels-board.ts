import {Chunk, createChunk} from './chunk';

export class PixelsBoard {
    private chunks: Map<string, Chunk> = new Map();

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
}
