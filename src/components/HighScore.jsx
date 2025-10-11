import { useEffect, useState } from "react";

const HS_KEY = "bcn_highscores_v1";

export default function HighScore() {
  const [scores, setScores] = useState([]);

  function readScores() {
    try {
      const raw = localStorage.getItem(HS_KEY);
      const arr = JSON.parse(raw);
      if (Array.isArray(arr)) setScores(arr);
      else setScores([]);
    } catch {
      setScores([]);
    }
  }

  useEffect(() => {
    readScores();

    // update when BullNCow.jsx + localStorage changes
    const onUpdate = () => readScores();
    window.addEventListener("highscores:update", onUpdate);
    const onStorage = (e) => {
      if (e.key === HS_KEY) readScores();
    };
    window.addEventListener("storage", onStorage);

    return () => {
      window.removeEventListener("highscores:update", onUpdate);
      window.removeEventListener("storage", onStorage);
    };
  }, []);

  const hasScores = scores.length > 0;

  return (
    <div style={{ maxWidth: 560, margin: "40px auto", padding: 16 }}>
      <h2 style={{ textAlign: "center" }}>High Scores</h2>

      {!hasScores ? (
        <p style={{ textAlign: "center", opacity: 0.8 }}>
          No scores yet. Play a game to set one!
        </p>
      ) : (
        <ol>
          {scores.map((s, i) => (
            <li key={`${s.name}-${s.date}-${s.tries}-${i}`}>
              <strong>{s.name}</strong> — {s.tries} tries <span style={{ opacity: 0.7 }}>({s.date})</span>
            </li>
          ))}
        </ol>
      )}
    </div>
  );
}
