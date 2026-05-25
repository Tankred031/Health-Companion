import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Izbornik';
import BmiKalkulator from './components/BmiKalkulator';
import MoonPhaseDiet from './components/MjesecFaze';
import MovementTracker from './components/KretanjeTracker';
import PrirodniUvjeti from './components/PrirodniUvjeti';

function App() {
  return (
    <Router>
      {/* Glavni omotač postavlja flexbox kako bi footer uvijek bio na dnu ekrana */}
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* Navbar je uvijek vidljiv na vrhu */}
        <Navbar />

        {/* Sadržaj stranice se širi i gura footer prema dolje */}
        <section className='section' style={{ flex: '1' }}>
          <div className='container'>
            <Routes>
              {/* Početna stranica */}
              <Route path="/" element={
                <div className='notification is-info is-light'>
                  <h2 className='title is-4'>Dobrodošli u svoj razvojni dnevnik 🩺</h2>
                  <p>Odaberite neku od opcija u navigaciji iznad kako biste otvorili zasebne alate.</p>
                </div>
              } />

              <Route path="/kalkulatori" element={<BmiKalkulator />} />
              <Route path="/priroda" element={<PrirodniUvjeti />} />
              <Route path="/mjesec" element={<MoonPhaseDiet />} />
              <Route path="/kretanje" element={<MovementTracker />} />
            </Routes>
          </div>
        </section>

        {/* --- POPRAVLJENI FOOTER SA ZELENOM POZADINOM, BIJELIM I COSKASTIM (ITALIC) SLOVIMA --- */}
        <footer className="footer has-background-black py-5">
          <div className="content has-text-centered">
            <p className="is-size-7 has-text-white is-italic">
              <strong>Health Companion</strong> &copy; {new Date().getFullYear()} &middot; Sva prava pridržana.
            </p>
            <p className="is-size-7 has-text-white-ter is-italic">
              Izrađeno s React-om i Bulma CSS-om u razvojnom dnevniku.
            </p>
          </div>
        </footer>
        {/* --------------------------------------------------------------------------------- */}

      </div>
    </Router>
  );
}

export default App;
