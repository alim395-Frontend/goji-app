// components/Navbar.tsx
"use client";

import React from "react";
import styled from "styled-components";
import Filters from "@/components/Filters";

const Nav = styled.nav`
    width: 100%;
    background-color: #333;
    color: white;
    padding: 10px; // Adjust for mobile
    display: flex;
    justify-content: space-between;
    align-items: center;

    @media (max-width: 640px) { // Tailwind's 'sm' breakpoint
        padding: 5px;
        flex-direction: column; // Stack items vertically on mobile
    }
`;

const Logo = styled.div`
    font-size: 24px; // Adjust for mobile
    font-weight: bold;

    @media (max-width: 640px) { // Tailwind's 'sm' breakpoint
        font-size: 18px;
        margin-bottom: 10px; // Add space between logo and filters on mobile
    }
`;

const Navbar: React.FC<{
  onFilterChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onEraChange: (value: string) => void;
}> = ({ onFilterChange, onSortChange, onEraChange }) => {
  return (
    <Nav>
      <Logo>Movie Catalogue</Logo>
      <Filters
        onFilterChange={onFilterChange}
        onSortChange={onSortChange}
        onEraChange={onEraChange}
      />
    </Nav>
  );
};

export default Navbar;
