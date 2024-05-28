// hooks/useMovies.ts
import { useState, useEffect } from 'react';
import { Movie } from '@/public/data/movies';

const useMovies = (apiEndpoint: string) => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [filter, setFilter] = useState<string>('');
    const [sort, setSort] = useState<string>('releaseDate');
    const [era, setEra] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchMovies = async () => {
            try {
                const response = await fetch(apiEndpoint, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                });

                if (response.ok) {
                    const moviesData = await response.json();
                    setMovies(moviesData);
                } else {
                    setError('Failed to fetch movies data');
                }
            } catch (err) {
                if (err instanceof Error) {
                    setError('Error fetching movies: ' + err.message);
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