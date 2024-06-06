// app/challenge/QuizPage.tsx
'use client';

import React, { useEffect, useState, useRef } from 'react';
import { useRouter } from 'next/navigation'; // Correct import for useRouter in Next.js 13
import './challenge.css'; // Import the CSS file
import StartScreen from './StartScreen';
import Question from './Question';
import Result from './Result';
import { ScoreManagerProvider, useScoreManager } from './ScoreManager';

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
    const [showFeedback, setShowFeedback] = useState(false);
    const [quizStarted, setQuizStarted] = useState(false);
    const [quizEnded, setQuizEnded] = useState(false);
    const [audioSrc, setAudioSrc] = useState<string>('/music/background-music-1.mp3'); // Default to the first track
    const [transitioning, setTransitioning] = useState(false);
    const [startScreenTransitioning, setStartScreenTransitioning] = useState(false);
    const [backgroundTransitioning, setBackgroundTransitioning] = useState(false);
    const [backgroundStyle, setBackgroundStyle] = useState<React.CSSProperties>({ backgroundImage: 'url(/images/background-start.jpg)' });
    const [showNextButton, setShowNextButton] = useState(false); // State to control the visibility of the next button
    const [isMusicEnabled, setIsMusicEnabled] = useState(true); // Default to true
    const audioRef = useRef<HTMLAudioElement | null>(null);
    const router = useRouter(); // Initialize the router
    const { scores, updateScore, resetSectionScore, resetAllScores, getTotalScore } = useScoreManager();

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
        if (quizStarted && audioRef.current && isMusicEnabled) {
            audioRef.current.src = audioSrc; // Set the audio source
            audioRef.current.volume = 1;
            audioRef.current.muted = false; // Ensure the audio is not muted
            audioRef.current.play().then(() => {
                console.log('Audio started playing');
            }).catch(error => {
                console.error('Error playing audio:', error);
            });
        } else if (audioRef.current) {
            audioRef.current.pause();
        }
    }, [quizStarted, audioSrc, isMusicEnabled]);

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

    useEffect(() => {
        // Check if the user is on a mobile device and set the music state accordingly
        if (isMobileDevice()) {
            setIsMusicEnabled(false);
        }
    }, []);

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
            updateScore(currentSetIndex, scores[currentSetIndex] + 1); // Update the score for the current section
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
        resetSectionScore(currentSetIndex); // Reset the score for the current section
    };

    const handleNextSet = () => {
        setCurrentSetIndex(prevIndex => prevIndex + 1);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        setShowFeedback(false);
        setTransitioning(false);
        setShowNextButton(false); // Hide the next button immediately
    };

    const handleRestartQuiz = () => {
        setQuizStarted(false);
        setQuizEnded(false);
        setCurrentSetIndex(0);
        setCurrentQuestionIndex(0);
        setSelectedAnswer(null);
        resetAllScores(); // Reset scores for all sections
        setShowFeedback(false);
        setTransitioning(false);
        setBackgroundStyle({ backgroundImage: 'url(/images/background-start.jpg)' }); // Reset to start background image
    };

    const handleReturnToMain = () => {
        router.push('/'); // Navigate to the main page
    };

    const toggleMusic = () => {
        setIsMusicEnabled(prevState => !prevState);
    };

    useEffect(() => {
        if (currentQuestionIndex >= currentQuestionSet?.questions.length && quizStarted) {
            fadeOutAudio();
            setQuizEnded(true);
            setBackgroundStyle({ backgroundImage: 'url(/images/background-end.jpg)' }); // Change to end background image
        }
    }, [currentQuestionIndex, currentQuestionSet?.questions.length, quizStarted]);

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
                    score={getTotalScore()}
                    getCurrentSetScore={() => scores[currentSetIndex]}
                    handleNextSet={handleNextSet}
                    handleRestartSet={handleRestartSet}
                    handleRestartQuiz={handleRestartQuiz}
                    handleReturnToMain={handleReturnToMain}
                />
            )}
            <div className="button-container">
                <button onClick={handleReturnToMain} className="exit-button">
                    Exit to Home
                </button>
                <button onClick={toggleMusic} className="music-toggle-button">
                    {isMusicEnabled ? 'Disable Music' : 'Enable Music'}
                </button>
            </div>
            <audio ref={audioRef} loop />
        </div>
    );
};

const isMobileDevice = () => {
    return /Mobi|Android/i.test(navigator.userAgent);
};

const QuizPageWithScoreManager: React.FC = () => (
    <ScoreManagerProvider numberOfSections={3}>
        <QuizPage />
    </ScoreManagerProvider>
);

export default QuizPageWithScoreManager;