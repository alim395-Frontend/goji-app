// app/api/getGodzillaMovies/route.ts

import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET(req: NextRequest) {
    try {
        const filePath = path.join(process.cwd(), 'public', 'data', 'movies.json');
        const fileContents = await fs.readFile(filePath, 'utf-8');
        const mothraMovies = JSON.parse(fileContents);
        return NextResponse.json(mothraMovies, { status: 200 });
    } catch (error) {
        console.error('Error fetching Godzilla movies:', error);
        return NextResponse.json({ error: 'Failed to fetch Godzilla movies' }, { status: 500 });
    }
}