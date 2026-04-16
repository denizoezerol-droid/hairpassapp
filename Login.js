import React, { useState } from "react";

export function Login({ role, onLogin, onBack }) {
  const [email, setEmail] = useState("");
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");

  const pageStyle = {
    minHeight: "100vh",
    background: "#080706",
    color: "#F0EBE3",
    padding: 24,
    fontFamily: "DM Sans, sans-serif",
  };

  const cardStyle = {
    maxWidth: 520,
    margin: "80px auto 0",
    background: "#111010",
    border: "1px solid #272422",
    borderRadius: 20,
    padding: 24,
    boxShadow: "0 8px 24px rgba(0,0,0,0.25)",
  };

  const inputStyle = {
    width: "100%",
    background: "#1C1A18",
    border: "1px solid #38332E",
    borderRadius: 14,
    padding: 14,
    color: "#F0EBE3",
    fontSize: 14,
    boxSizing: "border-box",
    outline: "none",
    fontFamily: "inherit",
  };

  const primaryButtonStyle = {
    background: "linear-gradient(135deg,#C8A96A,#A07840)",
    color: "#080706",
    border: "none",
    borderRadius: 12,
    padding: "12px 18px",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 14,
  };

  const secondaryButtonStyle = {
    background: "#1C1A18",
    color: "#F0EBE3",
    border: "1px solid #38332E",
    borderRadius: 12,
    padding: "12px 18px",
    fontWeight: 700,
    cursor: "pointer",
    fontSize: 14,
  };

  const handleCustomerLogin = () => {
    const result = onLogin({
      type: "customer-login",
      email,
    });

    if (result?.ok === false) {
      setMessage(result.message);
      return;
    }

    setMessage("");
  };

  const handleCustomerRegister = () => {
    const result = onLogin({
      type: "customer-register",
      name,
      email,
    });

    if (result?.ok === false) {
      setMessage(result.message);
      return;
    }

    setMessage("");
  };

  const handleSalonLogin = () => {
    onLogin({
      type: "salon-login",
    });
  };

  return (
    <div style={pageStyle}>
      <button onClick={onBack} style={secondaryButtonStyle}>
        ← Zurück
      </button>

      <div style={cardStyle}>
        <p
          style={{
            color: "#8A8079",
            textTransform: "uppercase",
            letterSpacing: "0.08em",
            fontSize: 12,
            marginBottom: 6,
          }}
        >
          Login
        </p>

        <h1
          style={{
            marginTop: 0,
            fontSize: 34,
            fontFamily: "Playfair Display, serif",
          }}
        >
          {role === "salon" ? "Salon Login" : "Kunden Login"}
        </h1>

        {role === "customer" && (
          <>
            <div style={{ marginBottom: 14 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontSize: 12,
                  color: "#8A8079",
                  textTransform: "uppercase",
                }}
              >
                Name für Registrierung
              </label>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                style={inputStyle}
                placeholder="Dein Name"
              />
            </div>

            <div style={{ marginBottom: 14 }}>
              <label
                style={{
                  display: "block",
                  marginBottom: 6,
                  fontSize: 12,
                  color: "#8A8079",
                  textTransform: "uppercase",
                }}
              >
                E-Mail
              </label>
              <input
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                style={inputStyle}
                placeholder="deine@email.de"
                type="email"
              />
            </div>

            {message ? (
              <p style={{ color: "#ff9d9d", marginBottom: 14 }}>{message}</p>
            ) : null}

            <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
              <button style={primaryButtonStyle} onClick={handleCustomerLogin}>
                Kunde Login
              </button>
              <button
                style={secondaryButtonStyle}
                onClick={handleCustomerRegister}
              >
                Registrieren
              </button>
            </div>
          </>
        )}

        {role === "salon" && (
          <div style={{ display: "flex", gap: 12 }}>
            <button style={primaryButtonStyle} onClick={handleSalonLogin}>
              Salon Login
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
