// components/ContentContainer.tsx
import styled from "styled-components";

const ContentContainer = styled.div`
    flex: 2;
    margin-left: 0;
    max-height: 80vh;
    overflow-y: auto;

    @media (min-width: 768px) {
        margin-left: 20px;
    }
`;

export default ContentContainer;