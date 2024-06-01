// components/RoarButton.tsx
import React from 'react';
import styled, { keyframes, css } from 'styled-components';

interface RoarButtonProps {
    onClick: () => void;
    'aria-label': string;
    isPlaying: boolean;
    icon: string;
}

// Animation for the roar button when playing
const roarAnimation = keyframes`
    0% { transform: scale(1); }
    50% { transform: scale(1.1); }
    100% { transform: scale(1); }
`;

// Button to play the Godzilla roar
const Button = styled.button<{ isPlaying: boolean; icon: string }>`
    background-color: #444;
    color: #fff;
    border: none;
    width: 50px; // Set both width and height to the same value for a square
    height: 50px;
    border-radius: 4px;
    cursor: pointer;
    margin-top: 20px;
    background-image: url(${({ icon }) => `/roarIcons/${icon}`}); // Use the icon prop for the background image
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

const RoarButton: React.FC<RoarButtonProps> = ({ onClick, 'aria-label': ariaLabel, isPlaying, icon }) => {
    return (
        <Button onClick={onClick} aria-label={ariaLabel} isPlaying={isPlaying} icon={icon}>
            Play Roar
        </Button>
    );
};

export default RoarButton;