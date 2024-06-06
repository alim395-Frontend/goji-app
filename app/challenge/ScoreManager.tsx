import React, { useState } from 'react';

interface ScoreManagerProps {
    numberOfSections: number;
}

interface ScoreManagerContextProps {
    scores: number[];
    updateScore: (sectionIndex: number, score: number) => void;
    resetSectionScore: (sectionIndex: number) => void;
    resetAllScores: () => void;
    getTotalScore: () => number;
}

const ScoreManagerContext = React.createContext<ScoreManagerContextProps | undefined>(undefined);

export const ScoreManagerProvider: React.FC<React.PropsWithChildren<ScoreManagerProps>> = ({ numberOfSections, children }) => {
    const [scores, setScores] = useState<number[]>(Array(numberOfSections).fill(0));

    const updateScore = (sectionIndex: number, score: number) => {
        setScores(prevScores => {
            const newScores = [...prevScores];
            newScores[sectionIndex] = score;
            return newScores;
        });
    };

    const resetSectionScore = (sectionIndex: number) => {
        setScores(prevScores => {
            const newScores = [...prevScores];
            newScores[sectionIndex] = 0;
            return newScores;
        });
    };

    const resetAllScores = () => {
        setScores(Array(numberOfSections).fill(0));
    };

    const getTotalScore = () => {
        return scores.reduce((acc, score) => acc + score, 0);
    };

    return (
        <ScoreManagerContext.Provider value={{ scores, updateScore, resetSectionScore, resetAllScores, getTotalScore }}>
            {children}
        </ScoreManagerContext.Provider>
    );
};

export const useScoreManager = () => {
    const context = React.useContext(ScoreManagerContext);
    if (!context) {
        throw new Error('useScoreManager must be used within a ScoreManagerProvider');
    }
    return context;
};