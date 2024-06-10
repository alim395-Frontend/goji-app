// app/page.tsx
import React from 'react';
import { Suspense } from "react";
import { AudioPathProvider } from '@/context/AudioPathContext';
import Home from "@/components/Home";
import UpdateMoviesData from '@/components/UpdateMoviesData';
import SetRoarIcon from '@/components/SetRoarIcon';

const GodzillaMoviesPage: React.FC = () => {
    return (
        <>
            <SetRoarIcon roarIcon="roar.svg" />
            <UpdateMoviesData type="godzilla" />
            <Suspense fallback={<div>Loading...</div>}>
                <AudioPathProvider basePath="/sounds/godzilla">
                    <Home bannerFile="defaultbanner.svg" apiEndpoint="api/getGodzillaMovies" />
                </AudioPathProvider>
            </Suspense>
        </>
    );
};

export default GodzillaMoviesPage;