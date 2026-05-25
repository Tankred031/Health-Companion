import React, { useState, useEffect, useRef } from 'react';

function MovementTracker() {
  const [isTracking, setIsTracking] = useState(false);
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0.0);
  const [calories, setCalories] = useState(0);
  const [userWeight, setUserWeight] = useState(75); // Zadana težina ako kalkulator nije korišten
  const [routeNote, setRouteNote] = useState('Spremno za polazak s mobitelom u džepu! 📱');

  const lastPositionRef = useRef(null);
  const watchIdRef = useRef(null);

  // Pri pokretanju komponente provjeravamo ima li zapamćene težine iz BMI kalkulatora
  useEffect(() => {
    const savedWeight = localStorage.getItem('userWeight');
    if (savedWeight && parseFloat(savedWeight) > 0) {
      setUserWeight(parseFloat(savedWeight));
    }
  }, []);

  // Haversine formula za izračun udaljenosti između GPS točaka
  const calculateDistanceInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371; 
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; 
  };

  useEffect(() => {
    if (isTracking) {
      if ('geolocation' in navigator) {
        watchIdRef.current = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude, accuracy } = position.coords;

            if (accuracy > 20) {
              setRouteNote('GPS signal je slab. Izađite na otvoreno... 🛰️');
              return;
            }

            if (lastPositionRef.current) {
              const kmMoved = calculateDistanceInKm(
                lastPositionRef.current.latitude,
                lastPositionRef.current.longitude,
                latitude,
                longitude
              );

              if (kmMoved > 0.002) {
                setDistance((prevDistance) => {
                  const newDistance = parseFloat((prevDistance + kmMoved).toFixed(2));
                  
                  // 1. Računamo korake (korak ~ 0.75m)
                  const newSteps = Math.floor((newDistance * 1000) / 0.75);
                  setSteps(newSteps);
                  
                  // 2. NOVI DIO: Izračun kalorija na temelju STVARNE težine i udaljenosti
                  // Formula: 0.75 * težina * km
                  const computedCalories = Math.floor(0.75 * userWeight * newDistance);
                  setCalories(computedCalories);

                  if (newDistance <= 0.5) setRouteNote('Krenuli ste! Prolazite pokraj osječke konkatedrale... ⛪');
                  else if (newDistance > 0.5 && newDistance <= 1.5) setRouteNote('Uživate u šetnji osječkom Promenadom uz Dravu... 🌊');
                  else if (newDistance > 1.5 && newDistance <= 2.5) setRouteNote('Prelazite preko pješačkog mosta prema Tvrđi... 🌉');
                  else setRouteNote('Ulazite u povijesnu osječku Tvrđu! Odličan posao! 🏰');

                  return newDistance;
                });
              }
            } else {
              setRouteNote('GPS zaključan! Možete krenuti hodati... 🏃‍♂️');
            }

            lastPositionRef.current = { latitude, longitude };
          },
          (error) => {
            console.error(error);
            setRouteNote('Molimo uključi lokaciju (GPS) na svom mobitelu! 🛑');
            setIsTracking(false);
          },
          {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 5000,
          }
        );
      } else {
        alert('Tvoj preglednik na mobitelu ne podržava GPS lokaciju.');
        setIsTracking(false);
      }
    } else {
      if (watchIdRef.current) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        lastPositionRef.current = null;
      }
    }

    return () => {
      if (watchIdRef.current) navigator.geolocation.clearWatch(watchIdRef.current);
    };
  }, [isTracking, userWeight]); // Dodan userWeight u ovisnosti kako bi reaktivno pratio promjene

  const resetTracker = () => {
    setIsTracking(false);
    setSteps(0);
    setDistance(0.0);
    setCalories(0);
    lastPositionRef.current = null;
    setRouteNote('Spremno za polazak s mobitelom u džepu!');
  };

  return (
    <div className="card">
      <div className="card-content">
        <h3 className="title is-4 has-text-success">🏃‍♂️ Real-Time Mobilni GPS Tracker</h3>
        
        <div className="notification is-light is-success mb-4">
          <p className="is-size-6">
            Povezana težina: <strong>{userWeight} kg</strong> 
            {localStorage.getItem('userWeight') ? ' (Učitano iz kalkulatora)' : ' (Zadano - izračunaj BMI za personalizaciju)'}
          </p>
          <p className="is-size-6 mt-1">
            Status rute: <span className="has-text-weight-bold has-text-success-dark">{routeNote}</span>
          </p>
        </div>

        {/* Mjerne stanice (Statistika) */}
        <div className="columns is-mobile has-text-centered mt-2">
          <div className="column">
            <div className="box">
              <p className="heading">Udaljenost</p>
              <p className="title is-4">{distance} km</p>
            </div>
          </div>
          <div className="column">
            <div className="box">
              <p className="heading">Izračunato koraka</p>
              <p className="title is-4">{steps}</p>
            </div>
          </div>
          <div className="column">
            <div className="box">
              <p className="heading">Potrošeno</p>
              <p className="title is-4 has-text-danger">{calories} kcal</p>
            </div>
          </div>
        </div>

        <div className="buttons mt-4">
          <button 
            className={`button is-fullwidth ${isTracking ? 'is-danger' : 'is-success'}`}
            onClick={() => setIsTracking(!isTracking)}
          >
            {isTracking ? 'Zaustavi GPS praćenje ⏸️' : 'Pokreni GPS praćenje na mobitelu 📡'}
          </button>
          
          <button 
            className="button is-light is-fullwidth"
            onClick={resetTracker}
            disabled={steps === 0 && distance === 0}
          >
            Resetiraj podatke 🔄
          </button>
        </div>
      </div>
    </div>
  );
}

export default MovementTracker;
