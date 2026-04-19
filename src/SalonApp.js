import React, { useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "./supabaseClient";

const SALON_ID = "0c053665-32be-414a-9f34-176b768139e7";

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "customers", label: "Kunden" },
  { id: "requests", label: "Anfragen" },
  { id: "history", label: "Verlauf" },
  { id: "reviews", label: "Bewertungen" },
  { id: "settings", label: "Salon" },
  { id: "notes", label: "Notizen" },
];

const DEFAULT_OPENING_HOURS = [
  { day: "Montag", open: "09:00", close: "18:00", closed: false },
  { day: "Dienstag", open: "09:00", close: "18:00", closed: false },
  { day: "Mittwoch", open: "09:00", close: "18:00", closed: false },
  { day: "Donnerstag", open: "09:00", close: "19:00", closed: false },
  { day: "Freitag", open: "09:00", close: "18:00", closed: false },
  { day: "Samstag", open: "09:00", close: "14:00", closed: false },
  { day: "Sonntag", open: "00:00", close: "00:00", closed: true },
];

const DEFAULT_PRICES = [
  { id: "price-1", service: "Haarschnitt", duration: "45 Min.", price: "39" },
  { id: "price-2", service: "Waschen + Schneiden + Föhnen", duration: "60 Min.", price: "55" },
  { id: "price-3", service: "Glossing", duration: "45 Min.", price: "49" },
  { id: "price-4", service: "Balayage", duration: "180 Min.", price: "149" },
];

const DEFAULT_STYLISTS = [
  { id: "stylist-1", name: "Deniz", role: "Cut Specialist", active: true },
  { id: "stylist-2", name: "Sabrina", role: "Color Specialist", active: true },
  { id: "stylist-3", name: "Julia", role: "Styling", active: true },
];

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
    notes: "Wünscht natürliche Übergänge, ruhige Beratung und pflegeleichte Looks.",
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
    notes: "Möchte moderne, gepflegte, aber alltagstaugliche Ergebnisse.",
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

function DemoVisual({ title, subtitle, colorA = "#2a2a2a", colorB = "#141414" }) {
  return (
    <div
      style={{
        minHeight: 170,
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
            textShadow: star <= value ? "0 0 12px rgba(232,203,115,0.28)" : "none",
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
  const [salonProfile, setSalonProfile] = useState({
  salonName: "",
  email: "",
  phone: "",
  address: "",
  description: "",
});

const [openingHours, setOpeningHours] = useState([]);
const [priceList, setPriceList] = useState([]);
const [stylists, setStylists] = useState([]);
  const [activeTab, setActiveTab] = useState("dashboard");
  const [customers, setCustomers] = useState(DEMO_CUSTOMERS);
  const [selectedCustomerId, setSelectedCustomerId] = useState(DEMO_CUSTOMERS[0].id);
  const [salonNote, setSalonNote] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);
  const [popup, setPopup] = useState({ visible: false, title: "", message: "", tone: "default" });
  const [reviews] = useState(INITIAL_REVIEWS);

  const [salonProfile, setSalonProfile] = useState({
    salonName: currentUser?.salonName || "Hair Pass Studio",
    email: currentUser?.email || "salon@hairpass.de",
    phone: "+49 176 00000000",
    address: "Premium Salon Partner",
    description: "Luxury Hair & Color mit ruhiger Beratung, präzisen Schnitten und edlem Finish.",
  });

  const [openingHours, setOpeningHours] = useState(DEFAULT_OPENING_HOURS);
  const [priceList, setPriceList] = useState(DEFAULT_PRICES);
  const [stylists, setStylists] = useState(DEFAULT_STYLISTS);

  const [profileSaved, setProfileSaved] = useState(false);
  const [hoursSaved, setHoursSaved] = useState(false);
  const [pricesSaved, setPricesSaved] = useState(false);
  const [stylistsSaved, setStylistsSaved] = useState(false);

  const [newPrice, setNewPrice] = useState({
    service: "",
    duration: "",
    price: "",
  });

  const [newStylist, setNewStylist] = useState({
    name: "",
    role: "",
  });

  const previousRequestIdsRef = useRef([]);
  const audioUnlockedRef = useRef(false);

  useEffect(() => {
    const existing = document.getElementById("hairpass-salon-luxury-settings-styles");
    if (existing) return;

    const linkPreconnect1 = document.createElement("link");
    linkPreconnect1.rel = "preconnect";
    linkPreconnect1.href = "https://fonts.googleapis.com";

    const linkPreconnect2 = document.createElement("link");
    linkPreconnect2.rel = "preconnect";
    linkPreconnect2.href = "https://fonts.gstatic.com";
    linkPreconnect2.crossOrigin = "anonymous";

    const linkFonts = document.createElement("link");
    linkFonts.rel = "stylesheet";
    linkFonts.href =
      "https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&family=Playfair+Display:wght@600;700;800&display=swap";

    document.head.appendChild(linkPreconnect1);
    document.head.appendChild(linkPreconnect2);
    document.head.appendChild(linkFonts);

    const style = document.createElement("style");
    style.id = "hairpass-salon-luxury-settings-styles";
    style.innerHTML = `
      * { box-sizing: border-box; }
      html, body, #root { margin: 0; min-height: 100%; width: 100%; overflow-x: hidden; }
      body {
        font-family: Inter, Arial, sans-serif;
        background:
          radial-gradient(circle at top left, rgba(212,175,55,0.10), transparent 22%),
          radial-gradient(circle at top right, rgba(255,255,255,0.04), transparent 18%),
          radial-gradient(circle at bottom left, rgba(212,175,55,0.06), transparent 20%),
          linear-gradient(135deg, #050608 0%, #0b1118 42%, #050608 100%);
        color: #f5f5f7;
      }
      button, input, textarea { font: inherit; }

      .sa-shell { min-height: 100vh; width: 100%; }
      .sa-main { width: 100%; max-width: 1240px; margin: 0 auto; padding: 20px; padding-bottom: 96px; }
      .sa-topbar { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; margin-bottom: 18px; }

      .sa-brand-badge, .sa-mini-badge {
        display: inline-flex; align-items: center; justify-content: center; min-height: 30px;
        padding: 6px 12px; border-radius: 999px; border: 1px solid rgba(212,175,55,0.22);
        background: linear-gradient(135deg, rgba(212,175,55,0.12), rgba(255,255,255,0.03));
        color: #e7c96a; font-size: 11px; font-weight: 800; letter-spacing: 0.12em;
        text-transform: uppercase; box-shadow: inset 0 1px 0 rgba(255,255,255,0.05), 0 10px 24px rgba(0,0,0,0.16);
        backdrop-filter: blur(12px);
      }

      .sa-brand-title {
        margin: 12px 0 6px;
        font-family: "Playfair Display", Georgia, serif;
        font-size: clamp(28px, 4vw, 46px);
        line-height: 1.02;
        letter-spacing: -0.035em;
        color: #fff;
        text-shadow: 0 0 24px rgba(255,255,255,0.03);
      }

      .sa-subtitle {
        margin: 0;
        max-width: 760px;
        color: rgba(255,255,255,0.76);
        font-size: clamp(14px, 2vw, 18px);
        line-height: 1.6;
      }

      .sa-primary-btn, .sa-secondary-btn, .sa-danger-btn, .sa-logout-btn, .sa-nav-btn, .sa-chip-btn, .sa-customer-btn, .sa-stat-card {
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
      }

      .sa-primary-btn, .sa-secondary-btn, .sa-danger-btn, .sa-logout-btn {
        min-height: 44px;
        padding: 10px 16px;
        border-radius: 15px;
        cursor: pointer;
        font-weight: 700;
        font-size: 13px;
      }

      .sa-primary-btn {
        border: none;
        background: linear-gradient(135deg, #d4af37 0%, #ecd584 100%);
        color: #141414;
        box-shadow: 0 10px 24px rgba(212,175,55,0.20), 0 0 28px rgba(212,175,55,0.08);
      }

      .sa-secondary-btn {
        border: 1px solid rgba(255,255,255,0.08);
        background: linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.025));
        color: #fff;
      }

      .sa-danger-btn {
        border: 1px solid rgba(255,80,80,0.22);
        background: linear-gradient(135deg, rgba(120,18,18,0.34), rgba(72,10,10,0.92));
        color: #fff;
      }

      .sa-logout-btn {
        border: 1px solid rgba(255,80,80,0.22);
        background: linear-gradient(135deg, rgba(120,18,18,0.34), rgba(72,10,10,0.92));
        color: #fff;
        box-shadow: 0 10px 24px rgba(80,0,0,0.20);
      }

      .sa-nav-wrap { display: flex; flex-wrap: wrap; gap: 8px; margin: 18px 0 22px; }

      .sa-nav-btn {
        min-height: 40px; padding: 8px 13px; border-radius: 14px;
        border: 1px solid rgba(255,255,255,0.08);
        background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
        color: #fff; font-size: 13px; font-weight: 650; cursor: pointer;
        white-space: nowrap; backdrop-filter: blur(10px);
      }

      .sa-nav-btn.active {
        background: linear-gradient(135deg, rgba(212,175,55,0.18), rgba(255,255,255,0.05));
        border-color: rgba(212,175,55,0.34);
        box-shadow: 0 0 0 1px rgba(255,255,255,0.03), 0 8px 24px rgba(212,175,55,0.08);
      }

      .sa-grid, .sa-grid-2, .sa-grid-3, .sa-grid-4, .sa-layout, .sa-stat-grid {
        display: grid;
        gap: 16px;
      }
      .sa-grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .sa-grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .sa-grid-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
      .sa-layout { grid-template-columns: minmax(300px, 0.95fr) minmax(0, 1.35fr); }
      .sa-stat-grid { grid-template-columns: repeat(4, minmax(0, 1fr)); }

      .sa-card {
        min-width: 0;
        background: linear-gradient(135deg, rgba(255,255,255,0.06), rgba(255,255,255,0.025));
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 24px;
        box-shadow: 0 18px 44px rgba(0,0,0,0.24), inset 0 1px 0 rgba(255,255,255,0.04);
        backdrop-filter: blur(16px);
        position: relative;
        overflow: hidden;
      }

      .sa-card::before {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, rgba(255,255,255,0.05), transparent 32%);
        pointer-events: none;
      }

      .sa-card::after {
        content: "";
        position: absolute;
        inset: 0;
        background: radial-gradient(circle at top left, rgba(212,175,55,0.06), transparent 26%);
        pointer-events: none;
      }

      .sa-card-padding { padding: 18px; }
      .sa-section-head { display: flex; align-items: flex-start; justify-content: space-between; gap: 16px; }

      .sa-section-title {
        margin: 8px 0 0;
        font-size: clamp(22px, 3.2vw, 34px);
        line-height: 1.02;
        letter-spacing: -0.04em;
        font-family: "Playfair Display", Georgia, serif;
      }

      .sa-muted {
        color: rgba(255,255,255,0.76);
        line-height: 1.6;
        font-size: 14px;
      }
    `;
    document.head.appendChild(style);
  }, []);
    useEffect(() => {
    const extraStyleId = "hairpass-salon-luxury-settings-styles-2";
    if (document.getElementById(extraStyleId)) return;

    const style = document.createElement("style");
    style.id = extraStyleId;
    style.innerHTML = `
      .sa-stat-card {
        text-align: left;
        padding: 18px;
        border-radius: 22px;
        border: 1px solid rgba(255,255,255,0.08);
        background: linear-gradient(135deg, rgba(255,255,255,0.055), rgba(255,255,255,0.025));
        color: #fff;
        cursor: pointer;
        box-shadow: 0 18px 44px rgba(0,0,0,0.24), inset 0 1px 0 rgba(255,255,255,0.04);
        backdrop-filter: blur(16px);
      }

      .sa-stat-card.highlight {
        background: linear-gradient(135deg, rgba(212,175,55,0.16), rgba(255,255,255,0.05));
        border-color: rgba(212,175,55,0.24);
      }

      .sa-stat-top, .sa-chip {
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
        font-size: 32px;
        font-weight: 800;
        line-height: 1;
        letter-spacing: -0.04em;
      }

      .sa-stat-sub {
        margin-top: 8px;
        font-size: 13px;
        color: rgba(255,255,255,0.72);
      }

      .sa-stack { display: flex; flex-direction: column; gap: 10px; }

      .sa-customer-btn {
        width: 100%;
        min-height: 92px;
        text-align: left;
        padding: 15px;
        border-radius: 18px;
        border: 1px solid rgba(255,255,255,0.08);
        background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.025));
        color: #fff;
        cursor: pointer;
      }

      .sa-customer-btn.active {
        background: linear-gradient(135deg, rgba(212,175,55,0.18), rgba(255,255,255,0.05));
        border-color: rgba(212,175,55,0.34);
      }

      .sa-summary-block + .sa-summary-block { margin-top: 14px; }

      .sa-summary-label {
        display: block;
        margin-bottom: 7px;
        color: rgba(255,255,255,0.62);
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.10em;
        text-transform: uppercase;
      }

      .sa-summary-text {
        margin: 0;
        color: rgba(255,255,255,0.95);
        line-height: 1.55;
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
        background: linear-gradient(135deg, rgba(212,175,55,0.17), rgba(255,255,255,0.05));
        border-color: rgba(212,175,55,0.35);
        color: #efcf72;
      }

      .sa-input, .sa-textarea {
        width: 100%;
        min-height: 48px;
        border-radius: 15px;
        border: 1px solid rgba(255,255,255,0.09);
        background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.025));
        color: #fff;
        padding: 12px 14px;
        outline: none;
        font-size: 14px;
        backdrop-filter: blur(10px);
      }

      .sa-textarea {
        min-height: 120px;
        resize: vertical;
      }

      .sa-form-group {
        display: flex;
        flex-direction: column;
        gap: 7px;
      }

      .sa-form-group + .sa-form-group {
        margin-top: 14px;
      }

      .sa-label {
        font-size: 13px;
        color: rgba(255,255,255,0.78);
        font-weight: 600;
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

      .sa-hours-list, .sa-settings-list {
        display: grid;
        gap: 10px;
        margin-top: 14px;
      }

      .sa-hours-row, .sa-line-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 12px;
        border-radius: 16px;
        background: linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
        border: 1px solid rgba(255,255,255,0.06);
      }

      .sa-line-row-left {
        display: flex;
        flex-direction: column;
        gap: 4px;
      }

      .sa-line-row-right {
        display: flex;
        gap: 8px;
        flex-wrap: wrap;
        align-items: center;
      }

      .sa-grid-mini-3 {
        display: grid;
        grid-template-columns: 1.2fr 1fr 0.8fr;
        gap: 10px;
      }

      .sa-grid-mini-2 {
        display: grid;
        grid-template-columns: 1fr 1fr;
        gap: 10px;
      }

      .sa-popup {
        position: fixed;
        top: 18px;
        right: 18px;
        z-index: 9999;
        width: min(360px, calc(100vw - 28px));
        padding: 14px 16px;
        border-radius: 18px;
        background: linear-gradient(135deg, rgba(17,20,27,0.84), rgba(10,12,18,0.92));
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
        letter-spacing: 0.08em;
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
        .sa-grid-4, .sa-grid-3, .sa-grid-2, .sa-layout, .sa-stat-grid, .sa-grid-mini-3, .sa-grid-mini-2 {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 820px) {
        .sa-main { padding: 14px; padding-bottom: 90px; }
        .sa-topbar, .sa-section-head { flex-direction: column; align-items: stretch; }
        .sa-logout-btn, .sa-actions > * { width: 100%; }
        .sa-actions { flex-direction: column; }
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
        .sa-brand-title { font-size: 38px; }
        .sa-card-padding { padding: 14px; }
        .sa-popup { left: 14px; right: 14px; top: 14px; width: auto; }
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

    if (tone) playTone(tone);

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
        customerName: request.customerName || matchingCustomer?.fullName || "Unbekannter Kunde",
      };
    });
  }, [sharedRequests, customers]);

  const customerRequests = useMemo(() => {
    return requestsWithCustomer.filter(
      (request) => request.customerEmail?.toLowerCase() === selectedCustomer.email.toLowerCase()
    );
  }, [requestsWithCustomer, selectedCustomer]);

  const openRequests = requestsWithCustomer.filter((item) => item.status === "Offen");
  const confirmedRequests = requestsWithCustomer.filter((item) => item.status === "Bestätigt");

  const averageRating =
    reviews.length > 0
      ? (reviews.reduce((sum, item) => sum + item.rating, 0) / reviews.length).toFixed(1)
      : "0.0";

  const dailyRevenue = confirmedRequests.reduce((sum, request) => {
    const match = priceList.find((price) => price.service === request.mainService);
    return sum + Number(match?.price || 0);
  }, 0);

  const monthlyRevenue = dailyRevenue * 12;

  const activeStylistsCount = stylists.filter((stylist) => stylist.active).length;

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
    const saveSalonProfile = () => {
    unlockAudio();
    setProfileSaved(true);
    showPopupMessage("Salon gespeichert", "Die Salon-Stammdaten wurden aktualisiert.");
    setTimeout(() => setProfileSaved(false), 2200);
  };

  const saveOpeningHours = () => {
    unlockAudio();
    setHoursSaved(true);
    showPopupMessage("Öffnungszeiten gespeichert", "Die Öffnungszeiten wurden aktualisiert.");
    setTimeout(() => setHoursSaved(false), 2200);
  };

  const savePrices = () => {
    unlockAudio();
    setPricesSaved(true);
    showPopupMessage("Preise gespeichert", "Die Preisliste wurde aktualisiert.");
    setTimeout(() => setPricesSaved(false), 2200);
  };

  const saveStylists = () => {
    unlockAudio();
    setStylistsSaved(true);
    showPopupMessage("Stylisten gespeichert", "Das Team wurde aktualisiert.");
    setTimeout(() => setStylistsSaved(false), 2200);
  };

  const updateOpeningHour = (index, field, value) => {
    setOpeningHours((prev) =>
      prev.map((item, i) => (i === index ? { ...item, [field]: value } : item))
    );
    setHoursSaved(false);
  };

  const updateSalonProfile = (field, value) => {
    setSalonProfile((prev) => ({ ...prev, [field]: value }));
    setProfileSaved(false);
  };

  const updateNewPrice = (field, value) => {
    setNewPrice((prev) => ({ ...prev, [field]: value }));
  };

  const addPrice = () => {
    if (!newPrice.service.trim()) return;
    setPriceList((prev) => [
      ...prev,
      {
        id: `price-${Date.now()}`,
        service: newPrice.service.trim(),
        duration: newPrice.duration.trim() || "-",
        price: newPrice.price.trim() || "0",
      },
    ]);
    setNewPrice({ service: "", duration: "", price: "" });
    setPricesSaved(false);
  };

  const removePrice = (id) => {
    setPriceList((prev) => prev.filter((item) => item.id !== id));
    setPricesSaved(false);
  };

  const updateNewStylist = (field, value) => {
    setNewStylist((prev) => ({ ...prev, [field]: value }));
  };

  const addStylist = () => {
    if (!newStylist.name.trim()) return;
    setStylists((prev) => [
      ...prev,
      {
        id: `stylist-${Date.now()}`,
        name: newStylist.name.trim(),
        role: newStylist.role.trim() || "Stylist",
        active: true,
      },
    ]);
    setNewStylist({ name: "", role: "" });
    setStylistsSaved(false);
  };

  const toggleStylistActive = (id) => {
    setStylists((prev) =>
      prev.map((item) => (item.id === id ? { ...item, active: !item.active } : item))
    );
    setStylistsSaved(false);
  };

  const removeStylist = (id) => {
    setStylists((prev) => prev.filter((item) => item.id !== id));
    setStylistsSaved(false);
  };

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
              <span className="sa-brand-badge">Hair Pass · Salon</span>
              <h1 className="sa-brand-title">Salonbereich</h1>
              <p className="sa-subtitle">
                Verwalte Kunden, Anfragen, Öffnungszeiten, Preise und Teamdaten in einer luxuriösen Salon-Ansicht.
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

                <button className="sa-stat-card highlight" onClick={() => setActiveTab("settings")}>
                  <span className="sa-stat-top">Stylisten</span>
                  <span className="sa-stat-value">{activeStylistsCount}</span>
                  <div className="sa-stat-sub">aktuell aktiv</div>
                </button>
              </div>

              <div className="sa-stat-grid">
                <div className="sa-stat-card highlight">
                  <span className="sa-stat-top">Umsatz heute</span>
                  <span className="sa-stat-value">€{dailyRevenue}</span>
                  <div className="sa-stat-sub">aus bestätigten Terminen berechnet</div>
                </div>

                <div className="sa-stat-card highlight">
                  <span className="sa-stat-top">Umsatz Monat</span>
                  <span className="sa-stat-value">€{monthlyRevenue}</span>
                  <div className="sa-stat-sub">Präsentations-KPI</div>
                </div>

                <button className="sa-stat-card highlight" onClick={() => setActiveTab("reviews")}>
                  <span className="sa-stat-top">Bewertung</span>
                  <span className="sa-stat-value">⭐ {averageRating}</span>
                  <div className="sa-stat-sub">durchschnittliche Zufriedenheit</div>
                </button>

                <button className="sa-stat-card highlight" onClick={() => setActiveTab("settings")}>
                  <span className="sa-stat-top">Salon</span>
                  <span className="sa-stat-value" style={{ fontSize: 20 }}>
                    {salonProfile.salonName}
                  </span>
                  <div className="sa-stat-sub">{salonProfile.phone}</div>
                </button>
              </div>

              <div className="sa-grid-2">
                <div className="sa-card sa-card-padding">
                  <span className="sa-mini-badge">Öffnungszeiten</span>
                  <h3 style={{ marginTop: 12, fontSize: 24, fontFamily: '"Playfair Display", Georgia, serif' }}>
                    {salonProfile.salonName}
                  </h3>

                  <div className="sa-hours-list">
                    {openingHours.map((item) => (
                      <div key={item.day} className="sa-hours-row">
                        <strong style={{ fontSize: 14 }}>{item.day}</strong>
                        <span style={{ color: "rgba(255,255,255,0.78)", fontSize: 14 }}>
                          {item.closed ? "Geschlossen" : `${item.open} – ${item.close}`}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="sa-card sa-card-padding">
                  <span className="sa-mini-badge">Top Kunden</span>
                  <h3 style={{ marginTop: 12, fontSize: 24, fontFamily: '"Playfair Display", Georgia, serif' }}>
                    Wiederkehrende Stammkunden
                  </h3>

                  <div className="sa-stack" style={{ marginTop: 14 }}>
                    {[...customers]
                      .sort((a, b) => (b.visits || 0) - (a.visits || 0))
                      .slice(0, 3)
                      .map((customer) => (
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
                    (request) => request.customerEmail?.toLowerCase() === customer.email.toLowerCase()
                  ).length;

                  return (
                    <div key={customer.id} className="sa-card sa-card-padding">
                      <h3 style={{ fontSize: 22, fontFamily: '"Playfair Display", Georgia, serif' }}>
                        {customer.fullName}
                      </h3>
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
                      <h3 style={{ marginTop: 12, fontSize: 22, fontFamily: '"Playfair Display", Georgia, serif' }}>
                        {request.mainService}
                      </h3>

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
                  <h3 style={{ marginTop: 12, fontSize: 24, fontFamily: '"Playfair Display", Georgia, serif' }}>
                    ⭐ {averageRating} / 5
                  </h3>
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

          {activeTab === "settings" && (
            <section className="sa-grid">
              <div className="sa-section-head">
                <div>
                  <span className="sa-mini-badge">Salonverwaltung</span>
                  <h2 className="sa-section-title">Salon, Öffnungszeiten, Preise und Team</h2>
                  <p className="sa-muted">
                    Hier kann der Salon seine Daten selbst pflegen und jederzeit aktualisieren.
                  </p>
                </div>
              </div>

              <div className="sa-grid-2">
                <div className="sa-card sa-card-padding">
                  <h3 style={{ fontSize: 24, fontFamily: '"Playfair Display", Georgia, serif' }}>
                    Salon-Stammdaten
                  </h3>

                  <div className="sa-form-group">
                    <label className="sa-label">Salonname</label>
                    <input
                      className="sa-input"
                      value={salonProfile.salonName}
                      onChange={(e) => updateSalonProfile("salonName", e.target.value)}
                    />
                  </div>

                  <div className="sa-form-group">
                    <label className="sa-label">E-Mail</label>
                    <input
                      className="sa-input"
                      value={salonProfile.email}
                      onChange={(e) => updateSalonProfile("email", e.target.value)}
                    />
                  </div>

                  <div className="sa-form-group">
                    <label className="sa-label">Telefon</label>
                    <input
                      className="sa-input"
                      value={salonProfile.phone}
                      onChange={(e) => updateSalonProfile("phone", e.target.value)}
                    />
                  </div>

                  <div className="sa-form-group">
                    <label className="sa-label">Adresse / Hinweis</label>
                    <input
                      className="sa-input"
                      value={salonProfile.address}
                      onChange={(e) => updateSalonProfile("address", e.target.value)}
                    />
                  </div>

                  <div className="sa-form-group">
                    <label className="sa-label">Beschreibung</label>
                    <textarea
                      className="sa-textarea"
                      value={salonProfile.description}
                      onChange={(e) => updateSalonProfile("description", e.target.value)}
                    />
                  </div>

                  <div className="sa-actions">
                    <button className="sa-primary-btn" onClick={saveSalonProfile}>
                      Salon speichern
                    </button>
                  </div>

                  {profileSaved ? <div className="sa-save-success">Salon-Stammdaten gespeichert.</div> : null}
                </div>

                <div className="sa-card sa-card-padding">
                  <h3 style={{ fontSize: 24, fontFamily: '"Playfair Display", Georgia, serif' }}>
                    Öffnungszeiten
                  </h3>

                  <div className="sa-hours-list">
                    {openingHours.map((item, index) => (
                      <div key={item.day} className="sa-hours-row">
                        <div style={{ minWidth: 100 }}>
                          <strong>{item.day}</strong>
                        </div>

                        <div className="sa-line-row-right">
                          <label style={{ display: "flex", alignItems: "center", gap: 6 }}>
                            <input
                              type="checkbox"
                              checked={item.closed}
                              onChange={(e) => updateOpeningHour(index, "closed", e.target.checked)}
                            />
                            <span style={{ fontSize: 13 }}>Geschlossen</span>
                          </label>

                          <input
                            className="sa-input"
                            type="time"
                            value={item.open}
                            disabled={item.closed}
                            onChange={(e) => updateOpeningHour(index, "open", e.target.value)}
                            style={{ width: 120, minHeight: 42 }}
                          />
                          <input
                            className="sa-input"
                            type="time"
                            value={item.close}
                            disabled={item.closed}
                            onChange={(e) => updateOpeningHour(index, "close", e.target.value)}
                            style={{ width: 120, minHeight: 42 }}
                          />
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="sa-actions">
                    <button className="sa-primary-btn" onClick={saveOpeningHours}>
                      Öffnungszeiten speichern
                    </button>
                  </div>

                  {hoursSaved ? <div className="sa-save-success">Öffnungszeiten gespeichert.</div> : null}
                </div>
              </div>

              <div className="sa-grid-2">
                <div className="sa-card sa-card-padding">
                  <h3 style={{ fontSize: 24, fontFamily: '"Playfair Display", Georgia, serif' }}>
                    Preisliste
                  </h3>

                  <div className="sa-grid-mini-3">
                    <input
                      className="sa-input"
                      placeholder="Leistung"
                      value={newPrice.service}
                      onChange={(e) => updateNewPrice("service", e.target.value)}
                    />
                    <input
                      className="sa-input"
                      placeholder="Dauer"
                      value={newPrice.duration}
                      onChange={(e) => updateNewPrice("duration", e.target.value)}
                    />
                    <input
                      className="sa-input"
                      placeholder="Preis €"
                      value={newPrice.price}
                      onChange={(e) => updateNewPrice("price", e.target.value)}
                    />
                  </div>

                  <div className="sa-actions">
                    <button className="sa-secondary-btn" onClick={addPrice}>
                      Preis hinzufügen
                    </button>
                    <button className="sa-primary-btn" onClick={savePrices}>
                      Preisliste speichern
                    </button>
                  </div>

                  <div className="sa-settings-list">
                    {priceList.map((item) => (
                      <div key={item.id} className="sa-line-row">
                        <div className="sa-line-row-left">
                          <strong>{item.service}</strong>
                          <span className="sa-muted">{item.duration}</span>
                        </div>
                        <div className="sa-line-row-right">
                          <span className="sa-chip">€ {item.price}</span>
                          <button className="sa-danger-btn" onClick={() => removePrice(item.id)}>
                            Entfernen
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {pricesSaved ? <div className="sa-save-success">Preisliste gespeichert.</div> : null}
                </div>

                <div className="sa-card sa-card-padding">
                  <h3 style={{ fontSize: 24, fontFamily: '"Playfair Display", Georgia, serif' }}>
                    Stylisten / Team
                  </h3>

                  <div className="sa-grid-mini-2">
                    <input
                      className="sa-input"
                      placeholder="Name"
                      value={newStylist.name}
                      onChange={(e) => updateNewStylist("name", e.target.value)}
                    />
                    <input
                      className="sa-input"
                      placeholder="Rolle"
                      value={newStylist.role}
                      onChange={(e) => updateNewStylist("role", e.target.value)}
                    />
                  </div>

                  <div className="sa-actions">
                    <button className="sa-secondary-btn" onClick={addStylist}>
                      Stylist hinzufügen
                    </button>
                    <button className="sa-primary-btn" onClick={saveStylists}>
                      Team speichern
                    </button>
                  </div>

                  <div className="sa-settings-list">
                    {stylists.map((item) => (
                      <div key={item.id} className="sa-line-row">
                        <div className="sa-line-row-left">
                          <strong>{item.name}</strong>
                          <span className="sa-muted">{item.role}</span>
                        </div>
                        <div className="sa-line-row-right">
                          <button
                            className={`sa-chip-btn ${item.active ? "active" : ""}`}
                            onClick={() => toggleStylistActive(item.id)}
                          >
                            {item.active ? "Aktiv" : "Inaktiv"}
                          </button>
                          <button className="sa-danger-btn" onClick={() => removeStylist(item.id)}>
                            Entfernen
                          </button>
                        </div>
                      </div>
                    ))}
                  </div>

                  {stylistsSaved ? <div className="sa-save-success">Team gespeichert.</div> : null}
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
                  <h3 style={{ fontSize: 24, fontFamily: '"Playfair Display", Georgia, serif' }}>
                    Bestehende Hinweise
                  </h3>
                  <p className="sa-summary-text" style={{ whiteSpace: "pre-line" }}>
                    {selectedCustomer.notes}
                  </p>
                </div>

                <div className="sa-card sa-card-padding">
                  <h3 style={{ fontSize: 24, fontFamily: '"Playfair Display", Georgia, serif' }}>
                    Neue Notiz
                  </h3>
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

                  {noteSaved ? <div className="sa-save-success">Die Salon-Notiz wurde gespeichert.</div> : null}
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
