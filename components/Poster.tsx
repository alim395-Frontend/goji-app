// components/Poster.tsx
import styled from "styled-components";

const PosterContainer = styled.div`
    flex: 1;
    max-width: 100%;
    margin-bottom: 20px;

    @media (min-width: 768px) {
        max-width: 40%;
        margin-bottom: 0;
    }
`;

const Poster = styled.img`
    width: 100%;
    height: auto;
    border-radius: 4px;

    @media (max-width: 767px) {
        max-height: 200px;
        object-fit: cover;
    }
`;

export { PosterContainer, Poster };