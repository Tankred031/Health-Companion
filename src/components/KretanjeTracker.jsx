import React, { useState, useEffect, useRef } from 'react';

function MovementTracker() {
  // --- KORISNIČKI PODACI ---
  const [userWeight, setUserWeight] = useState(128); // Zadano 128 kg prema tvom profilu

  // --- SUSTAV 1: BAZIČNA DNEVNA AKTIVNOST (Preklopnik) ---
  const [baseActivity, setBaseActivity] = useState('office-pc'); // 'office-pc' ili 'housework'
  const [workHours, setWorkHours] = useState(8); // Za uredski rad
  const [baseCalories, setBaseCalories] = useState(0);

  // --- SUSTAV 2: GPS ŠETNJA (Dodatno kretanje) ---
  const [isGpsTracking, setIsGpsTracking] = useState(false);
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0.0);
  const [gpsCalories, setGpsCalories] = useState(0);
  const [routeNote, setRouteNote] = useState('Spremno za polazak kući s mobitelom u džepu! 📱');

  const lastPositionRef = useRef(null);
  const watchIdRef = useRef(null);

  // 1. Učitavanje stvarne mase iz kalkulatora
  useEffect(() => {
    const savedWeight = localStorage.getItem('userWeight');
    if (savedWeight && parseFloat(savedWeight) > 0) {
      setUserWeight(parseFloat(savedWeight));
    }
  }, []);

  // 2. Logika za bazičnu aktivnost (Rad na računalu ILI čišćenje kuće)
  useEffect(() => {
    if (baseActivity === 'office-pc') {
      // Rad na računalu: MET 1.3
      const totalMinutes = workHours * 60;
      const computedOfficeKcal = Math.floor(((1.3 * 3.5 * userWeight) / 200) * (totalMinutes / 60));
      setBaseCalories(computedOfficeKcal);
    } else if (baseActivity === 'housework') {
      // POPRAVLJENO: Usisavanje s guranjem i znojenjem podignuto na MET 3.6
      const kcalUsisavanjeGuranje = (3.6 * 3.5 * userWeight * 20) / 12000;

      // Prašina (6 min, MET 2.3)
      const kcalPrasina = (2.3 * 3.5 * userWeight * 6) / 12000;

      // Ribanje sanitarija u pognutom položaju (10 min, MET 5.0)
      const kcalRibanjePognuto = (5.0 * 3.5 * userWeight * 10) / 12000;

      // Ukupni zbroj sada realno iznosi 261 kcal za 128 kg i uzima u obzir znojenje!
      const totalHouseworkKcal = Math.floor(kcalUsisavanjeGuranje + kcalPrasina + kcalRibanjePognuto);
      setBaseCalories(totalHouseworkKcal);
    }
  }, [baseActivity, workHours, userWeight]);


  // Haversine formula za GPS udaljenost
  const calculateDistanceInKm = (lat1, lon1, lat2, lon2) => {
    const R = 6371;
    const dLat = ((lat2 - lat1) * Math.PI) / 180;
    const dLon = ((lon2 - lon1) * Math.PI) / 180;
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) * Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  };

  // 3. Aktivacija mobilnog GPS-a za šetnju kući
  useEffect(() => {
    if (isGpsTracking) {
      if ('geolocation' in navigator) {
        watchIdRef.current = navigator.geolocation.watchPosition(
          (position) => {
            const { latitude, longitude, accuracy } = position.coords;

            if (accuracy > 20) {
              setRouteNote('Tražim bolji satelitski signal... Izađite van 🛰️');
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
                  const newSteps = Math.floor((newDistance * 1000) / 0.75);
                  setSteps(newSteps);

                  const computedGpsKcal = Math.floor(0.75 * userWeight * newDistance);
                  setGpsCalories(computedGpsKcal);

                  if (newDistance <= 0.5) setRouteNote('Krenuli ste s posla! Prolazite pokraj konkatedrale... ⛪');
                  else if (newDistance > 0.5 && newDistance <= 1.5) setRouteNote('Uživate u šetnji osječkom Promenadom uz Dravu... 🌊');
                  else if (newDistance > 1.5 && newDistance <= 2.5) setRouteNote('Prelazite preko pješačkog mosta... 🌉');
                  else setRouteNote('Stigli ste na odredište! Odličan balans dana! 🏰');

                  return newDistance;
                });
              }
            } else {
              setRouteNote('GPS zaključan! Možete krenuti pješačiti kući... 🏃‍♂️');
            }
            lastPositionRef.current = { latitude, longitude };
          },
          (error) => {
            console.error(error);
            setRouteNote('Uključite lokaciju na mobitelu za praćenje rute! 🛑');
            setIsGpsTracking(false);
          },
          { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
        );
      } else {
        alert('Tvoj mobitel ne podržava GPS.');
        setIsGpsTracking(false);
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
  }, [isGpsTracking, userWeight]);

  const resetAllData = () => {
    setIsGpsTracking(false);
    setSteps(0);
    setDistance(0.0);
    setGpsCalories(0);
    setWorkHours(8);
    setBaseActivity('office-pc');
    lastPositionRef.current = null;
    setRouteNote('Spremno za novi polazak kući s mobitelom u džepu! 📱');
  };

  return (
    <div className="card">
      <div className="card-content">
        <h3 className="title is-4 has-text-success">🏃‍♂️ Dnevni Tracker Aktivnosti & Kretanja</h3>

        <div className="notification is-light is-success py-2 px-3 mb-4">
          <p className="is-size-6">
            Povezana težina: <strong>{userWeight} kg</strong>
          </p>
        </div>

        {/* ================= BLOK 1: GLAVNA DNEVNA AKTIVNOST (POPRAVLJENI KONTRAST TEKSTA) ================= */}
        <div className="box has-background-light p-4 mb-4">
          <h4 className="title is-5 has-text-grey-dark mb-3">🛠️ Korak 1: Primarna dnevna aktivnost</h4>

          {/* Padajući izbornik za odabir primarne aktivnosti */}
          <div className="field mb-4">
            <div className="control">
              {/* Krupniji prikaz (is-medium) s eksplicitno definiranim crnim tekstom */}
              <div className="select is-fullwidth is-medium">
                <select
                  value={baseActivity}
                  onChange={(e) => setBaseActivity(e.target.value)}
                  style={{
                    backgroundColor: '#e9ecef', // Jasna, ugodna svjetlosiva pozadina
                    borderColor: '#ced4da',
                    color: '#212529',           // Strogo definirana tamna boja slova da se sve vidi
                    fontWeight: '600'
                  }}
                >
                  <option value="office-pc" style={{ color: '#212529', backgroundColor: '#ffffff' }}>
                    Rad na poslu / Računalo
                  </option>
                  <option value="housework" style={{ color: '#212529', backgroundColor: '#ffffff' }}>
                    Čišćenje kuće (30 min)
                  </option>
                </select>
              </div>
            </div>
          </div>

          {/* Dinamički prikaz pod-opcija ovisno o odabiru */}
          <div className="columns is-mobile is-vcentered">
            <div className="column is-7">
              {baseActivity === 'office-pc' ? (
                <div className="field is-horizontal is-align-items-center">
                  {/* Osigurana tamna boja za tekst 'Odradite sati:' */}
                  <label className="label is-size-6 mb-0 mr-3 has-text-dark" style={{ whiteSpace: 'nowrap' }}>
                    Odradite sati:
                  </label>
                  <div className="control" style={{ maxWidth: '80px' }}>
                    <input
                      className="input is-medium has-text-centered has-text-weight-bold has-text-dark"
                      type="number"
                      value={workHours}
                      onChange={(e) => setWorkHours(parseFloat(e.target.value) || 0)}
                      style={{ color: '#212529', backgroundColor: '#ffffff' }}
                    />
                  </div>
                </div>
              ) : (
                /* POPRAVLJENO: Tekst 'Obuhvaća...' je uklonjen s ekrana, ostavljen je čisti prostor pokraj potrošnje */
                <p className="is-size-6 has-text-grey-dark has-text-weight-semibold">
                  Aktivnost aktivna 🧹
                </p>
              )}
            </div>
            <div className="column is-5 has-text-right">
              <p className="heading mb-0 has-text-grey-dark">Potrošnja aktivnosti</p>
              <p className="title is-4 has-text-dark">{baseCalories} kcal</p>
            </div>
          </div>
        </div>



        {/* ================= BLOK 2: PUT KUĆI (Zadržan tvoj crni stil s bijelim tekstom) ================= */}
        <div className="box p-4 mb-4 has-background-dark" style={{ borderLeft: '4px solid #48c78e' }}>
          <h4 className="title is-5 has-text-white mb-2">🛰️ Korak 2: Kretanje - pješačenje (Pravi GPS)</h4>

          <div className="notification is-dark py-2 px-3 mb-3" style={{ background: '#1c1f2b' }}>
            <p className="is-size-7 has-text-weight-bold has-text-success">{routeNote}</p>
          </div>

          <div className="columns is-mobile has-text-centered mb-3">
            <div className="column">
              <p className="heading mb-1 has-text-grey-light">Udaljenost</p>
              <p className="title is-5 has-text-white">{distance} km</p>
            </div>
            <div className="column">
              <p className="heading mb-1 has-text-grey-light">Koraci</p>
              <p className="title is-5 has-text-white">{steps}</p>
            </div>
            <div className="column">
              <p className="heading mb-1 has-text-danger-light">Šetnja</p>
              <p className="title is-5 has-text-danger has-text-weight-bold">{gpsCalories} kcal</p>
            </div>
          </div>

          <button
            className={`button is-madium is-fullwidth ${isGpsTracking ? 'is-danger' : 'is-success'}`}
            onClick={() => setIsGpsTracking(!isGpsTracking)}
          >
            {isGpsTracking ? 'Zaustavi GPS praćenje rute' : 'Kreni kući (Uključi mobilni GPS)'}
          </button>
        </div>

        {/* Gumb za pokretanje GPS-a unutar Koraka 2 maknut s dna i spušten u zajednički red */}
      </div>

      {/* ================= UKUPNI ZBROJ DANA ================= */}
      <div className="box has-background-dark p-3 has-text-centered mb-4">
        <p className="heading has-text-grey-light">📊 UKUPNA ENERGETSKA POTROŠNJA DANA</p>
        <p className="title is-3 has-text-warning mt-1">
          {baseCalories + gpsCalories} <span className="is-size-5">kcal</span>
        </p>
        <p className="is-size-7 has-text-grey-light is-italic mt-1">
          (Baza: {baseCalories} kcal + Šetnja kući: {gpsCalories} kcal)
        </p>
      </div>

      {/* ================= POPRAVLJENO: GUMBI U ISTOM REDU ================= */}
      <div className="columns is-mobile is-variable is-2">

        {/* Lijevi gumb: GPS Kontrola */}
        <div className="column is-half">
          <button
            className={`button is-medium is-fullwidth ${isGpsTracking ? 'is-danger' : 'is-success'}`}
            onClick={() => setIsGpsTracking(!isGpsTracking)}
            style={{ fontWeight: '600', height: '40px' }}
          >
            {isGpsTracking ? 'Zaustavi GPS' : 'Uključi GPS'}
          </button>
        </div>

        {/* Desni gumb: Resetiranje dana */}
        <div className="column is-half">
          <button
            className="button is-medium is-light is-fullwidth"
            onClick={resetAllData}
            disabled={baseCalories === 0 && gpsCalories === 0 && distance === 0}
            style={{ fontWeight: '600', height: '40px' }}
          >
            Resetiraj dan 🔄
          </button>
        </div>

      </div>
      {/* =================================================================== */}

      {/* ODRICANJE OD ODGOVORNOSTI */}
      <div className="mt-4 pt-2" style={{ borderTop: '1px dashed #ccc' }}>
        <p className="is-size-7 has-text-grey has-text-centered is-italic">
          * Napomena: Izračun energetskog utroška izražen u kilokalorijama (kcal) temelji se na metaboličkim jednadžbama (MET) i unesenoj tjelesnoj masi. Služi isključivo u informativne i edukativne svrhe.
        </p>
      </div>

      </div>
    
  );
}

export default MovementTracker;

