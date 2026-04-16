import React, { useState } from "react";

export function Onboarding({ pendingRegistration, onDone, onBack }) {
  const [hairLength, setHairLength] = useState("");
  const [hairTexture, setHairTexture] = useState("");
  const [hairColor, setHairColor] = useState("");

  const pageStyle = {
    minHeight: "100vh",
    background: "#080706",
    color: "#F0EBE3",
    padding: 24,
    fontFamily: "DM Sans, sans-serif",
  };

  const cardStyle = {
    maxWidth: 620,
    margin: "60px auto 0",
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
          Onboarding
        </p>

        <h1
          style={{
            marginTop: 0,
            fontSize: 34,
            fontFamily: "Playfair Display, serif",
          }}
        >
          Haarprofil anlegen
        </h1>

        {pendingRegistration ? (
          <div
            style={{
              background: "#1C1A18",
              border: "1px solid #38332E",
              borderRadius: 16,
              padding: 14,
              marginBottom: 18,
            }}
          >
            <p style={{ margin: "0 0 6px" }}>
              <strong>Name:</strong> {pendingRegistration.name}
            </p>
            <p style={{ margin: 0 }}>
              <strong>E-Mail:</strong> {pendingRegistration.email}
            </p>
          </div>
        ) : null}

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
            Haarlänge
          </label>
          <input
            value={hairLength}
            onChange={(e) => setHairLength(e.target.value)}
            style={inputStyle}
            placeholder="z. B. lang"
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
            Haarstruktur
          </label>
          <input
            value={hairTexture}
            onChange={(e) => setHairTexture(e.target.value)}
            style={inputStyle}
            placeholder="z. B. wellig"
          />
        </div>

        <div style={{ marginBottom: 18 }}>
          <label
            style={{
              display: "block",
              marginBottom: 6,
              fontSize: 12,
              color: "#8A8079",
              textTransform: "uppercase",
            }}
          >
            Haarfarbe
          </label>
          <input
            value={hairColor}
            onChange={(e) => setHairColor(e.target.value)}
            style={inputStyle}
            placeholder="z. B. dunkelbraun"
          />
        </div>

        <button
          style={primaryButtonStyle}
          onClick={() =>
            onDone({
              hairLength,
              hairTexture,
              hairColor,
            })
          }
        >
          Registrierung abschließen
        </button>
      </div>
    </div>
  );
}
