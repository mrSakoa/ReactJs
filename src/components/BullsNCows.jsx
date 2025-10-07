function BullsNCows() {
  return (
    <>
      <div>
        <h1>Tutorial for Bulls & cows</h1>
        <h2>Guess the 4-digit non repeateable number, from 0 to 9. After each guess, you'll receive feedback in the form of "Bulls" and "Cows". A "Bull" indicates a correct digit in the correct position, while a "Cow" indicates a correct digit in the wrong position. Press Click to Start Good luck! </h2>
        <button className="startButton" id="startButton">Click to Start</button>
      </div>
      <style>{`
      .startButton {
        display: block;
        margin: 2em auto;
        padding: 1em 2em;
        font-size: 1.5em;
        background-color: black;
        color: #00ff00;
        border: 2px solid #004100ff;
       cursor: pointer;
      }

      h2 {
        display: center;
        width: 60%;
        justify-content: center;
        text-align: center;
        font-family: 'Consolas', 'Courier New', monospace;
        font-size: 1.5em;
        color: #00ff00;
        margin: auto;
      }

      h1 {
          font-family: 'Consolas', 'Courier New', monospace;
          font-size: 5em;
          font-weight: bold;
          color: #00ff00;
          margin: auto;
          padding: 1em;
          width: fit-content;
      }
    `}
      </style>
    </>
  );
}
export default BullsNCows;