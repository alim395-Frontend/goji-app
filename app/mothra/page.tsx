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

    return (
        <Suspense fallback={<div>Loading...</div>}>
            <AudioPathProvider basePath="/sounds/mothra">
                <Home bannerFile="mothrabanner.png" apiEndpoint="/api/getMothraMovies" />
            </AudioPathProvider>
        </Suspense>
    );
};

export default MothraMoviesPage;