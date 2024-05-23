// components/Music.tsx
import React, { useEffect, useState } from "react";
import styled from "styled-components";

const AudioContainer = styled.div`
    margin-top: 20px;
`;

const AudioLabel = styled.p`
    margin: 0;
    color: #333;
`;

const Music: React.FC<{ movie: string; era: string }> = ({ movie, era }) => {
    const [audioFiles, setAudioFiles] = useState<string[]>([]);

    useEffect(() => {
        const fetchAudioFiles = async () => {
            const sanitizedTitle = movie.replace(/[\\/:*?"<>|]/g, "").replace(/\s+/g, "_");
            const apiUrl = `/api/getAudioFiles?era=${era}&movie=${sanitizedTitle}`;

            console.log('Fetching audio files from:', apiUrl);

            try {
                const response = await fetch(apiUrl);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const data = await response.json();
                console.log('Fetched audio files:', data.files);
                setAudioFiles(data.files);
            } catch (error) {
                console.error('Error fetching audio files:', error);
            }
        };

        fetchAudioFiles();
    }, [movie, era]);

    return (
        <AudioContainer>
            {audioFiles.length === 0 ? (
                <p>No audio files found.</p>
            ) : (
                audioFiles.map((file, index) => (
                    <div key={index}>
                        <AudioLabel>{file}</AudioLabel>
                        <audio controls>
                            <source src={`/music/${era}/${movie.replace(/[\\/:*?"<>|]/g, "").replace(/\s+/g, "_")}/${file}`} type="audio/mpeg" />
                            Your browser does not support the audio element.
                        </audio>
                    </div>
                ))
            )}
        </AudioContainer>
    );
};

export default Music;