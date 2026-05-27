import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Izbornik';
import Home from './pages/Home';
import BmiKalkulator from './components/BmiKalkulator';
import MoonPhaseDiet from './components/MjesecFaze';
import MovementTracker from './components/KretanjeTracker';
import PrirodniUvjeti from './components/PrirodniUvjeti';
import { RouteNames } from '../constants';
import StatisticTracking from "./pages/StatistickoKretanje";

function App() {
  return (
    <Router>
      <div style={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>

        {/* Navbar je uvijek vidljiv na vrhu */}
        <Navbar />

        {/* Sadržaj stranice */}
        <section className='section' style={{ flex: '1' }}>
          <div className='container'>
            <Routes>
              {/* 3. POPRAVLJENO: Rute sada koriste objekte iz constants.js umjesto ručno upisanog teksta */}
              <Route path={RouteNames.HOME} element={<Home />} />
              <Route path={RouteNames.KALKULATORI} element={<BmiKalkulator />} />
              <Route path={RouteNames.PRIRODA} element={<PrirodniUvjeti />} />
              <Route path={RouteNames.MJESEC} element={<MoonPhaseDiet />} />
              <Route path={RouteNames.KRETANJE} element={<MovementTracker />} />
              <Route path={RouteNames.PRACENJE} element={<StatisticTracking />} />
            </Routes>
          </div>
        </section>

        {/* Crni Italic Footer */}
        <footer className="footer has-background-black py-5">
          <div className="content has-text-centered">
            <p className="is-size-7 has-text-white is-italic">
              <strong>Health Companion</strong> &copy; {new Date().getFullYear()} &middot; Sva prava pridržana.
              <br />
              Izradio: Tankred Kralj
            </p>
            <p className="is-size-7 has-text-white-ter is-italic">
              Izrađeno u Reactu uz Bulma CSS framework
            </p>
          </div>
        </footer>

      </div>
    </Router>
  );
}

export default App;
