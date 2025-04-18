import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { CartContext } from "../context/CartContext"; 
import gearItems from "../data/gearData"; // Import shared data
import "../styles/gear.css";

const Gear = () => {
  const { t } = useTranslation();
  const { addToCart } = useContext(CartContext); 

  return (
    <div className="gear-container">
      <h1>{t("gear.title")}</h1>
      <div className="gear-items">
        {gearItems.map((item) => {
          // Debugging console logs
          console.log("Gear Item Data:", item); // Logs the entire item object
          console.log("Item Name Key:", item.nameKey, "Translation:", t(item.nameKey));

          return (
            <div key={item.id} className="gear-item">
              {/* Image with fallback handling */}
              <img 
                src={`/images/gear/${item.image}`} 
                alt={t(item.nameKey)} 
                onError={(e) => {
                  e.target.src = "/images/gear/fallback.webp"; // Sets a fallback image if not found
                  e.target.style.opacity = "0.7"; // Optional: Makes it look faded to indicate fallback
                }}
              />
              {/* Translated name with fallback to nameKey if translation is missing */}
              <h3>{t(item.nameKey) || `Missing: ${item.nameKey}`}</h3>
              <h3 className="gear-description">{t(item.descriptionKey) || `Missing: ${item.descriptionKey}`}</h3>
              <p>${item.price.toFixed(2)}</p>
              <button onClick={() => addToCart(item)}>{t("cart.addToCart")}</button>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Gear;
