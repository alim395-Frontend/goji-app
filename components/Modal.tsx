"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from 'next/navigation';
import { useMediaQuery } from 'react-responsive';
import { Movie } from "@/public/data/movies";
import StarRating from './StarRating';
import Music from './Music';
import Overlay from './Overlay';
import ModalContent from './ModalContent';
import CloseButton from './CloseButton';
import { PosterContainer, Poster } from './Poster';
import ContentContainer from './ContentContainer';
import RoarButton from './RoarButton';
import SectionHeader from './SectionHeader';
import styled from "styled-components";
import { useRoarIcon } from '@/context/RoarIconContext';
import { useAudioPath } from '@/context/AudioPathContext';

const Title = styled.h2`
  margin: 0;
  color: #333;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 10px;
  text-align: center;
  cursor: pointer; /* Add cursor pointer to indicate clickability */
`;

const AlternateNames = styled.p`
  font-style: italic;
  color: #999;
  text-align: center;
  margin-top: -10px;
  margin-bottom: 10px;
`;

const Rating = styled.p`
  color: #333;
`;

const ReleaseDate = styled.p`
  color: #333;
`;

const Description = styled.p`
  color: #333;
`;

const Genres = styled.p`
  color: #333;
`;

const Runtime = styled.p`
  color: #333;
`;

const Divider = styled.hr`
  border: 0;
  height: 1px;
  background: #ccc;
  margin: 20px 0;
`;

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  movie: Movie;
}> = ({ isOpen, onClose, movie }) => {
  const [audio, setAudio] = useState<HTMLAudioElement | null>(null);
  const [roarAvailable, setRoarAvailable] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [clickCount, setClickCount] = useState(0);
  const { roarIcon } = useRoarIcon();
  const { basePath } = useAudioPath();
  const router = useRouter();
  const isMobile = useMediaQuery({ query: '(max-width: 768px)' });

  useEffect(() => {
    if (isOpen) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }

    return () => {
      document.body.classList.remove('modal-open');
    };
  }, [isOpen]);

  useEffect(() => {
    console.log('Modal is open:', isOpen);
    console.log('Movie:', movie);
    console.log('Base path:', basePath);

    setAudio(null);
    setRoarAvailable(false);
    setIsPlaying(false);

    if (isOpen && movie) {
      const sanitizedTitle = movie.title.replace(/[\\/:*?"<>|]/g, "").replace(/\s+/g, "_");
      const audioFile = `${basePath}/${movie.era}/${sanitizedTitle}.mp3`;

      console.log('Audio file path:', audioFile);

      fetch(audioFile, { method: 'HEAD' })
          .then((response) => {
            if (response.ok) {
              const audioElement = new Audio(audioFile);
              setAudio(audioElement);
              setRoarAvailable(true);
              console.log('Audio file found and set');
            } else {
              console.error('Audio file not found');
            }
          })
          .catch((error) => {
            console.error('Error checking for audio file:', error);
          });
    }
  }, [isOpen, movie, basePath]);

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

  const handleTitleClick = () => {
    if (movie.title === "Godzilla vs. Mothra" && movie.releaseDate === "1992-12-12") {
      setClickCount(prevCount => prevCount + 1);

      if (clickCount === 0) {
        new Audio('/sounds/mothra.mp3').play();
      } else if (clickCount === 1) {
        new Audio('/sounds/mothra_leo.mp3').play();
        setTimeout(() => {
          router.push('/mothra-movies');
        }, 1000); // Delay to allow the sound to play before navigation
      }
    }
  };

  if (!isOpen) {
    return null;
  }

  const handleImageError = (
      event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    if (movie.posterUrl && event.currentTarget.src !== movie.posterUrl) {
      event.currentTarget.src = movie.posterUrl;
    } else {
      event.currentTarget.src = "/images/placeholder.jpg";
    }
  };

  return (
      <Overlay onClick={onClose}>
        <ModalContent onClick={(e) => e.stopPropagation()}>
          <CloseButton onClick={onClose}>&times;</CloseButton>
          {!isMobile && (
              <PosterContainer>
                <Poster
                    src={`/images/${movie.era}/${movie.title.replace(/[\\/:*?"<>|]/g, "").replace(/\s+/g, "_")}.jpg`}
                    alt={movie.title}
                    onError={handleImageError}
                />
              </PosterContainer>
          )}
          <ContentContainer>
            <Title onClick={handleTitleClick}>{movie.title}</Title>
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
                <RoarButton onClick={playRoar} aria-label="Play Godzilla roar" isPlaying={isPlaying} icon={roarIcon} />
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