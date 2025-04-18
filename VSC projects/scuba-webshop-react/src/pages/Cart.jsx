import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { useContext } from "react";
import { CartContext } from "../context/CartContext";
import "../styles/cart.css";

const Cart = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
  
  const totalAmount = cartItems.reduce((total, item) => total + item.price * item.quantity, 0);

  const handleProceedToCheckout = () => {
    const isLoggedIn = localStorage.getItem("user");
    if (!isLoggedIn) {
      navigate("/login");
    } else {
      navigate("/checkout");
    }
  };

  return (
    <div className="cart-container">
      <h1>{t("cart.title")}</h1>

      {cartItems.length === 0 ? (
        <p className="empty-cart-message">{t("cart.empty")}</p>
      ) : (
        <ul className="cart-items">
          {cartItems.map((item) => (
            <li key={item.id} className="cart-item">
              <img src={`/images/gear/${item.image}`} alt={t(item.nameKey)} />
              <div className="cart-item-details">
                <p className="cart-item-name">{t(item.nameKey)} x {item.quantity}</p>
                <p className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</p>
              </div>
              <button className="remove-button" onClick={() => removeFromCart(item.id)}>
                {t("cart.remove")}
              </button>
            </li>
          ))}
        </ul>
      )}

      {cartItems.length > 0 && (
        <div className="cart-actions">
          <p className="total-amount">{t("cart.totalAmount")}: ${totalAmount.toFixed(2)}</p>
          <button className="clear-cart" onClick={clearCart}>{t("cart.clear")}</button>
          <button className="proceed-checkout" onClick={handleProceedToCheckout}>
            {t("cart.proceedToCheckout")}
          </button>
        </div>
      )}
    </div>
  );
};

export default Cart;
