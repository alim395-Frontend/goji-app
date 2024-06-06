// components/Home.tsx
'use client';

import React from 'react';
import Navbar from './Navbar';
import Banner from './Banner';
import MovieList from './MovieList';
import useMovies from '@/hooks/useMovies';
import NewNavbar from "@/components/NewNavbar";

interface HomeProps {
    apiEndpoint: string;
    bannerFile?: string;
}

const Home: React.FC<HomeProps> = ({ apiEndpoint, bannerFile }) => {
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
    } = useMovies(apiEndpoint);

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;

    return (
        <div>
            <Banner bannerFile={bannerFile} />
            <NewNavbar/>
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