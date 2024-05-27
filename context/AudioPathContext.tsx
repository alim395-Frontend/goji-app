// context/AudioPathContext.tsx
'use client';

import React, { createContext, useContext, ReactNode } from 'react';

interface AudioPathContextProps {
    basePath: string;
}

const AudioPathContext = createContext<AudioPathContextProps | undefined>(undefined);

export const useAudioPath = () => {
    const context = useContext(AudioPathContext);
    if (!context) {
        throw new Error('useAudioPath must be used within an AudioPathProvider');
    }
    return context;
};

export const AudioPathProvider: React.FC<{ basePath: string; children: ReactNode }> = ({ basePath, children }) => {
    return (
        <AudioPathContext.Provider value={{ basePath }}>
            {children}
        </AudioPathContext.Provider>
    );
};