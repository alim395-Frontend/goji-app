// components/Modal.tsx
"use client";

import React from "react";
import styled from "styled-components";
import { Movie } from "../data/movies";

const Overlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
`;

const ModalContent = styled.div`
  background: white;
  padding: 20px;
  border-radius: 8px;
  max-width: 800px;
  width: 100%;
  display: flex;
  gap: 20px;
  position: relative;
  color: black; /* Ensure text is black */

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: center;
  }
`;

const CloseButton = styled.button`
  position: absolute;
  top: 10px;
  right: 10px;
  background: none;
  border: none;
  font-size: 20px;
  cursor: pointer;
  color: black; /* Ensure close button is visible */
`;

const Poster = styled.img`
  width: 50%;
  height: auto;
  border-radius: 4px;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Content = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  width: 50%;

  @media (max-width: 768px) {
    width: 100%;
  }
`;

const Title = styled.h2`
  margin-bottom: 10px;
`;

const AlternateNames = styled.p`
  margin-bottom: 10px;
  font-style: italic;
`;

const ReleaseDate = styled.p`
  margin-bottom: 10px;
`;

const Description = styled.p`
  margin-bottom: 10px;
`;

const Modal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  movie: Movie;
}> = ({ isOpen, onClose, movie }) => {
  if (!isOpen) return null;

  const handleImageError = (
    event: React.SyntheticEvent<HTMLImageElement, Event>
  ) => {
    event.currentTarget.src = "/images/placeholder.jpg"; // Path to your placeholder image
  };

  return (
    <Overlay onClick={onClose}>
      <ModalContent onClick={(e) => e.stopPropagation()}>
        <CloseButton onClick={onClose}>&times;</CloseButton>
        <Poster
          src={`/images/${movie.era}/${movie.title
            .replace(/[\\/:*?"<>|]/g, "")
            .replace(/\s+/g, "_")}.jpg`}
          alt={movie.title}
          onError={handleImageError}
        />
        <Content>
          <Title>{movie.title}</Title>
          {movie.alternateNames.length > 0 && (
            <AlternateNames>
              <strong>Alt. Names:</strong> {movie.alternateNames.join(", ")}
            </AlternateNames>
          )}
          <ReleaseDate>
            <strong>Release Date:</strong>{" "}
            {new Date(movie.releaseDate).toLocaleDateString()}
          </ReleaseDate>
          <Description>{movie.description}</Description>
        </Content>
      </ModalContent>
    </Overlay>
  );
};

export default Modal;
