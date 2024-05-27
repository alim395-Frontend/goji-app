// components/Modal.tsx
"use client";

import React, { useEffect, useState } from "react";
import styled, { keyframes, css } from "styled-components";
import { Movie } from "@/data/movies";
import StarRating from './StarRating';
import Music from './Music';

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
  display: flex;
  flex-direction: column; // Default to column layout for smaller screens
  max-width: 900px;
  width: 90%;
  max-height: 90vh;
  overflow-y: auto; // Make the content scrollable

  @media (min-width: 768px) {
    flex-direction: row; // Change to row layout for larger screens
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  border: none;
  font-size: 24px;
  cursor: pointer;
  color: #333;
  background: rgba(0, 0, 0, 0.1) none;
  border-radius: 50%;
  padding: 0.5rem;
  display: flex; /* Center the '×' symbol */
  align-items: center;
  justify-content: center;
  width: 30px;
  height: 30px;

  &:hover {
    background-color: rgba(0, 0, 0, 0.2); /* Darker background on hover */
    color: #000; /* Optional: Change color on hover for better visibility */
  }
`;

// PosterContainer will hold the poster image
const PosterContainer = styled.div`
  flex: 1;
  max-width: 100%; // Full width on smaller screens
  margin-bottom: 20px; // Add margin at the bottom for spacing

  @media (min-width: 768px) {
    max-width: 40%; // Adjust the width for larger screens
    margin-bottom: 0; // Remove bottom margin for larger screens
  }

  @media (max-width: 767px) {
    display: none; // Hide the poster on smaller screens
  }
`;

// Adjust the Poster styled component if needed
const Poster = styled.img`
  width: 100%;
  height: auto;
  border-radius: 4px;

  @media (max-width: 767px) {
    max-height: 200px; // Limit the height on smaller screens
    object-fit: cover; // Ensure the image covers the area without distortion
  }
`;

// ContentContainer will hold the movie details
const ContentContainer = styled.div`
  flex: 2;
  margin-left: 0; // No left margin on smaller screens
  max-height: 80vh;
  overflow-y: auto;

  @media (min-width: 768px) {
    margin-left: 20px; // Add left margin for larger screens
  }
`;

// Title of the movie
const Title = styled.h2`
  margin: 0;
  color: #333;
  font-size: 2rem; // Increase font size
  font-weight: bold; // Make the font bold
  margin-bottom: 10px; // Add some margin at the bottom
  text-align: center; // Center the title
`;

// Container for alternate names
const AlternateNames = styled.p`
  font-style: italic;
  color: #999; // Faded grey color
  text-align: center; // Center the alternate names
  margin-top: -10px; // Adjust margin to bring it closer to the title
  margin-bottom: 10px; // Add some margin at the bottom
`;

// Rating of the movie
const Rating = styled.p`
  color: #333;
`;

// Release date of the movie
const ReleaseDate = styled.p`
  color: #333;
`;

// Description of the movie
const Description = styled.p`
  color: #333;
`;

// Genres of the movie
const Genres = styled.p`
  color: #333;
`;

// Runtime of the movie
const Runtime = styled.p`
  color: #333;
`;

// Animation for the roar button when playing
const roarAnimation = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.1); }
  100% { transform: scale(1); }
`;

// Button to play the Godzilla roar
const RoarButton = styled.button<{ isPlaying: boolean }>`
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

  &:active {
    background-color: #666;
  }

  ${({ isPlaying }) =>
      isPlaying &&
      css`
        animation: ${roarAnimation} 0.5s infinite;
      `}

      // Adjust the button size on different screen sizes if necessary
  @media (min-width: 768px) {
  width: 70px;
  height: 70px;
}
`;

// Divider to separate sections
const Divider = styled.hr`
  border: 0;
  height: 1px;
  background: #ccc;
  margin: 20px 0;
`;

// Section header for audio samples
const SectionHeader = styled.h3`
  margin: 20px 0 10px;
  color: #444;
  border-bottom: 2px solid #ccc;
  padding-bottom: 5px;
`;

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  movie: Movie;
}> = ({ isOpen, onClose, movie }) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [roarAvailable, setRoarAvailable] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

  useEffect(() => {
    // Add or remove the class to disable scrolling on the body element
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    // Cleanup function to remove the class when the component unmounts
    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  useEffect(() => {
    // Reset states when the modal is closed or the movie changes
    setAudio(null);
    setRoarAvailable(false);
    setIsPlaying(false);

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
      setIsPlaying(true);
      audio.play()
          .then(() => {
            audio.onended = () => {
              setIsPlaying(false);
            };
          })
          .catch((error) => {
            console.error('Error playing the audio:', error);
            setIsPlaying(false);
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
                  {movie.alternateNames.join(", ")}
                </AlternateNames>
            )}
            <Rating>
              <strong>Rating:</strong>
              {movie.rating ? (
                  <StarRating rating={movie.rating} />
              ) : (
                  'N/A'
              )}
            </Rating>
            <ReleaseDate>
              <strong>Release Date:</strong> {new Date(movie.releaseDate).toLocaleDateString()}
            </ReleaseDate>
            {movie.genres && movie.genres.length > 0 && (
                <Genres>
                  <strong>Genres:</strong> {movie.genres.join(", ")}
                </Genres>
            )}
            {movie.runtime !== undefined && (
                <Runtime>
                  <strong>Runtime:</strong> {movie.runtime} minutes
                </Runtime>
            )}
            <Description>{movie.description}</Description>
            {roarAvailable && (
                <RoarButton onClick={playRoar} aria-label="Play Godzilla roar" isPlaying={isPlaying} />
            )}
            <Divider />
            <SectionHeader>Audio Samples</SectionHeader>
            <Music movie={movie.title} era={movie.era} />
          </ContentContainer>
        </ModalContent>
      </Overlay>
  );
};

export default Modal;