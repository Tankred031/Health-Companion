import React from 'react';
import { Link } from 'react-router-dom';
import { RouteNames } from '../../constants'; 

function Home() {
  return (
    <div>
      {/* Pozdravna obavijest */}
      <div className='notification is-info is-light'>
        <h2 className='title is-4'>Dobrodošli u svoj razvojni dnevnik 🩺</h2>
        <p>Tvoj osobni digitalni pomoćnik za zdravlje i praćenje prirodnih ritmova. Odaberi karticu ispod i kreni!</p>
      </div>

      {/* Grid s karticama koje reagiraju na dodir i hover */}
      <div className="columns is-multiline mt-4">
        
        {/* 1. KARTICA: BMI Kalkulator */}
        <div className="column is-half">
          <Link to={RouteNames.KALKULATORI} style={{ textDecoration: 'none', display: 'block' }}>
            <div 
              className="box has-text-centered p-5 custom-hover-card"
              style={{ transition: 'all 0.3s ease', cursor: 'pointer', minHeight: '160px' }}
            >
              <h3 className="title is-5 mb-2 has-text-link">BMI Kalkulator</h3>
              <p className="is-size-6 has-text-grey-dark">Izračunaj indeks mase i optimalne doze vitamina prema težini.</p>
            </div>
          </Link>
        </div>

        {/* 2. KARTICA: Prirodni uvjeti */}
        <div className="column is-half">
          <Link to={RouteNames.PRIRODA} style={{ textDecoration: 'none', display: 'block' }}>
            <div 
              className="box has-text-centered p-5 custom-hover-card"
              style={{ transition: 'all 0.3s ease', cursor: 'pointer', minHeight: '160px' }}
            >
              <h3 className="title is-5 mb-2 has-text-success">Prirodni uvjeti</h3>
              <p className="is-size-6 has-text-grey-dark">Sezonski vodič za unos vode i personalizirane potrebe za Vitaminom D3.</p>
            </div>
          </Link>
        </div>

        {/* 3. KARTICA: Mjesečeve mijene */}
        <div className="column is-half">
          <Link to={RouteNames.MJESEC} style={{ textDecoration: 'none', display: 'block' }}>
            <div 
              className="box has-text-centered p-5 custom-hover-card"
              style={{ transition: 'all 0.3s ease', cursor: 'pointer', minHeight: '160px' }}
            >
              <h3 className="title is-5 mb-2 has-text-primary">Mjesečeve mijene</h3>
              <p className="is-size-6 has-text-grey-dark">Prati položaj u zodijaku i prilagodi prehranu trenutnoj fazi Mjeseca.</p>
            </div>
          </Link>
        </div>

        {/* 4. KARTICA: Tracker Kretanja */}
        <div className="column is-half">
          <Link to={RouteNames.KRETANJE} style={{ textDecoration: 'none', display: 'block' }}>
            <div 
              className="box has-text-centered p-5 custom-hover-card"
              style={{ transition: 'all 0.3s ease', cursor: 'pointer', minHeight: '160px' }}
            >
              <h3 className="title is-5 mb-2 has-text-info">Tracker Kretanja</h3>
              <p className="is-size-6 has-text-grey-dark">Uključi stvarni mobilni GPS i prati potrošnju kalorija duž osječke Promenade.</p>
            </div>
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Home;
