import './App.css';

import { BrowserRouter, Routes, Route } from 'react-router-dom';

import Layout from './components/Layout';
import Home from './components/Home';
import HamburgerNavbar from './components/HamburgerNavbar'; 
import ProductBar from './components/ProductBar';
import BullsNCows from './components/BullsNCows';
import HighScore from './components/HighScore';
import ProductCard from './components/ProductCard';
import Error404 from './components/Error404';

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

