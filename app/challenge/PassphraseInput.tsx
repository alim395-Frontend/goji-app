// app/challenge/PassphraseInput.tsx
import React, { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';

const PassphraseInput: React.FC = () => {
    const [passphrase, setPassphrase] = useState('');
    const [passphraseFeedback, setPassphraseFeedback] = useState<string | null>(null);
    const router = useRouter();
    const audioRef = useRef<HTMLAudioElement | null>(null);

    const handlePassphraseSubmit = () => {
        const lowerCasePassphrase = passphrase.toLowerCase();
        if (lowerCasePassphrase === 'gamera') {
            setPassphraseFeedback('Correct! Redirecting to the secret page...');
            if (audioRef.current) {
                audioRef.current.play();
            }
            setTimeout(() => {
                router.push('/gamera');
            }, 3000); // Delay to show feedback and play sound before redirecting
        } else if (lowerCasePassphrase === 'kamera') {
            setPassphraseFeedback('Review Hint #1 and #3, you are one syllable off.');
        } else {
            setPassphraseFeedback('Incorrect passphrase. Please try again.');
        }
    };

    return (
        <div className="passphrase-container">
            <input
                type="text"
                value={passphrase}
                onChange={(e) => setPassphrase(e.target.value)}
                placeholder="Enter passphrase"
                className="passphrase-input"
            />
            <button onClick={handlePassphraseSubmit} className="submit-button">Submit</button>
            {passphraseFeedback && <p>{passphraseFeedback}</p>}
            <audio ref={audioRef} src="/challenge/secret.mp3" />
        </div>
    );
};

export default PassphraseInput;