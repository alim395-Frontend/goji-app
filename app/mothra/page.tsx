// app/mothra.tsx
import React from 'react';
import { Suspense } from "react";
import { AudioPathProvider } from '@/context/AudioPathContext';
import Home from "@/components/Home";
import UpdateMoviesData from '@/components/UpdateMoviesData';
import SetRoarIcon from '@/components/SetRoarIcon';

const MothraMoviesPage: React.FC = () => {
    return (
        <>
            <SetRoarIcon roarIcon="roar_mothra.svg" />
            <UpdateMoviesData type="mothra" />
            <Suspense fallback={<div>Loading...</div>}>
                <AudioPathProvider basePath="/sounds/mothra">
                    <Home bannerFile="mothrabanner.png" apiEndpoint="api/getMothraMovies" />
                </AudioPathProvider>
            </Suspense>
        </>
    );
};

export default MothraMoviesPage;