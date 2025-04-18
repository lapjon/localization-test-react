import { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import "../styles/checkout.css";
import "../styles/form.css";
import { CartContext } from "../context/CartContext";

const Checkout = () => {
  const { t } = useTranslation();
  const { cartItems, removeFromCart, clearCart } = useContext(CartContext);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    address: "",
    country: "",
    city: "",
    postalCode: "",
    cardName: "",
    cardNumber: "",
    expiryDate: "",
    cvv: ""
  });

  const [errors, setErrors] = useState({});

  const validateForm = () => {
    let newErrors = {};
    const today = new Date();
    const selectedDate = new Date(formData.expiryDate + "-01");

    if (!formData.firstName.trim()) newErrors.firstName = t("errors.firstNameRequired");
    if (!formData.lastName.trim()) newErrors.lastName = t("errors.lastNameRequired");
    if (!formData.email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/)) newErrors.email = t("errors.invalidEmail");
    if (!formData.address.trim()) newErrors.address = t("errors.addressRequired");
    if (!formData.country) newErrors.country = t("errors.countryRequired");
    if (!formData.city.trim()) newErrors.city = t("errors.cityRequired");
    if (!formData.postalCode.match(/^\d{5}$/)) newErrors.postalCode = t("errors.invalidPostalCode");
    if (!formData.cardName.trim()) newErrors.cardName = t("errors.cardNameRequired");
    if (!formData.cardNumber.match(/^\d{16}$/)) newErrors.cardNumber = t("errors.invalidCardNumber");
    if (!formData.expiryDate) newErrors.expiryDate = t("errors.expiryDateRequired");
    if (selectedDate < today) newErrors.expiryDate = t("errors.expiryDatePast");
    if (!formData.cvv.match(/^\d{3}$/)) newErrors.cvv = t("errors.invalidCvv");

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validateForm()) {
      alert(t("placeOrderSuccess"));
      clearCart();
    }
  };

  const handleRemoveItem = (item) => {
    const confirmRemove = window.confirm(`${t("cart.confirmRemove", { item: t(item.nameKey) })}`);
    if (confirmRemove) {
      removeFromCart(item.id);
    }
  };

  // ✅ Calculate total price
  const totalAmount = cartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  return (
    <div className="checkout-container">
      <h2 className="checkout-title">{t("checkout.title")}</h2>

      {/* ✅ Cart Summary */}
      <div className="cart-summary">
        <h3 className="cart-header">{t("cart.title")}</h3>
        {cartItems.length === 0 ? (
          <p className="empty-cart-message">{t("cart.empty")}</p>
        ) : (
          <ul className="cart-list">
            {cartItems.map((item) => (
              <li key={item.id} className="cart-item">
                <span className="cart-item-name">
                  <strong>{t(item.nameKey)}</strong> x {item.quantity}
                </span>
                <span className="cart-item-price">${(item.price * item.quantity).toFixed(2)}</span>
                <button className="remove-button" onClick={() => handleRemoveItem(item)}>
                  {t("cart.remove")}
                </button>
              </li>
            ))}
          </ul>
        )}

        {/* ✅ Display Total Amount */}
        {cartItems.length > 0 && (
          <h3 className="total-amount">
            {t("cart.totalAmount")}: <span>${totalAmount.toFixed(2)}</span>
          </h3>
        )}
      </div>

      {/* ✅ Checkout Form */}
      <form className="checkout-form" onSubmit={handleSubmit} noValidate>
        {/* Billing Information */}
        <fieldset>
          <legend className="form-section">{t("checkout.billingInformation")}</legend>
          <label>
            {t("checkout.firstName")}:
            <input type="text" name="firstName" value={formData.firstName} onChange={handleChange} />
            {errors.firstName && <span className="error">{errors.firstName}</span>}
          </label>
          <label>
            {t("checkout.lastName")}:
            <input type="text" name="lastName" value={formData.lastName} onChange={handleChange} />
            {errors.lastName && <span className="error">{errors.lastName}</span>}
          </label>
          <label>
            {t("checkout.email")}:
            <input type="email" name="email" value={formData.email} onChange={handleChange} />
            {errors.email && <span className="error">{errors.email}</span>}
          </label>
          <label>
            {t("checkout.address")}:
            <input type="text" name="address" value={formData.address} onChange={handleChange} />
            {errors.address && <span className="error">{errors.address}</span>}
          </label>
          <label>
            {t("checkout.country")}:
            <input type="text" name="country" value={formData.country} onChange={handleChange} />
            {errors.country && <span className="error">{errors.country}</span>}
          </label>
          <label>
            {t("checkout.city")}:
            <input type="text" name="city" value={formData.city} onChange={handleChange} />
            {errors.city && <span className="error">{errors.city}</span>}
          </label>
          <label>
            {t("checkout.postalCode")}:
            <input type="text" name="postalCode" value={formData.postalCode} onChange={handleChange} />
            {errors.postalCode && <span className="error">{errors.postalCode}</span>}
          </label>
        </fieldset>

        {/* Payment Information */}
        <fieldset>
          <legend className="form-section">{t("checkout.paymentInformation")}</legend>
          <label>
            {t("checkout.nameOnCard")}:
            <input type="text" name="cardName" value={formData.cardName} onChange={handleChange} />
            {errors.cardName && <span className="error">{errors.cardName}</span>}
          </label>
          <label>
            {t("checkout.cardNumber")}:
            <input type="text" name="cardNumber" value={formData.cardNumber} onChange={handleChange} />
            {errors.cardNumber && <span className="error">{errors.cardNumber}</span>}
          </label>
          <label>
            {t("checkout.expiryDate")}:
            <input type="month" name="expiryDate" value={formData.expiryDate} onChange={handleChange} />
            {errors.expiryDate && <span className="error">{errors.expiryDate}</span>}
          </label>
          <label>
            {t("checkout.cvv")}:
            <input type="text" name="cvv" value={formData.cvv} onChange={handleChange} />
            {errors.cvv && <span className="error">{errors.cvv}</span>}
          </label>
        </fieldset>

        <button type="submit" className="checkout-button">{t("checkout.placeOrder")}</button>
      </form>
    </div>
  );
};

export default Checkout;
