// components/Modal.tsx
"use client";

import React, { useEffect, useState } from "react";
import styled from "styled-components";
import { Movie } from "@/data/movies";

// Overlay that covers the entire screen
const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
`;

// ModalContent now uses display: flex to arrange children side by side
const ModalContent = styled.div`
  position: relative;
  background-color: #fff;
  padding: 20px;
  border-radius: 8px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  display: flex; // Set to flex to use flexbox layout
  max-width: 900px; // Adjust the width as needed
  width: 90%; // Adjust the width as needed
`;

// Close button for the modal
const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  background: none;
  font-size: 24px;
  cursor: pointer;
`;

// PosterContainer will hold the poster image
const PosterContainer = styled.div`
  flex: 1; // Take up 1 portion of the flex container
  max-width: 40%; // Adjust the width as needed
`;

// ContentContainer will hold the movie details
const ContentContainer = styled.div`
  flex: 2; // Take up 2 portions of the flex container
  margin-left: 20px; // Add some space between the poster and the content
`;

// Adjust the Poster styled component if needed
const Poster = styled.img`
  width: 100%;
  height: auto;
  border-radius: 4px;
`;

// Title of the movie
const Title = styled.h2`
  margin: 0;
  color: #333;
`;

// Container for alternate names
const AlternateNames = styled.p`
  font-style: italic;
  color: #666;
`;

// Release date of the movie
const ReleaseDate = styled.p`
  color: #333;
`;

// Description of the movie
const Description = styled.p`
  color: #333;
`;

// Button to play the Godzilla roar
const RoarButton = styled.button`
  background-color: #444;
  color: #fff;
  border: none;
  width: 50px; // Set both width and height to the same value for a square
  height: 50px;
  border-radius: 4px;
  cursor: pointer;
  margin-top: 20px;
  background-image: url('/roar.svg'); // Path to your roar.svg in the public folder
  background-repeat: no-repeat;
  background-position: center;
  background-size: 80%; // Adjust the size of the SVG within the button
  text-indent: -9999px; // Hide the text off-screen

  &:hover {
    background-color: #555;
  }

  // Adjust the button size on different screen sizes if necessary
  @media (min-width: 768px) {
    width: 70px;
    height: 70px;
  }
`;

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  movie: Movie;
}> = ({ isOpen, onClose, movie }) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [roarAvailable, setRoarAvailable] = useState(false);

  useEffect(() => {
    // Reset states when the modal is closed or the movie changes
    setAudio(null);
    setRoarAvailable(false);

    if (isOpen && movie) {
      const sanitizedTitle = movie.title.replace(/[\\/:*?"<>|]/g, "").replace(/\s+/g, "_");
      const audioFile = `/sounds/${movie.era}/${sanitizedTitle}.mp3`;

      // Check if the audio file exists
      fetch(audioFile, { method: 'HEAD' })
          .then((response) => {
            if (response.ok) {
              const audioElement = new Audio(audioFile);
              setAudio(audioElement);
              setRoarAvailable(true);
            }
          })
          .catch((error) => {
            // If there's an error (e.g., network issue), log it and continue without the roar
            console.error('Error checking for audio file:', error);
          });
    }
  }, [isOpen, movie]);

  const playRoar = () => {
    if (audio) {
      audio.play().catch((error) => {
        console.error('Error playing the audio:', error);
      });
    }
  };

  if (!isOpen) {
    return null;
  }

  const handleImageError = (
      event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    // Fallback to the poster URL from the API if the local image fails to load
    if (movie.posterUrl && event.currentTarget.src !== movie.posterUrl) {
      event.currentTarget.src = movie.posterUrl;
    } else {
      // If the API's poster URL also fails, use a placeholder image
      event.currentTarget.src = "/images/placeholder.jpg";
    }
  };

  return (
      <Overlay onClick={onClose}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <CloseButton onClick={onClose}>&times;</CloseButton>
          <PosterContainer>
            <Poster
                src={`/images/${movie.era}/${movie.title.replace(/[\\/:*?"<>|]/g, "").replace(/\s+/g, "_")}.jpg`}
                alt={movie.title}
                onError={handleImageError}
            />
          </PosterContainer>
          <ContentContainer>
            <Title>{movie.title}</Title>
            {movie.alternateNames && movie.alternateNames.length > 0 && (
                <AlternateNames>
                  <strong>Alt. Names:</strong> {movie.alternateNames.join(", ")}
                </AlternateNames>
            )}
            <ReleaseDate>
              <strong>Release Date:</strong> {new Date(movie.releaseDate).toLocaleDateString()}
            </ReleaseDate>
            <Description>{movie.description}</Description>
            {roarAvailable && (
                <RoarButton onClick={playRoar} aria-label="Play Godzilla roar" />
            )}
          </ContentContainer>
        </ModalContent>
      </Overlay>
  );
};

export default Modal;