// components/Home.tsx
"use client";

import React, { useState, useEffect } from "react";
import styled from "styled-components";
import { Movie } from "@/data/movies";
import Timeline from "./Timeline";
import Navbar from "./Navbar";
import Modal from "./Modal";

const Banner = styled.div`
    width: 100%;
    height: auto;
    display: flex;
    align-items: center;
    justify-content: center;
    background-color: #000; // Adjust as needed
    color: white;
    font-size: 24px;
    font-weight: bold;
`;

const Home: React.FC<{ movies: Movie[] }> = ({ movies }) => {
    const [selectedMovie, setSelectedMovie] = useState<Movie | null>(null);
    const [filter, setFilter] = useState("");
    const [sort, setSort] = useState("releaseDate");
    const [era, setEra] = useState("");

    useEffect(() => {
        // Define the function to update the movies data
        const updateMoviesData = async () => {
            try {
                const response = await fetch('/api/updateMoviesData', {
                    method: 'POST'
                });
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                const data = await response.json();
                console.log(data.message);
            } catch (error) {
                console.error('There has been a problem with your fetch operation:', error);
            }
        };

        // Call the function
        updateMoviesData();
    }, []); // The empty array means this effect will only run once after the initial render

    const handleMovieClick = (movie: Movie) => {
        setSelectedMovie(movie);
    };

    const handleCloseModal = () => {
        setSelectedMovie(null);
    };

    return (
        <div>
            <Banner>
                <img src="/defaultbanner.svg" alt="Banner" />
            </Banner>
            <Navbar
                onFilterChange={setFilter}
                onSortChange={setSort}
                onEraChange={setEra}
            />
            <Timeline
                movies={movies}
                setSelectedMovie={handleMovieClick}
                filter={filter}
                sort={sort}
                era={era}
            />
            {selectedMovie && (
                <Modal
                    isOpen={!!selectedMovie}
                    onClose={handleCloseModal}
                    movie={selectedMovie}
                />
            )}
        </div>
    );
};

export default Home;