import dotenv from 'dotenv';
import axios from 'axios';
import path from 'path';
import fs from 'fs';
import { Movie } from '@/public/data/movies';

dotenv.config();

const API_KEY = process.env.TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';
const LAST_UPDATE_FILE = path.join(process.cwd(), 'public', 'data', 'lastUpdate.json');
const UPDATE_INTERVAL = 30 * 24 * 60 * 60 * 1000; // 30 days in milliseconds

const LOG_DIR = path.join(process.cwd(), 'logs');
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR);
}

const LOG_FILE_PATH = path.join(process.cwd(), 'logs', 'debug.log');

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

async function fetchAndSaveMovies(
    searchTerm: string | null,
    collectionIds: string[] | null,
    explicitMovieIds: number[] | null,
    filePath: string,
    force: boolean = false
) {
    try {
        // Check if the data needs to be updated
        if (!force && !shouldUpdateData()) {
            console.log('Data is up-to-date. No need to fetch new data.');
            return;
        }

        let allMovies: Movie[] = [];

        // Fetch movies from the search term if provided
        if (searchTerm) {
            const moviesByTerm = await fetchMoviesBySearchTerm(searchTerm);
            allMovies = allMovies.concat(moviesByTerm);
        }

        // Fetch movies from all collections if provided
        if (collectionIds && collectionIds.length > 0) {
            for (const collectionId of collectionIds) {
                const moviesFromCollection = await fetchMoviesFromCollection(collectionId);
                allMovies = allMovies.concat(moviesFromCollection);
            }
        }

        // Fetch explicit movies if provided
        if (explicitMovieIds && explicitMovieIds.length > 0) {
            for (const movieId of explicitMovieIds) {
                const movie = await fetchMovieById(movieId);
                if (movie) {
                    allMovies.push(movie);
                }
            }
        }

        // Remove duplicates based on a unique property, such as 'releaseDate'
        const uniqueMovies = Array.from(new Map(allMovies.map(movie => [movie.releaseDate, movie])).values());

        // Sort the unique movies by release date
        const sortedMovies = sortMoviesByReleaseDate(uniqueMovies);

        // Save the sorted movies to a file
        fs.writeFileSync(filePath, JSON.stringify(sortedMovies, null, 2), 'utf-8');

        // Update the last update timestamp
        updateLastUpdateTimestamp();

        console.log(`${filePath} data has been updated.`);
    } catch (error) {
        console.error(`Error fetching movies for ${filePath}:`, error);
    }
}

function shouldUpdateData(): boolean {
    if (!fs.existsSync(LAST_UPDATE_FILE)) {
        return true;
    }

    const lastUpdateData = JSON.parse(fs.readFileSync(LAST_UPDATE_FILE, 'utf-8'));
    const lastUpdateTime = new Date(lastUpdateData.timestamp).getTime();
    const currentTime = Date.now();

    return (currentTime - lastUpdateTime) > UPDATE_INTERVAL;
}

function updateLastUpdateTimestamp() {
    const timestamp = new Date().toISOString();
    fs.writeFileSync(LAST_UPDATE_FILE, JSON.stringify({ timestamp }), 'utf-8');
}

export async function fetchAllGodzillaMovies(force: boolean = false) {
    const godzillaSearchTerms = ['ゴジラ', 'Godzilla 1998'];
    const godzillaCollectionIds = ['374509', '374511', '374512', '535313', '535790'];
    const godzillaExplicitMovieIds: number[] = [940721,315011];
    const godzillaFilePath = path.join(process.cwd(), 'public', 'data', 'movies.json');

    for (const searchTerm of godzillaSearchTerms) {
        await fetchAndSaveMovies(searchTerm, godzillaCollectionIds, godzillaExplicitMovieIds, godzillaFilePath, force);
    }
}

export async function fetchAllMothraMovies(force: boolean = false) {
    const mothraSearchTerm = 'モスラ';
    const mothraCollectionIds = ['171732'];
    const mothraExplicitMovieIds = [3107, 15767, 373571];
    const mothraFilePath = path.join(process.cwd(), 'public', 'data', 'mothra_movies.json');

    await fetchAndSaveMovies(mothraSearchTerm, mothraCollectionIds, mothraExplicitMovieIds, mothraFilePath, force);
}

export async function fetchAllGameraMovies(force: boolean = false) {
    const gameraSearchTerm = null;
    const gameraCollectionIds = ['161766', '657313'];
    const gameraExplicitMovieIds = [60160];
    const gameraFilePath = path.join(process.cwd(), 'public', 'data', 'gamera_movies.json');

    await fetchAndSaveMovies(gameraSearchTerm, gameraCollectionIds, gameraExplicitMovieIds, gameraFilePath, force);
}

export async function fetchChallengeMovies(force: boolean = false) {
    const challengeSearchTerm = null;
    const challengeCollectionIds = null;
    const challengeExplicitMovieIds = [1678, 1679, 19742, 39410, 3115];
    const challengeFilePath = path.join(process.cwd(), 'public', 'data', 'challenge.json');

    await fetchAndSaveMovies(challengeSearchTerm, challengeCollectionIds, challengeExplicitMovieIds, challengeFilePath, force);
}

function determineEra(releaseDate: string, originalLanguage: string, title: string): string {
    const year = parseInt(releaseDate.split('-')[0], 10);

    // Check for Rebirth of Mothra trilogy
    const isMothraMovie = title.toLowerCase().includes('mothra');
    if (isMothraMovie && year >= 1996 && year <= 1998) {
        logToFile(`Mothra movie detected: ${title} (${year}) - Era: Heisei`);
        return 'Heisei';
    }

    // Check for Gamera trilogy
    const isGameraMovie = title.toLowerCase().includes('gamera');
    if (isGameraMovie && year >= 1995 && year <= 1999) {
        logToFile(`Gamera movie detected: ${title} (${year}) - Era: Heisei`);
        return 'Heisei';
    }

    if (year < 1984 && originalLanguage === 'ja') {
        logToFile(`Showa era movie detected: ${title} (${year})`);
        return 'Showa';
    }
    if (year >= 1984 && year <= 1995 && originalLanguage === 'ja') {
        logToFile(`Heisei era movie detected: ${title} (${year})`);
        return 'Heisei';
    }
    if (year === 1998 && originalLanguage === 'en') {
        logToFile(`Tristar era movie detected: ${title} (${year})`);
        return 'Tristar';
    }
    if (year >= 1999 && year <= 2006 && originalLanguage === 'ja') {
        logToFile(`Millennium era movie detected: ${title} (${year})`);
        return 'Millennium';
    }
    if (year >= 2014 && originalLanguage === 'en') {
        logToFile(`MonsterVerse era movie detected: ${title} (${year})`);
        return 'MonsterVerse';
    }
    if (year >= 2016 && originalLanguage === 'ja') {
        logToFile(`Reiwa era movie detected: ${title} (${year})`);
        return 'Reiwa';
    }

    logToFile(`No era detected for: ${title} (${year})`);
    return '';
}

function mapMovieData(movie: any, details: any): Movie | null {
    const era = determineEra(movie.release_date, movie.original_language, movie.title);
    if (!era) {
        logToFile(`Skipping movie due to undetermined era: ${movie.title}`);
        return null;
    }

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
        genres: details.genres.map((genre: { name: string }) => genre.name),
        runtime: details.runtime,
        ...(alternateNames && { alternateNames }),
    };
}

function logToFile(message: string) {
    const timestamp = new Date().toISOString();
    const logMessage = `[${timestamp}] ${message}\n`;
    fs.appendFileSync(LOG_FILE_PATH, logMessage, 'utf-8');
}

function sortMoviesByReleaseDate(movies: Movie[]): Movie[] {
    return movies.sort((a, b) => new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime());
}