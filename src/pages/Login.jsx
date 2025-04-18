import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/login.css";

const Login = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    setError(""); // Reset error message

    if (!email || !password) {
      setError(t("errors.allFieldsRequired"));
      return;
    }
    if (!validateEmail(email)) {
      setError(t("errors.invalidEmail"));
      return;
    }

    const storedUser = JSON.parse(localStorage.getItem("user"));

    if (!storedUser || storedUser.email !== email || storedUser.password !== password) {
      setError(t("errors.invalidCredentials"));
      return;
    }

    console.log("Login successful:", storedUser);
    navigate("/");
  };

  return (
    <div className="login-container">
      <h1>{t("login.title")}</h1>
      
      <form className="login-form" onSubmit={handleLogin} noValidate> {/* ✅ Prevents default HTML validation */}
        <input
          type="email"
          placeholder={t("login.email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder={t("login.password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        {error && <p className="error-message">{error}</p>} {/* ✅ Show custom error message */}
        <button type="submit">{t("login.button")}</button>
      </form>

      <p className="signup-link">
        {t("login.notMember")} <a href="/signup">{t("login.registerHere")}</a>
      </p>
    </div>
  );
};

export default Login;
