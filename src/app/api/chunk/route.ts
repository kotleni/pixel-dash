import {PixelsBoard} from '@/platform/pixels-board';
import {container} from 'tsyringe';

const pixelsBoard = container.resolve(PixelsBoard);

export async function GET() {
    const chunk = pixelsBoard.getChunk(0, 0);
    return Response.json(chunk);
}
