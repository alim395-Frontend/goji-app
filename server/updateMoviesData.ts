//app/api/updateMoviesData/route.ts

import dotenv from 'dotenv';
import axios from 'axios';
import path from 'path';
import fs from 'fs';
import { Movie } from '@/public/data/movies';

dotenv.config();

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const SEARCH_TERMS = ['ゴジラ', 'Godzilla 1998']; // Add additional search terms as needed
const COLLECTION_IDS = ['374509', '374511', '374512', '535313', '535790']; // Replace with actual collection IDs

async function fetchMoviesBySearchTerm(searchTerm: string): Promise<Movie[]> {
    const response = await axios.get(`${BASE_URL}/search/movie`, {
        params: { api_key: API_KEY, query: searchTerm, language: 'en-US' },
    });

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
        const filePath = path.join(process.cwd(), 'public', 'data', 'movies.json');
        fs.writeFileSync(filePath, JSON.stringify(sortedMovies, null, 2), 'utf-8');

        console.log('Movies data has been updated.');
    } catch (error) {
        console.error('Error fetching Godzilla movies:', error);
    }
}

export async function fetchAllMothraMovies() {
    try {
        let allMovies: Movie[] = [];

        // Fetch movies from the search term "Mothra"
        const mothraSearchTerm = 'モスラ';
        const moviesByTerm = await fetchMoviesBySearchTerm(mothraSearchTerm);
        allMovies = allMovies.concat(moviesByTerm);

        // Fetch movies from the collection ID 171732
        const mothraCollectionId = '171732';
        const moviesFromCollection = await fetchMoviesFromCollection(mothraCollectionId);
        allMovies = allMovies.concat(moviesFromCollection);

        // Fetch "Godzilla: King of the Monsters (2019)" explicitly
        const godzillaKingOfMonstersId = 373571;
        const godzillaKingOfMonsters = await fetchMovieById(godzillaKingOfMonstersId);
        if (godzillaKingOfMonsters) {
            allMovies.push(godzillaKingOfMonsters);
        }

        // Fetch "Destroy All Monsters (1968)" explicitly
        const anotherMovieId = 3107;
        const anotherMovie = await fetchMovieById(anotherMovieId);
        if (anotherMovie) {
            allMovies.push(anotherMovie);
        }

        // Remove duplicates based on a unique property, such as 'releaseDate'
        const uniqueMovies = Array.from(new Map(allMovies.map(movie => [movie.releaseDate, movie])).values());

        // Sort the unique movies by release date
        const sortedMovies = sortMoviesByReleaseDate(uniqueMovies);

        // Save the sorted movies to a file in the public directory
        const filePath = path.join(process.cwd(), 'public', 'data', 'mothra_movies.json');
        fs.writeFileSync(filePath, JSON.stringify(sortedMovies, null, 2), 'utf-8');

        console.log('Mothra movies data has been updated.');
    } catch (error) {
        console.error('Error fetching Mothra movies:', error);
    }
}

// fetchAllGodzillaMovies();

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

    if (year <= 1979 && originalLanguage === 'ja') return 'Showa';
    if (year >= 1984 && year <= 1995 && originalLanguage === 'ja') return 'Heisei';
    if (year === 1998 && originalLanguage === 'en') return 'Tristar';
    if (year >= 1999 && year <= 2005 && originalLanguage === 'ja') return 'Millennium';
    if (year >= 2014 && originalLanguage === 'en') return 'MonsterVerse';
    if (year >= 2016 && originalLanguage === 'ja') return 'Reiwa';
    return '';
}

function sortMoviesByReleaseDate(movies: Movie[]): Movie[] {
    return movies.sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());
}