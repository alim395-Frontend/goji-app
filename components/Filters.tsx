// components/Filters.tsx
"use client";

import React from "react";
import styled from "styled-components";

const FiltersContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 10px;
`;

const Input = styled.input`
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white; // Ensure background color is white
  color: black; // Ensure text color is black
`;

const Select = styled.select`
  padding: 5px;
  border: 1px solid #ccc;
  border-radius: 4px;
  background-color: white; // Ensure background color is white
  color: black; // Ensure text color is black
`;

const Filters: React.FC<{
  onFilterChange: (value: string) => void;
  onSortChange: (value: string) => void;
  onEraChange: (value: string) => void;
}> = ({ onFilterChange, onSortChange, onEraChange }) => {
  return (
    <FiltersContainer>
      <Input
        type="text"
        placeholder="Search by Name"
        onChange={(e) => onFilterChange(e.target.value)}
      />
        <Select onChange={(e) => onSortChange(e.target.value)}>
            <option value="releaseDate">Sort by Release Date</option>
            <option value="title">Sort by Title</option>
            <option value="rating">Sort by Rating</option>
        </Select>
        <Select onChange={(e) => onEraChange(e.target.value)}>
        <option value="">All Eras</option>
        <option value="Showa">Showa</option>
        <option value="Heisei">Heisei</option>
        <option value="Millennium">Millennium</option>
        <option value="MonsterVerse">MonsterVerse</option>
        <option value="Reiwa">Reiwa</option>
      </Select>
    </FiltersContainer>
  );
};

export default Filters;
