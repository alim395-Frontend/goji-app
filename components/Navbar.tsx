// components/Navbar.tsx
"use client";

import React from "react";
import styled from "styled-components";
import Filters from "./Filters";
import Music from "./Music";

const Nav = styled.nav`
  width: 100%;
  background-color: #333;
  color: white;
  padding: 10px;
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const Logo = styled.div`
  font-size: 24px;
  font-weight: bold;
`;

const Navbar: React.FC<{
  onFilterChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onEraChange: (value: string) => void;
}> = ({ onFilterChange, onSortChange, onEraChange }) => {
  return (
    <Nav>
      <Logo>Godzilla Movie Timeline</Logo>
      <Filters
        onFilterChange={onFilterChange}
        onSortChange={onSortChange}
        onEraChange={onEraChange}
      />
      <Music />
    </Nav>
  );
};

export default Navbar;
