import './App.css'

function App() {


  return (
    <section className="section">
      <div className="container">
        {/* Bulma koristi klase za boju teksta poput has-text-primary */}
        <h1 className="title has-text-primary has-text-centered">
          Zdravstveni Pratitelj 🩺
        </h1>
        <p className="subtitle has-text-centered">
          Aplikacija uspješno koristi Vite + React + Bulma!
        </p>

        {/* Test Bulma gumba */}
        <div className="buttons is-centered">
          <button className="button is-success is-rounded">
            Dodaj aktivnosti
          </button>
          <button className="button is-link is-light">
            Pregledaj grafove
          </button>
        </div>
      </div>
    </section>
  );
}

export default App
