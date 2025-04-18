// src/App.jsx

import { Outlet } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import CartProvider from "./context/CartProvider";
import "./styles/base.css";

const App = () => {
  return (
    <CartProvider> {/* Wrap the entire app inside CartProvider */}
      <div>
        <Navbar />
        <main>
          <Outlet /> {/* This is where child routes will be rendered */}
        </main>
        <Footer />
      </div>
    </CartProvider>
  );
};

export default App;
