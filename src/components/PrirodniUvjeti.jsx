import React, { useState, useEffect } from 'react';

function PrirodniUvjeti() {
  const currentMonth = new Date().getMonth();
  
  const [season, setSeason] = useState('');
  const [waterText, setWaterText] = useState('');
  const [waterAmount, setWaterAmount] = useState('');
  const [vitaminDText, setVitaminDText] = useState('');
  const [vitaminDAmount, setVitaminDAmount] = useState('');
  const [seasonClass, setSeasonClass] = useState('is-info');

  useEffect(() => {
    const savedWeight = localStorage.getItem('userWeight');
    const isSummer = currentMonth >= 3 && currentMonth <= 8;

        if (isSummer) {
      setSeason('Ljetno razdoblje ☀️');
      setSeasonClass('is-warning is-light');
      
      if (savedWeight) {
        const liters = ((savedWeight * 45) / 1000).toFixed(1);
        setWaterAmount(`${liters} Litara dnevno`);
        setWaterText(`Zbog ljetnih vrućina i pojačanog znojenja, tvoja formula unosa je podignuta na 45 ml po kilogramu za tvojih ${savedWeight} kg.`);
      } else {
        setWaterAmount('Oko 2.5 - 3.0 Litre');
        setWaterText('Ljeti je potreban pojačan unos vode. Unesi podatke u BMI kalkulator za točan izračun prema tvojoj masi.');
      }

      // POPRAVLJENO: Strogo samo 400 IJ
      setVitaminDAmount('400 IJ — Ljetni minimum');
      setVitaminDText('Koža ljeti sama stvara Vitamin D na suncu, stoga je dodatni unos spušten na preporučeni zdravstveni minimum.');
      
    } else {
      setSeason('Zimsko razdoblje ❄️');
      setSeasonClass('is-info is-light');
      
      if (savedWeight) {
        const liters = ((savedWeight * 35) / 1000).toFixed(1);
        setWaterAmount(`${liters} Litara dnevno`);
        setWaterText(`Zimi rjeđe osjećamo žeđ, ali tijelo i dalje gubi tekućinu kroz grijane prostore. Tvoja zimska formula iznosi 35 ml po kilogramu mase.`);
      } else {
        setWaterAmount('Oko 2.0 Litre');
        setWaterText('Zimska opća preporuka za bazičnu hidrataciju odraslih osoba.');
      }

      if (savedWeight) {
        let optimalD_IU = Math.round(savedWeight * 50);
        if (optimalD_IU < 1000) optimalD_IU = 1000;
        if (optimalD_IU > 5000) optimalD_IU = 5000;

        // POPRAVLJENO: Maknuti mikrogrami, ostaje samo IJ
        setVitaminDAmount(`${optimalD_IU} IJ — Prilagođeno tvojoj težini`);
        setVitaminDText(`Zimi je sunce preslabo. S obzirom na tvojih ${savedWeight} kg mase, ovo je optimalna zimska doza za tvoja tkiva.`);
      } else {
        // POPRAVLJENO: Maknuti mikrogrami
        setVitaminDAmount('800 IJ — Standardna doza');
        setVitaminDText('Zimska opća preporuka. Za personalizirani izračun unesi podatke u BMI Kalkulator.');
      }
    }

  }, [currentMonth]);

  return (
    <div className="card">
      <div className="card-content">
        <h3 className="title is-4 has-text-success">Prirodni Uvjeti & Sezonski Vodič</h3>

        <div className={`notification ${seasonClass} has-text-centered`}>
          <p className="is-size-5">Kalendarski detektirano: <strong>{season}</strong></p>
        </div>

        {/* Voda */}
        <div className="box">
          <h4 className="title is-5 has-text-link mb-2">💧 Hidratacija (Unos vode)</h4>
          <div className="notification is-info is-light py-2 px-3 mb-2">
            <p className="is-size-5 map-water-text has-text-link-dark has-text-weight-bold">{waterAmount}</p>
          </div>
          <p className="is-size-6">{waterText}</p>
        </div>

        {/* Vitamin D (Sada u potpunosti usklađen s kalkulatorom — samo IJ) */}
        <div className="box has-background-dark">
          <h4 className="title is-5 has-text-warning mb-2">☀️ Personalizirana Vitamin D3 Preporuka</h4>
          <div className="notification is-dark py-2 px-3 mb-2" style={{ background: '#1c1f2b' }}>
            <p className="is-size-5 has-text-warning has-text-weight-bold">{vitaminDAmount}</p>
          </div>
          <p className="is-size-6 has-text-white">{vitaminDText}</p>
          
          <div className="mt-4 pt-3" style={{ borderTop: '1px dashed #555' }}>
            <p className="is-size-7 has-text-grey-light is-italic">
              <strong>Napomena:</strong> Prikazane preporuke za dnevni unos tekućine i dodataka prehrani izražene u internacionalnim jedinicama (IJ) služe isključivo u informativne svrhe i ne predstavljaju medicinski savjet ili terapiju.
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default PrirodniUvjeti;
