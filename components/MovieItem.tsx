// components/MovieItem.tsx
"use client";

import React from "react";
import styled from "styled-components";
import { Movie } from "../data/movies";

const Item = styled.div`
  text-align: center;
  cursor: pointer;
  margin: 20px;
`;

const Poster = styled.img`
  width: 100%;
  height: auto;
  border-radius: 4px;
`;

const Title = styled.div`
  margin-top: 10px;
  font-weight: bold;
`;

const MovieItem: React.FC<{ movie: Movie; onClick: () => void }> = ({
  movie,
  onClick,
}) => {
  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    event.currentTarget.src = "/images/placeholder.jpg"; // Path to your placeholder image
  };

  return (
    <Item onClick={onClick}>
      <Poster
        src={`/images/${movie.era}/${movie.title
          .replace(/[\\/:*?"<>|]/g, "")
          .replace(/\s+/g, "_")}.jpg`}
        alt={movie.title}
        onError={handleImageError}
      />
      <Title>
        {movie.title} ({new Date(movie.releaseDate).getFullYear()})
      </Title>
    </Item>
  );
};

export default MovieItem;
