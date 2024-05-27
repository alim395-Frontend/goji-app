// components/Filters.tsx
"use client";

import React from "react";

const Filters: React.FC<{
    onFilterChange: (value: string) => void;
    onSortChange: (value: string) => void;
    onEraChange: (value: string) => void;
}> = ({ onFilterChange, onSortChange, onEraChange }) => {
    return (
        <div className="flex flex-wrap justify-between gap-2 p-2">
            <input
                type="text"
                placeholder="Search by Name"
                onChange={(e) => onFilterChange(e.target.value)}
                className="p-1 border border-gray-300 rounded bg-white text-black w-full sm:w-auto"
            />
            <select
                onChange={(e) => onSortChange(e.target.value)}
                className="p-1 border border-gray-300 rounded bg-white text-black w-full sm:w-auto mb-2 sm:mb-0"
            >
                <option value="releaseDate">Sort by Release Date</option>
                <option value="title">Sort by Title</option>
                <option value="rating">Sort by Rating</option>
            </select>
            <select
                onChange={(e) => onEraChange(e.target.value)}
                className="p-1 border border-gray-300 rounded bg-white text-black w-full sm:w-auto"
            >
                <option value="">All Eras</option>
                <option value="Showa">Showa</option>
                <option value="Heisei">Heist</option>
                <option value="Millennium">Millennium</option>
                <option value="MonsterVerse">MonsterVerse</option>
                <option value="Reiwa">Reiwa</option>
            </select>
        </div>
    );
};

export default Filters;
