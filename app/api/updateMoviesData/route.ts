import { NextRequest, NextResponse } from 'next/server';
import path from 'path';
import fs from 'fs/promises';
import { fetchAllGameraMovies, fetchAllGodzillaMovies, fetchAllMothraMovies } from '@/server/updateMoviesData';

export async function GET(req: NextRequest) {
    try {
        const filePath = path.join(process.cwd(), 'public', 'data', 'movies.json');
        const fileContents = await fs.readFile(filePath, 'utf-8');
        const movies = JSON.parse(fileContents);
        return NextResponse.json(movies, { status: 200 });
    } catch (error) {
        console.error('Error fetching movies:', error);
        return NextResponse.json({ error: 'Failed to fetch movies' }, { status: 500 });
    }
}

export async function POST(req: NextRequest) {
    try {
        const { type, force } = await req.json();
        //console.log('Received type:', type);

        if (type === 'godzilla') {
            await fetchAllGodzillaMovies(force);
            return NextResponse.json({ message: 'Godzilla movies data has been updated.' }, { status: 200 });
        } else if (type === 'mothra') {
            await fetchAllMothraMovies(force);
            return NextResponse.json({ message: 'Mothra movies data has been updated.' }, { status: 200 });
        } else if (type === 'gamera') {
            await fetchAllGameraMovies(force);
            return NextResponse.json({ message: 'Gamera movies data has been updated.' }, { status: 200 });
        } else {
            return NextResponse.json({ message: 'Invalid type specified.' }, { status: 400 });
        }
    } catch (error) {
        console.error('Error running updateMoviesData script:', error);
        return NextResponse.json({ message: 'Error updating movies data.' }, { status: 500 });
    }
}

export function OPTIONS() {
    return NextResponse.json({ message: 'Method Not Allowed' }, { status: 405 });
}