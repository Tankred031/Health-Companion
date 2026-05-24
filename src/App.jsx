import React from 'react';
import Navbar from './components/Navbar';
import BmiKalkulator from './components/BmiKalkulator'

function App() {


  return (
    <div>
      {/*Navbar*/}
      <Navbar />

      {/*Ovdje idu komponente*/}
      <section className='section'>
        <div className='container'>
          <div className='notification is-info is-light'>
            <h2 className='title is-4'>Dobrodošli u svoj razvojni dnevnik</h2>
            <p>Navbar iznad je tvoja prva samostalna komponeta. Polako gradimo dalje.</p>
          </div>
          {/*BMI kalkulator*/}
          <div className='columns is-centered'>
            <div className='column is-half'>
              <BmiKalkulator />
            </div>
          </div>

        </div>
      </section>
    </div>
  );
}

export default App
