// app/context/RoarIconContext.tsx
'use client';

import React, { createContext, useContext, useState, ReactNode } from 'react';

interface RoarIconContextProps {
    roarIcon: string;
    setRoarIcon: (icon: string) => void;
}

const RoarIconContext = createContext<RoarIconContextProps | undefined>(undefined);

export const RoarIconProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [roarIcon, setRoarIcon] = useState<string>('roar.svg');

    return (
        <RoarIconContext.Provider value={{ roarIcon, setRoarIcon }}>
            {children}
        </RoarIconContext.Provider>
    );
};

export const useRoarIcon = (): RoarIconContextProps => {
    const context = useContext(RoarIconContext);
    if (!context) {
        throw new Error('useRoarIcon must be used within a RoarIconProvider');
    }
    return context;
};