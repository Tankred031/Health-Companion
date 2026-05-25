import React, { useState, useEffect } from 'react';

function MoonPhaseDiet() {
  // Stanja za stvarnu (trenutnu) fazu i zodijak
  const [livePhaseName, setLivePhaseName] = useState('');
  const [liveZodiac, setLiveZodiac] = useState('');
  const [phase, setPhase] = useState('new-moon');

  // --- STANJA ZA KRETANJE MJESECA PO NEBU ---
  const [moonAltitude, setMoonAltitude] = useState(15);
  const [moonAzimuth, setMoonAzimuth] = useState(90);
  const [moonDirectionText, setMoonDirectionText] = useState('Istočni horizont (Mjesec se penje) 📈');

  // Podaci o fazama za prehranu
  const phaseData = {
    'new-moon': {
      title: 'Mlađak (Novi Mjesec)',
      icon: '🌑',
      glowColor: 'rgba(255, 255, 255, 0.05)',
      appetite: 'Prirodno smanjen apetit (Vrijeme za čišćenje)',
      barValue: 15,
      barColor: 'is-success',
      statusClass: 'has-text-success',
      options: [
        'Jednodnevni post (24h): Pijte samo vodu, nezaslađene čajeve i bistre juhe.',
        'Lagani meni: Ako ne postite, jedite isključivo svježe salate i juhu od povrća.',
        'Detoksikacija: Idealno vrijeme za izbacivanje toksina, izbjegavajte kavu i alkohol.'
      ]
    },
    'waxing': {
      title: 'Mjesec u rastu',
      icon: '🌒',
      glowColor: 'rgba(255, 243, 176, 0.3)',
      appetite: 'Pojačana glad (Tijelo skladišti energiju)',
      barValue: 75,
      barColor: 'is-warning',
      statusClass: 'has-text-warning-dark',
      options: [
        'Kontrola porcija: Svjesno smanjite obroke jer se metabolizam blago usporava.',
        'Povećajte proteine: Meso, riba, jaja i mahunarke pružit će vam dulji osjećaj sitosti.',
        'Trik s vodom: Popijte veliku čašu vode 15 minuta prije obroka kako biste smanjili lažnu glad.'
      ]
    },
    'full-moon': {
      title: 'Uštap (Pun Mjesec)',
      icon: '🌕',
      glowColor: 'rgba(255, 243, 176, 0.7)',
      appetite: 'Jaka emocionalna glad i zadržavanje vode',
      barValue: 100,
      barColor: 'is-danger',
      statusClass: 'has-text-danger',
      options: [
        'Tekući post: Pokrenite post točno u satu punog Mjeseca u trajanju od 24 sata.',
        'Potpuno izbacite sol: Sol u ove dane dodatno zaključava vodu u vašim tkivima.',
        'Čajevi za drenažu: Pijte čaj od koprive ili maslačka koji potiču izbacivanje viška tekućine.'
      ]
    },
    'waning': {
      title: 'Mjesec u padu',
      icon: '🌘',
      glowColor: 'rgba(156, 194, 255, 0.4)',
      appetite: 'Stabilan apetit (Ubrzano sagorijevanje)',
      barValue: 40,
      barColor: 'is-info',
      statusClass: 'has-text-info-dark',
      options: [
        'Vrijeme za umjereno uživanje: Ako planirate "grešni obrok", ovo je najsigurnija faza.',
        'Pojačajte kretanje: Iskoristite val prirodne energije za intenzivniji trening ili brzu šetnju.',
        'Smanjite ugljikohidrate: Tijelo sada lakše troši masne zalihe ako mu ne dajete višak šećera.'
      ]
    }
  };

  const currentData = phaseData[phase];

  // --- NOVI EFEKT: RAČUNANJE STVARNE FAZE I ZODIJAKA NA TEMELJU DATUMA ---
  useEffect(() => {
    const calculateMoonSpecs = () => {
      const date = new Date();
      const year = date.getFullYear();
      const month = date.getMonth() + 1;
      const day = date.getDate();

      // 1. Izračun približne starosti Mjeseca (Epakta metoda)
      const c = 365.25 * year;
      const e = 30.6 * month;
      const jd = c + e + day - 694039.09; // Julijanski dani od referentne točke
      const cycles = jd / 29.530588853;  // Duljina sinodičkog mjeseca
      const age = (cycles - Math.floor(cycles)) * 29.530588853;

      // Određivanje trenutne faze i sinkronizacija s kalkulatorom
      let determinedPhaseKey = 'new-moon';
      let phaseText = 'Mlađak (Novi Mjesec) 🌑';

      if (age >= 1.5 && age < 13.5) {
        determinedPhaseKey = 'waxing';
        phaseText = 'Mjesec u rastu 🌒';
      } else if (age >= 13.5 && age < 16.5) {
        determinedPhaseKey = 'full-moon';
        phaseText = 'Uštap (Pun Mjesec) 🌕';
      } else if (age >= 16.5 && age < 28.0) {
        determinedPhaseKey = 'waning';
        phaseText = 'Mjesec u padu 🌘';
      }

      setLivePhaseName(phaseText);
      setPhase(determinedPhaseKey); // Automatski postavlja formu na stvarno stanje

      // 2. Izračun tropskog zodijaka Mjeseca
      // Mjesec obiđe zodijak za ~27.32 dana (Siderički mjesec)
      const sidericCycles = jd / 27.321661;
      const zodiacProgress = (sidericCycles - Math.floor(sidericCycles)) * 360;

      const zodiacSigns = [
        { name: 'Ovan ♈', min: 0, max: 30 },
        { name: 'Bik ♉', min: 30, max: 60 },
        { name: 'Blizanci ♊', min: 60, max: 90 },
        { name: 'Rak ♋', min: 90, max: 120 },
        { name: 'Lav ♌', min: 120, max: 150 },
        { name: 'Djevica ♍', min: 150, max: 180 },
        { name: 'Vaga ♎', min: 180, max: 210 },
        { name: 'Škorpion ♏', min: 210, max: 240 },
        { name: 'Strijelac ♐', min: 240, max: 270 },
        { name: 'Jarac ♑', min: 270, max: 300 },
        { name: 'Vodenjak ♒', min: 300, max: 330 },
        { name: 'Ribe ♓', min: 330, max: 360 }
      ];

      const currentSign = zodiacSigns.find(sign => zodiacProgress >= sign.min && zodiacProgress < sign.max);
      setLiveZodiac(currentSign ? currentSign.name : 'Ovan ♈');
    };

    calculateMoonSpecs();
  }, []);

  // Simulator nebeskog kretanja Mjeseca (Azimut/Visina)
  useEffect(() => {
    const moonInterval = setInterval(() => {
      setMoonAzimuth((prevAz) => {
        let nextAz = prevAz + 0.5;
        if (nextAz > 270) nextAz = 90;

        const angleFromSouth = Math.abs(nextAz - 180);
        const currentAlt = Math.max(0, Math.floor(50 - (angleFromSouth * 0.5)));
        setMoonAltitude(currentAlt);

        if (nextAz >= 90 && nextAz < 135) setMoonDirectionText('Istočni horizont (Mjesec se penje) 📈');
        else if (nextAz >= 135 && nextAz < 225) setMoonDirectionText('Južno nebo (Mjesec je u najvišoj točki) 🌌');
        else if (nextAz >= 225 && nextAz <= 270) setMoonDirectionText('Zapadni horizont (Mjesec zalazi) 📉');

        return nextAz;
      });
    }, 400);

    return () => clearInterval(moonInterval);
  }, []);

  return (
    <div className="card">
      <div className="card-content">

        {/* ================= NOVI BLOK: STVARNO STANJE NA DANAŠNJI DAN ================= */}
        <h3 className="title is-4 has-text-info mb-3">📅 Stvarno stanje na današnji dan</h3>
        <div className="columns is-mobile">
          <div className="column is-half">
            <div className="box has-background-dark has-text-centered p-3" style={{ border: '1px solid #209cee' }}>
              <p className="heading has-text-grey-light">Trenutna faza mjeseca</p>
              <p className="subtitle is-6 has-text-white has-text-weight-bold mt-1">{livePhaseName}</p>
            </div>
          </div>
          <div className="column is-half">
            <div className="box has-background-dark has-text-centered p-3" style={{ border: '1px solid #ffdd57' }}>
              <p className="heading has-text-grey-light">Tranzitira kroz</p>
              <p className="subtitle is-6 has-text-warning has-text-weight-bold mt-1">{liveZodiac}</p>
            </div>
          </div>
        </div>

        <hr className="my-4" />

        {/* ================= DIO 1: KRETANJE PO NEBU ================= */}
        <h3 className="title is-4 has-text-primary mb-3">🌌 Kretanje Mjeseca iznad Osijeka</h3>
        <div className="notification is-dark mb-5" style={{ background: '#0e1118', borderRadius: '8px' }}>
          <p className="is-size-6">
            Trenutna pozicija na nebu: <strong className="has-text-info">{moonDirectionText}</strong>
          </p>

          <div className="columns is-mobile mt-3 has-text-centered">
            <div className="column">
              <p className="heading has-text-grey-light">Visina nad horizontom</p>
              <p className="title is-4 has-text-white">{moonAltitude}°</p>
            </div>
            <div className="column">
              <p className="heading has-text-grey-light">Azimut (Kut smjera)</p>
              <p className="title is-4 has-text-white">{moonAzimuth.toFixed(0)}°</p>
            </div>
          </div>

          <progress className="progress is-info" value={moonAzimuth - 90} max="180">{moonAzimuth}%</progress>
          <div className="is-flex is-justify-content-space-between is-size-7 has-text-grey-light">
            <span>Istok (90°)</span>
            <span className="has-text-info-light">Jug (180° - Vrh)</span>
            <span>Zapad (270°)</span>
          </div>
        </div>

        <hr />

        {/* ================= DIO 2: UTJECAJ NA PREHRANU & ANIMACIJA ================= */}
        <h3 className="title is-4 has-text-success">🌙 Utjecaj Mjesečevih Mijena na Prehranu</h3>

        <div className="field">
          <label className="label">Istražite utjecaj i ostalih faza:</label>
          <div className="control">
            <div className="select is-fullwidth is-success">
              <select value={phase} onChange={(e) => setPhase(e.target.value)}>
                <option value="new-moon">Mlađak (Novi Mjesec) 🌑</option>
                <option value="waxing">Mjesec u rastu (Do punog) 🌒</option>
                <option value="full-moon">Uštap (Pun Mjesec) 🌕</option>
                <option value="waning">Mjesec u padu (Do mlađaka) 🌘</option>
              </select>
            </div>
          </div>
        </div>

                {/* Animirani prikaz odabrane faze */}
        <div className="has-text-centered my-5 p-5" style={{ background: '#0e1118', borderRadius: '8px' }}>
          <div 
            className="moon-glow-container"
            style={{
              display: 'inline-block',
              borderRadius: '50%',
              padding: '20px',
              transition: 'all 0.5s ease',
              boxShadow: `0 0 40px ${currentData.glowColor}`,
              animation: 'pulseGlow 3s infinite ease-in-out'
            }}
          >
            {/* Ovdje prikazujemo SAMO veliku ikonu Mjeseca */}
            <span style={{ fontSize: '5rem', display: 'block', lineHeight: '1' }}>
              {currentData.icon}
            </span>
          </div>
          {/* Naslov faze ispod ikone */}
          <h4 className="title is-4 has-text-white mt-3 mb-0">{currentData.title}</h4>
        </div>

        {/* Analiza apetita izvučena van tamnog bloka radi preglednosti i urednog Bulma dizajna */}
        <div className="notification is-light is-success mt-4">
          <p className="is-size-6 mb-3">
            Razina gladi: <strong className={currentData.statusClass}>{currentData.appetite}</strong>
          </p>

          <p className="is-size-7 has-text-weight-bold mb-1">Potencijal za zadržavanje kalorija i glad:</p>
          <progress className={`progress ${currentData.barColor}`} value={currentData.barValue} max="100">
            {currentData.barValue}%
          </progress>

          <div className="content mt-4">
            <p className="has-text-weight-bold mb-2">Što raditi danas? (Vaše opcije):</p>
            <ul>
              {/* Popravljen .map() — sada ispravno renderira listu (li) elemenata */}
              {currentData.options.map((option, index) => (
                <li key={index} className="is-size-6">{option}</li>
              ))}
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}

export default MoonPhaseDiet;
