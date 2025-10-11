import ProductBar from "./ProductBar";
import CartWidget from "./CartWidget";

function Home() {
  return (
    <div style={{
      textAlign: "center",
    }}>
      <ProductBar limit={20} />
      <CartWidget />
      <h1>Home Page</h1>
      <p>Welcome to the Home Page!</p>
    </div>
  );
}
export default Home;