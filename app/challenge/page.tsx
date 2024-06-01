// app/challenge/QuizPage.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation'; // Correct import for useRouter in Next.js 13
import './challenge.css'; // Import the CSS file
import StartScreen from './StartScreen';
import Question from './Question';
import Result from './Result';

interface Question {
    question: string;
    options: string[];
    correctAnswer: string;
}

interface QuestionSet {
    questions: Question[];
}

const QuizPage: React.FC = () => {
    const [questionSets, setQuestionSets] = useState<QuestionSet[]>([]);
    const [currentSetIndex, setCurrentSetIndex] = useState(0);
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null);
    const [score, setScore] = useState(0);
    const [showFeedback, setShowFeedback] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizEnded, setQuizEnded] = useState(false);
    const [audioSrc, setAudioSrc] = useState<string>('/music/background-music-1.mp3'); // Default to the first track
    const [transitioning, setTransitioning] = useState(false);
    const [startScreenTransitioning, setStartScreenTransitioning] = useState(false);
    const [backgroundTransitioning, setBackgroundTransitioning] = useState(false);
    const [backgroundStyle, setBackgroundStyle] = useState<React.CSSProperties>({ backgroundImage: 'url(/images/background-start.jpg)' });
    const [showNextButton, setShowNextButton] = useState(false); // State to control the visibility of the next button
    const [showHint, setShowHint] = useState(false); // State to control the visibility of the hint
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const router = useRouter(); // Initialize the router

    useEffect(() => {
        fetch('/data/questions.json')
            .then(response => response.json())
            .then(data => {
                const limitedSets = data.sets.map((set: QuestionSet) => ({
                    questions: getRandomQuestions(set.questions, 20)
                }));
                setQuestionSets(limitedSets);
            });
    }, []);

    const getRandomQuestions = (questions: Question[], limit: number): Question[] => {
        const shuffled = questions.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, limit);
    };

    useEffect(() => {
        if (quizStarted && audioRef.current) {
            audioRef.current.src = audioSrc; // Set the audio source
            audioRef.current.volume = 1;
            audioRef.current.muted = false; // Ensure the audio is not muted
            audioRef.current.play().then(() => {
                console.log('Audio started playing');
            }).catch(error => {
                console.error('Error playing audio:', error);
            });
        }
    }, [quizStarted, audioSrc]);

    useEffect(() => {
        if (quizStarted) {
            // Change the audio source based on the current set index
            if (currentSetIndex === 0) {
                setAudioSrc('/music/background-music-1.mp3');
                setBackgroundStyle({ backgroundColor: 'red' });
            } else if (currentSetIndex === 1) {
                setAudioSrc('/music/background-music-2.mp3');
                setBackgroundStyle({ backgroundColor: 'orange' });
            } else if (currentSetIndex === 2) {
                setAudioSrc('/music/background-music-3.mp3');
                setBackgroundStyle({ backgroundColor: 'darkblue' });
            }
        }
    }, [currentSetIndex, quizStarted]);

    const startQuiz = () => {
        setStartScreenTransitioning(true);
        setBackgroundTransitioning(true);
        setTimeout(() => {
            setQuizStarted(true);
            setStartScreenTransitioning(false);
            setBackgroundTransitioning(false);
            setBackgroundStyle({ backgroundColor: 'red' }); // Change to first set background color
        }, 500); // Match the duration of the CSS transition
    };

    const fadeOutAudio = () => {
        if (audioRef.current) {
            let volume = audioRef.current.volume;
            const fadeOutInterval = setInterval(() => {
                if (volume > 0) {
                    volume -= 0.05;
                    audioRef.current!.volume = Math.max(volume, 0);
                } else {
                    clearInterval(fadeOutInterval);
                    audioRef.current!.pause();
                    console.log('Audio paused');
                }
            }, 100);
        } else {
            console.error('Audio element not found');
        }
    };

    const currentQuestionSet = questionSets[currentSetIndex];
    const currentQuestion = currentQuestionSet?.questions[currentQuestionIndex];

    const handleAnswerClick = (answer: string) => {
        if (selectedAnswer) return; // Prevent changing answer after selection

        setSelectedAnswer(answer);
        setShowFeedback(true);

        if (answer === currentQuestion.correctAnswer) {
            setScore(prevScore => prevScore + 1); // Use functional update to ensure correct score accumulation
        }

        // Delay the appearance of the next button
        setTimeout(() => {
            setShowNextButton(true);
        }, 1000); // 1 second delay
    };

    const handleNextQuestion = () => {
        setTransitioning(true);
        setShowNextButton(false); // Hide the next button immediately
        setTimeout(() => {
            setSelectedAnswer(null);
            setShowFeedback(false);
            setCurrentQuestionIndex(prevIndex => prevIndex + 1);
            setTransitioning(false);
        }, 500); // Match the duration of the CSS transition
    };

    const handleRestartSet = () => {
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setTransitioning(false);
    };

    const handleNextSet = () => {
        setCurrentSetIndex(prevIndex => prevIndex + 1);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setTransitioning(false);
        setShowNextButton(false); // Hide the next button immediately
        setShowHint(false); // Hide the hint for the next set
    };

    const handleRestartQuiz = () => {
        setQuizStarted(false);
        setQuizEnded(false);
        setCurrentSetIndex(0);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setScore(0); // Reset score when restarting the quiz
        setShowFeedback(false);
        setTransitioning(false);
        setBackgroundStyle({ backgroundImage: 'url(/images/background-start.jpg)' }); // Reset to start background image
    };

    const handleReturnToMain = () => {
        router.push('/'); // Navigate to the main page
    };

    useEffect(() => {
        if (currentQuestionIndex >= currentQuestionSet?.questions.length && quizStarted) {
            fadeOutAudio();
            setQuizEnded(true);
            setBackgroundStyle({ backgroundImage: 'url(/images/background-end.jpg)' }); // Change to end background image
            setShowHint(true); // Show the hint at the end of the set
        }
    }, [currentQuestionIndex, currentQuestionSet?.questions.length, quizStarted]);

    const getThreshold = () => {
        if (currentSetIndex === 0) return 0.6;
        if (currentSetIndex === 1) return 0.7;
        return 1; // No threshold for the last set
    };

    const canProceedToNextSet = () => {
        const threshold = getThreshold();
        return score / currentQuestionSet.questions.length >= threshold;
    };

    const getCurrentSetScore = () => {
        const totalQuestionsInPreviousSets = questionSets.slice(0, currentSetIndex).reduce((acc, set) => acc + set.questions.length, 0);
        return score - totalQuestionsInPreviousSets;
    };

    return (
        <div className="quiz-container">
            <div className={`background-container ${backgroundTransitioning ? 'fade-out' : ''}`} style={backgroundStyle}></div> {/* Background container */}
            {!quizStarted ? (
                <StartScreen
                    startScreenTransitioning={startScreenTransitioning}
                    startQuiz={startQuiz}
                />
            ) : currentQuestionIndex < currentQuestionSet?.questions.length ? (
                <Question
                    currentQuestion={currentQuestion}
                    selectedAnswer={selectedAnswer}
                    handleAnswerClick={handleAnswerClick}
                    showFeedback={showFeedback}
                    showNextButton={showNextButton}
                    handleNextQuestion={handleNextQuestion}
                    transitioning={transitioning}
                />
            ) : (
                <Result
                    currentSetIndex={currentSetIndex}
                    questionSets={questionSets}
                    score={score}
                    getCurrentSetScore={getCurrentSetScore}
                    canProceedToNextSet={canProceedToNextSet}
                    showHint={showHint}
                    handleNextSet={handleNextSet}
                    handleRestartSet={handleRestartSet}
                    handleRestartQuiz={handleRestartQuiz}
                    handleReturnToMain={handleReturnToMain}
                />
            )}
            <audio ref={audioRef} loop />
        </div>
    );
};

export default QuizPage;