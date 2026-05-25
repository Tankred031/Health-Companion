import React, { useState, useEffect } from 'react';

function MovementTracker() {
  const [isTracking, setIsTracking] = useState(false);
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0.0);
  const [calories, setCalories] = useState(0);
  const [routeNote, setRouteNote] = useState('Spremno za polazak s Trga Ante Starčevića.');

  useEffect(() => {
    let interval = null;
    if (isTracking) {
      interval = setInterval(() => {
        setSteps((prevSteps) => {
          const newSteps = prevSteps + Math.floor(Math.random() * 3) + 1;
          const newDistance = parseFloat(((newSteps * 0.75) / 1000).toFixed(2));
          setDistance(newDistance);
          setCalories(Math.floor(newSteps * 0.04));

          if (newDistance > 0 && newDistance <= 0.5) setRouteNote('Prolazite pokraj osječke konkatedrale... ⛪');
          else if (newDistance > 0.5 && newDistance <= 1.5) setRouteNote('Uživate u šetnji osječkom Promenadom uz Dravu... 🌊');
          else if (newDistance > 1.5 && newDistance <= 2.5) setRouteNote('Prelazite preko pješačkog mosta prema Tvrđi... 🌉');
          else if (newDistance > 2.5) setRouteNote('Ulazite u povijesnu osječku Tvrđu! Odličan posao! 🏰');

          return newSteps;
        });
      }, 1000);
    } else {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isTracking]);

  const resetTracker = () => {
    setIsTracking(false);
    setSteps(0);
    setDistance(0.0);
    setCalories(0);
    setRouteNote('Spremno za polazak s Trga Ante Starčevića.');
  };

  return (
    <div className="card">
      <div className="card-content">
        <h3 className="title is-4 has-text-success">🏃‍♂️ Tvoj Tracker Kretanja — Osijek</h3>
        
        <div className="notification is-light is-success mb-4">
          <p className="is-size-6">Trenutna lokacija: <strong>Osijek, Hrvatska</strong></p>
          <p className="is-size-6 mt-1">
            Status rute: <span className="has-text-weight-bold has-text-success-dark">{routeNote}</span>
          </p>
        </div>

        <div className="columns is-mobile has-text-centered mt-2">
          <div className="column">
            <div className="box">
              <p className="heading">Koraci</p>
              <p className="title is-4">{steps}</p>
            </div>
          </div>
          <div className="column">
            <div className="box">
              <p className="heading">Udaljenost</p>
              <p className="title is-4">{distance} km</p>
            </div>
          </div>
          <div className="column">
            <div className="box">
              <p className="heading">Kalorije</p>
              <p className="title is-4">{calories} kcal</p>
            </div>
          </div>
        </div>

        <div className="buttons mt-4">
          <button 
            className={`button is-fullwidth ${isTracking ? 'is-danger' : 'is-success'}`}
            onClick={() => setIsTracking(!isTracking)}
          >
            {isTracking ? 'Pauziraj šetnju ⏸️' : 'Pokreni šetnju Promenadom ▶️'}
          </button>
          
          <button 
            className="button is-light is-fullwidth"
            onClick={resetTracker}
            disabled={steps === 0}
          >
            Resetiraj podatke 🔄
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovementTracker;
