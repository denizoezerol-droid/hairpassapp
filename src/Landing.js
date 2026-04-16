import React from "react";

export function Landing({ onRole }) {
  return (
    <div style={{ padding: 40, color: "#F0EBE3" }}>
      <h1>Haarpass</h1>

      <p style={{ color: "#8A8079" }}>
        StackBlitz Basis läuft
      </p>

      <div style={{ display: "flex", gap: 12 }}>
        <button onClick={() => onRole("customer")}>
          Als Kunde
        </button>

        <button onClick={() => onRole("salon")}>
          Als Salon
        </button>

        <button onClick={() => onRole("demo")}>
          Demo
        </button>
      </div>
    </div>
  );
}
