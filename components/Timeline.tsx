// components/Timeline.tsx
"use client";

import React from "react";
import { Movie } from "@/public/data/movies";
import MovieItem from "./MovieItem";

interface TimelineProps {
    movies: Movie[];
    setSelectedMovie: (movie: Movie) => void;
    filter: string;
    sort: string;
    era: string;
}

const Timeline: React.FC<TimelineProps> = ({
                                               movies,
                                               setSelectedMovie,
                                               filter,
                                               sort,
                                               era,
                                           }) => {
    const filteredMovies = movies
        .filter((movie) => {
            const searchString = filter.toLowerCase();
            const matchTitle = movie.title.toLowerCase().includes(searchString);
            const matchAlternateNames = movie.alternateNames?.some((name) =>
                name.toLowerCase().includes(searchString)
            );
            const matchEra = era === "" || movie.era === era;
            return (matchTitle || matchAlternateNames) && matchEra;
        })
        .sort((a, b) => {
            if (sort === "title") {
                return a.title.localeCompare(b.title);
            } else if (sort === "releaseDate") {
                return (
                    new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
                );
            } else if (sort === "rating") {
                // Handle the case where rating might be undefined
                const ratingA = a.rating || 0;
                const ratingB = b.rating || 0;
                return ratingB - ratingA; // Assuming you want to sort from highest to lowest rating
            }
            return 0;
        });

    return (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4 p-4">
            {filteredMovies.map((movie, index) => (
                <MovieItem
                    key={index}
                    movie={movie}
                    onClick={() => setSelectedMovie(movie)}
                />
            ))}
        </div>
    );
};

export default Timeline;