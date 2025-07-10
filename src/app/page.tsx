'use client';
import {Canvas} from '@/components/canvas';
import {Chunk} from '@/platform/chunk';
import React, {useEffect, useState} from 'react';

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
