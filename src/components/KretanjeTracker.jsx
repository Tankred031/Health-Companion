import { useEffect, useRef, useState } from "react";
import storageService from "../services/healthCompanionService";

function MovementTracker() {
  // --- KORISNIČKI PODACI ---
  // Težina iz kalkulatora (ako postoji), inače zadanih 103 kg
  const [userWeight] = useState(() => {
    const parsedWeight = parseFloat(storageService.get("userWeight"));
    return !Number.isNaN(parsedWeight) && parsedWeight > 0 ? parsedWeight : 103;
  });

  // --- SUSTAV 1: PRIMARNA DNEVNA AKTIVNOST ---
  const [baseActivity, setBaseActivity] = useState("office-pc");
  const [workHours, setWorkHours] = useState(8);

  // Određuje ulazi li gornji dio u ukupan zbroj
  const [includeBaseCalories, setIncludeBaseCalories] = useState(true);

  // --- SUSTAV 2: GPS KRETANJE ---
  const [isGpsTracking, setIsGpsTracking] = useState(false);
  const [steps, setSteps] = useState(0);
  const [distance, setDistance] = useState(0);
  const [gpsCalories, setGpsCalories] = useState(0);

  const [routeNote, setRouteNote] = useState(
    "Spremno za početak GPS praćenja. 📱"
  );

  const lastPositionRef = useRef(null);
  const distanceRef = useRef(0);
  const watchIdRef = useRef(null);

  // Izračun primarne aktivnosti (MET × masa × sati)
  const baseActivityMET = {
    "office-pc": { met: 1.3, hours: workHours },
    housework: { met: 3.8, hours: 0.5 },
    lawnmowing: { met: 6.5, hours: 20 / 60 },
  };
  const { met, hours } = baseActivityMET[baseActivity];
  const baseCalories = Math.floor(met * userWeight * hours);

  // Haversine formula za udaljenost između dvije GPS točke
  const calculateDistanceInKm = (lat1, lon1, lat2, lon2) => {
    const earthRadius = 6371;

    const latitudeDifference = ((lat2 - lat1) * Math.PI) / 180;
    const longitudeDifference = ((lon2 - lon1) * Math.PI) / 180;

    const calculation =
      Math.sin(latitudeDifference / 2) *
        Math.sin(latitudeDifference / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(longitudeDifference / 2) *
        Math.sin(longitudeDifference / 2);

    const angularDistance =
      2 * Math.atan2(Math.sqrt(calculation), Math.sqrt(1 - calculation));

    return earthRadius * angularDistance;
  };

  // GPS praćenje
  useEffect(() => {
    if (!isGpsTracking) {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }

      lastPositionRef.current = null;
      return undefined;
    }

    watchIdRef.current = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude, accuracy } = position.coords;

        // Ne prihvaćamo vrlo neprecizne GPS točke
        if (accuracy > 30) {
          setRouteNote(
            `GPS signal još nije dovoljno precizan. Preciznost: ${Math.round(
              accuracy
            )} m.`
          );
          return;
        }

        // Prva točka samo postavlja početnu poziciju
        if (!lastPositionRef.current) {
          lastPositionRef.current = {
            latitude,
            longitude,
          };

          setRouteNote("GPS je spreman. Praćenje kretanja je započelo. ✅");
          return;
        }

        const movedDistance = calculateDistanceInKm(
          lastPositionRef.current.latitude,
          lastPositionRef.current.longitude,
          latitude,
          longitude
        );

        /*
          Ignoriramo premale pomake jer su često samo GPS odstupanje.
          0.005 km = 5 metara.
        */
        if (movedDistance < 0.005) {
          return;
        }

        /*
          Ignoriramo i nelogično velike skokove između dva očitanja.
          Time sprječavamo da GPS pogreška doda stotine metara.
        */
        if (movedDistance > 0.5) {
          lastPositionRef.current = {
            latitude,
            longitude,
          };

          setRouteNote("GPS je zabilježio neprecizan skok i preskočio ga.");
          return;
        }

        // Zbroj čuvamo u refu pa sva stanja postavljamo izvan updater funkcije
        const updatedDistance = Number(
          (distanceRef.current + movedDistance).toFixed(3)
        );
        distanceRef.current = updatedDistance;

        setDistance(updatedDistance);
        setSteps(Math.floor((updatedDistance * 1000) / 0.75));
        setGpsCalories(Math.floor(0.75 * userWeight * updatedDistance));

        setRouteNote(
          `Praćenje je aktivno. Prijeđeno: ${updatedDistance.toFixed(
            2
          )} km. 🚶‍♂️`
        );

        lastPositionRef.current = {
          latitude,
          longitude,
        };
      },
      (error) => {
        console.error("GPS greška:", error);

        if (error.code === error.PERMISSION_DENIED) {
          setRouteNote(
            "Pristup lokaciji nije dopušten. Omogućite lokaciju u pregledniku."
          );
        } else if (error.code === error.POSITION_UNAVAILABLE) {
          setRouteNote("GPS lokacija trenutno nije dostupna.");
        } else if (error.code === error.TIMEOUT) {
          setRouteNote("GPS nije uspio pronaći lokaciju na vrijeme.");
        } else {
          setRouteNote("Dogodila se greška tijekom GPS praćenja.");
        }

        setIsGpsTracking(false);
      },
      {
        enableHighAccuracy: true,
        maximumAge: 0,
        timeout: 10000,
      }
    );

    return () => {
      if (watchIdRef.current !== null) {
        navigator.geolocation.clearWatch(watchIdRef.current);
        watchIdRef.current = null;
      }
    };
  }, [isGpsTracking, userWeight]);

  // Ukupna potrošnja
  const totalCalories =
    gpsCalories + (includeBaseCalories ? baseCalories : 0);

  const toggleGpsTracking = () => {
    if (!isGpsTracking && !("geolocation" in navigator)) {
      alert("Ovaj uređaj ne podržava GPS praćenje.");
      return;
    }

    if (!isGpsTracking) {
      setRouteNote("Tražim GPS signal... 🛰️");
    }

    setIsGpsTracking((previousValue) => !previousValue);
  };

  const resetAllData = () => {
    if (watchIdRef.current !== null) {
      navigator.geolocation.clearWatch(watchIdRef.current);
      watchIdRef.current = null;
    }

    setIsGpsTracking(false);
    distanceRef.current = 0;
    setSteps(0);
    setDistance(0);
    setGpsCalories(0);

    setWorkHours(8);
    setBaseActivity("office-pc");
    setIncludeBaseCalories(true);

    lastPositionRef.current = null;

    setRouteNote("Spremno za novo GPS praćenje. 📱");
  };

  return (
    <div className="card">
      <div className="card-content">
        <h3 className="title is-4 has-text-success">
          🏃‍♂️ Dnevni Tracker Aktivnosti & Kretanja
        </h3>

        <div className="notification is-light is-success py-2 px-3 mb-4">
          <p className="is-size-6">
            Povezana težina: <strong>{userWeight} kg</strong>
          </p>
        </div>

        {/* PRIMARNA AKTIVNOST */}
        <div className="box has-background-light p-4 mb-4">
          <h4 className="title is-5 has-text-grey-dark mb-3">
            🛠️ Korak 1: Primarna dnevna aktivnost
          </h4>

          <div className="field mb-4">
            <div className="control">
              <div className="select is-fullwidth is-medium">
                <select
                  value={baseActivity}
                  onChange={(event) =>
                    setBaseActivity(event.target.value)
                  }
                  style={{
                    backgroundColor: "#e9ecef",
                    borderColor: "#ced4da",
                    color: "#212529",
                    fontWeight: "600",
                  }}
                >
                  <option value="office-pc">
                    Rad na poslu / Računalo
                  </option>

                  <option value="housework">
                    Čišćenje kuće (30 min)
                  </option>

                  <option value="lawnmowing">
                    Košenje trave (20 min)
                  </option>
                </select>
              </div>
            </div>
          </div>

          <div className="columns is-mobile is-vcentered">
            <div className="column is-7">
              {baseActivity === "office-pc" ? (
                <div className="field is-horizontal is-align-items-center">
                  <label
                    className="label is-size-6 mb-0 mr-3 has-text-dark"
                    style={{ whiteSpace: "nowrap" }}
                  >
                    Odradite sati:
                  </label>

                  <div
                    className="control"
                    style={{ maxWidth: "80px" }}
                  >
                    <input
                      className="input is-medium has-text-centered has-text-weight-bold has-text-dark"
                      type="number"
                      min="0"
                      step="0.5"
                      value={workHours}
                      onChange={(event) =>
                        setWorkHours(
                          parseFloat(event.target.value) || 0
                        )
                      }
                      style={{
                        color: "#212529",
                        backgroundColor: "#ffffff",
                      }}
                    />
                  </div>
                </div>
              ) : (
                <p className="is-size-6 has-text-grey-dark has-text-weight-semibold">
                  Aktivnost odabrana
                </p>
              )}
            </div>

            <div className="column is-5 has-text-right">
              <p className="heading mb-0 has-text-grey-dark">
                Potrošnja aktivnosti
              </p>

              <p className="title is-4 has-text-dark">
                {baseCalories} kcal
              </p>
            </div>
          </div>

          {/* CHECKBOX ZA UKLJUČIVANJE U UKUPAN ZBROJ */}
          <div
            className="notification is-white mt-3 mb-0 py-3 px-3"
            style={{ border: "1px solid #dbdbdb" }}
          >
            <label
              className="checkbox has-text-dark has-text-weight-semibold"
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
              }}
            >
              <input
                type="checkbox"
                checked={includeBaseCalories}
                onChange={(event) =>
                  setIncludeBaseCalories(event.target.checked)
                }
                style={{
                  width: "20px",
                  height: "20px",
                  cursor: "pointer",
                }}
              />

              Uključi primarnu aktivnost u ukupnu potrošnju
            </label>

            <p className="is-size-7 has-text-grey mt-2">
              {includeBaseCalories
                ? "Primarna aktivnost i GPS kretanje zbrajaju se zajedno."
                : "Primarna aktivnost se prikazuje, ali ne ulazi u ukupan zbroj."}
            </p>
          </div>
        </div>

        {/* GPS KRETANJE */}
        <div
          className="box p-4 mb-4 has-background-dark"
          style={{ borderLeft: "4px solid #48c78e" }}
        >
          <h4 className="title is-5 has-text-white mb-2">
            🛰️ Korak 2: GPS kretanje
          </h4>

          <div
            className="notification is-dark py-2 px-3 mb-3"
            style={{ background: "#1c1f2b" }}
          >
            <p className="is-size-7 has-text-weight-bold has-text-success">
              {routeNote}
            </p>
          </div>

          <div className="columns is-mobile has-text-centered mb-3">
            <div className="column">
              <p className="heading mb-1 has-text-grey-light">
                Udaljenost
              </p>

              <p className="title is-5 has-text-white">
                {distance.toFixed(2)} km
              </p>
            </div>

            <div className="column">
              <p className="heading mb-1 has-text-grey-light">
                Koraci
              </p>

              <p className="title is-5 has-text-white">
                {steps}
              </p>
            </div>

            <div className="column">
              <p className="heading mb-1 has-text-danger-light">
                Kretanje
              </p>

              <p className="title is-5 has-text-danger has-text-weight-bold">
                {gpsCalories} kcal
              </p>
            </div>
          </div>

          <button
            className={`button is-medium is-fullwidth ${
              isGpsTracking ? "is-danger" : "is-success"
            }`}
            onClick={toggleGpsTracking}
          >
            {isGpsTracking
              ? "Zaustavi GPS praćenje"
              : "Pokreni GPS praćenje"}
          </button>
        </div>

        {/* UKUPAN ZBROJ */}
        <div className="box has-background-dark p-3 has-text-centered mb-4">
          <p className="heading has-text-grey-light">
            📊 UKUPNA ENERGETSKA POTROŠNJA
          </p>

          <p className="title is-3 has-text-warning mt-1">
            {totalCalories}{" "}
            <span className="is-size-5">kcal</span>
          </p>

          <p className="is-size-7 has-text-grey-light is-italic mt-1">
            Primarna aktivnost:{" "}
            {includeBaseCalories
              ? `${baseCalories} kcal`
              : "nije uključena"}
            {" + "}
            GPS kretanje: {gpsCalories} kcal
          </p>
        </div>

        {/* DONJI GUMBI */}
        <div className="columns is-mobile is-variable is-2">
          <div className="column is-half">
            <button
              className={`button is-medium is-fullwidth ${
                isGpsTracking ? "is-danger" : "is-success"
              }`}
              onClick={toggleGpsTracking}
              style={{
                fontWeight: "600",
                minHeight: "40px",
              }}
            >
              {isGpsTracking ? "Zaustavi GPS" : "Uključi GPS"}
            </button>
          </div>

          <div className="column is-half">
            <button
              className="button is-medium is-light is-fullwidth"
              onClick={resetAllData}
              style={{
                fontWeight: "600",
                minHeight: "40px",
              }}
            >
              Resetiraj dan 🔄
            </button>
          </div>
        </div>

        <div
          className="mt-4 pt-2"
          style={{ borderTop: "1px dashed #ccc" }}
        >
          <p className="is-size-7 has-text-grey has-text-centered is-italic">
            * Napomena: Izračun energetskog utroška izražen u
            kilokalorijama temelji se na MET vrijednostima, prijeđenoj
            udaljenosti i unesenoj tjelesnoj masi. Rezultati su
            informativni.
          </p>
        </div>
      </div>
    </div>
  );
}

export default MovementTracker;