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

        const resizeCanvas = () => {
            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;
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
        };

        resizeCanvas();
        window.addEventListener('resize', resizeCanvas);
        draw();

        // Redraw canvas with target to 20 FPS
        setInterval(draw, 1000 / 20);

        return () => {
            window.removeEventListener('resize', resizeCanvas);
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
