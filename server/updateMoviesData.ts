// pages/updateMoviesData.ts

import dotenv from 'dotenv';
import axios from 'axios';
import path from 'path';
import fs from 'fs';
import { Movie } from '@/data/movies';

dotenv.config();

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const SEARCH_TERMS = ['ゴジラ']; // Add additional search terms as needed
const COLLECTION_IDS = ['374509', '374511', '374512', '535313', '535790']; // Replace with actual collection IDs

async function fetchMoviesBySearchTerm(searchTerm: string): Promise<Movie[]> {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
        params: { api_key: API_KEY, query: searchTerm, language: 'en-US' },
    });

    return response.data.results
        .map(mapMovieData)
        .filter((movie: Movie | null): movie is Movie => movie !== null);
}

async function fetchMoviesFromCollection(collectionId: string): Promise<Movie[]> {
    const response = await axios.get(`${BASE_URL}/collection/${collectionId}`, {
        params: { api_key: API_KEY, language: 'en-US' },
    });

    return response.data.parts
        .map(mapMovieData)
        .filter((movie: Movie | null): movie is Movie => movie !== null);
}

export async function fetchAllGodzillaMovies() {
    try {
        let allMovies: Movie[] = [];

        // Fetch movies from all search terms
        for (const searchTerm of SEARCH_TERMS) {
            const moviesByTerm = await fetchMoviesBySearchTerm(searchTerm);
            allMovies = allMovies.concat(moviesByTerm);
        }

        // Fetch movies from all collections
        for (const collectionId of COLLECTION_IDS) {
            const moviesFromCollection = await fetchMoviesFromCollection(collectionId);
            allMovies = allMovies.concat(moviesFromCollection);
        }

        // Remove duplicates based on a unique property, such as 'title'
        const uniqueMovies = Array.from(new Map(allMovies.map(movie => [movie.releaseDate, movie])).values());

        // Sort the unique movies by release date
        const sortedMovies = sortMoviesByReleaseDate(uniqueMovies);

        // Save the sorted movies to a file
        const filePath = path.join(process.cwd(), 'data', 'movies.json');
        fs.writeFileSync(filePath, JSON.stringify(sortedMovies, null, 2), 'utf-8');

        console.log('Movies data has been updated.');
    } catch (error) {
        console.error('Error fetching Godzilla movies:', error);
    }
}

//fetchAllGodzillaMovies();

function mapMovieData(movie: any): Movie | null {
    const era = determineEra(movie.release_date, movie.original_language);
    if (!era) return null;

    let alternateNames = movie.original_language === 'ja' && movie.original_title !== movie.title
        ? [movie.original_title]
        : undefined;

    return {
        title: movie.title,
        releaseDate: movie.release_date,
        posterUrl: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
        description: movie.overview,
        era,
        ...(alternateNames && { alternateNames }),
    };
}

function determineEra(releaseDate: string, originalLanguage: string): string {
    const year = parseInt(releaseDate.split('-')[0], 10);
    if (year <= 1979 && originalLanguage === 'ja') return 'Showa';
    if (year >= 1984 && year <= 1995 && originalLanguage === 'ja') return 'Heisei';
    if (year >= 1999 && year <= 2005 && originalLanguage === 'ja') return 'Millennium';
    if (year >= 2014 && originalLanguage === 'en') return 'MonsterVerse';
    if (year >= 2016 && originalLanguage === 'ja') return 'Reiwa';
    return '';
}

function sortMoviesByReleaseDate(movies: Movie[]): Movie[] {
    return movies.sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());
}