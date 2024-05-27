import { NextRequest, NextResponse } from 'next/server';
import fs from 'fs';
import path from 'path';

// Define a custom error type that includes the 'code' property
interface CustomError extends Error {
    code?: string;
}

export async function GET(req: NextRequest) {
    const { searchParams } = new URL(req.url);
    const era = searchParams.get('era');
    const movie = searchParams.get('movie');

    if (!era || !movie) {
        return NextResponse.json({ error: 'Era and movie are required' }, { status: 400 });
    }

    const sanitizedTitle = movie.replace(/[\\/:*?"<>|]/g, "").replace(/\s+/g, "_");
    const directoryPath = path.join(process.cwd(), 'public', 'music', era, sanitizedTitle);

    try {
        const files = await fs.promises.readdir(directoryPath);
        const audioFiles = files.filter(file => file.endsWith('.mp3'));
        return NextResponse.json({ files: audioFiles }, { status: 200 });
    } catch (err) {
        const error = err as CustomError;
        if (error.code === 'ENOENT') {
            // Directory does not exist
            return NextResponse.json({ error: 'Directory not found' }, { status: 404 });
        }
        // Other errors
        return NextResponse.json({ error: 'Failed to read directory' }, { status: 500 });
    }
}