import React, { useState } from 'react';
import Link from 'next/link';
import './NewNavbar.css';

const NewNavbar: React.FC = () => {
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);

    const toggleDropdown = () => {
        setIsDropdownOpen(!isDropdownOpen);
    };

    return (
        <nav className="navbar">
            <ul className="navbar-list">
                <li className="navbar-item">
                    <div className="dropdown-toggle navbar-link" onClick={toggleDropdown}>
                        Series
                    </div>
                    {isDropdownOpen && (
                        <ul className="dropdown-menu">
                            <li className="dropdown-item">
                                <Link href="/" className="navbar-link">
                                    Godzilla
                                </Link>
                            </li>
                            <li className="dropdown-item">
                                <Link href="/mothra" className="navbar-link">
                                    Mothra
                                </Link>
                            </li>
                            <li className="dropdown-item">
                                <Link href="/gamera" className="navbar-link">
                                    Gamera
                                </Link>
                            </li>
                        </ul>
                    )}
                </li>
                <li className="navbar-item">
                    <Link href="/monsterpedia" className="navbar-link">
                        Monsterpedia
                    </Link>
                </li>
                <li className="navbar-item">
                    <Link href="/challenge" className="navbar-link">
                        Challenge
                    </Link>
                </li>
            </ul>
        </nav>
    );
};

export default NewNavbar;