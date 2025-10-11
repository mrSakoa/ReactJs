
function Error() {
  return (
    <>
      <div>
        <h2>Eror 404</h2>
        <p>Page not found</p>
        <button onClick={() => window.location.href = '/'}>Go to Home</button>
      </div>

      <style>{` 
    h2 {
      font-size: 100px;
      text-align: center;
      margin-top: 200px;
      }
    p {
      font-size: 40px;
      text-align: center;
      }
      button {
        color: #00ff00;
        font-size: 20px;
        padding: 10px 20px;
        display: block;
        background: #000000;
        border: 2px solid #004100ff;
        margin: auto;
      }
    
    `}</style>

    </>
  )
}

export default Error
