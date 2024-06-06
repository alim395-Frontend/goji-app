// app/challenge/Result.tsx
import React from 'react';

interface ResultProps {
    currentSetIndex: number;
    questionSets: { questions: { question: string; options: string[]; correctAnswer: string }[] }[];
    score: number;
    getCurrentSetScore: () => number;
    handleNextSet: () => void;
    handleRestartSet: () => void;
    handleRestartQuiz: () => void;
    handleReturnToMain: () => void;
}

const Result: React.FC<ResultProps> = ({
                                           currentSetIndex,
                                           questionSets,
                                           score,
                                           getCurrentSetScore,
                                           handleNextSet,
                                           handleRestartSet,
                                           handleRestartQuiz,
                                           handleReturnToMain,
                                       }) => {
    const isLastSet = currentSetIndex >= questionSets.length - 1;

    return (
        <div className="result-container">
            <h2>Quiz Completed</h2>
            <p>Your score for this set: {getCurrentSetScore()}</p>
            <p>Total score: {score}</p>
            <div className="result-button-container">
                {!isLastSet ? (
                    <>
                        <button onClick={handleNextSet} className="result-button">
                            Next Set
                        </button>
                        <button onClick={handleRestartSet} className="result-button">
                            Restart Set
                        </button>
                    </>
                ) : (
                    <>
                        <button onClick={handleRestartQuiz} className="result-button">
                            Restart Quiz
                        </button>
                        <button onClick={handleReturnToMain} className="result-button">
                            Return to Main
                        </button>
                    </>
                )}
            </div>
        </div>
    );
};

export default Result;