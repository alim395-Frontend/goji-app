// app/mothra/page.tsx
'use client';

import React, { useEffect } from 'react';
import { Suspense } from "react";
import { useRoarIcon } from '@/context/RoarIconContext';
import { AudioPathProvider } from '@/context/AudioPathContext';
import Home from "@/components/Home";

const MothraMoviesPage: React.FC = () => {
    const { setRoarIcon } = useRoarIcon();

    useEffect(() => {
        setRoarIcon('roar_mothra.svg');

        // Cleanup function to reset the roarIcon when the component unmounts
        return () => {
            setRoarIcon('roar.svg');
        };
    }, [setRoarIcon]);

    useEffect(() => {
        const updateMoviesData = async () => {
            try {
                const response = await fetch('/api/updateMoviesData', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({ type: 'mothra' }),
                });

                const data = await response.json();
                //console.log(data.message);
            } catch (error) {
                console.error('Error updating Mothra movies data:', error);
            }
        };

        updateMoviesData();
    }, []);

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AudioPathProvider basePath="/sounds/mothra">
                <Home bannerFile="mothrabanner.png" apiEndpoint="/api/getMothraMovies" />
            </AudioPathProvider>
        </Suspense>
    );
};

export default MothraMoviesPage;