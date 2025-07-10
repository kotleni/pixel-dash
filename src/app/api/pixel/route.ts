import {PixelsBoard} from '@/platform/pixels-board';
import {container} from 'tsyringe';

const pixelsBoard = container.resolve(PixelsBoard);

export interface UpdatePixel {
    x: number;
    y: number;
    color: string;
}

export async function POST(req: Request) {
    const body = (await req.json()) as UpdatePixel;
    if (
        body.color === undefined ||
        body.x === undefined ||
        body.y === undefined
    )
        return Response.json({success: false}); // TODO:

    pixelsBoard.updatePixel(body.x, body.y, body.color);
    return Response.json({success: true});
}
