// app/challenge/Question.tsx
import React from 'react';

interface QuestionProps {
    currentQuestion: {
        question: string;
        options: string[];
        correctAnswer: string;
    };
    selectedAnswer: string | null;
    handleAnswerClick: (answer: string) => void;
    showFeedback: boolean;
    showNextButton: boolean;
    handleNextQuestion: () => void;
    transitioning: boolean;
}

const Question: React.FC<QuestionProps> = ({
                                               currentQuestion,
                                               selectedAnswer,
                                               handleAnswerClick,
                                               showFeedback,
                                               showNextButton,
                                               handleNextQuestion,
                                               transitioning
                                           }) => {
    return (
        <div className="quiz-content-container">
            <h1 className="quiz-header">Godzilla Movie Quiz</h1>
            <div className={`question-container ${transitioning ? 'fade-out' : 'fade-in'}`}>
                <p>{currentQuestion.question}</p>
                <div className="options-grid">
                    {currentQuestion.options.map(option => (
                        <button
                            key={option}
                            onClick={() => handleAnswerClick(option)}
                            className={`option-button ${
                                selectedAnswer
                                    ? option === currentQuestion.correctAnswer
                                        ? 'correct'
                                        : option === selectedAnswer
                                            ? 'incorrect'
                                            : ''
                                    : ''
                            }`}
                        >
                            {option}
                        </button>
                    ))}
                </div>
            </div>
            {showFeedback && (
                <div className="feedback-container">
                    <p>{selectedAnswer === currentQuestion.correctAnswer ? 'Correct' : 'Incorrect'}</p>
                    {showNextButton && (
                        <button onClick={handleNextQuestion} className="next-button">Next Question</button>
                    )}
                </div>
            )}
        </div>
    );
};

export default Question;