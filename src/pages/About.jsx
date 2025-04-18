import { useTranslation } from "react-i18next";
import "../styles/about.css";

const About = () => {
  const { t } = useTranslation();

  return (
    <div className="about-container">
      <div className="about-text-box">
        <h1 className="about-title">{t("about.title")}</h1>
        <p className="about-description">{t("about.description")}</p>
      </div>
    </div>
  );
};

export default About;
