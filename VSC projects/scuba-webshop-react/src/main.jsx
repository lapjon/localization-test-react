
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import App from './App';
import Welcome from './pages/Welcome'; // Make sure this file exists
import Gear from './pages/Gear';
import Cart from './pages/Cart';
import Checkout from './pages/Checkout';
import About from './pages/About';
import './styles/base.css';
import Login from './pages/Login';
import Signup from './pages/Signup';
import "./i18n"; // Load translations before app starts

ReactDOM.createRoot(document.getElementById('root')).render(
  //<React.StrictMode>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<App />}>
          <Route index element={<Welcome />} />
          <Route path="gear" element={<Gear />} />
          <Route path="cart" element={<Cart />} />
          <Route path="welcome" element={<Welcome />} />
          <Route path="checkout" element={<Checkout />} />
          <Route path="about" element={<About />} />
          <Route path="login" element={<Login />} />
          <Route path="signup" element={<Signup />} />
        </Route>
      </Routes>
    </BrowserRouter>
  //</React.StrictMode>
);
