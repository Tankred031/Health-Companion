import React, { useState, useEffect } from 'react';

function PrirodniUvjeti() {
  // Automatski hvatamo trenutni mjesec u godini (0 = Siječanj, 11 = Prosinac)
  const currentMonth = new Date().getMonth();
  
  // Stanja za sezonske podatke
  const [season, setSeason] = useState('');
  const [waterRecommendation, setWaterRecommendation] = useState('');
  const [vitaminDRecommendation, setVitaminDRecommendation] = useState('');
  const [seasonClass, setSeasonClass] = useState('is-info');

  useEffect(() => {
    // Logika kalendara: Travanj (3) do Rujan (8) je ljetni režim, ostalo zimski
    if (currentMonth >= 3 && currentMonth <= 8) {
      setSeason('Ljetno razdoblje ☀️');
      setSeasonClass('is-warning is-light');
      setWaterRecommendation(
        'Zbog visokih temperatura i pojačanog znojenja, tijelo ubrzano gubi tekućinu. Preporučuje se povećan unos vode.'
      );
      setVitaminDRecommendation(
        'Izloženost suncu je visoka. Tijelo prirodno sintetizira Vitamin D. Preporučuje se obratiti pozornost na adekvatan unos, osim ako provodite cijeli dan u zatvorenom prostoru. (Napomena: Doza će se kasnije preciznije prilagoditi vašem BMI-ju).'
      );
    } else {
      setSeason('Zimsko razdoblje ❄️');
      setSeasonClass('is-info is-light');
      setWaterRecommendation(
        'Zimi rjeđe osjećamo žeđ, ali tijelo i dalje gubi vodu disanjem i kroz grijane prostore. Preporučuje se prilagođen unos vode.'
      );
      setVitaminDRecommendation(
        'Snažno smanjena sunčeva svjetlost. Sinteza kroz kožu je minimalna. Preporučuje se razmatranje suplementacije za održavanje imuniteta i zdravlja kostiju. (Napomena: Osobe s povišenim BMI-jem u pravilu imaju drugačije potrebe jer se Vitamin D zadržava u masnom tkivu).'
      );
    }
  }, [currentMonth]);

  return (
    <div className="card">
      <div className="card-content">
        <h3 className="title is-4 has-text-success">Prirodni Uvjeti & Sezonski Vodič</h3>

        {/* Indikator godišnjeg doba na temelju kalendara */}
        <div className={`notification ${seasonClass} has-text-centered`}>
          <p className="is-size-5">
            Kalendarski detektirano: <strong>{season}</strong>
          </p>
        </div>

        {/* Preporuka za vodu */}
        <div className="box">
          <h4 className="title is-5 has-text-link mb-2">💧 Hidratacija (Unos vode)</h4>
          <p className="is-size-6">{waterRecommendation}</p>
          <div className="message is-small is-link mt-3">
            <div className="message-body">
              <strong>Savjet:</strong> Nemojte čekati osjećaj žeđi. Pijte vodu u malim gutljajima tijekom cijelog dana.
            </div>
          </div>
        </div>

        {/* Preporuka za Vitamin D */}
        <div className="box">
          <h4 className="title is-5 has-text-warning mb-2">☀️ Vitamin D3 Preporuka</h4>
          <p className="is-size-6">{vitaminDRecommendation}</p>
          
          {/* Najava buduće veze s BMI-jem */}
          <div className="notification is-warning is-light mt-3 is-size-7">
            <p>
              <strong>🧬 BMI najava:</strong> Budući da je Vitamin D topiv u mastima, kod povišene tjelesne težine (BMI &gt; 25) tkiva ga brže "upijaju", pa je u zimskim mjesecima često potrebna prilagodba doze. Ovu funkciju ćemo automatizirati čim uneseš podatke u BMI kalkulator!
            </p>
          </div>
        </div>

      </div>
    </div>
  );
}

export default PrirodniUvjeti;
