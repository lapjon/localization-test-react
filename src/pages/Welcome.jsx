import { useContext } from "react";
import { useTranslation } from "react-i18next";
import { CartContext } from "../context/CartContext"; // ✅ Import CartContext
import gearItems from "../data/gearData"; // ✅ Import shared gear data
import { Link } from "react-router-dom"; // ✅ Use Link instead of <a> for navigation
import "../styles/welcome.css";

const Welcome = () => {
  const { t } = useTranslation();
  const { addToCart } = useContext(CartContext);

  // ✅ Get the first 4 featured items
  const featuredItems = gearItems.slice(0, 4);

  return (
    <div className="welcome-container">
      <h1>{t("welcome.title")}</h1>
      <p>{t("welcome.description")}</p>

     
      <p className="browse-gear-link">
        <Link to="/gear">{t("welcome.browseGear")}</Link>
      </p>

   
      <div className="featured-items">
  {featuredItems.map((item) => (
    <div key={item.id} className="featured-item">
      <img src={`/images/gear/${item.image}`} alt={t(item.nameKey)} />
      <p className="item-name">{t(item.nameKey)}</p>  
      <p>${item.price.toFixed(2)}</p>
      <button onClick={() => addToCart(item)}>{t("cart.addToCart")}</button>
    </div>
  ))}
</div>
    </div>
  );
};

export default Welcome;
