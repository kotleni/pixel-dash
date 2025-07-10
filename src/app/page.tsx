'use client';
import {Chunk, CHUNK_SIZE} from '@/platform/chunk';
import {Pixel} from '@/platform/pixel';
import React, {useRef, useEffect, useState} from 'react';

interface CanvasProps {
    chunks: Chunk[];
}

function Canvas(props: CanvasProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const renderScale = 16;

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;

        const ctx = canvas.getContext('2d');
        if (!ctx) return;

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

            console.log('Clicked chunk', chunk);
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

                // Draw chunk border
                ctx.strokeStyle = 'red';
                ctx.strokeRect(
                    chunk.x * CHUNK_SIZE * renderScale,
                    chunk.y * CHUNK_SIZE * renderScale,
                    CHUNK_SIZE * renderScale,
                    CHUNK_SIZE * renderScale,
                );
            }

            // Draw selecting box
            ctx.fillStyle = 'rgba(255, 255, 255, 0.5)';
            ctx.fillRect(
                Math.floor(mouseX / renderScale) * renderScale,
                Math.floor(mouseY / renderScale) * renderScale,
                renderScale,
                renderScale,
            );
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

export default function Home() {
    const [chunks, setChunks] = useState<Chunk[]>([]);

    const updateBoard = async () => {
        const resp = await fetch('/api/chunk');
        const chunk = (await resp.json()) as Chunk;

        chunks.push(chunk);
        setChunks(chunks);

        console.log(chunks);
    };

    useEffect(() => {
        void updateBoard();
    }, []);

    return (
        <>
            <Canvas chunks={chunks} />
        </>
    );
}
