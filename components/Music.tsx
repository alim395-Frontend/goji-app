// components/Music.tsx
"use client";

import React, { useRef, useState } from "react";
import styled from "styled-components";

const MusicButton = styled.button`
  margin-left: 10px;
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    color: #ccc;
  }
`;

const PlayButton = styled.button`
  background: none;
  border: none;
  color: white;
  cursor: pointer;
  font-size: 16px;

  &:hover {
    color: #ccc;
  }
`;

const Music: React.FC = () => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  const handlePlay = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.loop = true;
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.error("Error playing audio:", error);
        });
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (audio) {
      audio.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  return (
    <div>
      <audio
        ref={audioRef}
        src="/background-music.mp3"
        onError={() => console.error("Error loading audio")}
      />
      {!isPlaying && <PlayButton onClick={handlePlay}>Play Music</PlayButton>}
      {isPlaying && (
        <MusicButton onClick={toggleMute}>
          {isMuted ? "Unmute" : "Mute"}
        </MusicButton>
      )}
    </div>
  );
};

export default Music;
