import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { RouteNames } from '../../constants';
import healthCompanionServiceLocalStorage from '../services/healthCompanionServiceLocalStorage';

function Navbar() {
    const [isActive, setIsActive] = useState(false);
    const [source, setSource] = useState('memorija');

    // Pri učitavanju provjeravamo koji je trenutni način rada u servisu
    useEffect(() => {
        const trenutniIzbor = localStorage.getItem('dataSource') || 'memorija';
        setSource(trenutniIzbor);
    }, []);

    // Funkcija koja reagira na promjenu preklopnika
    const handleSourceChange = (e) => {
        const noviIzvor = e.target.value;
        setSource(noviIzvor);
        
        // Zapisujemo u localStorage i ponovno učitavamo stranicu da se servisi prebace
        localStorage.setItem('dataSource', noviIzvor);
        window.location.reload();
    };

    return (
        <nav className='navbar is-primary is-light' role='navigation' aria-label='main navigation'>
            <div className='navbar-brand'>
                <Link className='navbar-item' to={RouteNames.HOME}>
                    <strong className='is-size-4'>🩺 Health Companion</strong>
                </Link>

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

            <div className={`navbar-menu ${isActive ? 'is-active' : ''}`}>
                <div className='navbar-start'>
                    <Link className='navbar-item' to={RouteNames.KALKULATORI} onClick={() => setIsActive(false)}>Kalkulatori</Link>
                    <Link className='navbar-item' to={RouteNames.PRIRODA} onClick={() => setIsActive(false)}>Prirodni uvjeti</Link>
                    <Link className='navbar-item' to={RouteNames.MJESEC} onClick={() => setIsActive(false)}>Mjesečeve mijene</Link>
                    <Link className='navbar-item' to={RouteNames.KRETANJE} onClick={() => setIsActive(false)}>Kretanje</Link>
                    <Link className='navbar-item' to={RouteNames.PRACENJE} onClick={() => setIsActive(false)}>Praćenje rezultata</Link>
                </div>

                {/* --- DESNA STRANA: SWITCHER ZA IZVOR PODATAKA --- */}
                <div className='navbar-end'>
                    <div className='navbar-item'>
                        <div className="field is-horizontal is-align-items-center">
                            <div className="field-label is-small mr-2">
                                <label className="label has-text-grey is-size-7">Baza:</label>
                            </div>
                            <div className="field-body">
                                <div className="control">
                                    <div className="select is-small is-rounded">
                                        <select value={source} onChange={handleSourceChange}>
                                            <option value="memorija">Memorija</option>
                                            <option value="local">LocalStorage</option>
                                        </select>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='navbar-item'>
                        <span className='tag is-dark is-medium'>v1.0</span>
                    </div>
                </div>
                {/* ----------------------------------------------- */}
            </div>
        </nav>
    );
}

export default Navbar;
