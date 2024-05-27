// app/mothra-movies/page.tsx
'use client';

import React, { useEffect, useState } from 'react';
import { Suspense } from "react";
import Navbar from '@/components/Navbar';
import Banner from '@/components/Banner';
import MovieList from '@/components/MovieList';
import { Movie } from '@/public/data/movies';
import { useRoarIcon } from '@/context/RoarIconContext';
import { AudioPathProvider } from '@/context/AudioPathContext';

const MothraMoviesPage: React.FC = () => {
    const [movies, setMovies] = useState<Movie[]>([]);
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [filter, setFilter] = useState<string>('');
    const [sort, setSort] = useState<string>('');
    const [era, setEra] = useState<string>('');
    const { setRoarIcon } = useRoarIcon();

    useEffect(() => {
        const fetchMothraMovies = async () => {
            try {
                const response = await fetch('/api/updateMoviesData', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ type: 'mothra' }),
                });

                if (response.ok) {
                    const result = await response.json();
                    const filePath = '/data/mothra_movies.json';
                    const fileResponse = await fetch(filePath);
                    const moviesData = await fileResponse.json();
                    setMovies(moviesData);
                } else {
                    console.error('Failed to update Mothra movies data');
                }
            } catch (error) {
                console.error('Error fetching Mothra movies:', error);
            }
        };

        fetchMothraMovies();
    }, []);

    useEffect(() => {
        setRoarIcon('roar_mothra.svg');

        // Cleanup function to reset the roarIcon when the component unmounts
        return () => {
            setRoarIcon('roar.svg');
        };
    }, [setRoarIcon]);

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AudioPathProvider basePath="/sounds/mothra">
                <div>
                    <Banner bannerFile="mothrabanner.png" />
                    <Navbar
                        onFilterChange={setFilter}
                        onSortChange={setSort}
                        onEraChange={setEra}
                    />
                    <MovieList
                        movies={movies}
                        selectedMovie={selectedMovie}
                        onMovieClick={setSelectedMovie}
                        onCloseModal={() => setSelectedMovie(null)}
                        filter={filter}
                        sort={sort}
                        era={era}
                    />
                </div>
            </AudioPathProvider>
        </Suspense>
    );
};

export default MothraMoviesPage;