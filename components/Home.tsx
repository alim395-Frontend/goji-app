// components/Home.tsx
'use client';

import React from 'react';
import Navbar from './Navbar';
import Banner from './Banner';
import MovieList from './MovieList';
import useMovies from '@/hooks/useMovies';
import {Movie} from "@/public/data/movies";

interface HomeProps {
    movies?: Movie[];
    bannerFile?: string;
}

const Home: React.FC<HomeProps> = ({ bannerFile }) => {
    const {
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
    } = useMovies('/api/updateMoviesData');

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <Banner bannerFile={bannerFile} />
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
    );
};

export default Home;