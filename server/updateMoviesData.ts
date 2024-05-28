import dotenv from 'dotenv';
import axios from 'axios';
import path from 'path';
import fs from 'fs';
import { Movie } from '@/public/data/movies';

dotenv.config();

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

async function fetchMoviesBySearchTerm(searchTerm: string): Promise<Movie[]> {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
        params: { api_key: API_KEY, query: searchTerm, language: 'en-US' },
    });

    console.log(`Movies fetched by search term "${searchTerm}":`, response.data.results);

    const movies = await Promise.all(
        response.data.results.map(async (movie: any) => {
            const details = await fetchMovieDetails(movie.id);
            return mapMovieData(movie, details);
        })
    );

    return movies.filter((movie: Movie | null): movie is Movie => movie !== null);
}

async function fetchMoviesFromCollection(collectionId: string): Promise<Movie[]> {
    const response = await axios.get(`${BASE_URL}/collection/${collectionId}`, {
        params: { api_key: API_KEY, language: 'en-US' },
    });

    console.log(`Movies fetched from collection ID "${collectionId}":`, response.data.parts);

    const movies = await Promise.all(
        response.data.parts.map(async (movie: any) => {
            const details = await fetchMovieDetails(movie.id);
            return mapMovieData(movie, details);
        })
    );

    return movies.filter((movie: Movie | null): movie is Movie => movie !== null);
}

async function fetchMovieDetails(tmdbId: number) {
    const response = await axios.get(`${BASE_URL}/movie/${tmdbId}`, {
        params: { api_key: API_KEY, language: 'en-US' },
    });
    return response.data;
}

async function fetchMovieById(tmdbId: number): Promise<Movie | null> {
    const details = await fetchMovieDetails(tmdbId);
    return mapMovieData(details, details);
}

async function fetchAndSaveMovies(searchTerm: string, collectionIds: string[], explicitMovieIds: number[], filePath: string) {
    try {
        let allMovies: Movie[] = [];

        // Fetch movies from the search term
        const moviesByTerm = await fetchMoviesBySearchTerm(searchTerm);
        allMovies = allMovies.concat(moviesByTerm);

        // Fetch movies from all collections
        for (const collectionId of collectionIds) {
            const moviesFromCollection = await fetchMoviesFromCollection(collectionId);
            allMovies = allMovies.concat(moviesFromCollection);
        }

        // Fetch explicit movies
        for (const movieId of explicitMovieIds) {
            const movie = await fetchMovieById(movieId);
            if (movie) {
                allMovies.push(movie);
            }
        }

        // Remove duplicates based on a unique property, such as 'releaseDate'
        const uniqueMovies = Array.from(new Map(allMovies.map(movie => [movie.releaseDate, movie])).values());

        // Sort the unique movies by release date
        const sortedMovies = sortMoviesByReleaseDate(uniqueMovies);

        // Save the sorted movies to a file
        console.log(`Writing to file: ${filePath}`);
        fs.writeFileSync(filePath, JSON.stringify(sortedMovies, null, 2), 'utf-8');

        console.log(`${filePath} data has been updated.`);
    } catch (error) {
        console.error(`Error fetching movies for ${filePath}:`, error);
    }
}

export async function fetchAllGodzillaMovies() {
    const godzillaSearchTerms = ['ゴジラ', 'Godzilla 1998'];
    const godzillaCollectionIds = ['374509', '374511', '374512', '535313', '535790'];
    const godzillaExplicitMovieIds: number[] = [];
    const godzillaFilePath = path.join(process.cwd(), 'public', 'data', 'movies.json');

    for (const searchTerm of godzillaSearchTerms) {
        await fetchAndSaveMovies(searchTerm, godzillaCollectionIds, godzillaExplicitMovieIds, godzillaFilePath);
    }
}

export async function fetchAllMothraMovies() {
    const mothraSearchTerm = 'モスラ';
    const mothraCollectionIds = ['171732'];
    const mothraExplicitMovieIds = [3107, 15767, 373571];
    const mothraFilePath = path.join(process.cwd(), 'public', 'data', 'mothra_movies.json');

    await fetchAndSaveMovies(mothraSearchTerm, mothraCollectionIds, mothraExplicitMovieIds, mothraFilePath);
}

export async function fetchAllGameraMovies() {
    const gameraSearchTerm = '';
    const gameraCollectionIds = ['161766', '657313'];
    const gameraExplicitMovieIds = [60160];
    const gameraFilePath = path.join(process.cwd(), 'public', 'data', 'gamera_movies.json');

    await fetchAndSaveMovies(gameraSearchTerm, gameraCollectionIds, gameraExplicitMovieIds, gameraFilePath);
}

function mapMovieData(movie: any, details: any): Movie | null {
    const era = determineEra(movie.release_date, movie.original_language, movie.title);
    if (!era) return null;

    const alternateNames = movie.original_language === 'ja' && movie.original_title !== movie.title
        ? [movie.original_title]
        : undefined;

    return {
        title: movie.title,
        releaseDate: movie.release_date,
        posterUrl: `https://image.tmdb.org/t/p/original${movie.poster_path}`,
        description: movie.overview,
        era,
        rating: movie.vote_average,
        genres: details.genres.map((genre: { name: string }) => genre.name), // Map genres
        runtime: details.runtime, // Add runtime
        ...(alternateNames && { alternateNames }),
    };
}

function determineEra(releaseDate: string, originalLanguage: string, title: string): string {
    const year = parseInt(releaseDate.split('-')[0], 10);

    // Check for Rebirth of Mothra trilogy
    const isMothraMovie = title.toLowerCase().includes('mothra');
    if (isMothraMovie && year >= 1996 && year <= 1998) return 'Heisei';

    // Check for Gamera trilogy
    const isGameraMovie = title.toLowerCase().includes('gamera');
    if (isGameraMovie && year >= 1995 && year <= 1999) return 'Heisei';

    if (year < 1984 && originalLanguage === 'ja') return 'Showa';
    if (year >= 1984 && year <= 1995 && originalLanguage === 'ja') return 'Heisei';
    if (year === 1998 && originalLanguage === 'en') return 'Tristar';
    if (year >= 1999 && year <= 2006 && originalLanguage === 'ja') return 'Millennium';
    if (year >= 2014 && originalLanguage === 'en') return 'MonsterVerse';
    if (year >= 2016 && originalLanguage === 'ja') return 'Reiwa';
    return '';
}

function sortMoviesByReleaseDate(movies: Movie[]): Movie[] {
    return movies.sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());
}