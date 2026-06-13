import React, { useEffect, useState } from 'react';

function PrirodniUvjeti() {
  // --- METEO STANJA ---
  const [temperature, setTemperature] = useState(null);
  const [humidity, setHumidity] = useState(null);
  const [apparentTemperature, setApparentTemperature] = useState(null);
  const [dewPoint, setDewPoint] = useState(null);

  const [humidityLevel, setHumidityLevel] = useState('');
  const [humidityText, setHumidityText] = useState('');
  const [humidityClass, setHumidityClass] = useState('is-info is-light');

  const [loadingWeather, setLoadingWeather] = useState(true);
  const [isOfflineMode, setIsOfflineMode] = useState(false);

  const [manualTemp, setManualTemp] = useState('');
  const [manualHumidity, setManualHumidity] = useState('');

  // --- ZDRAVSTVENA STANJA ---
  const [season, setSeason] = useState('');
  const [waterAmount, setWaterAmount] = useState('');
  const [waterText, setWaterText] = useState('');
  const [vitaminDAmount, setVitaminDAmount] = useState('');
  const [vitaminDText, setVitaminDText] = useState('');
  const [seasonClass, setSeasonClass] = useState('is-info');

  useEffect(() => {
    fetchWeather();
  }, []);

  const calculateDewPoint = (temp, relativeHumidity) => {
    if (
      temp === null ||
      relativeHumidity === null ||
      relativeHumidity <= 0
    ) {
      return null;
    }

    const a = 17.27;
    const b = 237.7;

    const alpha =
      (a * temp) / (b + temp) +
      Math.log(relativeHumidity / 100);

    return (b * alpha) / (a - alpha);
  };

  const calculateHeatIndex = (tempC, relativeHumidity) => {
    if (
      tempC === null ||
      relativeHumidity === null ||
      tempC < 27 ||
      relativeHumidity < 40
    ) {
      return tempC;
    }

    const tempF = (tempC * 9) / 5 + 32;

    const heatIndexF =
      -42.379 +
      2.04901523 * tempF +
      10.14333127 * relativeHumidity -
      0.22475541 * tempF * relativeHumidity -
      0.00683783 * tempF * tempF -
      0.05481717 * relativeHumidity * relativeHumidity +
      0.00122874 * tempF * tempF * relativeHumidity +
      0.00085282 * tempF * relativeHumidity * relativeHumidity -
      0.00000199 *
        tempF *
        tempF *
        relativeHumidity *
        relativeHumidity;

    return ((heatIndexF - 32) * 5) / 9;
  };

  const fetchWeather = () => {
    setLoadingWeather(true);

    fetch(
      'https://api.open-meteo.com/v1/forecast?latitude=45.55&longitude=18.69&current=temperature_2m,relative_humidity_2m,apparent_temperature,dew_point_2m'
    )
      .then((res) => {
        if (!res.ok) {
          throw new Error('Problem s mrežom');
        }

        return res.json();
      })
      .then((data) => {
        const currentTemp = Number(
          data.current.temperature_2m.toFixed(1)
        );

        const currentHumidity = Number(
          data.current.relative_humidity_2m.toFixed(0)
        );

        const currentApparentTemperature = Number(
          data.current.apparent_temperature.toFixed(1)
        );

        const currentDewPoint = Number(
          data.current.dew_point_2m.toFixed(1)
        );

        setTemperature(currentTemp);
        setHumidity(currentHumidity);
        setApparentTemperature(currentApparentTemperature);
        setDewPoint(currentDewPoint);

        setManualTemp(currentTemp.toString());
        setManualHumidity(currentHumidity.toString());

        setIsOfflineMode(false);
        setLoadingWeather(false);
      })
      .catch((err) => {
        console.error(err);

        setIsOfflineMode(true);
        setLoadingWeather(false);
      });
  };

  const formatNumber = (value) => {
    if (value === null || Number.isNaN(value)) {
      return '--';
    }

    return Number(value).toFixed(1).replace('.', ',');
  };

  const conditionsTitle =
    temperature !== null && temperature < 20
      ? '❄️ Osjećaj hladnoće i vlažnost zraka'
      : '🌡️ Toplinski osjećaj i sparina';

  const conditionsTitleClass =
    temperature !== null && temperature < 20
      ? 'has-text-info'
      : 'has-text-danger';

  useEffect(() => {
    if (
      temperature === null ||
      humidity === null ||
      dewPoint === null
    ) {
      return;
    }

    if (temperature < 8) {
      setHumidityLevel('Hladni vremenski uvjeti');
      setHumidityClass('is-info is-light');

      setHumidityText(
        `Temperatura iznosi ${formatNumber(
          temperature
        )} °C, a osjeća se kao ${formatNumber(
          apparentTemperature
        )} °C. Vlažnost zraka je ${Math.round(
          humidity
        )} %. Pri ovoj temperaturi nema sparine; važniji je osjećaj hladnoće.`
      );

      return;
    }

    if (temperature < 20) {
      setHumidityLevel('Svjež i vlažan zrak');
      setHumidityClass('is-primary is-light');

      setHumidityText(
        `Vlažnost zraka iznosi ${Math.round(
          humidity
        )} %, a osjeća se kao ${formatNumber(
          apparentTemperature
        )} °C. Temperatura nije dovoljno visoka za pojavu sparine.`
      );

      return;
    }

    if (dewPoint < 13) {
      setHumidityLevel('Ugodan i suh zrak');
      setHumidityClass('is-success is-light');

      setHumidityText(
        'Zrak je ugodan, a znoj može normalno isparavati i hladiti tijelo.'
      );
    } else if (dewPoint < 16) {
      setHumidityLevel('Ugodna vlažnost');
      setHumidityClass('is-success is-light');

      setHumidityText(
        'Vlažnost je primjetna, ali zasad ne stvara značajno toplinsko opterećenje.'
      );
    } else if (dewPoint < 19) {
      setHumidityLevel('Blago sparno');
      setHumidityClass('is-warning is-light');

      setHumidityText(
        'Zrak je blago vlažan. Tijekom fizičke aktivnosti može se osjetiti otežano hlađenje tijela.'
      );
    } else if (dewPoint < 22) {
      setHumidityLevel('Sparno');
      setHumidityClass('is-warning');

      setHumidityText(
        'Povišena vlaga usporava isparavanje znoja pa se temperatura može osjećati višom nego što pokazuje termometar.'
      );
    } else if (dewPoint < 25) {
      setHumidityLevel('Vrlo sparno');
      setHumidityClass('is-danger is-light');

      setHumidityText(
        'Tijelo se teže hladi zbog visoke vlage. Aktivnosti na otvorenom mogu djelovati znatno napornije.'
      );
    } else {
      setHumidityLevel('Ekstremno sparno');
      setHumidityClass('is-danger');

      setHumidityText(
        'Izrazito visoka sparina snažno otežava prirodno hlađenje tijela. Potreban je oprez tijekom boravka i aktivnosti na otvorenom.'
      );
    }
  }, [temperature, humidity, dewPoint, apparentTemperature]);

  useEffect(() => {
    if (temperature === null) {
      return;
    }

    const savedWeight = localStorage.getItem('userWeight')
      ? parseFloat(localStorage.getItem('userWeight'))
      : 103;

    const effectiveTemperature =
      apparentTemperature !== null
        ? Math.max(temperature, apparentTemperature)
        : temperature;

    if (effectiveTemperature >= 27) {
      setSeason(
        `Ljetni uvjeti ☀️ (${temperature
          .toFixed(1)
          .replace('.', ',')}°C)`
      );

      setSeasonClass('is-warning is-light');

      setVitaminDAmount('400 IJ — Ljetni minimum');

      setVitaminDText(
        'Izloženost suncu u Osijeku je visoka. Koža prirodno sintetizira Vitamin D3, stoga je dodatni unos spušten na preporučeni minimum.'
      );

      if (effectiveTemperature >= 32) {
        setWaterAmount('5.0 – 7.0 Litara dnevno');

        setWaterText(
          `PAŽNJA: Stvarna temperatura iznosi ${temperature
            .toFixed(1)
            .replace('.', ',')}°C, a osjeća se kao ${effectiveTemperature
            .toFixed(1)
            .replace(
              '.',
              ','
            )}°C. Zbog topline, moguće sparine i tvoje mase od ${savedWeight} kg tijelo ubrzano gubi tekućinu. Mirniji dan u klimatiziranom prostoru zahtijeva manji unos, dok hodanje, posao vani ili trening zahtijevaju redovitu hidraciju i nadoknadu elektrolita.`
        );
      } else {
        setWaterAmount('3.5 – 4.5 Litara dnevno');

        setWaterText(
          `U toplim uvjetima, uz temperaturu od ${temperature
            .toFixed(1)
            .replace('.', ',')}°C i osjećaj od ${effectiveTemperature
            .toFixed(1)
            .replace(
              '.',
              ','
            )}°C, za tvoju masu od ${savedWeight} kg preporučuje se stabilan unos tekućine. Tijekom kretanja ili visoke sparine teži gornjoj granici.`
        );
      }
    } else if (
      effectiveTemperature >= 8 &&
      effectiveTemperature < 27
    ) {
      setSeason(
        `Proljetno / Jesensko razdoblje 🌤️ (${temperature
          .toFixed(1)
          .replace('.', ',')}°C)`
      );

      setSeasonClass('is-primary is-light');

      setVitaminDAmount('1000 – 2000 IJ');

      setVitaminDText(
        'Sunčeva izloženost je promjenjiva pa se preporučuje umjeren dodatni unos vitamina D3, posebno tijekom oblačnih dana i slabijeg boravka na otvorenom.'
      );

      setWaterAmount('2.5 – 3.5 Litara dnevno');

      setWaterText(
        `U umjerenim temperaturama od ${temperature
          .toFixed(1)
          .replace(
            '.',
            ','
          )}°C potrebe za tekućinom su stabilnije. Tijelo gubi manje elektrolita nego ljeti, ali redovita hidracija i dalje ostaje važna.`
      );
    } else {
      setSeason(
        `Zimsko razdoblje ❄️ (${temperature
          .toFixed(1)
          .replace('.', ',')}°C)`
      );

      setSeasonClass('is-info is-light');

      const winterLiters = ((savedWeight * 35) / 1000).toFixed(1);

      setWaterAmount(`${winterLiters} Litara dnevno`);

      setWaterText(
        `Zimi rjeđe osjećamo žeđ, ali tijelo i dalje gubi vodu kroz suhi zrak i grijane prostore. Tvoja zimska formula iznosi oko ${winterLiters} L.`
      );

      let optimalD_IU = Math.round(savedWeight * 50);

      if (optimalD_IU < 1000) {
        optimalD_IU = 1000;
      }

      if (optimalD_IU > 5000) {
        optimalD_IU = 5000;
      }

      setVitaminDAmount(
        `${optimalD_IU} IJ — Prilagođeno tvojoj težini`
      );

      setVitaminDText(
        `Zimi je sunce preslabo za pouzdanu sintezu. S obzirom na tvoju masu od ${savedWeight} kg, prikazana je informativna zimska procjena.`
      );
    }
  }, [temperature, apparentTemperature]);

  const handleManualTempChange = (e) => {
    setIsOfflineMode(true);

    const value = e.target.value;
    setManualTemp(value);

    if (value === '' || Number.isNaN(Number(value))) {
      return;
    }

    const newTemperature = parseFloat(value);

    const currentHumidity =
      manualHumidity !== ''
        ? parseFloat(manualHumidity)
        : humidity;

    setTemperature(newTemperature);

    if (
      currentHumidity !== null &&
      !Number.isNaN(currentHumidity)
    ) {
      const calculatedDewPoint = calculateDewPoint(
        newTemperature,
        currentHumidity
      );

      const calculatedApparentTemperature = calculateHeatIndex(
        newTemperature,
        currentHumidity
      );

      setHumidity(currentHumidity);

      setDewPoint(
        calculatedDewPoint !== null
          ? Number(calculatedDewPoint.toFixed(1))
          : null
      );

      setApparentTemperature(
        Number(calculatedApparentTemperature.toFixed(1))
      );
    } else {
      setApparentTemperature(newTemperature);
    }
  };

  const handleManualHumidityChange = (e) => {
    setIsOfflineMode(true);

    const value = e.target.value;
    setManualHumidity(value);

    if (
      value === '' ||
      Number.isNaN(Number(value)) ||
      temperature === null
    ) {
      return;
    }

    let newHumidity = parseFloat(value);

    if (newHumidity < 1) {
      newHumidity = 1;
    }

    if (newHumidity > 100) {
      newHumidity = 100;
    }

    const calculatedDewPoint = calculateDewPoint(
      temperature,
      newHumidity
    );

    const calculatedApparentTemperature = calculateHeatIndex(
      temperature,
      newHumidity
    );

    setHumidity(newHumidity);

    setDewPoint(
      calculatedDewPoint !== null
        ? Number(calculatedDewPoint.toFixed(1))
        : null
    );

    setApparentTemperature(
      Number(calculatedApparentTemperature.toFixed(1))
    );
  };

  return (
    <div className="card">
      <div className="card-content">
        <h3 className="title is-4 has-text-success">
          Prirodni Uvjeti & Sezonski Vodič
        </h3>

        {/* TEMPERATURA */}
        <div
          className={`notification ${seasonClass} mb-4 py-3 px-4`}
        >
          <div className="columns is-mobile is-vcentered">
            <div className="column is-10 is-flex is-align-items-center is-justify-content-center">
              <span className="is-size-5 has-text-weight-bold">
                {isOfflineMode
                  ? 'Ručni unos: '
                  : 'Uživo izmjereno: '}

                {season.split('(')[0].trim()}
              </span>

              {isOfflineMode && (
                <button
                  className="button is-small is-danger is-light ml-3 py-0 px-2"
                  style={{
                    height: '24px',
                    fontSize: '0.75rem'
                  }}
                  onClick={fetchWeather}
                >
                  Uživo 🔄
                </button>
              )}
            </div>

            <div className="column is-2">
              <div className="field has-addons is-justify-content-flex-end">
                <div
                  className="control"
                  style={{ maxWidth: '70px' }}
                >
                  <input
                    className="input is-small has-text-centered has-text-weight-bold"
                    type="number"
                    step="0.1"
                    min="-50"
                    placeholder="22.0"
                    style={{
                      borderColor: 'rgba(0,0,0,0.15)'
                    }}
                    value={manualTemp}
                    onChange={handleManualTempChange}
                    onFocus={() => {
                      setIsOfflineMode(true);
                    }}
                  />
                </div>

                <div className="control">
                  <span
                    className="button is-small is-static has-text-weight-bold"
                    style={{
                      borderColor: 'rgba(0,0,0,0.15)'
                    }}
                  >
                    °C
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* SPARINA / ZIMSKI UVJETI */}
        <div className="box has-background-dark">
          <h4 className={`title is-5 mb-3 ${conditionsTitleClass}`}>
            {conditionsTitle}
          </h4>

          <div className="columns is-mobile has-text-centered mb-3">
            <div className="column">
              <p className="heading has-text-success">
                Vlažnost
              </p>

              <p className="title is-5 mb-1 has-text-white">
                {loadingWeather || humidity === null
                  ? '--'
                  : `${Math.round(humidity)} %`}
              </p>
            </div>

            <div className="column">
              <p className="heading has-text-success">
                Osjećaj
              </p>

              <p className="title is-5 mb-1 has-text-white">
                {loadingWeather ||
                apparentTemperature === null
                  ? '--'
                  : `${formatNumber(apparentTemperature)} °C`}
              </p>
            </div>

            <div className="column">
              <p className="heading has-text-success">
                Točka rosišta
              </p>

              <p className="title is-5 mb-1 has-text-white">
                {loadingWeather || dewPoint === null
                  ? '--'
                  : `${formatNumber(dewPoint)} °C`}
              </p>
            </div>
          </div>

          <div
            className={`notification ${humidityClass} py-3 px-3 mb-3`}
          >
            <p className="is-size-5 has-text-weight-bold">
              {loadingWeather
                ? 'Računam uvjete...'
                : temperature !== null && temperature < 20
                  ? `❄️ ${humidityLevel}`
                  : `💦 ${humidityLevel}`}
            </p>

            <p className="is-size-6 mt-1">
              {loadingWeather
                ? 'Učitavam podatke o vlažnosti zraka...'
                : humidityText}
            </p>
          </div>

          {isOfflineMode && (
            <div className="field">
              <label className="label has-text-white">
                Ručni unos relativne vlažnosti
              </label>

              <div className="field has-addons">
                <div className="control is-expanded">
                  <input
                    className="input has-text-centered has-text-weight-bold"
                    type="number"
                    min="1"
                    max="100"
                    step="1"
                    placeholder="70"
                    value={manualHumidity}
                    onChange={handleManualHumidityChange}
                  />
                </div>

                <div className="control">
                  <span className="button is-static has-text-weight-bold">
                    %
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* HIDRATACIJA */}
        <div className="box">
          <h4 className="title is-5 has-text-link mb-2">
            💧 Hidratacija (Potreba za tekućinom)
          </h4>

          <div className="notification is-info is-light py-2 px-3 mb-2">
            <p className="is-size-4 has-text-link-dark has-text-weight-bold">
              {loadingWeather ? 'Računam...' : waterAmount}
            </p>
          </div>

          <p className="is-size-6 mt-2">
            {loadingWeather
              ? 'Učitavam podatke...'
              : waterText}
          </p>
        </div>

        {/* VITAMIN D */}
        <div className="box has-background-dark">
          <h4 className="title is-5 has-text-warning mb-2">
            ☀️ Personalizirana Vitamin D3 Preporuka
          </h4>

          <div
            className="notification is-dark py-2 px-3 mb-2"
            style={{ background: '#1c1f2b' }}
          >
            <p className="is-size-5 has-text-warning has-text-weight-bold">
              {loadingWeather
                ? 'Računam...'
                : vitaminDAmount}
            </p>
          </div>

          <p className="is-size-6 has-text-white">
            {loadingWeather
              ? 'Učitavam podatke...'
              : vitaminDText}
          </p>
        </div>

        {/* ODRICANJE ODGOVORNOSTI */}
        <div
          className="mt-5 pt-3"
          style={{ borderTop: '1px dashed #555' }}
        >
          <p className="is-size-6 has-text-grey has-text-centered is-italic">
            Izjava o odricanju odgovornosti: Preporuke
            za unos tekućine i dodataka prehrani u
            internacionalnim jedinicama (IJ) služe
            isključivo u informativne i edukativne svrhe
            i ne predstavljaju medicinski savjet ili
            terapiju.
          </p>
        </div>
      </div>
    </div>
  );
}

export default PrirodniUvjeti;