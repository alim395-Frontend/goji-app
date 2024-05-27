// components/ModalContent.tsx
import styled from "styled-components";

const ModalContent = styled.div`
    position: relative;
    background-color: #fff;
    padding: 20px;
    border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
    display: flex;
    flex-direction: column;
    max-width: 900px;
    width: 90%;
    max-height: 90vh;
    overflow-y: auto;

    @media (min-width: 768px) {
        flex-direction: row;
    }
`;

export default ModalContent;