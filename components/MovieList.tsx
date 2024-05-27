// components/MovieList.tsx
'use client';

import React from 'react';
import { Movie } from '@/public/data/movies';
import Timeline from './Timeline';
import Modal from './Modal';

interface MovieListProps {
    movies: Movie[];
    selectedMovie: Movie | null;
    onMovieClick: (movie: Movie) => void;
    onCloseModal: () => void;
    filter: string;
    sort: string;
    era: string;
}

const MovieList: React.FC<MovieListProps> = ({
                                                 movies,
                                                 selectedMovie,
                                                 onMovieClick,
                                                 onCloseModal,
                                                 filter,
                                                 sort,
                                                 era,
                                             }) => (
    <>
        <Timeline
            movies={movies}
            setSelectedMovie={onMovieClick}
            filter={filter}
            sort={sort}
            era={era}
        />
        {selectedMovie && (
            <Modal
                isOpen={!!selectedMovie}
                onClose={onCloseModal}
                movie={selectedMovie}
            />
        )}
    </>
);

export default MovieList;