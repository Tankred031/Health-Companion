import React, { useState, useEffect } from 'react';

function PrirodniUvjeti() {
  // --- METEO STANJA ---
  const [temperature, setTemperature] = useState(null);
  const [loadingWeather, setLoadingWeather] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(false);
  const [manualTemp, setManualTemp] = useState('');


  // --- ZDRAVSTVENA STANJA ---
  const [season, setSeason] = useState('');
  const [waterAmount, setWaterAmount] = useState('');
  const [waterText, setWaterText] = useState('');
  const [vitaminDAmount, setVitaminDAmount] = useState('');
  const [vitaminDText, setVitaminDText] = useState('');
  const [seasonClass, setSeasonClass] = useState('is-info');

  // 1. DOHVAĆANJE VREMENA S INTERNETA (Puna i točna putanja za Osijek)
  useEffect(() => {
    fetchWeather();
  }, []);

  const fetchWeather = () => {
    setLoadingWeather(true);

    fetch('https://api.open-meteo.com/v1/forecast?latitude=45.55&longitude=18.69&current=temperature_2m')
      .then((res) => {
        if (!res.ok) throw new Error('Problem s mrežom');
        return res.json();
      })
      .then((data) => {
        const currentTemp =
          parseFloat(data.current.temperature_2m.toFixed(1));

        setTemperature(currentTemp);
        setManualTemp(currentTemp);

        setIsOfflineMode(false);
        setLoadingWeather(false);
      })
      .catch((err) => {
        console.error(err);

        setIsOfflineMode(true);
        setLoadingWeather(false);
      });
  };

  // 2. GLAVNI EFEKT: LOGIKA IZRAČUNA ZA VODU, VITAMIN D I ASTRO PROGNOZU
  useEffect(() => {
    if (temperature === null) return;

    const savedWeight = localStorage.getItem('userWeight')
      ? parseFloat(localStorage.getItem('userWeight'))
      : 103;

    const currentMonth = new Date().getMonth();
    const isSummerCalendar = currentMonth >= 3 && currentMonth <= 8;

    // A) Sezonski režim za Vodu i Vitamin D

    if (temperature >= 27) {

      // ================= LJETO =================

      setSeason(
        `Ljetni uvjeti ☀️ (${temperature?.toFixed(1).replace('.', ',')}°C)`
      );

      setSeasonClass('is-warning is-light');

      setVitaminDAmount('400 IJ — Ljetni minimum');

      setVitaminDText(
        'Izloženost suncu u Osijeku je visoka. Tvoja koža prirodno sintetizira Vitamin D3, stoga je dodatni unos spušten na preporučeni minimum.'
      );

      if (temperature >= 32) {

        setWaterAmount('5.0 – 7.0 Litara dnevno');

        setWaterText(
          `PAŽNJA: Zbog vrlo visoke temperature od ${temperature?.toFixed(1).replace('.', ',')}°C i tvoje mase od ${savedWeight} kg, tijelo ubrzano gubi tekućinu. Mirniji dan u klimatiziranom prostoru zahtijeva minimum 4.0 L, dok hodanje, posao vani ili trening na ovoj vrućini traže 5.0 L do preko 6.0 L uz obaveznu nadoknadu elektrolita.`
        );

      } else {

        setWaterAmount('3.5 – 4.5 Litara dnevno');

        setWaterText(
          `U toplim ljetnim temperaturama (${temperature?.toFixed(1).replace('.', ',')}°C) za tvoju masu od ${savedWeight} kg preporučuje se stabilan unos tekućine. Većina unosa treba biti obična voda, a u dane kretanja teži gornjoj granici.`
        );
      }

    } else if (temperature >= 8 && temperature < 27) {

      // ================= PROLJEĆE / JESEN =================

      setSeason(
        `Proljetno / Jesensko razdoblje 🌤️ (${temperature?.toFixed(1).replace('.', ',')}°C)`
      );

      setSeasonClass('is-primary is-light');

      setVitaminDAmount('1000 – 2000 IJ');

      setVitaminDText(
        'Sunčeva izloženost je promjenjiva pa se preporučuje umjeren dodatni unos vitamina D3, posebno tijekom oblačnih dana i slabijeg boravka na otvorenom.'
      );

      setWaterAmount('2.5 – 3.5 Litara dnevno');

      setWaterText(
        `U umjerenim temperaturama (${temperature?.toFixed(1).replace('.', ',')}°C) potrebe za tekućinom su stabilnije. Tijelo gubi manje elektrolita nego ljeti, ali redovita hidracija i dalje ostaje važna.`
      );

    } else {

      // ================= ZIMA =================

      setSeason(
        `Zimsko razdoblje ❄️ (${temperature?.toFixed(1).replace('.', ',')}°C)`
      );

      setSeasonClass('is-info is-light');

      const winterLiters =
        ((savedWeight * 35) / 1000).toFixed(1);

      setWaterAmount(`${winterLiters} Litara dnevno`);

      setWaterText(
        `Zimi rjeđe osjećamo žeđ, ali tijelo i dalje gubi vodu kroz suhi zrak i grijane prostore. Tvoja zimska formula iznosi oko ${winterLiters} L.`
      );

      let optimalD_IU = Math.round(savedWeight * 50);

      if (optimalD_IU < 1000) optimalD_IU = 1000;
      if (optimalD_IU > 5000) optimalD_IU = 5000;

      setVitaminDAmount(
        `${optimalD_IU} IJ — Prilagođeno tvojoj težini`
      );

      setVitaminDText(
        `Zimi je sunce preslabo za sintezu. S obzirom na tvoju masu od ${savedWeight} kg, ovo je optimalna zimska doza za tvoja tkiva.`
      );
    }

  }, [temperature]);

  const handleManualTempChange = (e) => {
    setIsOfflineMode(true);

    const val = e.target.value;
    setManualTemp(val);

    if (val !== '' && !isNaN(val)) {
      setTemperature(parseFloat(val));
    }
  };

  return (
    <div className="card">
      <div className="card-content">
        <h3 className="title is-4 has-text-success">Prirodni Uvjeti & Sezonski Vodič</h3>

        {/* ================= CENTRIRANI TEKST I DESNO POLJE UNUTAR TRAKE ================= */}
        <div className={`notification ${seasonClass} mb-4 py-3 px-4`}>
          <div className="columns is-mobile is-vcentered">

            <div className="column is-10 is-flex is-align-items-center is-justify-content-center">
              <span className="is-size-5 has-text-weight-bold">
                {isOfflineMode ? 'Ručni unos: ' : 'Uživo izmjereno: '} {season.split('(')[0].trim()}
              </span>

              {isOfflineMode && (
                <button
                  className="button is-small is-danger is-light ml-3 py-0 px-2"
                  style={{ height: '24px', fontSize: '0.75rem' }}
                  onClick={fetchWeather}
                >
                  Uživo 🔄
                </button>
              )}
            </div>

            {/* Unosno polje u tvom crvenom krugu (2/12 mjesta, bez ikakvih ikona) */}
            <div className="column is-2">
              <div className="field has-addons is-justify-content-flex-end">
                <div className="control" style={{ maxWidth: '70px' }}>
                  <input
                    className="input is-small has-text-centered has-text-weight-bold"
                    type="number"
                    step="0.1"
                    min="-50"
                    placeholder="22.0"
                    style={{ borderColor: 'rgba(0,0,0,0.15)' }}
                    value={manualTemp}
                    onChange={handleManualTempChange}
                    onFocus={() => {
                      setIsOfflineMode(true);
                    }}
                  />
                </div>
                <div className="control">
                  <span className="button is-small is-static has-text-weight-bold" style={{ borderColor: 'rgba(0,0,0,0.15)' }}>
                    °C
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* KUTIJA 1: VODA */}
        <div className="box">
          <h4 className="title is-5 has-text-link mb-2">💧 Hidratacija (Potreba za tekućinom)</h4>
          <div className="notification is-info is-light py-2 px-3 mb-2">
            <p className="is-size-4 has-text-link-dark has-text-weight-bold">
              {loadingWeather ? 'Računam...' : waterAmount}
            </p>
          </div>
          <p className="is-size-6 mt-2">{loadingWeather ? 'Učitavam podatke...' : waterText}</p>
        </div>

        {/* KUTIJA 2: VITAMIN D (Samo u IJ jedinicama) */}
        <div className="box has-background-dark">
          <h4 className="title is-5 has-text-warning mb-2">☀️ Personalizirana Vitamin D3 Preporuka</h4>
          <div className="notification is-dark py-2 px-3 mb-2" style={{ background: '#1c1f2b' }}>
            <p className="is-size-5 has-text-warning has-text-weight-bold">
              {loadingWeather ? 'Računam...' : vitaminDAmount}
            </p>
          </div>
          <p className="is-size-6 has-text-white">{loadingWeather ? 'Učitavam podatke...' : vitaminDText}</p>
        </div>



        {/* ZAKONSKO ODRICANJE OD ODGOVORNOSTI (Krupniji tekst is-size-6 bez ikona) */}
        <div className="mt-5 pt-3" style={{ borderTop: '1px dashed #555' }}>
          <p className="is-size-6 has-text-grey has-text-centered is-italic">
            Izjava o odricanju odgovornosti: Preporuke za unos tekućine i dodataka prehrani u internacionalnim jedinicama (IJ) služe isključivo u informativne i edukativne svrhe i ne predstavljaju medicinski savjet ili terapiju.
          </p>
        </div>
      </div>

    </div>
  );
}

export default PrirodniUvjeti;