import React, { useEffect, useState } from "react";

function WeightKcalTracker() {

  const [weight, setWeight] = useState("");
  const [kcal, setKcal] = useState("");
  const [entries, setEntries] = useState([]);

  // učitaj spremljene podatke
  useEffect(() => {
    const saved = localStorage.getItem("weightKcalHistory");

    if (saved) {
      setEntries(JSON.parse(saved));
    }
  }, []);

  // spremi u localStorage
  useEffect(() => {
    localStorage.setItem("weightKcalHistory", JSON.stringify(entries));
  }, [entries]);

  const addEntry = () => {

    if (!weight || !kcal) {
      alert("Unesi težinu i kcal!");
      return;
    }

    const newEntry = {
      id: Date.now(),
      date: new Date().toLocaleDateString("hr-HR"),
      weight: parseFloat(weight),
      kcal: parseInt(kcal)
    };

    setEntries([newEntry, ...entries]);

    setWeight("");
    setKcal("");
  };

  const deleteEntry = (id) => {
    setEntries(entries.filter((e) => e.id !== id));
  };

  // statistika
  const averageKcal =
    entries.length > 0
      ? Math.round(
          entries.reduce((sum, e) => sum + e.kcal, 0) / entries.length
        )
      : 0;

  const weightDifference =
    entries.length >= 2
      ? (
          entries[0].weight -
          entries[entries.length - 1].weight
        ).toFixed(1)
      : 0;

  return (
    <div className="card">
      <div className="card-content">

        <h3 className="title is-4 has-text-primary">
          📉 Tracker težine i kcal
        </h3>

        {/* INPUTI */}
        <div className="columns">

          <div className="column">
            <div className="field">
              <label className="label">Težina (kg)</label>
              <div className="control">
                <input
                  className="input"
                  type="number"
                  placeholder="npr. 103"
                  value={weight}
                  onChange={(e) => setWeight(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="column">
            <div className="field">
              <label className="label">Unos kcal</label>
              <div className="control">
                <input
                  className="input"
                  type="number"
                  placeholder="npr. 2400"
                  value={kcal}
                  onChange={(e) => setKcal(e.target.value)}
                />
              </div>
            </div>
          </div>

        </div>

        <button
          className="button is-success is-fullwidth mb-5"
          onClick={addEntry}
        >
          Dodaj zapis ➕
        </button>

        {/* STATISTIKA */}
        <div className="columns is-mobile mb-5">

          <div className="column">
            <div className="box has-background-dark has-text-centered">
              <p className="heading has-text-grey-light">
                Prosjek kcal
              </p>

              <p className="title is-4 has-text-warning">
                {averageKcal}
              </p>
            </div>
          </div>

          <div className="column">
            <div className="box has-background-link has-text-centered">
              <p className="heading has-text-white">
                Promjena težine
              </p>

              <p className="title is-4 has-text-white">
                {weightDifference} kg
              </p>
            </div>
          </div>

        </div>

        {/* POVIJEST */}
        <h4 className="title is-5">
          📅 Povijest unosa
        </h4>

        {entries.length === 0 ? (
          <div className="notification is-light">
            Nema podataka još.
          </div>
        ) : (
          entries.map((entry) => (
            <div
              key={entry.id}
              className="box mb-3"
            >
              <div className="columns is-mobile is-vcentered">

                <div className="column">
                  <p className="has-text-weight-bold">
                    {entry.date}
                  </p>

                  <p>
                    ⚖️ {entry.weight} kg
                  </p>

                  <p>
                    🔥 {entry.kcal} kcal
                  </p>
                </div>

                <div className="column is-narrow">
                  <button
                    className="button is-danger is-small"
                    onClick={() => deleteEntry(entry.id)}
                  >
                    Obriši
                  </button>
                </div>

              </div>
            </div>
          ))
        )}

      </div>
    </div>
  );
}

export default WeightKcalTracker;