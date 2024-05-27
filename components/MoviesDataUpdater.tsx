// components/MoviesDataUpdater.tsx
import React, { useEffect } from 'react';

const MoviesDataUpdater = () => {
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

    return (
        <div>Updating movies data...</div>
    );
};

export default MoviesDataUpdater;