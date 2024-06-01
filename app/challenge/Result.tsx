// app/challenge/Result.tsx
import React from 'react';
import PassphraseInput from './PassphraseInput';

interface ResultProps {
    currentSetIndex: number;
    questionSets: {
        questions: {
            question: string;
            options: string[];
            correctAnswer: string;
        }[];
    }[];
    score: number;
    getCurrentSetScore: () => number;
    canProceedToNextSet: () => boolean;
    showHint: boolean;
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
                                           canProceedToNextSet,
                                           showHint,
                                           handleNextSet,
                                           handleRestartSet,
                                           handleRestartQuiz,
                                           handleReturnToMain
                                       }) => {
    const renderHint = () => {
        let hintElement = null;
        let hintDescription = '';

        if (currentSetIndex === 0) {
            hintElement = <audio controls src="/challenge_data/hint1.mp3"/>;
            hintDescription = 'HINT #1: Listen carefully to what you are hearing, and NOTE who is present. It may help if you write it down.';
        } else if (currentSetIndex === 1) {
            hintElement = <img src="/challenge_data/hint2.gif" alt="Hint 2"/>;
            hintDescription = 'HINT #2: Kame Sen\'nin Master Roshi  preforming the Kamehameha. But what is a Kame hameha?';
        } else if (currentSetIndex === 2) {
            hintElement = <img src="/challenge_data/hint3.png" alt="Hint 3"/>;
            hintDescription = 'HINT #3: An excerpt from a Japanese dictionary. Note the subject highlighted and the format, as it may help you with Hint #1.';
        }

        return (
            <div className="hint-wrapper">
                {hintElement}
                <p className="hint-description">{hintDescription}</p>
            </div>
        );
    };

    const getThresholdMessage = () => {
        const threshold = getThreshold();
        const currentSetScore = getCurrentSetScore();
        const totalQuestions = questionSets[currentSetIndex].questions.length;
        const requiredScore = Math.ceil(threshold * totalQuestions);

        if (canProceedToNextSet()) {
            return `Congratulations! You scored ${currentSetScore} out of ${totalQuestions}, which meets the threshold of ${requiredScore} correct answers. You can proceed to the next set.`;
        } else {
            return `You scored ${currentSetScore} out of ${totalQuestions}, but you needed at least ${requiredScore} correct answers to proceed. Please try again.`;
        }
    };

    const getThreshold = () => {
        if (currentSetIndex === 0) return 0.6;
        if (currentSetIndex === 1) return 0.7;
        return 1; // No threshold for the last set
    };

    return (
        <div className="quiz-content-container">
            <div className="result-container">
                <h1>Set Complete!</h1>
                <p>Your score: {getCurrentSetScore()} / {questionSets[currentSetIndex].questions.length}</p>
                {currentSetIndex < questionSets.length - 1 ? (
                    <>
                        <p>{getThresholdMessage()}</p>
                        {canProceedToNextSet() ? (
                            <>
                                {showHint && <div className="hint-container">{renderHint()}</div>}
                                <button onClick={handleNextSet} className="next-button">Next Set</button>
                            </>
                        ) : (
                            <button onClick={handleRestartSet} className="restart-button">Retry Set</button>
                        )}
                    </>
                ) : (
                    <>
                        <p>Quiz Complete! Your final score: {score} / {questionSets.reduce((acc, set) => acc + set.questions.length, 0)}</p>
                        {showHint && <div className="hint-container">{renderHint()}</div>}
                        <button onClick={handleRestartQuiz} className="restart-button">Restart Quiz</button>
                        <button onClick={handleReturnToMain} className="next-button">Return to Main Page</button>
                        <PassphraseInput />
                    </>
                )}
            </div>
        </div>
    );
};

export default Result;