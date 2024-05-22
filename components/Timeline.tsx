// components/Timeline.tsx
"use client";

import React from "react";
import styled from "styled-components";
import { Movie } from "@/data/movies";
import MovieItem from "./MovieItem";

const Container = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
  gap: 20px;
`;

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
      } else {
        return (
          new Date(a.releaseDate).getTime() - new Date(b.releaseDate).getTime()
        );
      }
    });

  return (
    <Container>
      {filteredMovies.map((movie, index) => (
        <MovieItem
          key={index}
          movie={movie}
          onClick={() => setSelectedMovie(movie)}
        />
      ))}
    </Container>
  );
};

export default Timeline;
