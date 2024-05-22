// components/StarRating.tsx

import React from 'react';
import styled from 'styled-components';

const StarContainer = styled.div`
    display: flex;
    align-items: center;
`;

const Star = styled.span<{ filled: boolean }>`
    color: ${props => (props.filled ? '#ffc107' : '#ffc107')};
    font-size: 1.5rem;
    line-height: 1;
    margin-right: 0.1rem; // Add a small margin to separate the stars
`;

const RatingText = styled.span`
  font-size: 1rem;
  margin-left: 0.5rem; // Space between stars and rating text
`;

interface StarRatingProps {
    rating: number;
    outOf?: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating, outOf = 5 }) => {
    const normalizedRating = (rating / 10) * outOf;
    const fullStars = Math.floor(normalizedRating);
    const halfStar = normalizedRating % 1 >= 0.5;
    const emptyStars = outOf - fullStars - (halfStar ? 1 : 0);

    return (
        <StarContainer>
            {Array.from({ length: fullStars }, (_, index) => (
                <Star key={`full-${index}`} filled>&#9733;</Star>
            ))}
            {halfStar && <Star filled>&#189;</Star>}
            {Array.from({ length: emptyStars }, (_, index) => (
                <Star key={`empty-${index}`} filled={false}>&#9734;</Star>
            ))}
            <RatingText>{rating.toFixed(2)}/10</RatingText>
        </StarContainer>
    );
};

export default StarRating;