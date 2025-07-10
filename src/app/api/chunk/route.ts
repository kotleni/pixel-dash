import {PixelsBoard} from '@/platform/pixels-board';

const pixelsBoard = new PixelsBoard();
pixelsBoard.createChunk(0, 0);

export async function GET() {
    const chunk = pixelsBoard.getChunk(0, 0);
    return Response.json(chunk);
}
