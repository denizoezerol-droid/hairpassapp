import React, { useEffect, useMemo, useState } from "react";
import CustomerApp from "./CustomerApp";
import SalonApp from "./SalonApp";

const DEMO_USERS = {
  customer: {
    email: "deniz@example.com",
    password: "123456",
    profile: {
      firstName: "Deniz",
      lastName: "Özerol",
      email: "deniz@example.com",
      phone: "+49 176 00000000",
    },
  },
  salon: {
    email: "salon@hairpass.de",
    password: "123456",
    profile: {
      salonName: "Hair Pass Studio",
      email: "salon@hairpass.de",
    },
  },
};

const INITIAL_SHARED_REQUESTS = [
  {
    id: "req-1",
    customerEmail: "deniz@example.com",
    customerName: "Deniz Özerol",
    mainService: "Haarschnitt",
    extras: ["Bartpflege"],
    desiredLook: "Sauberer, moderner Schnitt",
    preferredStylist: "Deniz",
    preferredDate: "2026-04-20",
    preferredTime: "14:00",
    importantNote: "Nicht zu kurz an den Seiten.",
    status: "Offen",
    createdAt: "15.04.2026, 18:40",
  },
];

export default function App() {
  useEffect(() => {
    const ensureMeta = (selector, createTag) => {
      let element = document.querySelector(selector);
      if (!element) {
        element = createTag();
        document.head.appendChild(element);
      }
      return element;
    };

    const manifestLink = ensureMeta('link[rel="manifest"]', () => {
      const link = document.createElement("link");
      link.rel = "manifest";
      return link;
    });
    manifestLink.href = "/manifest.webmanifest";

    const themeMeta = ensureMeta('meta[name="theme-color"]', () => {
      const meta = document.createElement("meta");
      meta.name = "theme-color";
      return meta;
    });
    themeMeta.content = "#0d1117";

    const appleMeta = ensureMeta('meta[name="apple-mobile-web-app-capable"]', () => {
      const meta = document.createElement("meta");
      meta.name = "apple-mobile-web-app-capable";
      return meta;
    });
    appleMeta.content = "yes";

    const appleStatusBar = ensureMeta(
      'meta[name="apple-mobile-web-app-status-bar-style"]',
      () => {
        const meta = document.createElement("meta");
        meta.name = "apple-mobile-web-app-status-bar-style";
        return meta;
      }
    );
    appleStatusBar.content = "black-translucent";

    const appleTitle = ensureMeta('meta[name="apple-mobile-web-app-title"]', () => {
      const meta = document.createElement("meta");
      meta.name = "apple-mobile-web-app-title";
      return meta;
    });
    appleTitle.content = "Hair Pass";

    const appleTouchIcon = ensureMeta('link[rel="apple-touch-icon"]', () => {
      const link = document.createElement("link");
      link.rel = "apple-touch-icon";
      return link;
    });
    appleTouchIcon.href = "/icon-192.png";

    if ("serviceWorker" in navigator) {
      window.addEventListener("load", () => {
        navigator.serviceWorker.register("/sw.js").catch((error) => {
          console.error("Service Worker registration failed:", error);
        });
      });
    }
  }, []);
  const [step, setStep] = useState("welcome");
  const [selectedRole, setSelectedRole] = useState(null);
  const [loggedInUser, setLoggedInUser] = useState(null);

  const [authMode, setAuthMode] = useState("login");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [authError, setAuthError] = useState("");

  const [sharedRequests, setSharedRequests] = useState(INITIAL_SHARED_REQUESTS);

  const customerRequests = useMemo(() => {
    if (!loggedInUser?.email) return [];
    return sharedRequests.filter(
      (request) => request.customerEmail === loggedInUser.email
    );
  }, [sharedRequests, loggedInUser]);

  const handleChooseRole = (role) => {
    setSelectedRole(role);
    setAuthMode("login");
    setEmail("");
    setPassword("");
    setAuthError("");
    setStep("auth");
  };

  const handleBackToWelcome = () => {
    setSelectedRole(null);
    setLoggedInUser(null);
    setEmail("");
    setPassword("");
    setAuthError("");
    setStep("welcome");
  };

  const handleLogout = () => {
    setSelectedRole(null);
    setLoggedInUser(null);
    setEmail("");
    setPassword("");
    setAuthError("");
    setStep("welcome");
  };

  const handleLogin = () => {
    setAuthError("");

    if (!email.trim() || !password.trim()) {
      setAuthError("Bitte E-Mail und Passwort eingeben.");
      return;
    }

    const demoUser = DEMO_USERS[selectedRole];

    if (!demoUser) {
      setAuthError("Unbekannte Rolle.");
      return;
    }

    if (
      email.trim().toLowerCase() !== demoUser.email.toLowerCase() ||
      password !== demoUser.password
    ) {
      setAuthError("E-Mail oder Passwort ist falsch.");
      return;
    }

    setLoggedInUser({
      role: selectedRole,
      email: demoUser.email,
      ...demoUser.profile,
    });

    if (selectedRole === "customer") {
      setStep("customer-dashboard");
    } else {
      setStep("salon-dashboard");
    }
  };

  const handleRegister = () => {
    setAuthError("");

    if (!email.trim() || !password.trim()) {
      setAuthError("Bitte E-Mail und Passwort eingeben.");
      return;
    }

    if (password.trim().length < 6) {
      setAuthError("Das Passwort muss mindestens 6 Zeichen haben.");
      return;
    }

    setLoggedInUser({
      role: selectedRole,
      email: email.trim(),
      firstName: selectedRole === "customer" ? "Neuer" : undefined,
      lastName: selectedRole === "customer" ? "Kunde" : undefined,
      phone: selectedRole === "customer" ? "" : undefined,
      salonName: selectedRole === "salon" ? "Neuer Salon" : undefined,
    });

    if (selectedRole === "customer") {
      setStep("customer-dashboard");
    } else {
      setStep("salon-dashboard");
    }
  };

  const handleCreateRequest = (requestPayload) => {
    const newRequest = {
      id: `req-${Date.now()}`,
      customerEmail: loggedInUser?.email || "",
      customerName:
        loggedInUser?.firstName && loggedInUser?.lastName
          ? `${loggedInUser.firstName} ${loggedInUser.lastName}`
          : "Unbekannter Kunde",
      mainService: requestPayload.mainService || "",
      extras: requestPayload.extras || [],
      desiredLook: requestPayload.desiredLook || "",
      preferredStylist: requestPayload.preferredStylist || "Egal",
      preferredDate: requestPayload.preferredDate || "",
      preferredTime: requestPayload.preferredTime || "",
      importantNote: requestPayload.importantNote || "",
      status: "Offen",
      createdAt: new Date().toLocaleString("de-DE"),
    };
  
    setSharedRequests((prev) => [newRequest, ...prev]);
    return newRequest;
  };

  const handleUpdateRequestStatus = (requestId, nextStatus) => {
    setSharedRequests((prev) =>
      prev.map((request) =>
        request.id === requestId ? { ...request, status: nextStatus } : request
      )
    );
  };

  if (step === "customer-dashboard") {
    return (
      <CustomerApp
  onLogout={handleLogout}
  currentUser={loggedInUser}
  sharedRequests={customerRequests}
  confirmedRequests={[]}
  onCreateRequest={handleCreateRequest}
/>
    );
  }

  if (step === "salon-dashboard") {
    return (
      <SalonApp
        onLogout={handleLogout}
        currentUser={loggedInUser}
        sharedRequests={sharedRequests}
        onUpdateRequestStatus={handleUpdateRequestStatus}
      />
    );
  }

  return (
    <div
      style={{
        minHeight: "100vh",
        background:
          "radial-gradient(circle at top left, rgba(212,175,55,0.08), transparent 24%), linear-gradient(135deg, #07080b 0%, #0d1117 45%, #07080b 100%)",
        color: "#f5f5f7",
        fontFamily: "Inter, Arial, sans-serif",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: "24px",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "520px",
          background: "rgba(255,255,255,0.04)",
          border: "1px solid rgba(255,255,255,0.08)",
          borderRadius: "24px",
          padding: "24px",
          boxShadow: "0 12px 36px rgba(0,0,0,0.18)",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            padding: "6px 12px",
            borderRadius: "999px",
            background: "rgba(212,175,55,0.12)",
            border: "1px solid rgba(212,175,55,0.18)",
            color: "#e4c15d",
            fontSize: "12px",
            fontWeight: 800,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
          }}
        >
          Hair Pass
        </span>

        {step === "welcome" && (
          <>
            <h1
              style={{
                margin: "14px 0 8px",
                fontSize: "40px",
                lineHeight: 1,
              }}
            >
              Willkommen
            </h1>

            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.74)",
                lineHeight: 1.6,
              }}
            >
              bei deiner persönlichen Haarakte
            </p>

            <div
              style={{
                display: "grid",
                gap: "12px",
                marginTop: "22px",
              }}
            >
              <button
                onClick={() => handleChooseRole("customer")}
                style={{
                  minHeight: "48px",
                  borderRadius: "14px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "14px",
                  background: "linear-gradient(135deg, #d4af37 0%, #e8cb73 100%)",
                  color: "#111",
                }}
              >
                Als Kunde öffnen
              </button>

              <button
                onClick={() => handleChooseRole("salon")}
                style={{
                  minHeight: "48px",
                  borderRadius: "14px",
                  border: "1px solid rgba(255,255,255,0.10)",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "14px",
                  background: "rgba(255,255,255,0.04)",
                  color: "#fff",
                }}
              >
                Als Salon öffnen
              </button>
            </div>
          </>
        )}

        {step === "auth" && (
          <>
            <button
              onClick={handleBackToWelcome}
              style={{
                marginTop: "4px",
                marginBottom: "14px",
                background: "transparent",
                border: "none",
                color: "rgba(255,255,255,0.72)",
                cursor: "pointer",
                padding: 0,
                fontSize: "14px",
              }}
            >
              ← Zurück
            </button>

            <h1
              style={{
                margin: "0 0 8px",
                fontSize: "34px",
                lineHeight: 1,
              }}
            >
              {selectedRole === "customer" ? "Kunden-Zugang" : "Salon-Zugang"}
            </h1>

            <p
              style={{
                margin: 0,
                color: "rgba(255,255,255,0.74)",
                lineHeight: 1.6,
              }}
            >
              Bitte anmelden oder registrieren.
            </p>

            <div style={{ marginTop: "20px", display: "grid", gap: "12px" }}>
              <input
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setAuthError("");
                }}
                placeholder="E-Mail"
                style={{
                  minHeight: "48px",
                  borderRadius: "14px",
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.04)",
                  color: "#fff",
                  padding: "0 14px",
                  outline: "none",
                }}
              />

              <input
                type="password"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setAuthError("");
                }}
                placeholder="Passwort"
                style={{
                  minHeight: "48px",
                  borderRadius: "14px",
                  border: "1px solid rgba(255,255,255,0.10)",
                  background: "rgba(255,255,255,0.04)",
                  color: "#fff",
                  padding: "0 14px",
                  outline: "none",
                }}
              />

              {authError ? (
                <div
                  style={{
                    padding: "12px 14px",
                    borderRadius: "14px",
                    background: "rgba(239,68,68,0.10)",
                    border: "1px solid rgba(239,68,68,0.22)",
                    color: "#ffd0d0",
                    fontSize: "13px",
                  }}
                >
                  {authError}
                </div>
              ) : null}

              <button
                onClick={handleLogin}
                style={{
                  minHeight: "48px",
                  borderRadius: "14px",
                  border: "none",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "14px",
                  background: "linear-gradient(135deg, #d4af37 0%, #e8cb73 100%)",
                  color: "#111",
                }}
              >
                Anmelden
              </button>

              <button
                onClick={handleRegister}
                style={{
                  minHeight: "48px",
                  borderRadius: "14px",
                  border: "1px solid rgba(255,255,255,0.10)",
                  cursor: "pointer",
                  fontWeight: 700,
                  fontSize: "14px",
                  background: "rgba(255,255,255,0.04)",
                  color: "#fff",
                }}
              >
                Registrieren
              </button>

              <div
                style={{
                  marginTop: "4px",
                  fontSize: "12px",
                  color: "rgba(255,255,255,0.55)",
                  lineHeight: 1.6,
                }}
              >
                Demo-Zugang Kunde: <strong>deniz@example.com</strong> / <strong>123456</strong>
                <br />
                Demo-Zugang Salon: <strong>salon@hairpass.de</strong> / <strong>123456</strong>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
