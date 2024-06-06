"use client";

import React from "react";
import "./Filters.css";

const Filters: React.FC<{
    onFilterChange: (value: string) => void;
    onSortChange: (value: string) => void;
    onEraChange: (value: string) => void;
}> = ({ onFilterChange, onSortChange, onEraChange }) => {
    return (
        <div className="filters-container">
            <div className="filter-item">
                <input
                    type="text"
                    placeholder="Search by Name"
                    onChange={(e) => onFilterChange(e.target.value)}
                    className="filter-input"
                />
            </div>
            <div className="filter-item">
                <select
                    onChange={(e) => onSortChange(e.target.value)}
                    className="filter-select"
                >
                    <option value="releaseDate">Sort by Release Date</option>
                    <option value="title">Sort by Title</option>
                    <option value="rating">Sort by Rating</option>
                    <option value="runtime">Sort by Runtime</option>
                </select>
            </div>
            <div className="filter-item">
                <select
                    onChange={(e) => onEraChange(e.target.value)}
                    className="filter-select"
                >
                    <option value="">All Eras</option>
                    <option value="Showa">Showa</option>
                    <option value="Heisei">Heisei</option>
                    <option value="Millennium">Millennium</option>
                    <option value="MonsterVerse">MonsterVerse</option>
                    <option value="Reiwa">Reiwa</option>
                </select>
            </div>
        </div>
    );
};

export default Filters;