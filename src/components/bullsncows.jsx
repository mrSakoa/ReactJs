import { useEffect, useRef, useState } from "react";
import Swal from "sweetalert2";
import "../style/app.css";

export default function BullNCow() {
  const [gameIsRunning, setGameIsRunning] = useState(false);
  const [secret, setSecret] = useState([]);
  const [userTries, setUserTries] = useState(0);
  const [pastTries, setPastTries] = useState([]);
  const [highScores, setHighScores] = useState([]);
  const [recentGuess, setRecentGuess] = useState("—");
  const [bullsCount, setBullsCount] = useState(0);
  const [cowsCount, setCowsCount] = useState(0);
  const inputRef = useRef(null);

  const TESTMODE = false;
  const HS_KEY = "bcn_highscores_v1";

  function setStatus(msg, type = "info") {
    Swal.fire({
      text: msg,
      icon: type,
      toast: true,
      position: "top",
      timer: 2000,
      showConfirmButton: false,
    });
  }

  function generateSecretCode() {
    const d = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const code = [];
    for (let i = 0; i < 4; i++) {
      const idx = Math.floor(Math.random() * d.length);
      code.push(d[idx]);
      d.splice(idx, 1);
    }
    return code;
  }

  function resetHUD() {
    setUserTries(0);
    setPastTries([]);
    setRecentGuess("—");
    setBullsCount(0);
    setCowsCount(0);
    if (inputRef.current) inputRef.current.value = "";
  }
  //---------------- buttons ----------------
  function startGame() {
    const code = generateSecretCode();
    setSecret(code);
    setGameIsRunning(true);
    resetHUD();
    setTimeout(() => inputRef.current?.focus(), 0);
    if (TESTMODE) setStatus(`(DEV) Secret: ${code.join("")}`, "warning");
  }

  function surrenderGame(silent = false) {
    if (!gameIsRunning) return;
    setGameIsRunning(false);
    if (!silent) setStatus("You surrendered.", "error");
  }

  function validateGuess(s) {
    if (!s) return { ok: false, reason: "empty" };
    s = s.trim();
    if (s.toLowerCase() === "sv_cheats") {
      setStatus(`Secret: ${secret.join("")}`, "info");
      setRecentGuess("sv_cheats");
      return { ok: false, reason: "cheat" };
    }
    if (!/^\d{4}$/.test(s)) return { ok: false, reason: "format" };
    if (new Set(s).size !== 4) return { ok: false, reason: "unique" };
    return { ok: true, value: s };
  }

  function checkGuess(guessStr) {
    const userArray = guessStr.split("").map(Number);
    let b = 0, c = 0;
    userArray.forEach((digit, idx) => {
      if (digit === secret[idx]) b++;
      else if (secret.includes(digit)) c++;
    });
    return { bulls: b, cows: c, win: b === 4 };
  }

  function saveHighScores(scores) {
    localStorage.setItem(HS_KEY, JSON.stringify(scores));
    // update the higscore tab
    window.dispatchEvent(new Event("highscores:update"));
  }

  function addHighScore(name, tries) {
    const entry = {
      name: name?.trim() ? name.trim() : "Player",
      tries,
      date: new Date().toISOString().slice(0, 10),
    };
    const updated = [...highScores, entry]
      .sort((a, b) => a.tries - b.tries || (a.date < b.date ? 1 : -1))
      .slice(0, 5);
    setHighScores(updated);
    saveHighScores(updated);
  }

  async function submitGuess() {
    if (!gameIsRunning) {
      setStatus("Click Start first.", "warning");
      return;
    }
    const raw = inputRef.current?.value ?? "";
    const val = validateGuess(raw);
    if (!val.ok) {
      if (val.reason === "format") setStatus("Enter exactly 4 digits.", "error");
      else if (val.reason === "unique") setStatus("Digits must be unique.", "error");
      else if (val.reason === "empty") setStatus("Type a guess first.", "warning");
      return;
    }

    const guess = val.value;
    const { bulls, cows, win } = checkGuess(guess);

    setUserTries(t => t + 1);
    setRecentGuess(guess);
    setBullsCount(bulls);
    setCowsCount(cows);
    setPastTries(prev => [...prev, { guess, bulls, cows }]);

    // ---------- win // surrender ----------
    if (win) {
      setGameIsRunning(false);
      Swal.fire({
        icon: "success",
        title: "Victory!",
        html: `You guessed <b>${secret.join("")}</b> in <b>${(userTries + 1)}</b> tries.`,
        input: "text",
        inputLabel: "Your name for the High Score",
        inputPlaceholder: "Player",
        inputAttributes: { maxlength: 5, autocapitalize: "words", autocorrect: "off" },
        showCancelButton: true,
        confirmButtonText: "Save & Exit",
        cancelButtonText: "Skip & Exit",
        allowOutsideClick: false,
        allowEscapeKey: false,
        allowEnterKey: false,
      }).then(({ isConfirmed, value }) => {
        const playerName = value?.trim() ? value.trim() : "Player";
        if (isConfirmed) addHighScore(playerName, userTries + 1);
        surrenderGame(true);
      });
    } else {
      setStatus("Try again.", "info");
      if (inputRef.current) {
        inputRef.current.value = "";
        inputRef.current.focus();
      }
    }
  }


  useEffect(() => {
    try {
      const cached = JSON.parse(localStorage.getItem(HS_KEY));
      if (Array.isArray(cached)) {
        setHighScores(cached);
        return;
      }
    } catch { }
    localStorage.setItem(HS_KEY, JSON.stringify([]));
  }, []);

  return (
    <div className="gamezone">
      {!gameIsRunning ? (
        <>
          <div className="mainText">
            <h2 style={{ textAlign: "center" }}>Bulls & cows</h2>
            <p style={{ textAlign: "center" }}>
              Press Start to begin a new game.
            </p>
          </div>

          <div className="buttonContainer" style={{ marginTop: 12 }}>
            <button id="startButton" onClick={startGame}>Start</button>
          </div>
        </>
      ) : (
        <>
          <h2 style={{ justifyContent: "center", textAlign: "center" }}>Bulls & cows</h2>

          <div className="gamehud">
            <div className="attempts">
              <h3>Attempts:</h3>
              <p id="attemptCount">{userTries}</p>
            </div>

            <div className="pastNumbers">
              <h3>Old tries</h3>
              <ul id="pastList">
                {[...pastTries].slice().reverse().map((t, i) => (
                  <li key={`${t.guess}-${t.bulls}-${t.cows}-${i}`}>
                    {t.guess} → Bulls {t.bulls} | Cows {t.cows}
                  </li>
                ))}
              </ul>
            </div>

            <div className="recentNumber">
              <h3>Last attempt</h3>
              <p id="recentGuess">{recentGuess}</p>
            </div>

            <div className="submitBox">
              <input
                className="submitedNumber"
                id="guessInput"
                type="tel"
                placeholder="write your number"
                autoComplete="off"
                ref={inputRef}
                onKeyDown={(e) => { if (e.key === "Enter") submitGuess(); }}
              />
            </div>

            <div className="bulls">
              <h2>Bulls</h2>
              <p id="bullsCount">{bullsCount}</p>
            </div>

            <div className="cows">
              <h2>Cows</h2>
              <p id="cowsCount">{cowsCount}</p>
            </div>

            <div className="highScore">
              <h3>High Score</h3>
              <ol id="highScores">
                {highScores.map((s, i) => (
                  <li key={`${s.name}-${s.date}-${s.tries}-${i}`}>
                    {s.name} — {s.tries} tries ({s.date})
                  </li>
                ))}
              </ol>
            </div>
          </div>

          <div className="buttonContainer">
            <button id="guessBtn" onClick={submitGuess}>Guess</button>
            <button id="surrenderBtn" onClick={() => surrenderGame(false)}>Surrender</button>
          </div>
        </>
      )}
    </div>
  );
}
