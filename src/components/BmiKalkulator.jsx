import React, { useState } from 'react';

function BmiCalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [isSmoker, setIsSmoker] = useState(false); // Stanje za provjeru pušenja
  const [bmi, setBmi] = useState(null);
  const [message, setMessage] = useState('');
  const [categoryColor, setCategoryColor] = useState('is-success');

  const [vitC, setVitC] = useState('');
  const [vitD, setVitD] = useState('');

  const calculateBmi = (e) => {
    e.preventDefault();

    if (weight > 0 && height > 0 && age > 0) {
      const heightInMeters = height / 100;
      const bmiValue = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
      setBmi(bmiValue);

      // --- OPTIMALNA KALKULACIJA VITAMINA PREMA TEŽINI ---
      const currentMonth = new Date().getMonth();
      const isSummer = currentMonth >= 3 && currentMonth <= 8;

      // Izračun za Vitamin C (10 mg po kg)
      let optimalC = Math.round(weight * 10);

      // Ako je korisnik pušač, dodajemo 300 mg na optimalnu dozu za imunitet
      if (isSmoker) {
        optimalC += 300;
      }

      if (optimalC < 500) optimalC = 500;
      if (optimalC > 2000) optimalC = 2000; // Sigurna gornja granica

      setVitC(`${optimalC} mg`);

      // Izračun za Vitamin D3 (50 IJ po kg)
      let optimalD_IU = Math.round(weight * 50);
      if (isSummer) {
        optimalD_IU = Math.round(optimalD_IU / 2);
      }
      if (optimalD_IU < 1000) optimalD_IU = 1000;
      if (optimalD_IU > 5000) optimalD_IU = 5000;

      const optimalD_mcg = parseFloat((optimalD_IU / 40).toFixed(1));
      setVitD(`${optimalD_mcg} mcg (${optimalD_IU} IJ)`);

      // --- INTERPRETACIJA BMI KATEGORIJE ---
      if (age >= 65) {
        if (bmiValue < 22) { setCategoryColor('is-warning'); setMessage('Pothranjenost za stariju dob 🟡'); }
        else if (bmiValue >= 22 && bmiValue < 27) { setCategoryColor('is-success'); setMessage('Optimalna težina za stariju dob 🟢'); }
        else if (bmiValue >= 27 && bmiValue < 32) { setCategoryColor('is-warning'); setMessage('Blago povišena težina 🟠'); }
        else { setCategoryColor('is-danger'); setMessage('Pretilost 🔴'); }
      } else {
        const genderNote = gender === 'female' ? ' (Žene prirodno imaju veći % masti)' : ' (Muškarci imaju veću mišićnu masu)';
        if (bmiValue < 18.5) { setCategoryColor('is-warning'); setMessage('Pothranjenost 🟡'); }
        else if (bmiValue >= 18.5 && bmiValue < 25) { setCategoryColor('is-success'); setMessage('Normalna težina 🟢' + genderNote); }
        else if (bmiValue >= 25 && bmiValue < 30) { setCategoryColor('is-warning'); setMessage('Povećana težina 🟠' + genderNote); }
        else { setCategoryColor('is-danger'); setMessage('Pretilost 🔴'); }
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
          {/* Spol */}
          <div className="field">
            <label className="label">Spol</label>
            <div className="control">
              <div className="select is-fullwidth">
                <select value={gender} onChange={(e) => setGender(e.target.value)}>
                  <option value="male">Muški</option>
                  <option value="female">Ženski</option>
                </select>
              </div>
            </div>
          </div>

          {/* Godine */}
          <div className="field">
            <label className="label">Godine</label>
            <div className="control">
              <input className="input" type="number" placeholder="Npr. 35" value={age} onChange={(e) => setAge(e.target.value)} />
            </div>
          </div>

          {/* Težina */}
          <div className="field">
            <label className="label">Težina (kg)</label>
            <div className="control">
              <input className="input" type="number" placeholder="Npr. 75" value={weight} onChange={(e) => setWeight(e.target.value)} />
            </div>
          </div>

          {/* Visina */}
          <div className="field">
            <label className="label">Visina (cm)</label>
            <div className="control">
              <input className="input" type="number" placeholder="Npr. 180" value={height} onChange={(e) => setHeight(e.target.value)} />
            </div>
          </div>

          {/* Checkbox za pušače */}
          <div className="field">
            <div className="control">
              <label className="checkbox has-text-weight-bold">
                <input
                  type="checkbox"
                  className="mr-2"
                  checked={isSmoker}
                  onChange={(e) => setIsSmoker(e.target.checked)}
                />
                Da li ste pušač? 🚬
              </label>
            </div>
          </div>

          <div className="control">
            <button type="submit" className="button is-link is-fullwidth">Izračunaj</button>
          </div>
        </form>

        {/* Prikaz rezultata */}
        {bmi && (
          <div className="notification is-light is-info mt-5">
            <p className="is-size-5 mb-3">Tvoj BMI: <strong>{bmi}</strong></p>
            <p className="is-size-6 mb-4">Status: <strong>{message}</strong></p>

            <p className="is-size-7 has-text-weight-bold mb-1">Skala tvoje kategorije:</p>
            <progress className={`progress ${categoryColor}`} value={bmi} max="40">{bmi}%</progress>

            <div className="is-flex is-justify-content-space-between is-size-7 mt-1 mb-5">
              {age >= 65 ? (
                <><span className="has-text-warning-dark">Pothranjen (&lt;22)</span><span className="has-text-success-dark">Normalan (22-27)</span><span className="has-text-danger-dark">Pretilo (32+)</span></>
              ) : (
                <><span className="has-text-warning-dark">Pothranjen (&lt;18.5)</span><span className="has-text-success-dark">Normalan (18.5-25)</span><span className="has-text-danger-dark">Pretilo (30+)</span></>
              )}
            </div>

            <hr />
            <h4 className="title is-6 has-text-grey-dark mb-3">Preporučeni dnevni unos mikronutrijenata:</h4>
            <div className="columns is-mobile">

              {/* Vitamin C */}
              <div className="column is-half">
                <div className="box has-background-white p-3">
                  <p className="heading has-text-weight-bold has-text-link">🍊 Vitamin C</p>
                  <p className="title is-5 mt-1">{vitC}</p>
                </div>
              </div>

              {/* Vitamin D */}
              <div className="column is-half">
                <div className="box has-background-dark p-3">
                  <p className="heading has-text-weight-bold has-text-warning">☀️ Vitamin D3</p>
                  <p className="title is-5 has-text-white mt-1">{vitD}</p>
                </div>
              </div>
            </div>

            {/* Dinamička žuta opaska za pušače */}
            {isSmoker && (
              <div className="notification is-warning is-light p-3 mt-3 is-size-7">
                <p>
                  <strong>⚠️ Opaska za pušače:</strong> Tvoja optimalna doza Vitamina C je automatski **povećana za 300 mg**. Toksini iz duhanskog dima ubrzano uništavaju zalihe ovog vitamina u krvi i stanicama, zbog čega ti je potrebna jača antioksidativna zaštita.
                </p>
              </div>
            )}

            {/* POPRAVLJENO I ZATVORENO: Odricanje odgovornosti je sada ispravno unutar bloka rezultata */}
            <div className="mt-5 pt-3 style-disclaimer" style={{ borderTop: '1px dashed #ccc' }}>
              <p className="is-size-7 has-text-grey has-text-centered is-italic">
                <strong>Izjava o odricanju odgovornosti:</strong> Ovaj izračun i preporuke služe isključivo u informativne i edukativne svrhe. Aplikacija ne postavlja medicinske dijagnoze niti zamjenjuje stručni savjet liječnika, nutricionista ili ljekarnika. Prije uvođenja bilo kakvih dodataka prehrani ili drastičnih promjena životnog stila, posavjetujte se sa svojim liječnikom.
              </p>
            </div>

          </div>
        )}
      </div>
    </div>
  );
}

export default BmiCalculator;
