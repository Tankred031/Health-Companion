import React, { useState } from 'react';

function BmiCalculator() {
  // Držimo unos visine, težine, rezultat i poruku u stanju (state)
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [bmi, setBmi] = useState(null);
  const [message, setMessage] = useState('');

  // Funkcija koja računa BMI na klik gumba
  const calculateBmi = (e) => {
    e.preventDefault(); // Sprječava osvježavanje stranice

    if (weight > 0 && height > 0) {
      // Formula: težina (kg) / (visina (m) * visina (m))
      // Dijelimo visinu sa 100 jer je korisnik unosi u centimetrima
      const heightInMeters = height / 100;
      const bmiValue = (weight / (heightInMeters * heightInMeters)).toFixed(1);
      setBmi(bmiValue);

      // Logika za određivanje kategorije
      if (bmiValue < 18.5) {
        setMessage('Pothranjenost 🟡');
      } else if (bmiValue >= 18.5 && bmiValue < 25) {
        setMessage('Normalna težina 🟢');
      } else if (bmiValue >= 25 && bmiValue < 30) {
        setMessage('Povećana težina 🟠');
      } else {
        setMessage('Pretilost 🔴');
      }
    } else {
      alert('Molimo unesite ispravne vrijednosti!');
    }
  };

  return (
    <div className="card">
      <div className="card-content">
        <h3 className="title is-4 has-text-primary">BMI Kalkulator</h3>

        <form onSubmit={calculateBmi}>
          {/* Polje za težinu */}
          <div className="field">
            <label className="label">Težina (kg)</label>
            <div className="control">
              <input
                className="input"
                type="number"
                placeholder="Npr. 75"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
              />
            </div>
          </div>

          {/* Polje za visinu */}
          <div className="field">
            <label className="label">Visina (cm)</label>
            <div className="control">
              <input
                className="input"
                type="number"
                placeholder="Npr. 180"
                value={height}
                onChange={(e) => setHeight(e.target.value)}
              />
            </div>
          </div>

          {/* Gumb za izračun */}
          <div className="control">
            <button type="submit" className="button is-link is-fullwidth">
              Izračunaj
            </button>
          </div>
        </form>

        {/* Prikaz rezultata ako je BMI izračunat */}
        {bmi && (
          <div className="notification is-light is-info mt-5">
            <p className="is-size-5 mb-3">Tvoj BMI: <strong>{bmi}</strong></p>
            <p className="is-size-6 mb-4">Status: <strong>{message}</strong></p>

            {/* Naslov iznad trake */}
            <p className="is-size-7 has-text-weight-bold mb-1">Skala tvoje kategorije:</p>

            {/* Dinamična traka napretka (Bulma progress) */}
            <progress
              className={`progress ${bmi < 18.5 ? 'is-warning' :
                  bmi < 25 ? 'is-success' :
                    bmi < 30 ? 'is-warning' : 'is-danger'
                }`}
              value={bmi}
              max="40"
            >
              {bmi}%
            </progress>

            {/* Granice u boji ispod trake */}
            <div className="is-flex is-justify-content-space-between is-size-7 mt-1">
              <span className="has-text-warning-dark">Pothranjen (&lt;18.5)</span>
              <span className="has-text-success-dark">Normalan (18.5-25)</span>
              <span className="has-text-danger-dark">Pretilo (30+)</span>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}

export default BmiCalculator;
