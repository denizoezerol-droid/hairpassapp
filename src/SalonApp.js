import React, { useEffect, useMemo, useRef, useState } from "react";

const DEMO_CUSTOMERS = [
  {
    id: "c1",
    fullName: "Tascha Schmidt",
    email: "tascha@gmail.com",
    phone: "+49 176 11111111",
    hairLength: "lang",
    hairStructure: "wellig",
    currentHairColor: "Warmes Braun",
    allergies: "Keine bekannt",
    notes: "Wünscht natürliche Übergänge und pflegeleichte Looks.",
    visits: 5,
    rating: 4.9,
    timeline: [
      {
        id: "t1",
        date: "04.03.2026",
        title: "Glossing + Spitzen",
        treatment: "Glossing + Pflege",
        color: "Warmes Braun",
        description: "Mehr Glanz und frischer Abschluss in den Längen.",
        colorA: "#5d4322",
        colorB: "#151515",
      },
      {
        id: "t2",
        date: "11.01.2026",
        title: "Pflegebehandlung",
        treatment: "Pflege",
        color: "Naturton",
        description: "Aufbau und Feuchtigkeit für trockene Spitzen.",
        colorA: "#2a2a2a",
        colorB: "#4a3522",
      },
    ],
  },
  {
    id: "c2",
    fullName: "Deniz Özerol",
    email: "deniz@example.com",
    phone: "+49 176 00000000",
    hairLength: "mittel",
    hairStructure: "wellig",
    currentHairColor: "Dunkelbraun",
    allergies: "Empfindliche Kopfhaut",
    notes: "Möchte moderne, aber pflegeleichte Ergebnisse.",
    visits: 3,
    rating: 4.7,
    timeline: [
      {
        id: "t3",
        date: "20.02.2026",
        title: "Cut + Bartpflege",
        treatment: "Cut + Bart",
        color: "Dunkelbraun",
        description: "Kontur sauber, natürlicher Übergang, gepflegter Bart.",
        colorA: "#3b2a18",
        colorB: "#111111",
      },
    ],
  },
];

const INITIAL_REVIEWS = [
  {
    id: "review-1",
    customerName: "Tascha Schmidt",
    rating: 5,
    comment: "Sehr ruhige Beratung und hochwertiges Ergebnis.",
    date: "14.04.2026",
  },
  {
    id: "review-2",
    customerName: "Deniz Özerol",
    rating: 4,
    comment: "Wunschlook wurde gut verstanden und sauber umgesetzt.",
    date: "02.04.2026",
  },
];

const OPENING_HOURS = [
  { day: "Montag", value: "09:00 – 18:00" },
  { day: "Dienstag", value: "09:00 – 18:00" },
  { day: "Mittwoch", value: "09:00 – 18:00" },
  { day: "Donnerstag", value: "09:00 – 19:00" },
  { day: "Freitag", value: "09:00 – 18:00" },
  { day: "Samstag", value: "09:00 – 14:00" },
  { day: "Sonntag", value: "Geschlossen" },
];

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "customers", label: "Kunden" },
  { id: "requests", label: "Anfragen" },
  { id: "history", label: "Verlauf" },
  { id: "reviews", label: "Bewertungen" },
  { id: "notes", label: "Notizen" },
];

function DemoVisual({ title, subtitle, colorA = "#2a2a2a", colorB = "#141414" }) {
  return (
    <div
      style={{
        minHeight: 160,
        position: "relative",
        overflow: "hidden",
        borderBottom: "1px solid rgba(255,255,255,0.06)",
        background: `linear-gradient(135deg, ${colorA}, ${colorB})`,
      }}
    >
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08), transparent 20%), radial-gradient(circle at 80% 15%, rgba(212,175,55,0.10), transparent 18%), linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.34))",
        }}
      />
      <div
        style={{
          position: "absolute",
          left: 14,
          right: 14,
          bottom: 14,
        }}
      >
        <div
          style={{
            display: "inline-flex",
            padding: "7px 11px",
            borderRadius: 999,
            background: "rgba(0,0,0,0.26)",
            border: "1px solid rgba(255,255,255,0.08)",
            fontWeight: 700,
            fontSize: 12,
          }}
        >
          {title}
        </div>
        {subtitle ? (
          <div style={{ marginTop: 8, fontSize: 13, color: "rgba(255,255,255,0.82)" }}>
            {subtitle}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function StarRow({ value }) {
  return (
    <div style={{ display: "flex", gap: 4, alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          style={{
            color: star <= value ? "#e8cb73" : "rgba(255,255,255,0.20)",
            fontSize: 20,
            lineHeight: 1,
          }}
        >
          ★
        </span>
      ))}
    </div>
  );
}

export default function SalonApp({
  onLogout,
  currentUser,
  sharedRequests = [],
  onUpdateRequestStatus,
}) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [customers, setCustomers] = useState(DEMO_CUSTOMERS);
  const [selectedCustomerId, setSelectedCustomerId] = useState(DEMO_CUSTOMERS[0].id);
  const [salonNote, setSalonNote] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);
  const [popup, setPopup] = useState({ visible: false, title: "", message: "", tone: "default" });
  const [reviews] = useState(INITIAL_REVIEWS);

  const previousRequestIdsRef = useRef([]);
  const audioUnlockedRef = useRef(false);

  useEffect(() => {
    const existing = document.getElementById("hairpass-salon-block-a-styles");
    if (existing) return;

    const style = document.createElement("style");
    style.id = "hairpass-salon-block-a-styles";
    style.innerHTML = `
      * { box-sizing: border-box; }
      html, body, #root {
        margin: 0;
        min-height: 100%;
        width: 100%;
        overflow-x: hidden;
      }
      body {
        font-family: Inter, Arial, sans-serif;
        background:
          radial-gradient(circle at top left, rgba(212,175,55,0.08), transparent 24%),
          radial-gradient(circle at top right, rgba(255,255,255,0.04), transparent 18%),
          linear-gradient(135deg, #07080b 0%, #0d1117 45%, #07080b 100%);
        color: #f5f5f7;
      }
      button, input, textarea { font: inherit; }

      .sa-shell { min-height: 100vh; width: 100%; }
      .sa-main {
        width: 100%;
        max-width: 1180px;
        margin: 0 auto;
        padding: 18px;
        padding-bottom: 90px;
      }
      .sa-topbar {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 14px;
        margin-bottom: 18px;
      }

      .sa-badge, .sa-mini-badge {
        display: inline-flex;
        align-items: center;
        justify-content: center;
        min-height: 28px;
        padding: 5px 11px;
        border-radius: 999px;
        background: rgba(212,175,55,0.10);
        border: 1px solid rgba(212,175,55,0.18);
        color: #e4c15d;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
        box-shadow: inset 0 1px 0 rgba(255,255,255,0.05);
      }

      .sa-title {
        margin: 10px 0 6px;
        font-size: clamp(28px, 4.4vw, 44px);
        line-height: 0.98;
        font-weight: 800;
        letter-spacing: -0.025em;
      }
      .sa-subtitle {
        margin: 0;
        max-width: 760px;
        color: rgba(255,255,255,0.74);
        font-size: clamp(14px, 2.1vw, 18px);
        line-height: 1.55;
      }

      .sa-primary-btn, .sa-secondary-btn, .sa-logout-btn, .sa-nav-btn, .sa-chip-btn, .sa-customer-btn, .sa-stat-card {
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
      }

      .sa-primary-btn, .sa-secondary-btn, .sa-logout-btn {
        min-height: 42px;
        padding: 10px 14px;
        border-radius: 14px;
        cursor: pointer;
        font-weight: 700;
        font-size: 13px;
      }
      .sa-primary-btn {
        border: none;
        background: linear-gradient(135deg, #d4af37 0%, #e8cb73 100%);
        color: #121212;
        box-shadow: 0 8px 18px rgba(212,175,55,0.18);
      }
      .sa-secondary-btn {
        border: 1px solid rgba(255,255,255,0.08);
        background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
        color: #fff;
      }
      .sa-logout-btn {
        border: 1px solid rgba(255,80,80,0.22);
        background: linear-gradient(135deg, rgba(110,18,18,0.32), rgba(70,8,8,0.88));
        color: #fff;
        box-shadow: 0 8px 18px rgba(80,0,0,0.18);
      }

      .sa-nav-wrap {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 18px;
      }
      .sa-nav-btn {
        min-height: 38px;
        padding: 8px 12px;
        border-radius: 14px;
        border: 1px solid rgba(255,255,255,0.08);
        background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
        color: #fff;
        font-size: 13px;
        font-weight: 650;
        cursor: pointer;
        white-space: nowrap;
        backdrop-filter: blur(10px);
      }
      .sa-nav-btn.active {
        background: linear-gradient(135deg, rgba(212,175,55,0.17), rgba(255,255,255,0.05));
        border-color: rgba(212,175,55,0.34);
      }

      .sa-grid, .sa-grid-2, .sa-grid-3, .sa-grid-4, .sa-layout, .sa-stat-grid {
        display: grid;
        gap: 14px;
      }
      .sa-grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .sa-grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .sa-grid-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
      .sa-layout { grid-template-columns: minmax(300px, 0.95fr) minmax(0, 1.35fr); }
      .sa-stat-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }

      .sa-card {
        min-width: 0;
        background: linear-gradient(135deg, rgba(255,255,255,0.055), rgba(255,255,255,0.025));
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 20px;
        box-shadow: 0 14px 38px rgba(0,0,0,0.22);
        backdrop-filter: blur(16px);
        position: relative;
        overflow: hidden;
      }
      .sa-card::before {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, rgba(255,255,255,0.05), transparent 35%);
        pointer-events: none;
      }
      .sa-card-padding { padding: 14px; }

      .sa-section-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 14px;
      }
      .sa-section-title {
        margin: 8px 0 0;
        font-size: clamp(20px, 3.2vw, 28px);
        line-height: 1.08;
      }
      .sa-muted {
        color: rgba(255,255,255,0.74);
        line-height: 1.55;
        font-size: 14px;
      }

      .sa-stat-card {
        text-align: left;
        padding: 16px;
        border-radius: 20px;
        border: 1px solid rgba(255,255,255,0.08);
        background: linear-gradient(135deg, rgba(255,255,255,0.055), rgba(255,255,255,0.025));
        color: #fff;
        cursor: pointer;
        box-shadow: 0 14px 38px rgba(0,0,0,0.22);
        backdrop-filter: blur(16px);
      }
      .sa-stat-card.highlight {
        background: linear-gradient(135deg, rgba(212,175,55,0.15), rgba(255,255,255,0.05));
        border-color: rgba(212,175,55,0.24);
      }
      .sa-stat-top {
        display: inline-flex;
        min-height: 28px;
        align-items: center;
        justify-content: center;
        padding: 5px 11px;
        border-radius: 999px;
        background: rgba(212,175,55,0.11);
        border: 1px solid rgba(212,175,55,0.16);
        color: #e4c15d;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .sa-stat-value {
        display: block;
        margin-top: 16px;
        font-size: 30px;
        font-weight: 800;
        line-height: 1;
      }
      .sa-stat-sub {
        margin-top: 8px;
        font-size: 13px;
        color: rgba(255,255,255,0.72);
      }

      .sa-stack {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .sa-customer-btn {
        width: 100%;
        min-height: 88px;
        text-align: left;
        padding: 14px;
        border-radius: 16px;
        border: 1px solid rgba(255,255,255,0.08);
        background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.025));
        color: #fff;
        cursor: pointer;
        backdrop-filter: blur(10px);
      }
      .sa-customer-btn.active {
        background: linear-gradient(135deg, rgba(212,175,55,0.17), rgba(255,255,255,0.05));
        border-color: rgba(212,175,55,0.34);
      }

      .sa-summary-block + .sa-summary-block { margin-top: 14px; }
      .sa-summary-label {
        display: block;
        margin-bottom: 7px;
        color: rgba(255,255,255,0.62);
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .sa-summary-text {
        margin: 0;
        color: rgba(255,255,255,0.94);
        line-height: 1.5;
        font-size: 14px;
        word-break: break-word;
      }

      .sa-tag-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .sa-tag {
        display: inline-flex;
        align-items: center;
        min-height: 34px;
        padding: 7px 10px;
        border-radius: 999px;
        background: rgba(212,175,55,0.12);
        border: 1px solid rgba(212,175,55,0.18);
        color: #efcf72;
        font-size: 12px;
        font-weight: 700;
      }

      .sa-chip-btn {
        min-height: 38px;
        padding: 8px 12px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,0.10);
        background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.025));
        color: #fff;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
      }
      .sa-chip-btn.active {
        background: linear-gradient(135deg, rgba(212,175,55,0.16), rgba(255,255,255,0.05));
        border-color: rgba(212,175,55,0.35);
        color: #efcf72;
      }

      .sa-textarea {
        width: 100%;
        min-height: 112px;
        border-radius: 14px;
        border: 1px solid rgba(255,255,255,0.09);
        background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.025));
        color: #fff;
        padding: 12px 14px;
        outline: none;
        resize: vertical;
        font-size: 14px;
        backdrop-filter: blur(10px);
      }

      .sa-actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        margin-top: 14px;
      }
      .sa-save-success {
        margin-top: 12px;
        padding: 12px 14px;
        border-radius: 14px;
        background: linear-gradient(135deg, rgba(34,197,94,0.14), rgba(255,255,255,0.04));
        border: 1px solid rgba(34,197,94,0.22);
        color: #b8f5c7;
        font-size: 13px;
        font-weight: 600;
      }

      .sa-hours-list {
        display: grid;
        gap: 8px;
        margin-top: 14px;
      }
      .sa-hours-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 10px 12px;
        border-radius: 14px;
        background: linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
        border: 1px solid rgba(255,255,255,0.06);
      }

      .sa-popup {
        position: fixed;
        top: 18px;
        right: 18px;
        z-index: 9999;
        width: min(360px, calc(100vw - 28px));
        padding: 14px 16px;
        border-radius: 18px;
        background: linear-gradient(135deg, rgba(17,20,27,0.82), rgba(10,12,18,0.90));
        border: 1px solid rgba(212,175,55,0.24);
        box-shadow: 0 20px 50px rgba(0,0,0,0.34);
        color: #fff;
        backdrop-filter: blur(18px);
        animation: saSlideIn 0.28s ease;
      }
      .sa-popup-title {
        font-size: 13px;
        font-weight: 800;
        color: #efcf72;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        margin-bottom: 6px;
      }
      .sa-popup-text {
        color: rgba(255,255,255,0.88);
        font-size: 14px;
        line-height: 1.45;
      }
      @keyframes saSlideIn {
        from { opacity: 0; transform: translateY(-8px) scale(0.98); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }

      @media (max-width: 1050px) {
        .sa-grid-4,
        .sa-grid-3,
        .sa-grid-2,
        .sa-layout,
        .sa-stat-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 820px) {
        .sa-main {
          padding: 14px;
          padding-bottom: 90px;
        }
        .sa-topbar, .sa-section-head {
          flex-direction: column;
          align-items: stretch;
        }
        .sa-logout-btn, .sa-actions > * {
          width: 100%;
        }
        .sa-actions {
          flex-direction: column;
        }
      }

      @media (max-width: 520px) {
        .sa-nav-wrap {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
        }
        .sa-nav-btn {
          width: 100%;
          min-height: 42px;
          text-align: center;
          white-space: normal;
        }
        .sa-title { font-size: 31px; }
        .sa-card-padding { padding: 14px; }
        .sa-popup {
          left: 14px;
          right: 14px;
          top: 14px;
          width: auto;
        }
      }
    `;
    document.head.appendChild(style);
  }, []);

  const unlockAudio = () => {
    audioUnlockedRef.current = true;
  };

  const playTone = (type = "default") => {
    try {
      if (!audioUnlockedRef.current) return;
      const AudioContextClass = window.AudioContext || window.webkitAudioContext;
      if (!AudioContextClass) return;

      const ctx = new AudioContextClass();
      const oscillator = ctx.createOscillator();
      const gainNode = ctx.createGain();

      oscillator.connect(gainNode);
      gainNode.connect(ctx.destination);

      if (type === "confirmed") {
        oscillator.type = "sine";
        oscillator.frequency.setValueAtTime(760, ctx.currentTime);
        oscillator.frequency.linearRampToValueAtTime(920, ctx.currentTime + 0.12);
        gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.35);
      } else {
        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(640, ctx.currentTime);
        gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.045, ctx.currentTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.22);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.22);
      }
    } catch (error) {
      console.error("Ton konnte nicht abgespielt werden:", error);
    }
  };

  const showPopupMessage = (title, message, tone = null) => {
    setPopup({ visible: true, title, message, tone });

    if (tone) {
      playTone(tone);
    }

    window.clearTimeout(showPopupMessage.timeoutId);
    showPopupMessage.timeoutId = window.setTimeout(() => {
      setPopup({ visible: false, title: "", message: "", tone: "default" });
    }, 2400);
  };

  const selectedCustomer = useMemo(
    () => customers.find((customer) => customer.id === selectedCustomerId) || customers[0],
    [customers, selectedCustomerId]
  );

  const requestsWithCustomer = useMemo(() => {
    return (sharedRequests || []).map((request) => {
      const matchingCustomer = customers.find(
        (customer) => customer.email.toLowerCase() === request.customerEmail?.toLowerCase()
      );

      return {
        ...request,
        customerName:
          request.customerName ||
          matchingCustomer?.fullName ||
          "Unbekannter Kunde",
      };
    });
  }, [sharedRequests, customers]);

  const customerRequests = useMemo(() => {
    return requestsWithCustomer.filter(
      (request) =>
        request.customerEmail?.toLowerCase() === selectedCustomer.email.toLowerCase()
    );
  }, [requestsWithCustomer, selectedCustomer]);

  const openRequests = requestsWithCustomer.filter((item) => item.status === "Offen");
  const confirmedRequests = requestsWithCustomer.filter((item) => item.status === "Bestätigt");

  const dailyRevenue = confirmedRequests.length * 95;
  const monthlyRevenue = confirmedRequests.length * 320;
  const averageRating =
    reviews.length > 0
      ? (
          reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length
        ).toFixed(1)
      : "0.0";

  const topCustomers = [...customers]
    .sort((a, b) => (b.visits || 0) - (a.visits || 0))
    .slice(0, 3);

  useEffect(() => {
    const requestIds = (sharedRequests || []).map((item) => item.id);

    if (previousRequestIdsRef.current.length === 0) {
      previousRequestIdsRef.current = requestIds;
      return;
    }

    const newestRequest = requestsWithCustomer.find(
      (item) => !previousRequestIdsRef.current.includes(item.id)
    );

    if (newestRequest) {
      showPopupMessage("Neue Anfrage", `Neue Anfrage von ${newestRequest.customerName}.`, "default");
    }

    previousRequestIdsRef.current = requestIds;
  }, [sharedRequests, requestsWithCustomer]);

  const saveSalonNote = () => {
    unlockAudio();

    if (!salonNote.trim()) return;

    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === selectedCustomer.id
          ? { ...customer, notes: `${customer.notes}\n• ${salonNote.trim()}` }
          : customer
      )
    );

    setSalonNote("");
    setNoteSaved(true);
    showPopupMessage("Notiz gespeichert", "Die interne Salon-Notiz wurde gespeichert.");
    setTimeout(() => setNoteSaved(false), 2200);
  };

  const handleUpdateStatus = (requestId, status, customerName, mainService) => {
    unlockAudio();

    if (typeof onUpdateRequestStatus === "function") {
      onUpdateRequestStatus(requestId, status);
    }

    if (status === "Bestätigt") {
      showPopupMessage(
        "Termin bestätigt",
        `${mainService} für ${customerName} wurde bestätigt.`,
        "confirmed"
      );
    } else if (status === "Erledigt") {
      showPopupMessage(
        "Termin abgeschlossen",
        `${mainService} für ${customerName} wurde abgeschlossen.`,
        "default"
      );
    }
  };

  return (
    <>
      <div className="sa-shell">
        <main className="sa-main">
          <div className="sa-topbar">
            <div>
              <span className="sa-badge">Hair Pass · Salon</span>
              <h1 className="sa-title">Salonbereich</h1>
              <p className="sa-subtitle">
                Verwalte Kundenprofile, Terminwünsche, Haarverläufe und interne
                Notizen in einem eleganten, präsentierbaren Dashboard.
              </p>
            </div>

            <button
              className="sa-logout-btn"
              onClick={() => {
                unlockAudio();
                onLogout();
              }}
            >
              Logout
            </button>
          </div>

          <div className="sa-nav-wrap">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                className={`sa-nav-btn ${activeTab === item.id ? "active" : ""}`}
                onClick={() => {
                  unlockAudio();
                  setActiveTab(item.id);
                }}
              >
                {item.label}
              </button>
            ))}
          </div>

          {activeTab === "dashboard" && (
            <section className="sa-grid">
              <div className="sa-stat-grid">
                <button className="sa-stat-card" onClick={() => setActiveTab("customers")}>
                  <span className="sa-stat-top">Kunden</span>
                  <span className="sa-stat-value">{customers.length}</span>
                  <div className="sa-stat-sub">aktive Kundenprofile</div>
                </button>

                <button className="sa-stat-card" onClick={() => setActiveTab("requests")}>
                  <span className="sa-stat-top">Anfragen</span>
                  <span className="sa-stat-value">{requestsWithCustomer.length}</span>
                  <div className="sa-stat-sub">gesamt synchronisiert</div>
                </button>

                <button className="sa-stat-card" onClick={() => setActiveTab("requests")}>
                  <span className="sa-stat-top">Offen</span>
                  <span className="sa-stat-value">{openRequests.length}</span>
                  <div className="sa-stat-sub">wartet auf Antwort</div>
                </button>

                <button className="sa-stat-card" onClick={() => setActiveTab("requests")}>
                  <span className="sa-stat-top">Bestätigt</span>
                  <span className="sa-stat-value">{confirmedRequests.length}</span>
                  <div className="sa-stat-sub">bereits zugesagt</div>
                </button>
              </div>

              <div className="sa-stat-grid">
                <div className="sa-stat-card highlight">
                  <span className="sa-stat-top">Umsatz heute</span>
                  <span className="sa-stat-value">€{dailyRevenue}</span>
                  <div className="sa-stat-sub">basierend auf bestätigten Terminen</div>
                </div>

                <div className="sa-stat-card highlight">
                  <span className="sa-stat-top">Umsatz Monat</span>
                  <span className="sa-stat-value">€{monthlyRevenue}</span>
                  <div className="sa-stat-sub">Demo-KPI für Präsentation</div>
                </div>

                <button className="sa-stat-card highlight" onClick={() => setActiveTab("reviews")}>
                  <span className="sa-stat-top">Bewertung</span>
                  <span className="sa-stat-value">⭐ {averageRating}</span>
                  <div className="sa-stat-sub">durchschnittliche Zufriedenheit</div>
                </button>

                <div className="sa-stat-card highlight">
                  <span className="sa-stat-top">Top Kunde</span>
                  <span className="sa-stat-value" style={{ fontSize: 20 }}>
                    {topCustomers[0]?.fullName?.split(" ")[0] || "-"}
                  </span>
                  <div className="sa-stat-sub">
                    {topCustomers[0] ? `${topCustomers[0].visits} Besuche` : "Noch keine Daten"}
                  </div>
                </div>
              </div>

              <div className="sa-grid-2">
                <div className="sa-card sa-card-padding">
                  <span className="sa-mini-badge">Öffnungszeiten</span>
                  <h3 style={{ marginTop: 12, fontSize: 18 }}>Hair Pass Studio</h3>
                  <div className="sa-hours-list">
                    {OPENING_HOURS.map((item) => (
                      <div key={item.day} className="sa-hours-row">
                        <strong style={{ fontSize: 14 }}>{item.day}</strong>
                        <span style={{ color: "rgba(255,255,255,0.78)", fontSize: 14 }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sa-card sa-card-padding">
                  <span className="sa-mini-badge">Top Kunden</span>
                  <h3 style={{ marginTop: 12, fontSize: 18 }}>Wiederkehrende Stammkunden</h3>

                  <div className="sa-stack" style={{ marginTop: 14 }}>
                    {topCustomers.map((customer) => (
                      <button
                        key={customer.id}
                        className={`sa-customer-btn ${selectedCustomerId === customer.id ? "active" : ""}`}
                        onClick={() => setSelectedCustomerId(customer.id)}
                      >
                        <strong>{customer.fullName}</strong>
                        <p className="sa-muted" style={{ margin: "6px 0 4px 0" }}>
                          {customer.visits} Besuche · ⭐ {customer.rating}
                        </p>
                        <span style={{ color: "#efcf72", fontWeight: 700, fontSize: 13 }}>
                          {customer.email}
                        </span>
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="sa-layout">
                <div className="sa-card sa-card-padding">
                  <span className="sa-mini-badge">Kunde</span>
                  <h2 className="sa-section-title">{selectedCustomer.fullName}</h2>

                  <div className="sa-summary-block">
                    <span className="sa-summary-label">Kontakt</span>
                    <p className="sa-summary-text">{selectedCustomer.email}</p>
                    <p className="sa-summary-text">{selectedCustomer.phone}</p>
                  </div>

                  <div className="sa-summary-block">
                    <span className="sa-summary-label">Haarprofil</span>
                    <p className="sa-summary-text">
                      {selectedCustomer.hairLength}, {selectedCustomer.hairStructure}, {selectedCustomer.currentHairColor}
                    </p>
                  </div>
                </div>

                <div className="sa-card sa-card-padding">
                  <span className="sa-mini-badge">Aktuellste Anfrage</span>
                  <h2 className="sa-section-title">Kundenwunsch</h2>

                  {customerRequests[0] ? (
                    <>
                      <div className="sa-summary-block">
                        <span className="sa-summary-label">Behandlung</span>
                        <p className="sa-summary-text">{customerRequests[0].mainService}</p>
                      </div>

                      <div className="sa-summary-block">
                        <span className="sa-summary-label">Wunschlook</span>
                        <p className="sa-summary-text">{customerRequests[0].desiredLook}</p>
                      </div>

                      <div className="sa-summary-block">
                        <span className="sa-summary-label">Wunschfriseur</span>
                        <p className="sa-summary-text">
                          {customerRequests[0].preferredStylist || "Egal"}
                        </p>
                      </div>

                      <div className="sa-summary-block">
                        <span className="sa-summary-label">Termin</span>
                        <p className="sa-summary-text">
                          {customerRequests[0].preferredDate} um {customerRequests[0].preferredTime}
                        </p>
                      </div>
                    </>
                  ) : (
                    <p className="sa-muted" style={{ marginTop: 14 }}>Keine Anfragen vorhanden.</p>
                  )}
                </div>
              </div>
            </section>
          )}

          {activeTab === "customers" && (
            <section className="sa-grid">
              <div className="sa-section-head">
                <div>
                  <span className="sa-mini-badge">Kundenverwaltung</span>
                  <h2 className="sa-section-title">Kundenprofile</h2>
                  <p className="sa-muted">
                    Übersicht über Profile, Kontaktdaten und relevante Haarinformationen.
                  </p>
                </div>
              </div>

              <div className="sa-grid-2">
                {customers.map((customer) => {
                  const count = requestsWithCustomer.filter(
                    (request) =>
                      request.customerEmail?.toLowerCase() === customer.email.toLowerCase()
                  ).length;

                  return (
                    <div key={customer.id} className="sa-card sa-card-padding">
                      <h3 style={{ fontSize: 18 }}>{customer.fullName}</h3>
                      <p className="sa-muted" style={{ marginBottom: 4 }}>{customer.email}</p>
                      <p className="sa-muted" style={{ marginTop: 0 }}>{customer.phone}</p>

                      <div className="sa-summary-block">
                        <span className="sa-summary-label">Haarprofil</span>
                        <p className="sa-summary-text">
                          {customer.hairLength}, {customer.hairStructure}, {customer.currentHairColor}
                        </p>
                      </div>

                      <div className="sa-summary-block">
                        <span className="sa-summary-label">Kundenwert</span>
                        <p className="sa-summary-text">
                          {customer.visits} Besuche · ⭐ {customer.rating} · {count} Anfragen
                        </p>
                      </div>

                      <div className="sa-actions">
                        <button
                          className="sa-secondary-btn"
                          onClick={() => {
                            setSelectedCustomerId(customer.id);
                            setActiveTab("history");
                          }}
                        >
                          Verlauf
                        </button>
                        <button
                          className="sa-primary-btn"
                          onClick={() => {
                            setSelectedCustomerId(customer.id);
                            setActiveTab("requests");
                          }}
                        >
                          Anfragen
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {activeTab === "requests" && (
            <section className="sa-grid">
              <div className="sa-section-head">
                <div>
                  <span className="sa-mini-badge">Anfragen</span>
                  <h2 className="sa-section-title">Synchronisierte Terminanfragen</h2>
                  <p className="sa-muted">
                    Diese Anfragen kommen direkt aus dem Kundenbereich.
                  </p>
                </div>
              </div>

              <div className="sa-grid-2">
                {requestsWithCustomer.length === 0 ? (
                  <div className="sa-card sa-card-padding">
                    <p className="sa-muted" style={{ margin: 0 }}>
                      Noch keine Anfragen vorhanden.
                    </p>
                  </div>
                ) : (
                  requestsWithCustomer.map((request) => (
                    <div key={request.id} className="sa-card sa-card-padding">
                      <span className="sa-mini-badge">{request.customerName}</span>
                      <h3 style={{ marginTop: 12, fontSize: 18 }}>{request.mainService}</h3>

                      <div className="sa-summary-block">
                        <span className="sa-summary-label">Extras</span>
                        <div className="sa-tag-list">
                          {request.extras?.length > 0 ? (
                            request.extras.map((extra) => (
                              <span key={extra} className="sa-tag">{extra}</span>
                            ))
                          ) : (
                            <p className="sa-summary-text">Keine Extras</p>
                          )}
                        </div>
                      </div>

                      <div className="sa-summary-block">
                        <span className="sa-summary-label">Wunschlook</span>
                        <p className="sa-summary-text">{request.desiredLook}</p>
                      </div>

                      <div className="sa-summary-block">
                        <span className="sa-summary-label">Wunschfriseur</span>
                        <p className="sa-summary-text">{request.preferredStylist || "Egal"}</p>
                      </div>

                      <div className="sa-summary-block">
                        <span className="sa-summary-label">Termin</span>
                        <p className="sa-summary-text">
                          {request.preferredDate} um {request.preferredTime}
                        </p>
                      </div>

                      <div className="sa-summary-block">
                        <span className="sa-summary-label">Hinweise</span>
                        <p className="sa-summary-text">{request.importantNote}</p>
                      </div>

                      <div className="sa-summary-block">
                        <span className="sa-summary-label">Status</span>
                        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                          {["Offen", "Bestätigt", "Erledigt"].map((status) => {
                            const active = request.status === status;
                            return (
                              <button
                                key={status}
                                className={`sa-chip-btn ${active ? "active" : ""}`}
                                onClick={() =>
                                  handleUpdateStatus(
                                    request.id,
                                    status,
                                    request.customerName,
                                    request.mainService
                                  )
                                }
                              >
                                {status}
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </section>
          )}

          {activeTab === "history" && (
            <section className="sa-grid">
              <div className="sa-section-head">
                <div>
                  <span className="sa-mini-badge">Haarverlauf</span>
                  <h2 className="sa-section-title">{selectedCustomer.fullName}</h2>
                  <p className="sa-muted">
                    Premium-Darstellung der bisherigen Behandlungen und Ergebnisse.
                  </p>
                </div>
              </div>

              <div className="sa-grid">
                {selectedCustomer.timeline.map((entry) => (
                  <div key={entry.id} className="sa-card">
                    <DemoVisual
                      title={entry.title}
                      subtitle={entry.date}
                      colorA={entry.colorA}
                      colorB={entry.colorB}
                    />
                    <div className="sa-card-padding">
                      <span className="sa-mini-badge">{entry.date}</span>

                      <div className="sa-summary-block">
                        <span className="sa-summary-label">Behandlung</span>
                        <p className="sa-summary-text">{entry.treatment}</p>
                      </div>

                      <div className="sa-summary-block">
                        <span className="sa-summary-label">Farbstand</span>
                        <p className="sa-summary-text">{entry.color}</p>
                      </div>

                      <div className="sa-summary-block">
                        <span className="sa-summary-label">Notiz</span>
                        <p className="sa-summary-text">{entry.description}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === "reviews" && (
            <section className="sa-grid">
              <div className="sa-section-head">
                <div>
                  <span className="sa-mini-badge">Bewertungen</span>
                  <h2 className="sa-section-title">Kundenfeedback im Überblick</h2>
                  <p className="sa-muted">
                    Letzte Sternebewertungen und Kommentare aus Kundensicht.
                  </p>
                </div>
              </div>

              <div className="sa-grid-2">
                <div className="sa-card sa-card-padding">
                  <span className="sa-mini-badge">Durchschnitt</span>
                  <h3 style={{ marginTop: 12, fontSize: 18 }}>⭐ {averageRating} / 5</h3>
                  <p className="sa-muted" style={{ marginTop: 8 }}>
                    Sichtbarer Qualitätsindikator für den Salonbetrieb.
                  </p>

                  <div className="sa-summary-block">
                    <span className="sa-summary-label">Gesamtanzahl</span>
                    <p className="sa-summary-text">{reviews.length} Bewertungen</p>
                  </div>
                </div>

                <div className="sa-card sa-card-padding">
                  <span className="sa-mini-badge">Letzte Einträge</span>
                  <div className="sa-grid" style={{ marginTop: 14 }}>
                    {reviews.map((item) => (
                      <div key={item.id} className="sa-card" style={{ padding: 14 }}>
                        <strong>{item.customerName}</strong>
                        <p className="sa-muted" style={{ margin: "6px 0 10px 0" }}>{item.date}</p>
                        <StarRow value={item.rating} />
                        <p className="sa-summary-text" style={{ marginTop: 12 }}>
                          {item.comment}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === "notes" && (
            <section className="sa-grid">
              <div className="sa-section-head">
                <div>
                  <span className="sa-mini-badge">Notizen</span>
                  <h2 className="sa-section-title">Salon-Notizen für {selectedCustomer.fullName}</h2>
                  <p className="sa-muted">
                    Interne Hinweise für Beratung, Farbe und Folgetermine.
                  </p>
                </div>
              </div>

              <div className="sa-grid-2">
                <div className="sa-card sa-card-padding">
                  <h3 style={{ fontSize: 18 }}>Bestehende Hinweise</h3>
                  <p className="sa-summary-text" style={{ whiteSpace: "pre-line" }}>
                    {selectedCustomer.notes}
                  </p>
                </div>

                <div className="sa-card sa-card-padding">
                  <h3 style={{ fontSize: 18 }}>Neue Notiz</h3>
                  <textarea
                    className="sa-textarea"
                    value={salonNote}
                    onChange={(e) => {
                      setSalonNote(e.target.value);
                      setNoteSaved(false);
                    }}
                    placeholder="z. B. Kundin bevorzugt warme Nuancen..."
                  />
                  <div className="sa-actions">
                    <button className="sa-primary-btn" onClick={saveSalonNote}>
                      Notiz speichern
                    </button>
                  </div>

                  {noteSaved ? (
                    <div className="sa-save-success">
                      Die Salon-Notiz wurde gespeichert.
                    </div>
                  ) : null}
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {popup.visible ? (
        <div className="sa-popup">
          <div className="sa-popup-title">{popup.title}</div>
          <div className="sa-popup-text">{popup.message}</div>
        </div>
      ) : null}
    </>
  );
}
