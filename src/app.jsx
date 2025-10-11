import './style/app.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './components/layout';
import Home from './components/home';
import HamburgerNavbar from './components/hamburgernavbar'; 
import ProductBar from './components/productBar';
import BullsNCows from './components/bullsncows';
import HighScore from './components/highscore';
import ProductCard from './components/ProductCard';
import Error404 from './components/error404';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="hamburgerNavbar" element={<HamburgerNavbar />} />
          <Route path="productBar" element={<ProductBar />} />
          <Route path="bullsnCows" element={<BullsNCows />} />
          <Route path="highScore" element={<HighScore />} />
          <Route path="product/:id" element={<ProductCard />} />
          <Route path="*" element={<Error404/>} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

