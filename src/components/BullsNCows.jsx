import React, { useEffect, useRef } from "react";
import Swal from "sweetalert2";
import '../style/BullStyle.css';


export default function BullNCow() {
  let testmode = false;

  const gameIsRunning = useRef(false);
  const secretCodeArray = useRef([]);
  const userTries = useRef(0);
  const pastTries = useRef([]);
  const highScoresRef = useRef([]);

  const bnc = {
    zone: useRef(null),
    mainText: useRef(null),
    startButton: useRef(null),
    guessInput: useRef(null),
    guessBtn: useRef(null),
    surrenderBtn: useRef(null),
    attemptCount: useRef(null),
    pastList: useRef(null),
    recentGuess: useRef(null),
    bullsCount: useRef(null),
    cowsCount: useRef(null),
    highScores: useRef(null),
  };

  function setStatus(msg, type = "info") {
    Swal.fire({ text: msg, icon: type, toast: true, position: "top", timer: 2000, showConfirmButton: false });
  }

  function renderAttempts() {
    if (bnc.attemptCount.current) bnc.attemptCount.current.textContent = String(userTries.current);
  }

  function renderPast() {
    if (!bnc.pastList.current) return;
    bnc.pastList.current.innerHTML = "";
    pastTries.current
      .slice()
      .reverse()
      .forEach(({ guess, bulls, cows }) => {
        const li = document.createElement("li");
        li.textContent = `${guess} → Bulls ${bulls} | Cows ${cows}`;
        bnc.pastList.current.appendChild(li);
      });
  }

  function renderRecent(guess) {
    if (bnc.recentGuess.current) bnc.recentGuess.current.textContent = guess ?? "—";
  }

  function renderBC(b, c) {
    if (bnc.bullsCount.current) bnc.bullsCount.current.textContent = String(b);
    if (bnc.cowsCount.current) bnc.cowsCount.current.textContent = String(c);
  }

  function renderHighScores() {
    if (!bnc.highScores.current) return;
    bnc.highScores.current.innerHTML = "";
    highScoresRef.current.forEach((s) => {
      const li = document.createElement("li");
      li.textContent = `${s.name} — ${s.tries} tries (${s.date})`;
      bnc.highScores.current.appendChild(li);
    });
  }

  function enableInput(enabled) {
    if (bnc.guessInput.current) bnc.guessInput.current.disabled = !enabled;
    if (bnc.guessBtn.current) bnc.guessBtn.current.disabled = !enabled;
    if (enabled && bnc.guessInput.current) bnc.guessInput.current.focus();
  }

  function showZone() {
    if (bnc.zone.current) bnc.zone.current.style.display = "block";
    if (bnc.mainText.current) bnc.mainText.current.classList.add("hidden");
  }

  function hideZone() {
    if (bnc.zone.current) bnc.zone.current.style.display = "none";
    if (bnc.mainText.current) bnc.mainText.current.classList.remove("hidden");
  }

  function generateSecretCode() {
    const digits = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const code = [];
    for (let i = 0; i < 4; i++) {
      const idx = Math.floor(Math.random() * digits.length);
      code.push(digits[idx]);
      digits.splice(idx, 1);
    }
    return code;
  }

  function resetHUD() {
    userTries.current = 0;
    pastTries.current = [];
    renderAttempts();
    renderPast();
    renderRecent("—");
    renderBC(0, 0);
    if (bnc.guessInput.current) bnc.guessInput.current.value = "";
  }

  function startGame() {
    secretCodeArray.current = generateSecretCode();
    gameIsRunning.current = true;
    showZone();
    resetHUD();
    enableInput(true);
    if (testmode) setStatus(`(DEV) Secret: ${secretCodeArray.current.join("")}`, "warning");
  }

  function surrenderGame(silent = false) {
    if (!gameIsRunning.current) {
      hideZone();
      return;
    }
    gameIsRunning.current = false;
    enableInput(false);
    if (!silent) setStatus("You surrendered.", "error");
    hideZone();
  }

  function validateGuess(s) {
    if (!s) return { ok: false, reason: "empty" };
    s = s.trim();
    if (s.toLowerCase() === "sv_cheats") {
      setStatus(`Secret: ${secretCodeArray.current.join("")}`, "info");
      renderRecent("sv_cheats");
      return { ok: false, reason: "cheat" };
    }
    if (!/^\d{4}$/.test(s)) return { ok: false, reason: "format" };
    if (new Set(s).size !== 4) return { ok: false, reason: "unique" };
    return { ok: true, value: s };
  }

  function checkGuess(userString) {
    const userArray = userString.split("").map(Number);
    let bulls = 0,
      cows = 0;
    userArray.forEach((digit, idx) => {
      if (digit === secretCodeArray.current[idx]) bulls++;
      else if (secretCodeArray.current.includes(digit)) cows++;
    });
    return { bulls, cows, win: bulls === 4 };
  }

  const highScoreKey = "bcn_highscores_v1";

  async function loadHighScores() {
    try {
      const cached = JSON.parse(localStorage.getItem(highScoreKey));
      if (Array.isArray(cached)) return cached;
    } catch {}
    try {
      const res = await fetch("./json/highScores.json", { cache: "no-store" });
      const json = await res.json();
      const scores = Array.isArray(json.scores) ? json.scores : [];
      localStorage.setItem(highScoreKey, JSON.stringify(scores));
      return scores;
    } catch {
      const empty = [];
      localStorage.setItem(highScoreKey, JSON.stringify(empty));
      return empty;
    }
  }

  function saveHighScores(scores) {
    localStorage.setItem(highScoreKey, JSON.stringify(scores));
  }

  function addHighScore(name, tries) {
    const entry = { name: name && name.trim() ? name.trim() : "Player", tries, date: new Date().toISOString().slice(0, 10) };
    highScoresRef.current.push(entry);
    highScoresRef.current.sort((a, b) => a.tries - b.tries || (a.date < b.date ? 1 : -1));
    highScoresRef.current = highScoresRef.current.slice(0, 5);
    saveHighScores(highScoresRef.current);
    renderHighScores();
  }

  function submitGuess() {
    if (!gameIsRunning.current) {
      setStatus("Click Start first.", "warning");
      return;
    }
    const raw = bnc.guessInput.current ? bnc.guessInput.current.value : "";
    const val = validateGuess(raw);
    if (!val.ok) {
      if (val.reason === "format") setStatus("Enter exactly 4 digits.", "error");
      else if (val.reason === "unique") setStatus("Digits must be unique.", "error");
      else if (val.reason === "empty") setStatus("Type a guess first.", "warning");
      return;
    }
    const guess = val.value;
    const { bulls, cows, win } = checkGuess(guess);
    userTries.current++;
    renderAttempts();
    renderRecent(guess);
    renderBC(bulls, cows);
    pastTries.current.push({ guess, bulls, cows });
    renderPast();
    if (win) {
      gameIsRunning.current = false;
      enableInput(false);
      Swal.fire({
        icon: "success",
        title: "Victory!",
        html: `You guessed <b>${secretCodeArray.current.join("")}</b> in <b>${userTries.current}</b> tries.`,
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
        const playerName = value && value.trim() ? value.trim() : "Player";
        if (isConfirmed) addHighScore(playerName, userTries.current);
        surrenderGame(true);
      });
      return;
    } else {
      setStatus("Try again.", "info");
    }
    if (bnc.guessInput.current) {
      bnc.guessInput.current.value = "";
      bnc.guessInput.current.focus();
    }
  }

  useEffect(() => {
    (async function init() {
      highScoresRef.current = await loadHighScores();
      renderHighScores();
      enableInput(false);
      hideZone();
    })();
  }, []);

  return (
    <div>
      <div ref={bnc.mainText} className="mainText">Welcome</div>
      <div className="controls">
        <button id="startButton" ref={bnc.startButton} onClick={startGame}>Start</button>
        <button id="surrenderBtn" ref={bnc.surrenderBtn} onClick={() => surrenderGame(false)}>Surrender</button>
      </div>
      <div className="gamezone" ref={bnc.zone} style={{ display: "none" }}>
        <div className="hud">
          <div>Attempts: <span id="attemptCount" ref={bnc.attemptCount}>0</span></div>
          <div>Last: <span id="recentGuess" ref={bnc.recentGuess}>—</span></div>
          <div>Bulls: <span id="bullsCount" ref={bnc.bullsCount}>0</span></div>
          <div>Cows: <span id="cowsCount" ref={bnc.cowsCount}>0</span></div>
        </div>
        <div className="inputRow">
          <input className="submitedNumber" ref={bnc.guessInput} onKeyDown={(e) => e.key === "Enter" && submitGuess()} />
          <button id="guessBtn" ref={bnc.guessBtn} onClick={submitGuess}>Guess</button>
        </div>
        <ul id="pastList" ref={bnc.pastList} />
        <h3>High Scores</h3>
        <ul id="highScores" ref={bnc.highScores} />
      </div>
    </div>
  );
}
