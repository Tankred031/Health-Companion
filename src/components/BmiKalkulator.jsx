import React, { useState, useEffect } from 'react';

function BmiCalculator() {
  const [weight, setWeight] = useState('');
  const [height, setHeight] = useState('');
  const [age, setAge] = useState('');
  const [gender, setGender] = useState('male');
  const [isSmoker, setIsSmoker] = useState(false);
  const [bmi, setBmi] = useState(null);
  const [message, setMessage] = useState('');
  const [categoryColor, setCategoryColor] = useState('is-success');

  const [vitC, setVitC] = useState('');
  const [vitD, setVitD] = useState('');
  const [water, setWater] = useState('');

  // Stanje za pohranu live temperature za Osijek
  const [liveTemp, setLiveTemp] = useState(22); // Zadano 22°C ako mreža padne

    // Dohvaćamo temperaturu za Osijek čim se kalkulator učita
  useEffect(() => {
    // Puna API putanja s koordinatama Osijeka: lat=45.5511, lon=18.6939
    fetch('https://open-meteo.com')
      .then((res) => {
        if (!res.ok) throw new Error('Problem s API-jem');
        return res.json();
      })
      .then((data) => {
        // Izvlačimo temperaturu iz živih podataka
        setLiveTemp(Math.round(data.current.temperature_2m));
      })
      .catch((err) => {
        console.error('Meteo greška u kalkulatoru:', err);
        setLiveTemp(22); // Sigurna zadana temperatura ako internet pukne
      });
  }, []);


  const calculateBmi = (e) => {
    e.preventDefault();

    if (weight > 0 && height > 0 && age > 0) {
      const heightInMeters = height / 100;
      const bmiValue = parseFloat((weight / (heightInMeters * heightInMeters)).toFixed(1));
      setBmi(bmiValue);

      // Spremanje podataka za druge stranice
      localStorage.setItem('userBmi', bmiValue);
      localStorage.setItem('userWeight', weight);

      const currentMonth = new Date().getMonth();
      const isSummerCalendar = currentMonth >= 3 && currentMonth <= 8;

      // 1. IZRAČUN ZA VITAMIN C (10 mg po kg + opcija za pušače)
      let optimalC = Math.round(weight * 10);
      if (isSmoker) optimalC += 300;
      if (optimalC < 500) optimalC = 500;
      if (optimalC > 2000) optimalC = 2000;
      setVitC(`${optimalC} mg`);

      // 2. KORIGIRANI IZRAČUN ZA VODU PREMA TEMPERATURI I TVOJIM SMJERNICAMA
      if (liveTemp >= 25 || isSummerCalendar) {
        if (liveTemp >= 30) {
          // Tropski dani (30+ °C) - npr. za 128 kg prikazuje točan raspon 5-7 L
          setWater('5.0 – 7.0 L');
        } else {
          // Umjereno ljeto / proljeće
          setWater('3.5 – 4.5 L');
        }
      } else {
        // Zimski uvjeti (Bazična formula: 35 ml po kg mase)
        const winterLiters = ((weight * 35) / 1000).toFixed(1);
        setWater(`${winterLiters} L`);
      }

      // 3. IZRAČUN ZA VITAMIN D3 (Samo u IJ jedinicama)
      let optimalD_IU = Math.round(weight * 50);
      if (liveTemp >= 25 || isSummerCalendar) {
        optimalD_IU = 400; // Ljetni minimum
      } else {
        if (optimalD_IU < 1000) optimalD_IU = 1000;
        if (optimalD_IU > 5000) optimalD_IU = 5000;
      }
      setVitD(`${optimalD_IU} IJ`);

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
          <div className="field">
            <label className="label">Spol</label>
            <div className="control"><div className="select is-fullwidth"><select value={gender} onChange={(e) => setGender(e.target.value)}><option value="male">Muški</option><option value="female">Ženski</option></select></div></div>
          </div>
          <div className="field">
            <label className="label">Godine</label>
            <div className="control"><input className="input" type="number" placeholder="Npr. 35" value={age} onChange={(e) => setAge(e.target.value)} /></div>
          </div>
          <div className="field">
            <label className="label">Težina (kg)</label>
            <div className="control"><input className="input" type="number" placeholder="Npr. 75" value={weight} onChange={(e) => setWeight(e.target.value)} /></div>
          </div>
          <div className="field">
            <label className="label">Visina (cm)</label>
            <div className="control"><input className="input" type="number" placeholder="Npr. 175" value={height} onChange={(e) => setHeight(e.target.value)} /></div>
          </div>
          <div className="field">
            <div className="control">
              <label className="checkbox has-text-weight-bold">
                <input type="checkbox" className="mr-2" checked={isSmoker} onChange={(e) => setIsSmoker(e.target.checked)} />
                Da li ste pušač? 🚬
              </label>
            </div>
          </div>
          <div className="control"><button type="submit" className="button is-link is-fullwidth">Izračunaj</button></div>
        </form>

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
            <h4 className="title is-6 has-text-grey-dark mb-3">Preporučeni dnevni unos mikronutrijenata i vode:</h4>
            
            {/* TRI JEDNAKE KUTIJICE U ISTOM REDU */}
            <div className="columns is-mobile is-centered">
              
              {/* Box 1: Vitamin C */}
              <div className="column is-one-third">
                <div 
                  className="box has-background-dark p-2 has-text-centered" 
                  style={{ minHeight: '110px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                >
                  <p className="heading has-text-weight-bold has-text-link mb-1">🍊 Vitamin C</p>
                  <p className="title is-5 has-text-white mb-0">{vitC}</p>
                </div>
              </div>

              {/* Box 2: Voda (Usklađena s live temperaturom neba) */}
              <div className="column is-one-third">
                <div 
                  className="box has-background-link p-2 has-text-centered" 
                  style={{ minHeight: '110px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                >
                  <p className="heading has-text-weight-bold has-text-white mb-1">💧 Voda</p>
                  <p className="title is-5 has-text-white mb-0">{water}</p>
                </div>
              </div>

              {/* Box 3: Vitamin D3 (Samo čiste IJ jedinice) */}
              <div className="column is-one-third">
                <div 
                  className="box has-background-dark p-2 has-text-centered" 
                  style={{ minHeight: '110px', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}
                >
                  <p className="heading has-text-weight-bold has-text-warning mb-1">☀️ Vitamin D3</p>
                  <p className="title is-5 has-text-white mb-0">{vitD}</p>
                </div>
              </div>

            </div>

            {isSmoker && (
              <div className="notification is-warning is-light p-3 mt-3 is-size-7">
                <p><strong>⚠️ Opaska za pušače:</strong> Tvoja optimalna doza Vitamina C je automatski povećana za 300 mg zbog duhanskog dima.</p>
              </div>
            )}

            <div className="mt-5 pt-3" style={{ borderTop: '1px dashed #ccc' }}>
              <p className="is-size-7 has-text-grey has-text-centered is-italic">
                <strong>Izjava o odricanju odgovornosti:</strong> Ovaj izračun i preporuke služe isključivo u informativne i edukativne svrhe. Aplikacija ne postavlja medicinske dijagnoze niti zamjenjuje stručni savjet liječnika.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default BmiCalculator;
