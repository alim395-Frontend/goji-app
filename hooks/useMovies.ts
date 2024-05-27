'use client';

import { useState, useEffect } from 'react';
import { Movie } from '@/public/data/movies';

const useMovies = (apiEndpoint: string) => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [filter, setFilter] = useState('');
    const [sort, setSort] = useState('releaseDate');
    const [era, setEra] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch(apiEndpoint);
                if (!response.ok) {
                    throw new Error('Failed to fetch movies');
                }
                const data: Movie[] = await response.json();
                setMovies(data);
            } catch (err) {
                if (err instanceof Error) {
                    setError(err.message);
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchMovies();
    }, [apiEndpoint]);

    return {
        movies,
        selectedMovie,
        setSelectedMovie,
        filter,
        setFilter,
        sort,
        setSort,
        era,
        setEra,
        loading,
        error,
    };
};

export default useMovies;