import React, { useState } from 'react'

function Navbar() {
    const [isActive, setIsActive] = useState(false);



    return (
        <nav className='navbar is-link' role='navigation' aria-label='main navigation'>
            <div className='navbar-brand'>

                {/* Logtip aplikacije*/}
                <a className='navbar-item' href="/">
                    <strong className='is-size-4'>🩺 Health Companion</strong>
                </a>

                {/* Hamburger gumb za mobitele*/}
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

            {/* Stavke izbornika - klasični Bulma navbar*/}
            <div className={`navbar-menu ${isActive ? 'is-active' : ''}`}>
                <div className='navbar-start'>
                    <a className='navbar-item' href="#kalkulatori">Kalkulatori</a>
                    <a className='navbar-item' href="#priroda">Prirodni uvijeti</a>
                    <a className='navbar-item' href="#kretanje">Kretanje</a>
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




    )
}

export default Navbar;