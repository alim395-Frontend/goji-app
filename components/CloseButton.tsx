// components/CloseButton.tsx
import styled from "styled-components";

const CloseButton = styled.button`
    position: absolute;
    top: 10px;
    right: 10px;
    border: none;
    font-size: 24px;
    cursor: pointer;
    color: #333;
    background: rgba(0, 0, 0, 0.1);
    border-radius: 50%;
    padding: 0.5rem;
    display: flex;
    align-items: center;
    justify-content: center;
    width: 30px;
    height: 30px;

    &:hover {
        background-color: rgba(0, 0, 0, 0.2);
        color: #000;
    }
`;

export default CloseButton;