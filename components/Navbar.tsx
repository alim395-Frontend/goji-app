"use client";

import React, { useState } from "react";
import styled from "styled-components";
import Filters from "@/components/Filters";

const Nav = styled.nav`
    width: 100%;
    background-color: #333;
    color: white;
    padding: 10px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;

    @media (max-width: 640px) {
        padding: 5px;
        flex-direction: column;
    }
`;

const Logo = styled.div`
    font-size: 24px;
    font-weight: bold;

    @media (max-width: 640px) {
        font-size: 18px;
        margin-bottom: 10px;
    }
`;

const NavToggle = styled.button`
    background: none;
    border: none;
    color: white;
    font-size: 18px;
    cursor: pointer;

    @media (min-width: 641px) {
        display: none;
    }
`;

const NavContent = styled.div<{ isVisible: boolean }>`
    display: flex;
    flex-direction: column;

    @media (max-width: 640px) {
        ${({ isVisible }) => !isVisible && "display: none;"}
    }
`;

const Navbar: React.FC<{
    onFilterChange: (value: string) => void;
    onSortChange: (value: string) => void;
    onEraChange: (value: string) => void;
}> = ({ onFilterChange, onSortChange, onEraChange }) => {
    const [isNavContentVisible, setIsNavContentVisible] = useState(false);

    const toggleNavContent = () => {
        setIsNavContentVisible(!isNavContentVisible);
    };

    return (
        <Nav>
            {/*<Logo>Movie Catalogue</Logo>*/}
            <NavToggle onClick={toggleNavContent}>
                {isNavContentVisible ? "Close" : "Menu"}
            </NavToggle>
            <NavContent isVisible={isNavContentVisible}>
                <Filters
                    onFilterChange={onFilterChange}
                    onSortChange={onSortChange}
                    onEraChange={onEraChange}
                />
            </NavContent>
        </Nav>
    );
};

export default Navbar;