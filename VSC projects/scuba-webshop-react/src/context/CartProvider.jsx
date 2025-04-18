import { useState, useEffect } from "react";
import { useTranslation } from "react-i18next";
import PropTypes from "prop-types"; 
import { CartContext } from "./CartContext";

const CartProvider = ({ children }) => {
  const { t } = useTranslation(); // Localization support
  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage
  useEffect(() => {
    try {
      const savedCart = JSON.parse(localStorage.getItem("cart")) || [];
      setCartItems(savedCart);
    } catch (error) {
      console.error("Error loading cart:", error);
      setCartItems([]);
    }
  }, []);

  // Function to add items to cart
  const addToCart = (item) => {
    setCartItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      if (existingItem) {
        alert(`${t(item.nameKey)} ${t("cart.quantityIncreased")}`);
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      alert(`${t(item.nameKey)} ${t("cart.added")}`);
      return [...prevItems, { ...item, quantity: 1 }];
    });
  };

  // Function to remove a single quantity of an item
  const removeFromCart = (id) => {
    setCartItems((prevItems) => {
      const itemToRemove = prevItems.find((item) => item.id === id);
      if (!itemToRemove) return prevItems; // If item doesn't exist, return unchanged
  
      const confirmRemove = window.confirm(
        `${t("cart.confirmRemove", { item: t(itemToRemove.nameKey) })}`
      );
  
      if (!confirmRemove) return prevItems; // Do nothing if user cancels
  
      return prevItems
        .map((item) =>
          item.id === id ? { ...item, quantity: item.quantity - 1 } : item
        )
        .filter((item) => item.quantity > 0);
    });
  };

  // Function to clear the cart
  const clearCart = () => {
    setCartItems([]);
  };

  // Save cart to localStorage when cartItems change
  useEffect(() => {
    localStorage.setItem("cart", JSON.stringify(cartItems));
  }, [cartItems]);

  return (
    <CartContext.Provider value={{ cartItems, addToCart, removeFromCart, clearCart }}>
      {children}
    </CartContext.Provider>
  );
};

// ✅ Add PropTypes validation to fix the ESLint warning
CartProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export default CartProvider;
