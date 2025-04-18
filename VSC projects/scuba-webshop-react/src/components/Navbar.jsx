// src/components/Navbar.jsx
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useState, useEffect, useContext } from "react";
import { CartContext } from "../context/CartContext";
import "../styles/navbar.css";

const Navbar = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const { cartItems } = useContext(CartContext);
  const [user, setUser] = useState(null);

  // ✅ Load user from localStorage on mount
  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  // ✅ Calculate total quantity of items in the cart
  const totalItems = cartItems.reduce((total, item) => total + item.quantity, 0);

  // ✅ Load saved language on mount
  useEffect(() => {
    const savedLanguage = localStorage.getItem("language") || "en"; // Default to English
    i18n.changeLanguage(savedLanguage);
  }, []);

  // ✅ Save selected language to localStorage
  const switchLanguage = (langCode) => {
    localStorage.setItem("language", langCode);
    i18n.changeLanguage(langCode);
  };

  return (
    <nav className="navbar">
      <h1><Link to="/welcome">Deep Dive</Link></h1>
      <ul className="nav-links">
        <li><Link to="/gear">{t("navbar.gear")}</Link></li>
        <li><Link to="/about">{t("navbar.about")}</Link></li>
        <li>
          <Link to="/cart">
            {t("navbar.cart")} 
            {totalItems > 0 && <span className="cart-indicator">{totalItems}</span>}
          </Link>
        </li>
      </ul>

      <div className="user-info">
        {user ? (
          <>
            <span>{t("navbar.loggedInAs")}: {user.email}!</span>
            <button onClick={handleLogout}>{t("navbar.logout")}</button>
          </>
        ) : (
          <Link to="/login">{t("navbar.login")}</Link>
        )}
      </div>

      {/* ✅ Language Switcher with Persistence */}
      <div className="language-switcher">
        <select onChange={(e) => switchLanguage(e.target.value)} defaultValue={i18n.language}>
          <option value="en">English</option>
          <option value="sv">Svenska</option>
          <option value="de">Deutsch</option>
          <option value="fr">Français</option>
          <option value="es">Español</option>
        </select>
      </div>
    </nav>
  );
};

export default Navbar;
