// components/UpdateMoviesData.tsx
'use client'

import { useEffect } from 'react';

interface UpdateMoviesDataProps {
    type: string;
}

const UpdateMoviesData: React.FC<UpdateMoviesDataProps> = ({ type }) => {
    useEffect(() => {
        const updateMoviesData = async () => {
            try {
                const response = await fetch('/api/updateMoviesData', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ type }),
                });

                const data = await response.json();
                console.log(data.message);
            } catch (error) {
                console.error('Error updating movies data:', error);
            }
        };

        updateMoviesData();
    }, [type]);

    return null;
};

export default UpdateMoviesData;