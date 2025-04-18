import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import "../styles/signup.css";

const Signup = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validatePassword = (password) => {
    const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    return passwordRegex.test(password);
  };

  const handleSignup = (e) => {
    e.preventDefault();
    setError(""); // Reset error message

    if (!email || !password || !confirmPassword) {
      setError(t("errors.allFieldsRequired"));
      return;
    }
    if (!validateEmail(email)) {
      setError(t("errors.invalidEmail"));
      return;
    }
    if (password !== confirmPassword) {
      setError(t("errors.passwordMismatch"));
      return;
    }
    if (!validatePassword(password)) {
      setError(t("errors.weakPassword"));
      return;
    }

    const userData = { email, password };
    localStorage.setItem("user", JSON.stringify(userData));

    console.log("Signup successful:", userData);
    navigate("/login");
  };

  return (
    <div className="signup-container">
      <h1>{t("signup.title")}</h1>
      
      <form className="signup-form" onSubmit={handleSignup} noValidate>
        <input
          type="email"
          placeholder={t("signup.email")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder={t("signup.password")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="password"
          placeholder={t("signup.confirmPassword")}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
        />
        {error && <p className="error-message">{error}</p>}
        <button type="submit">{t("signup.button")}</button>
      </form>

      <p className="login-link">
        {t("signup.alreadyMember")} <a href="/login">{t("signup.loginHere")}</a>
      </p>
    </div>
  );
};

export default Signup;
