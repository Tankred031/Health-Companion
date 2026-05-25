import React from 'react';
import { Link } from 'react-router-dom';
import { RouteNames } from '../../constants'; 

function Home() {
  return (
    <div>
      {/* Pozdravna obavijest */}
      <div className='notification is-info is-light'>
        <h2 className='title is-4'>Dobrodošli u svoj razvojni dnevnik 🩺</h2>
        <p>Tvoj osobni digitalni suputnik za zdravlje i praćenje prirodnih ritmova. Odaberi alat i kreni!</p>
      </div>

      {/* Grid s brzim kraticama do alata aplikacije */}
      <div className="columns is-multiline mt-4">
        
        <div className="column is-half">
          <div className="box has-text-centered">
            <h3 className="title is-5 mb-2">📊 BMI Kalkulator</h3>
            <p className="is-size-6 mb-3 has-text-grey">Izračunaj indeks mase i optimalne doze vitamina prema težini.</p>
            <Link to={RouteNames.KALKULATORI} className="button is-link is-light is-small">Otvori kalkulator &rarr;</Link>
          </div>
        </div>

        <div className="column is-half">
          <div className="box has-text-centered">
            <h3 className="title is-5 mb-2">🌤️ Prirodni uvjeti</h3>
            <p className="is-size-6 mb-3 has-text-grey">Sezonski vodič za unos vode i personalizirane potrebe za Vitaminom D3.</p>
            <Link to={RouteNames.PRIRODA} className="button is-success is-light is-small">Pogledaj uvjete &rarr;</Link>
          </div>
        </div>

        <div className="column is-half">
          <div className="box has-text-centered">
            <h3 className="title is-5 mb-2">🌙 Mjesečeve mijene</h3>
            <p className="is-size-6 mb-3 has-text-grey">Prati položaj u zodijaku i prilagodi prehranu trenutnoj fazi Mjeseca.</p>
            <Link to={RouteNames.MJESEC} className="button is-primary is-light is-small">Astro prognoza &rarr;</Link>
          </div>
        </div>

        <div className="column is-half">
          <div className="box has-text-centered">
            <h3 className="title is-5 mb-2">🏃‍♂️ Tracker Kretanja</h3>
            <p className="is-size-6 mb-3 has-text-grey">Uključi stvarni mobilni GPS i prati potrošnju kalorija duž osječke Promenade.</p>
            <Link to={RouteNames.KRETANJE} className="button is-info is-light is-small">Pokreni GPS &rarr;</Link>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Home;
