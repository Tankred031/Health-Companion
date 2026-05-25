import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // 1. Uvozimo Link komponentu

function Navbar() {
    const [isActive, setIsActive] = useState(false);

    return (
        <nav className='navbar is-primary is-light' role='navigation' aria-label='main navigation'>
            <div className='navbar-brand'>
                {/* Logotip vodi na početnu stranicu (/) */}
                <Link className='navbar-item' to="/">
                    <strong className='is-size-4'>🩺 Health Companion</strong>
                </Link>

                {/* Hamburger gumb za mobitele */}
                <button
                    className={`navbar-burger burger ${isActive ? 'is-active' : ''}`}
                    aria-label='menu'
                    aria-expanded='false'
                    onClick={() => setIsActive(!isActive)}
                >
                    <span aria-hidden='true'></span>
                    <span aria-hidden='true'></span>
                    <span aria-hidden='true'></span>
                </button>
            </div>

            {/* Stavke izbornika - zamijenili smo 'href' s 'to' i 'a' s 'Link' */}
            <div className={`navbar-menu ${isActive ? 'is-active' : ''}`}>
                <div className='navbar-start'>
                    <Link className='navbar-item' to="/kalkulatori" onClick={() => setIsActive(false)}>Kalkulatori</Link>
                    <Link className='navbar-item' to="/priroda" onClick={() => setIsActive(false)}>Prirodni uvjeti</Link>
                    <Link className='navbar-item' to="/mjesec" onClick={() => setIsActive(false)}>Mjesečeve mijene</Link>
                    <Link className='navbar-item' to="/kretanje" onClick={() => setIsActive(false)}>Kretanje</Link>
                </div>

                <div className='navbar-end'>
                    <div className='navbar-item'>
                        <div className='buttons'>
                            <span className='tag is-light is-medium'>Verzija 1.0</span>
                        </div>
                    </div>
                </div>
            </div>
        </nav>
    );
}

export default Navbar;
