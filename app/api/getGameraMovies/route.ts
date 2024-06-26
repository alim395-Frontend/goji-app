// app/api/getGameraMovies/route.ts

import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';

export async function GET(req: NextRequest) {
    try {
        const filePath = path.join(process.cwd(), 'public', 'data', 'gamera_movies.json');
        const fileContents = await fs.readFile(filePath, 'utf-8');
        const mothraMovies = JSON.parse(fileContents);
        return NextResponse.json(mothraMovies, { status: 200 });
    } catch (error) {
        console.error('Error fetching Gamera movies:', error);
        return NextResponse.json({ error: 'Failed to fetch Gamera movies' }, { status: 500 });
    }
}