// app/challenge/StartScreen.tsx
import React from 'react';

interface StartScreenProps {
    startScreenTransitioning: boolean;
    startQuiz: () => void;
}

const StartScreen: React.FC<StartScreenProps> = ({ startScreenTransitioning, startQuiz }) => {
    return (
        <div className={`start-screen ${startScreenTransitioning ? 'fade-out' : ''}`}>
            <div className="text-container">
                <h1>Welcome to the Godzilla Movie Quiz!</h1>
                <p>Test your knowledge about Godzilla movies. Are you a super Goji Fan?</p>
                <button onClick={startQuiz} className="start-button">Start Quiz</button>
            </div>
        </div>
    );
};

export default StartScreen;