// app/gamera.tsx
import React from 'react';
import { Suspense } from "react";
import { AudioPathProvider } from '@/context/AudioPathContext';
import Home from "@/components/Home";
import UpdateMoviesData from '@/components/UpdateMoviesData';
import SetRoarIcon from '@/components/SetRoarIcon';

const GameraMoviesPage: React.FC = () => {
    return (
        <>
            <SetRoarIcon roarIcon="roar_gamera.svg" />
            <UpdateMoviesData type="gamera" />
            <Suspense fallback={<div>Loading...</div>}>
                <AudioPathProvider basePath="/sounds/gamera">
                    <Home bannerFile="gamerabanner.svg" apiEndpoint="api/getGameraMovies" />
                </AudioPathProvider>
            </Suspense>
        </>
    );
};

export default GameraMoviesPage;