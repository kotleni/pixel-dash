import {Chunk, CHUNK_SIZE} from '@/platform/chunk';
import {Pixel} from '@/platform/pixel';
import {useRef, useEffect} from 'react';

interface CanvasProps {
    chunks: Chunk[];
    onPixelSelected: (pixel: Pixel) => void;
}

export function Canvas(props: CanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const renderScale = 16;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

        const lockImage = new Image();
        lockImage.src = '/icons/lock-icon.svg';

        let mouseX = 0;
        let mouseY = 0;

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
        };

        const mouseMove = (event: MouseEvent) => {
            mouseX = event.offsetX;
            mouseY = event.offsetY;
        };

        const mouseClick = () => {
            const chunkX = Math.floor(mouseX / renderScale / CHUNK_SIZE);
            const chunkY = Math.floor(mouseY / renderScale / CHUNK_SIZE);

            const chunk = props.chunks.find(
                chunk => chunk.x === chunkX && chunk.y === chunkY,
            );

            if (!chunk) return;

            const pixelX = Math.floor(mouseX / renderScale);
            const pixelY = Math.floor(mouseY / renderScale);

            const pixel = chunk.pixels.find(
                pixel => pixel.x === pixelX && pixel.y === pixelY,
            );

            if (!pixel) return;

            props.onPixelSelected(pixel);
        };

        const draw = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Draw all downloaded chunks
            for (const chunk of props.chunks) {
                for (const pixel of chunk.pixels) {
                    ctx.fillStyle = pixel.color;
                    ctx.fillRect(
                        (chunk.x * CHUNK_SIZE + pixel.x) * renderScale,
                        (chunk.y * CHUNK_SIZE + pixel.y) * renderScale,
                        renderScale,
                        renderScale,
                    );
                }

                // If mouse in bound of chunk
                if (
                    mouseX >= chunk.x * CHUNK_SIZE * renderScale &&
                    mouseX <= (chunk.x + 1) * CHUNK_SIZE * renderScale &&
                    mouseY >= chunk.y * CHUNK_SIZE * renderScale &&
                    mouseY <= (chunk.y + 1) * CHUNK_SIZE * renderScale
                ) {
                    // TODO:
                    const isLocked = false;

                    if (isLocked) {
                        // Draw background
                        ctx.fillStyle = 'rgba(11, 11, 11, 0.5)';
                        ctx.fillRect(
                            chunk.x * CHUNK_SIZE * renderScale,
                            chunk.y * CHUNK_SIZE * renderScale,
                            CHUNK_SIZE * renderScale,
                            CHUNK_SIZE * renderScale,
                        );

                        // Draw lock icon
                        const lockSize = 2 * renderScale;
                        ctx.drawImage(
                            lockImage,
                            chunk.x * CHUNK_SIZE +
                                (CHUNK_SIZE / 2) * renderScale -
                                lockSize / 2,
                            chunk.y * CHUNK_SIZE +
                                (CHUNK_SIZE / 2) * renderScale -
                                lockSize / 2,
                            lockSize,
                            lockSize,
                        );
                    } else {
                        // Draw selecting box
                        ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
                        ctx.fillRect(
                            Math.floor(mouseX / renderScale) * renderScale,
                            Math.floor(mouseY / renderScale) * renderScale,
                            renderScale,
                            renderScale,
                        );
                    }

                    // Draw chunk border
                    ctx.strokeStyle = isLocked ? 'red' : 'white';
                    ctx.strokeRect(
                        chunk.x * CHUNK_SIZE * renderScale,
                        chunk.y * CHUNK_SIZE * renderScale,
                        CHUNK_SIZE * renderScale,
                        CHUNK_SIZE * renderScale,
                    );
                }
            }
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        window.addEventListener('mousemove', mouseMove);
        window.addEventListener('mousedown', mouseClick);
        draw();

        // Redraw canvas with target to 20 FPS
        setInterval(draw, 1000 / 20);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
            window.removeEventListener('mousemove', mouseMove);
            window.removeEventListener('mousedown', mouseClick);
        };
    }, []);

    return (
        <canvas
            ref={canvasRef}
            style={{display: 'block', background: '#111111'}}
        />
    );
}
