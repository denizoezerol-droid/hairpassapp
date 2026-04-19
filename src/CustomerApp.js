import React, { useEffect, useMemo, useRef, useState } from "react";

const MAIN_SERVICES = [
  { id: "cut", name: "Haarschnitt", description: "Waschen, Schneiden, Styling", icon: "✂️" },
  { id: "color", name: "Färben", description: "Ansatz, Farbe oder Veredelung", icon: "🎨" },
  { id: "styling", name: "Styling", description: "Finish, Föhnen oder Event-Look", icon: "✨" },
  { id: "care", name: "Pflege", description: "Aufbau, Feuchtigkeit, Repair", icon: "🧴" },
];

const EXTRA_SERVICES = [
  { id: "beard", name: "Bartpflege" },
  { id: "makeup", name: "Make-Up" },
  { id: "massage", name: "Kopfmassage" },
  { id: "eyebrows", name: "Augenbrauen" },
  { id: "gloss", name: "Glossing" },
  { id: "updo", name: "Hochsteckfrisuren" },
];

const STYLIST_OPTIONS = [
  "Egal",
  "Deniz",
  "Sabrina",
  "Julia",
  "Barber Specialist",
  "Color Specialist",
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

const INITIAL_HISTORY = [
  {
    id: "history-1",
    date: "12.04.2026",
    title: "Vorher Haarstatus",
    treatment: "Bestandsaufnahme",
    color: "Dunkelbraun",
    note: "Spitzen trocken, Ansatz leicht rausgewachsen.",
    colorA: "#2f2314",
    colorB: "#111111",
  },
  {
    id: "history-2",
    date: "04.03.2026",
    title: "Nach Glossing",
    treatment: "Glossing + Pflege",
    color: "Warmes Braun",
    note: "Mehr Glanz und weichere Längen.",
    colorA: "#4e3519",
    colorB: "#151515",
  },
];

const INITIAL_INSPIRATIONS = [
  {
    id: "inspo-1",
    title: "Soft Glow Bob",
    subtitle: "Natürlicher, eleganter Look",
    category: "Bob",
    image: "https://images.unsplash.com/photo-1522337360788-8b13dee7a37e"
  },
  {
    id: "inspo-2",
    title: "Warme Balayage",
    subtitle: "Luxuriöser Farbverlauf",
    category: "Color",
    image: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1"
  },
  {
    id: "inspo-3",
    title: "Hochsteckfrisur Elegant",
    subtitle: "Perfekt für Events",
    category: "Updo",
    image: "https://images.unsplash.com/photo-1529626455594-4ff0802cfb7e"
  }
];

const INITIAL_REVIEWS = [
  {
    id: "review-1",
    customerName: "Tascha Schmidt",
    rating: 5,
    comment: "Sehr saubere Beratung und ruhiger Ablauf im Salon.",
    date: "14.04.2026",
  },
  {
    id: "review-2",
    customerName: "Deniz Özerol",
    rating: 4,
    comment: "Look wurde sehr gut verstanden und professionell umgesetzt.",
    date: "02.04.2026",
  },
];

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "profile", label: "Haarprofil" },
  { id: "history", label: "Verlauf" },
  { id: "inspiration", label: "Inspiration" },
  { id: "appointment", label: "Termin" },
  { id: "reviews", label: "Bewertung" },
  { id: "summary", label: "Final" },
];

function InspirationVisual({ title, subtitle, category, image }) {
  return (
    <div
      style={{
        minHeight: 260,
        borderRadius: "20px 20px 0 0",
        overflow: "hidden",
        position: "relative",
        background: "#111",
      }}
    >
      {/* BILD */}
      {image ? (
        <img
          src={image}
          alt={title}
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover"
          }}
        />
      ) : (
        <div style={{
          width: "100%",
          height: "100%",
          background: "linear-gradient(135deg,#333,#111)"
        }} />
      )}

      {/* OVERLAY */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(180deg, rgba(0,0,0,0.1), rgba(0,0,0,0.6))",
        }}
      />

      {/* TEXT */}
      <div
        style={{
          position: "absolute",
          bottom: "14px",
          left: "14px",
          right: "14px",
        }}
      >
        <div className="cu-mini-badge">{category}</div>

        <h3 style={{ margin: "8px 0 4px" }}>{title}</h3>
        <p style={{ margin: 0, fontSize: "13px", opacity: 0.9 }}>
          {subtitle}
        </p>
      </div>
    </div>
  );
}

function HistoryVisual({ title, subtitle, colorA = "#2a2a2a", colorB = "#141414" }) {
  return (
    <div
      style={{
        minHeight: 150,
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
            "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.08), transparent 20%), linear-gradient(180deg, rgba(0,0,0,0.02), rgba(0,0,0,0.34))",
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

function StarRow({ value, onChange, readOnly = false }) {
  return (
    <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => !readOnly && onChange?.(star)}
          style={{
            border: "none",
            background: "transparent",
            color: star <= value ? "#e8cb73" : "rgba(255,255,255,0.24)",
            fontSize: 26,
            cursor: readOnly ? "default" : "pointer",
            padding: 0,
            lineHeight: 1,
          }}
        >
          ★
        </button>
      ))}
    </div>
  );
}

export default function CustomerApp({
  onLogout,
  currentUser,
  sharedRequests = [],
  confirmedRequests = [],
  onCreateRequest,
}) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [profileSaved, setProfileSaved] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [lastSubmittedRequest, setLastSubmittedRequest] = useState(null);
  const [submitError, setSubmitError] = useState("");
  const [popup, setPopup] = useState({ visible: false, title: "", message: "", tone: "default" });
  const [reviews, setReviews] = useState(INITIAL_REVIEWS);
  const [newRating, setNewRating] = useState(5);
  const [newComment, setNewComment] = useState("");
  const [reviewSaved, setReviewSaved] = useState(false);

  const previousConfirmedIdsRef = useRef([]);
  const audioUnlockedRef = useRef(false);

  const [customer, setCustomer] = useState({
    firstName: currentUser?.firstName || "Deniz",
    lastName: currentUser?.lastName || "Özerol",
    email: currentUser?.email || "deniz@example.com",
    phone: currentUser?.phone || "",
  });

  const [hairProfile, setHairProfile] = useState({
    hairLength: "mittel",
    hairStructure: "wellig",
    currentHairColor: "Dunkelbraun",
    previousTreatments: "Glossing vor 6 Wochen",
    allergies: "Keine bekannt",
    notes: "Kopfhaut eher empfindlich, Spitzen trocken",
  });

  const [hairHistory, setHairHistory] = useState(INITIAL_HISTORY);
  const [inspirations, setInspirations] = useState(INITIAL_INSPIRATIONS);

  const [appointmentPrep, setAppointmentPrep] = useState({
    selectedMainService: "",
    selectedExtras: [],
    desiredLook: "",
    preferredStylist: "Egal",
    preferredDate: "",
    preferredTime: "",
    importantNote: "",
  });

  useEffect(() => {
    if (!currentUser) return;
    setCustomer((prev) => ({
      ...prev,
      firstName: currentUser.firstName || prev.firstName,
      lastName: currentUser.lastName || prev.lastName,
      email: currentUser.email || prev.email,
      phone: currentUser.phone || prev.phone,
    }));
  }, [currentUser]);

  useEffect(() => {
    const existing = document.getElementById("hairpass-customer-block-a-styles");
    if (existing) return;

    const style = document.createElement("style");
    style.id = "hairpass-customer-block-a-styles";
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

      .cu-shell { min-height: 100vh; width: 100%; }
      .cu-main {
        width: 100%;
        max-width: 1180px;
        margin: 0 auto;
        padding: 18px;
        padding-bottom: 90px;
      }
      .cu-topbar {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 14px;
        margin-bottom: 18px;
      }
      .cu-badge, .cu-mini-badge {
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
      .cu-title {
        margin: 10px 0 6px;
        font-size: clamp(28px, 4.4vw, 44px);
        line-height: 0.98;
        font-weight: 800;
        letter-spacing: -0.025em;
      }
      .cu-subtitle {
        margin: 0;
        max-width: 760px;
        color: rgba(255,255,255,0.74);
        font-size: clamp(14px, 2.1vw, 18px);
        line-height: 1.55;
      }

      .cu-primary-btn, .cu-secondary-btn, .cu-logout-btn, .cu-nav-btn, .cu-service-btn, .cu-extra-btn {
        -webkit-tap-highlight-color: transparent;
        touch-action: manipulation;
      }

      .cu-primary-btn, .cu-secondary-btn, .cu-logout-btn {
        min-height: 42px;
        padding: 10px 14px;
        border-radius: 14px;
        cursor: pointer;
        font-weight: 700;
        font-size: 13px;
      }
      .cu-primary-btn {
        border: none;
        background: linear-gradient(135deg, #d4af37 0%, #e8cb73 100%);
        color: #121212;
        box-shadow: 0 8px 18px rgba(212,175,55,0.18);
      }
      .cu-secondary-btn {
        border: 1px solid rgba(255,255,255,0.08);
        background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.02));
        color: #fff;
      }
      .cu-logout-btn {
        border: 1px solid rgba(255,80,80,0.22);
        background: linear-gradient(135deg, rgba(110,18,18,0.32), rgba(70,8,8,0.88));
        color: #fff;
        box-shadow: 0 8px 18px rgba(80,0,0,0.18);
      }

      .cu-nav-wrap {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
        margin-bottom: 18px;
      }
      .cu-nav-btn {
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
      .cu-nav-btn.active {
        background: linear-gradient(135deg, rgba(212,175,55,0.17), rgba(255,255,255,0.05));
        border-color: rgba(212,175,55,0.34);
        box-shadow: 0 0 0 1px rgba(255,255,255,0.03);
      }

      .cu-grid, .cu-grid-2, .cu-grid-3, .cu-grid-4, .cu-card-grid, .cu-appointment-layout, .cu-service-grid, .cu-form-grid {
        display: grid;
        gap: 14px;
      }
      .cu-grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .cu-grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .cu-grid-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
      .cu-card-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .cu-appointment-layout { grid-template-columns: minmax(0, 1.45fr) minmax(300px, 0.95fr); }
      .cu-service-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .cu-form-grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }

      .cu-card {
        min-width: 0;
        background: linear-gradient(135deg, rgba(255,255,255,0.055), rgba(255,255,255,0.025));
        border: 1px solid rgba(255,255,255,0.08);
        border-radius: 20px;
        box-shadow: 0 14px 38px rgba(0,0,0,0.22);
        backdrop-filter: blur(16px);
        position: relative;
        overflow: hidden;
      }
      .cu-card::before {
        content: "";
        position: absolute;
        inset: 0;
        background: linear-gradient(180deg, rgba(255,255,255,0.05), transparent 35%);
        pointer-events: none;
      }
      .cu-card-padding { padding: 14px; }
      .cu-hero { padding: 16px; }

      .cu-hero-head, .cu-section-head {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 14px;
      }
      .cu-hero h2, .cu-section-title, .cu-card h3 { margin: 0; }
      .cu-hero h2 {
        margin-top: 10px;
        font-size: clamp(22px, 3.8vw, 32px);
        line-height: 1.08;
      }
      .cu-section-title {
        margin-top: 8px;
        font-size: clamp(20px, 3.2vw, 28px);
        line-height: 1.08;
      }

      .cu-muted {
        color: rgba(255,255,255,0.74);
        line-height: 1.55;
        font-size: 14px;
      }
      .cu-actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        margin-top: 14px;
      }
      .cu-stat-value {
        display: block;
        margin-top: 10px;
        font-size: 20px;
        font-weight: 800;
      }

      .cu-form-group {
        display: flex;
        flex-direction: column;
        gap: 7px;
      }
      .cu-form-group + .cu-form-group { margin-top: 14px; }
      .cu-label {
        font-size: 13px;
        color: rgba(255,255,255,0.78);
        font-weight: 600;
      }
      .cu-input, .cu-textarea {
        width: 100%;
        min-height: 46px;
        border-radius: 14px;
        border: 1px solid rgba(255,255,255,0.09);
        background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.025));
        color: #fff;
        padding: 12px 14px;
        outline: none;
        font-size: 14px;
        backdrop-filter: blur(10px);
      }
      .cu-textarea {
        min-height: 104px;
        resize: vertical;
      }
      .cu-full-width { grid-column: 1 / -1; }

      .cu-service-btn {
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
      .cu-service-btn.active {
        background: linear-gradient(135deg, rgba(212,175,55,0.16), rgba(255,255,255,0.05));
        border-color: rgba(212,175,55,0.35);
      }
      .cu-service-top {
        display: flex;
        align-items: center;
        gap: 10px;
        margin-bottom: 8px;
      }
      .cu-service-icon {
        width: 34px;
        height: 34px;
        display: inline-flex;
        align-items: center;
        justify-content: center;
        border-radius: 12px;
        background: rgba(255,255,255,0.08);
        font-size: 16px;
      }
      .cu-service-name {
        font-size: 15px;
        font-weight: 800;
      }
      .cu-service-desc {
        font-size: 13px;
        color: rgba(255,255,255,0.72);
        line-height: 1.45;
      }

      .cu-extras {
        display: flex;
        flex-wrap: wrap;
        gap: 9px;
        margin-top: 12px;
      }
      .cu-extra-btn {
        min-height: 38px;
        padding: 8px 12px;
        border-radius: 999px;
        border: 1px solid rgba(255,255,255,0.10);
        background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.025));
        color: #fff;
        font-size: 13px;
        font-weight: 700;
        cursor: pointer;
        backdrop-filter: blur(10px);
      }
      .cu-extra-btn.active {
        background: linear-gradient(135deg, rgba(212,175,55,0.16), rgba(255,255,255,0.05));
        border-color: rgba(212,175,55,0.35);
        color: #efcf72;
      }

      .cu-summary-block + .cu-summary-block { margin-top: 14px; }
      .cu-summary-label {
        display: block;
        margin-bottom: 7px;
        color: rgba(255,255,255,0.62);
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
      }
      .cu-summary-text {
        margin: 0;
        color: rgba(255,255,255,0.94);
        line-height: 1.5;
        font-size: 14px;
        word-break: break-word;
      }

      .cu-tag-list {
        display: flex;
        flex-wrap: wrap;
        gap: 8px;
      }
      .cu-tag {
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

      .cu-request-list {
        display: flex;
        flex-direction: column;
        gap: 10px;
      }
      .cu-request-item {
        padding: 14px;
        border-radius: 16px;
        background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.025));
        border: 1px solid rgba(255,255,255,0.07);
        backdrop-filter: blur(12px);
      }
      .cu-request-top {
        display: flex;
        align-items: flex-start;
        justify-content: space-between;
        gap: 10px;
      }
      .cu-request-status {
        display: inline-flex;
        align-items: center;
        padding: 5px 9px;
        border-radius: 999px;
        background: rgba(34,197,94,0.12);
        border: 1px solid rgba(34,197,94,0.18);
        color: #9ff0b8;
        font-size: 11px;
        font-weight: 800;
        text-transform: uppercase;
        letter-spacing: 0.05em;
      }

      .cu-save-box {
        padding: 14px;
        border-radius: 16px;
        background: linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.025));
        border: 1px solid rgba(255,255,255,0.07);
        backdrop-filter: blur(12px);
      }
      .cu-save-success {
        margin-top: 12px;
        padding: 12px 14px;
        border-radius: 14px;
        background: linear-gradient(135deg, rgba(34,197,94,0.14), rgba(255,255,255,0.04));
        border: 1px solid rgba(34,197,94,0.22);
        color: #b8f5c7;
        font-size: 13px;
        font-weight: 600;
      }
      .cu-error-box {
        margin-top: 12px;
        padding: 12px 14px;
        border-radius: 14px;
        background: rgba(239,68,68,0.10);
        border: 1px solid rgba(239,68,68,0.22);
        color: #ffd0d0;
        font-size: 13px;
      }

      .cu-hours-list {
        display: grid;
        gap: 8px;
        margin-top: 14px;
      }
      .cu-hours-row {
        display: flex;
        align-items: center;
        justify-content: space-between;
        gap: 12px;
        padding: 10px 12px;
        border-radius: 14px;
        background: linear-gradient(135deg, rgba(255,255,255,0.04), rgba(255,255,255,0.02));
        border: 1px solid rgba(255,255,255,0.06);
      }

      .cu-popup {
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
        animation: cuSlideIn 0.28s ease;
      }
      .cu-popup-title {
        font-size: 13px;
        font-weight: 800;
        color: #efcf72;
        letter-spacing: 0.05em;
        text-transform: uppercase;
        margin-bottom: 6px;
      }
      .cu-popup-text {
        color: rgba(255,255,255,0.88);
        font-size: 14px;
        line-height: 1.45;
      }
      @keyframes cuSlideIn {
        from { opacity: 0; transform: translateY(-8px) scale(0.98); }
        to { opacity: 1; transform: translateY(0) scale(1); }
      }

      .cu-modal-backdrop {
        position: fixed;
        inset: 0;
        background: rgba(0,0,0,0.62);
        backdrop-filter: blur(8px);
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 14px;
        z-index: 1000;
      }
      .cu-modal {
        width: 100%;
        max-width: 500px;
        padding: 18px;
        border-radius: 22px;
        background: linear-gradient(135deg, rgba(17,20,27,0.92), rgba(10,12,18,0.98));
        border: 1px solid rgba(255,255,255,0.10);
        box-shadow: 0 24px 70px rgba(0,0,0,0.36);
        backdrop-filter: blur(18px);
      }
      .cu-modal h3 {
        margin: 10px 0 10px;
        font-size: 24px;
      }
      .cu-modal p {
        margin: 0;
        color: rgba(255,255,255,0.8);
        line-height: 1.55;
        font-size: 14px;
      }
      .cu-modal-actions {
        display: flex;
        gap: 10px;
        flex-wrap: wrap;
        margin-top: 18px;
      }

      @media (max-width: 1050px) {
        .cu-grid-4,
        .cu-grid-3,
        .cu-grid-2,
        .cu-card-grid,
        .cu-appointment-layout,
        .cu-service-grid,
        .cu-form-grid {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 820px) {
        .cu-main {
          padding: 14px;
          padding-bottom: 90px;
        }
        .cu-topbar, .cu-hero-head, .cu-section-head {
          flex-direction: column;
          align-items: stretch;
        }
        .cu-logout-btn, .cu-actions > *, .cu-modal-actions > * {
          width: 100%;
        }
        .cu-actions, .cu-modal-actions {
          flex-direction: column;
        }
      }

      @media (max-width: 520px) {
        .cu-nav-wrap {
          display: grid;
          grid-template-columns: repeat(2, minmax(0, 1fr));
          gap: 8px;
        }
        .cu-nav-btn {
          width: 100%;
          min-height: 42px;
          text-align: center;
          white-space: normal;
        }
        .cu-title { font-size: 31px; }
        .cu-card-padding, .cu-hero, .cu-modal { padding: 14px; }
        .cu-request-top {
          flex-direction: column;
          align-items: flex-start;
        }
        .cu-popup {
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
        oscillator.frequency.setValueAtTime(740, ctx.currentTime);
        oscillator.frequency.linearRampToValueAtTime(880, ctx.currentTime + 0.12);
        gainNode.gain.setValueAtTime(0.001, ctx.currentTime);
        gainNode.gain.linearRampToValueAtTime(0.06, ctx.currentTime + 0.02);
        gainNode.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.35);
        oscillator.start(ctx.currentTime);
        oscillator.stop(ctx.currentTime + 0.35);
      } else {
        oscillator.type = "triangle";
        oscillator.frequency.setValueAtTime(620, ctx.currentTime);
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
    }, 2600);
  };

  useEffect(() => {
    const confirmedIds = (confirmedRequests || []).map((item) => item.id);

    if (previousConfirmedIdsRef.current.length === 0) {
      previousConfirmedIdsRef.current = confirmedIds;
      return;
    }

    const newlyConfirmed = (confirmedRequests || []).find(
      (item) => !previousConfirmedIdsRef.current.includes(item.id)
    );

    if (newlyConfirmed) {
      showPopupMessage(
        "Termin bestätigt",
        `Dein Termin für ${newlyConfirmed.mainService} wurde bestätigt.`,
        "confirmed"
      );
    }

    previousConfirmedIdsRef.current = confirmedIds;
  }, [confirmedRequests]); // eslint-disable-line

  const selectedMainService = useMemo(
    () =>
      MAIN_SERVICES.find(
        (service) => service.id === appointmentPrep.selectedMainService
      ) || null,
    [appointmentPrep.selectedMainService]
  );

  const selectedExtras = useMemo(
    () =>
      appointmentPrep.selectedExtras
        .map((id) => EXTRA_SERVICES.find((item) => item.id === id))
        .filter(Boolean),
    [appointmentPrep.selectedExtras]
  );

  const latestRequest = sharedRequests?.[0] || null;

  const averageRating = useMemo(() => {
    if (!reviews.length) return "0.0";
    const total = reviews.reduce((sum, item) => sum + item.rating, 0);
    return (total / reviews.length).toFixed(1);
  }, [reviews]);

  const updateCustomer = (field, value) => {
    setCustomer((prev) => ({ ...prev, [field]: value }));
    setProfileSaved(false);
  };

  const updateHairProfile = (field, value) => {
    setHairProfile((prev) => ({ ...prev, [field]: value }));
    setProfileSaved(false);
  };

  const updateAppointment = (field, value) => {
    setAppointmentPrep((prev) => ({ ...prev, [field]: value }));
    setSubmitError("");
  };

  const toggleExtra = (extraId) => {
    setAppointmentPrep((prev) => {
      const exists = prev.selectedExtras.includes(extraId);
      return {
        ...prev,
        selectedExtras: exists
          ? prev.selectedExtras.filter((id) => id !== extraId)
          : [...prev.selectedExtras, extraId],
      };
    });
    setSubmitError("");
  };

  const addDemoHistory = () => {
    const next = {
      id: `history-${Date.now()}`,
      date: new Date().toLocaleDateString("de-DE"),
      title: `Neuer Verlauf ${hairHistory.length + 1}`,
      treatment: "Neue Behandlung",
      color: hairProfile.currentHairColor,
      note: "Aktueller Zustand vor dem nächsten Termin gespeichert.",
      colorA: "#5a3f1d",
      colorB: "#1a1a1a",
    };
    setHairHistory((prev) => [next, ...prev]);
  };

  const addDemoInspiration = () => {
    const next = {
      id: `inspo-${Date.now()}`,
      title: `Neue Luxus-Inspiration ${inspirations.length + 1}`,
      subtitle: "Neue Richtung für deinen nächsten Termin",
      category: "Luxury Look",
      colorA: "#7b5a2f",
      colorB: "#171717",
    };
    setInspirations((prev) => [next, ...prev]);
  };

  const handleSaveProfile = () => {
    unlockAudio();
    setProfileSaved(true);
    showPopupMessage("Profil gespeichert", "Dein Haarprofil wurde aktualisiert.");
    setTimeout(() => setProfileSaved(false), 2200);
  };

  const handleUseInspiration = (item) => {
    unlockAudio();
    setAppointmentPrep((prev) => ({
      ...prev,
      desiredLook: item.title,
    }));
    showPopupMessage("Wunschlook übernommen", `${item.title} wurde übernommen.`);
    setActiveTab("appointment");
  };

  const handleSubmitReview = () => {
    unlockAudio();

    if (!newComment.trim()) {
      showPopupMessage("Bewertung fehlt", "Bitte schreibe kurz, wie dein Termin war.");
      return;
    }

    const newEntry = {
      id: `review-${Date.now()}`,
      customerName: `${customer.firstName} ${customer.lastName}`,
      rating: newRating,
      comment: newComment.trim(),
      date: new Date().toLocaleDateString("de-DE"),
    };

    setReviews((prev) => [newEntry, ...prev]);
    setNewComment("");
    setNewRating(5);
    setReviewSaved(true);
    showPopupMessage("Bewertung gespeichert", "Danke für dein Feedback zum Salon.", "default");
    setTimeout(() => setReviewSaved(false), 2200);
  };

  const handleSubmitRequest = () => {
    unlockAudio();

    if (!selectedMainService) {
      setSubmitError("Bitte wähle zuerst eine Hauptleistung aus.");
      setActiveTab("appointment");
      return;
    }

    if (typeof onCreateRequest !== "function") {
      setSubmitError("Die Termin-Synchronisierung ist aktuell nicht verbunden.");
      return;
    }

    const created = onCreateRequest({
      mainService: selectedMainService.name,
      extras: selectedExtras.map((item) => item.name),
      desiredLook: appointmentPrep.desiredLook || "Keine Angabe",
      preferredStylist: appointmentPrep.preferredStylist || "Egal",
      preferredDate: appointmentPrep.preferredDate || "Kein Datum",
      preferredTime: appointmentPrep.preferredTime || "",
      importantNote: appointmentPrep.importantNote || "Keine Angabe",
    });

    setLastSubmittedRequest(created || null);
    setShowSuccessModal(true);
    setSubmitError("");
    showPopupMessage(
      "Anfrage übermittelt",
      "Deine Anfrage wurde an den Salon übermittelt.",
      "default"
    );
    setActiveTab("dashboard");
  };

  return (
    <>
      <div className="cu-shell">
        <main className="cu-main">
          <div className="cu-topbar">
            <div>
              <span className="cu-badge">Hair Pass · Kunde</span>
              <h1 className="cu-title">Kundenbereich</h1>
              <p className="cu-subtitle">
                Verwalte deinen digitalen Haarpass, deine Wunschlooks und bereite
                deinen nächsten Termin sauber vor.
              </p>
            </div>

            <button
              className="cu-logout-btn"
              onClick={() => {
                unlockAudio();
                onLogout();
              }}
            >
              Logout
            </button>
          </div>

          <div className="cu-nav-wrap">
            {NAV_ITEMS.map((item) => (
              <button
                key={item.id}
                className={`cu-nav-btn ${activeTab === item.id ? "active" : ""}`}
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
            <div className="cu-card cu-card-padding" style={{ marginBottom: "14px" }}>
  <span className="cu-mini-badge">Mein Salon</span>

  <div style={{
    display: "flex",
    alignItems: "center",
    gap: "14px",
    marginTop: "12px"
  }}>
    {/* LOGO */}
    <div style={{
      width: "54px",
      height: "54px",
      borderRadius: "14px",
      background: "linear-gradient(135deg, #d4af37, #e8cb73)",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontWeight: "800",
      color: "#111"
    }}>
      HP
    </div>

    {/* INFOS */}
    <div style={{ flex: 1 }}>
      <h3 style={{ margin: 0, fontSize: "16px" }}>
        Hair Pass Studio
      </h3>

      <p style={{
        margin: "4px 0",
        fontSize: "13px",
        color: "rgba(255,255,255,0.7)"
      }}>
        Luxury Hair & Color
      </p>

      <div style={{
        display: "flex",
        alignItems: "center",
        gap: "6px",
        fontSize: "12px",
        color: "#9ff0b8"
      }}>
        ● Live
      </div>
    </div>

    {/* BUTTON */}
    <button className="cu-secondary-btn">
      Ansehen
    </button>
  </div>
</div>
            <section className="cu-grid">
              <div className="cu-card cu-hero">
                <div className="cu-hero-head">
                  <div>
                    <span className="cu-mini-badge">Willkommen zurück</span>
                    <h2>Hallo {customer.firstName}, dein digitaler Haarpass ist bereit.</h2>
                    <p className="cu-muted">
                      Pflege dein Haarprofil, speichere deinen Verlauf, sammle Inspirationen
                      und bereite den nächsten Termin sauber vor.
                    </p>
                  </div>

                  <button
                    className="cu-primary-btn"
                    onClick={() => {
                      unlockAudio();
                      setActiveTab("appointment");
                    }}
                  >
                    Termin starten
                  </button>
                </div>

                <div className="cu-actions">
                  <button className="cu-secondary-btn" onClick={() => setActiveTab("profile")}>
                    Profil öffnen
                  </button>
                  <button className="cu-secondary-btn" onClick={() => setActiveTab("history")}>
                    Verlauf ansehen
                  </button>
                  <button className="cu-secondary-btn" onClick={() => setActiveTab("inspiration")}>
                    Inspirationen
                  </button>
                </div>
              </div>

              <div className="cu-grid-4">
                <div className="cu-card cu-card-padding">
                  <span className="cu-mini-badge">Haarlänge</span>
                  <span className="cu-stat-value">{hairProfile.hairLength}</span>
                </div>

                <div className="cu-card cu-card-padding">
                  <span className="cu-mini-badge">Haarstruktur</span>
                  <span className="cu-stat-value">{hairProfile.hairStructure}</span>
                </div>

                <div className="cu-card cu-card-padding">
                  <span className="cu-mini-badge">Verläufe</span>
                  <span className="cu-stat-value">{hairHistory.length}</span>
                </div>

                <div className="cu-card cu-card-padding">
                  <span className="cu-mini-badge">Bewertung</span>
                  <span className="cu-stat-value">⭐ {averageRating}</span>
                </div>
              </div>

              <div className="cu-grid-2">
                <div className="cu-card cu-card-padding">
                  <span className="cu-mini-badge">Öffnungszeiten</span>
                  <h3 style={{ marginTop: 12, fontSize: 18 }}>Hair Pass Studio</h3>
                  <div className="cu-hours-list">
                    {OPENING_HOURS.map((item) => (
                      <div key={item.day} className="cu-hours-row">
                        <strong style={{ fontSize: 14 }}>{item.day}</strong>
                        <span style={{ color: "rgba(255,255,255,0.78)", fontSize: 14 }}>{item.value}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="cu-card cu-card-padding">
                  <span className="cu-mini-badge">Synchronisierte Anfragen</span>
                  <h3 style={{ marginTop: 12, fontSize: 18 }}>Dein aktueller Status</h3>

                  {!sharedRequests || sharedRequests.length === 0 ? (
                    <p className="cu-muted" style={{ marginBottom: 0 }}>
                      Noch keine Anfrage gesendet.
                    </p>
                  ) : (
                    <div className="cu-request-list" style={{ marginTop: 14 }}>
                      {sharedRequests.map((request) => (
                        <div key={request.id} className="cu-request-item">
                          <div className="cu-request-top">
                            <div>
                              <strong>{request.mainService}</strong>
                              <p className="cu-muted" style={{ margin: "6px 0 0 0" }}>
                                {request.preferredDate}
                                {request.preferredTime ? ` um ${request.preferredTime}` : ""}
                              </p>
                            </div>
                            <span className="cu-request-status">{request.status}</span>
                          </div>

                          <div className="cu-summary-block">
                            <span className="cu-summary-label">Wunschfriseur</span>
                            <p className="cu-summary-text">{request.preferredStylist || "Egal"}</p>
                          </div>

                          <div className="cu-summary-block">
                            <span className="cu-summary-label">Wunschlook</span>
                            <p className="cu-summary-text">{request.desiredLook}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>

              {!!confirmedRequests?.length && (
                <div className="cu-card cu-card-padding">
                  <span className="cu-mini-badge">Bestätigte Termine</span>
                  <h3 style={{ marginTop: 12, fontSize: 18 }}>Vom Salon bestätigt</h3>

                  <div className="cu-request-list" style={{ marginTop: 14 }}>
                    {confirmedRequests.map((request) => (
                      <div key={request.id} className="cu-request-item">
                        <div className="cu-request-top">
                          <div>
                            <strong>{request.mainService}</strong>
                            <p className="cu-muted" style={{ margin: "6px 0 0 0" }}>
                              {request.preferredDate}
                              {request.preferredTime ? ` um ${request.preferredTime}` : ""}
                            </p>
                          </div>
                          <span className="cu-request-status">{request.status}</span>
                        </div>

                        <div className="cu-summary-block">
                          <span className="cu-summary-label">Wunschfriseur</span>
                          <p className="cu-summary-text">{request.preferredStylist || "Egal"}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </section>
          )}

          {activeTab === "profile" && (
            <section className="cu-grid">
              <div className="cu-section-head">
                <div>
                  <span className="cu-mini-badge">Mein Haarprofil</span>
                  <h2 className="cu-section-title">Persönliche Daten und Haarinformationen</h2>
                  <p className="cu-muted">
                    Alles, was dein Salon für eine bessere Vorbereitung braucht.
                  </p>
                </div>
              </div>

              <div className="cu-grid-2">
                <div className="cu-card cu-card-padding">
                  <h3 style={{ marginBottom: 16 }}>Kundendaten</h3>

                  <div className="cu-form-group">
                    <label className="cu-label">Vorname</label>
                    <input
                      className="cu-input"
                      value={customer.firstName}
                      onChange={(e) => updateCustomer("firstName", e.target.value)}
                    />
                  </div>

                  <div className="cu-form-group">
                    <label className="cu-label">Nachname</label>
                    <input
                      className="cu-input"
                      value={customer.lastName}
                      onChange={(e) => updateCustomer("lastName", e.target.value)}
                    />
                  </div>

                  <div className="cu-form-group">
                    <label className="cu-label">E-Mail</label>
                    <input
                      className="cu-input"
                      value={customer.email}
                      onChange={(e) => updateCustomer("email", e.target.value)}
                    />
                  </div>

                  <div className="cu-form-group">
                    <label className="cu-label">Telefon</label>
                    <input
                      className="cu-input"
                      value={customer.phone}
                      onChange={(e) => updateCustomer("phone", e.target.value)}
                    />
                  </div>
                </div>

                <div className="cu-card cu-card-padding">
                  <h3 style={{ marginBottom: 16 }}>Haarprofil</h3>

                  <div className="cu-form-group">
                    <label className="cu-label">Haarlänge</label>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {["kurz", "mittel", "lang"].map((value) => {
                        const active = hairProfile.hairLength === value;
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => updateHairProfile("hairLength", value)}
                            className="cu-extra-btn"
                            style={{
                              border: active
                                ? "1px solid rgba(212,175,55,0.35)"
                                : "1px solid rgba(255,255,255,0.10)",
                              background: active
                                ? "linear-gradient(135deg, rgba(212,175,55,0.16), rgba(255,255,255,0.05))"
                                : "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.025))",
                              color: active ? "#efcf72" : "#fff",
                            }}
                          >
                            {value.charAt(0).toUpperCase() + value.slice(1)}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="cu-form-group">
                    <label className="cu-label">Haarstruktur</label>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      {["glatt", "wellig", "lockig", "kraus"].map((value) => {
                        const active = hairProfile.hairStructure === value;
                        return (
                          <button
                            key={value}
                            type="button"
                            onClick={() => updateHairProfile("hairStructure", value)}
                            className="cu-extra-btn"
                            style={{
                              border: active
                                ? "1px solid rgba(212,175,55,0.35)"
                                : "1px solid rgba(255,255,255,0.10)",
                              background: active
                                ? "linear-gradient(135deg, rgba(212,175,55,0.16), rgba(255,255,255,0.05))"
                                : "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.025))",
                              color: active ? "#efcf72" : "#fff",
                            }}
                          >
                            {value.charAt(0).toUpperCase() + value.slice(1)}
                          </button>
                        );
                      })}
                    </div>
                  </div>

                  <div className="cu-form-group">
                    <label className="cu-label">Aktuelle Haarfarbe</label>
                    <input
                      className="cu-input"
                      value={hairProfile.currentHairColor}
                      onChange={(e) => updateHairProfile("currentHairColor", e.target.value)}
                    />
                  </div>

                  <div className="cu-form-group">
                    <label className="cu-label">Frühere Behandlungen</label>
                    <textarea
                      className="cu-textarea"
                      value={hairProfile.previousTreatments}
                      onChange={(e) => updateHairProfile("previousTreatments", e.target.value)}
                    />
                  </div>

                  <div className="cu-form-group">
                    <label className="cu-label">Allergien / Hinweise</label>
                    <textarea
                      className="cu-textarea"
                      value={hairProfile.allergies}
                      onChange={(e) => updateHairProfile("allergies", e.target.value)}
                    />
                  </div>

                  <div className="cu-form-group">
                    <label className="cu-label">Persönliche Notizen</label>
                    <textarea
                      className="cu-textarea"
                      value={hairProfile.notes}
                      onChange={(e) => updateHairProfile("notes", e.target.value)}
                    />
                  </div>
                </div>
              </div>

              <div className="cu-save-box">
                <div
                  style={{
                    display: "flex",
                    gap: "10px",
                    flexWrap: "wrap",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <div>
                    <span className="cu-mini-badge">Profil</span>
                    <p className="cu-muted" style={{ margin: "10px 0 0 0", fontSize: "13px" }}>
                      Speichere deine Änderungen, damit dein Salon mit aktuellen Daten arbeitet.
                    </p>
                  </div>

                  <button className="cu-primary-btn" onClick={handleSaveProfile}>
                    Änderungen speichern
                  </button>
                </div>

                {profileSaved ? (
                  <div className="cu-save-success">
                    Dein Haarprofil wurde gespeichert.
                  </div>
                ) : null}
              </div>
            </section>
          )}

          {activeTab === "history" && (
            <section className="cu-grid">
              <div className="cu-section-head">
                <div>
                  <span className="cu-mini-badge">Haarverlauf</span>
                  <h2 className="cu-section-title">Deine bisherigen Haarstände</h2>
                  <p className="cu-muted">
                    Die Timeline deiner Haare – was gemacht wurde und wie dein Haar zuletzt aussah.
                  </p>
                </div>

                <button className="cu-primary-btn" onClick={addDemoHistory}>
                  + Verlauf
                </button>
              </div>

              <div className="cu-grid">
                {hairHistory.map((item) => (
                  <div key={item.id} className="cu-card">
                    <HistoryVisual
                      title={item.title}
                      subtitle={item.date}
                      colorA={item.colorA}
                      colorB={item.colorB}
                    />
                    <div className="cu-card-padding">
                      <span className="cu-mini-badge">{item.date}</span>

                      <div className="cu-summary-block">
                        <span className="cu-summary-label">Behandlung</span>
                        <p className="cu-summary-text">{item.treatment}</p>
                      </div>

                      <div className="cu-summary-block">
                        <span className="cu-summary-label">Farbstand</span>
                        <p className="cu-summary-text">{item.color}</p>
                      </div>

                      <div className="cu-summary-block">
                        <span className="cu-summary-label">Notiz</span>
                        <p className="cu-summary-text">{item.note}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === "inspiration" && (
            <section className="cu-grid">
              <div className="cu-section-head">
                <div>
                  <span className="cu-mini-badge">Inspiration</span>
                  <h2 className="cu-section-title">Looks und Ideen für deinen nächsten Termin</h2>
                  <p className="cu-muted">
                    Speichere Richtungen und Wunschlooks für die Beratung im Salon.
                  </p>
                </div>

                <button className="cu-primary-btn" onClick={addDemoInspiration}>
                  + Inspiration
                </button>
              </div>

              <div className="cu-card-grid">
                {inspirations.map((item) => (
                  <div key={item.id} className="cu-card" style={{ overflow: "hidden" }}>
                    <InspirationVisual
                      title={item.title}
                      subtitle={item.subtitle}
                      category={item.category}
                      colorA={item.colorA}
                      colorB={item.colorB}
                    />
                    <div className="cu-card-padding">
                      <div className="cu-summary-block" style={{ marginTop: 0 }}>
                        <span className="cu-summary-label">Beschreibung</span>
                        <p className="cu-summary-text">{item.subtitle}</p>
                      </div>

                      <div className="cu-actions">
                        <button
                          className="cu-primary-btn"
                          onClick={() => handleUseInspiration(item)}
                        >
                          Als Wunschlook wählen
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {activeTab === "appointment" && (
            <section className="cu-grid">
              <div className="cu-section-head">
                <div>
                  <span className="cu-mini-badge">Termin vorbereiten</span>
                  <h2 className="cu-section-title">Hauptleistung und Extras auswählen</h2>
                  <p className="cu-muted">
                    Teile dem Salon vorab mit, was du möchtest und worauf geachtet werden soll.
                  </p>
                </div>
              </div>

              <div className="cu-appointment-layout">
                <div className="cu-card cu-card-padding">
                  <h3 style={{ marginBottom: 14 }}>1. Hauptleistung</h3>

                  <div className="cu-service-grid">
                    {MAIN_SERVICES.map((service) => (
                      <button
                        key={service.id}
                        className={`cu-service-btn ${
                          appointmentPrep.selectedMainService === service.id ? "active" : ""
                        }`}
                        onClick={() => updateAppointment("selectedMainService", service.id)}
                      >
                        <div className="cu-service-top">
                          <span className="cu-service-icon">{service.icon}</span>
                          <span className="cu-service-name">{service.name}</span>
                        </div>
                        <div className="cu-service-desc">{service.description}</div>
                      </button>
                    ))}
                  </div>

                  <h3 style={{ marginTop: 22, marginBottom: 10 }}>2. Extras</h3>

                  <div className="cu-extras">
                    {EXTRA_SERVICES.map((extra) => (
                      <button
                        key={extra.id}
                        className={`cu-extra-btn ${
                          appointmentPrep.selectedExtras.includes(extra.id) ? "active" : ""
                        }`}
                        onClick={() => toggleExtra(extra.id)}
                      >
                        {extra.name}
                      </button>
                    ))}
                  </div>

                  <div className="cu-form-grid" style={{ marginTop: 18 }}>
                    <div className="cu-form-group">
                      <label className="cu-label">Gewünschter Look</label>
                      <input
                        className="cu-input"
                        placeholder="z. B. natürlicher Glow Bob"
                        value={appointmentPrep.desiredLook}
                        onChange={(e) => updateAppointment("desiredLook", e.target.value)}
                      />
                    </div>

                    <div className="cu-form-group">
                      <label className="cu-label">Wunschfriseur</label>
                      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                        {STYLIST_OPTIONS.map((stylist) => {
                          const active = appointmentPrep.preferredStylist === stylist;
                          return (
                            <button
                              key={stylist}
                              type="button"
                              onClick={() => updateAppointment("preferredStylist", stylist)}
                              className="cu-extra-btn"
                              style={{
                                border: active
                                  ? "1px solid rgba(212,175,55,0.35)"
                                  : "1px solid rgba(255,255,255,0.10)",
                                background: active
                                  ? "linear-gradient(135deg, rgba(212,175,55,0.16), rgba(255,255,255,0.05))"
                                  : "linear-gradient(135deg, rgba(255,255,255,0.05), rgba(255,255,255,0.025))",
                                color: active ? "#efcf72" : "#fff",
                              }}
                            >
                              {stylist}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    <div className="cu-form-group">
                      <label className="cu-label">Wunschdatum</label>
                      <input
                        className="cu-input"
                        type="date"
                        value={appointmentPrep.preferredDate}
                        onChange={(e) => updateAppointment("preferredDate", e.target.value)}
                      />
                    </div>

                    <div className="cu-form-group">
                      <label className="cu-label">Wunschzeit</label>
                      <input
                        className="cu-input"
                        type="time"
                        value={appointmentPrep.preferredTime}
                        onChange={(e) => updateAppointment("preferredTime", e.target.value)}
                      />
                    </div>

                    <div className="cu-form-group cu-full-width">
                      <label className="cu-label">Hinweise an den Salon</label>
                      <textarea
                        className="cu-textarea"
                        placeholder="z. B. empfindliche Kopfhaut, pflegeleicht, wenig Zeit"
                        value={appointmentPrep.importantNote}
                        onChange={(e) => updateAppointment("importantNote", e.target.value)}
                      />
                    </div>
                  </div>

                  {submitError ? <div className="cu-error-box">{submitError}</div> : null}
                </div>

                <div className="cu-card cu-card-padding">
                  <span className="cu-mini-badge">Live-Vorschau</span>
                  <h3 style={{ marginTop: 12, fontSize: 18 }}>Dein Terminwunsch</h3>

                  <div className="cu-summary-block">
                    <span className="cu-summary-label">Hauptleistung</span>
                    <p className="cu-summary-text">
                      {selectedMainService?.name || "Nicht gewählt"}
                    </p>
                  </div>

                  <div className="cu-summary-block">
                    <span className="cu-summary-label">Extras</span>
                    {selectedExtras.length > 0 ? (
                      <div className="cu-tag-list">
                        {selectedExtras.map((item) => (
                          <span key={item.id} className="cu-tag">{item.name}</span>
                        ))}
                      </div>
                    ) : (
                      <p className="cu-summary-text">Keine Extras gewählt</p>
                    )}
                  </div>

                  <div className="cu-summary-block">
                    <span className="cu-summary-label">Wunschlook</span>
                    <p className="cu-summary-text">
                      {appointmentPrep.desiredLook || "Keine Angabe"}
                    </p>
                  </div>

                  <div className="cu-summary-block">
                    <span className="cu-summary-label">Wunschfriseur</span>
                    <p className="cu-summary-text">
                      {appointmentPrep.preferredStylist || "Egal"}
                    </p>
                  </div>

                  <div className="cu-summary-block">
                    <span className="cu-summary-label">Termin</span>
                    <p className="cu-summary-text">
                      {appointmentPrep.preferredDate || "Kein Datum"}
                      {appointmentPrep.preferredTime ? ` um ${appointmentPrep.preferredTime}` : ""}
                    </p>
                  </div>

                  <div className="cu-summary-block">
                    <span className="cu-summary-label">Hinweise an den Salon</span>
                    <p className="cu-summary-text">
                      {appointmentPrep.importantNote || "Keine Angabe"}
                    </p>
                  </div>

                  <div className="cu-actions">
                    <button className="cu-primary-btn" onClick={() => setActiveTab("summary")}>
                      Final prüfen
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === "reviews" && (
            <section className="cu-grid">
              <div className="cu-section-head">
                <div>
                  <span className="cu-mini-badge">Bewertungssystem</span>
                  <h2 className="cu-section-title">Deine Bewertung für den Salon</h2>
                  <p className="cu-muted">
                    Teile dein Erlebnis und hilf dem Salon mit ehrlichem Feedback.
                  </p>
                </div>
              </div>

              <div className="cu-grid-2">
                <div className="cu-card cu-card-padding">
                  <h3 style={{ marginBottom: 16 }}>Neue Bewertung</h3>

                  <div className="cu-form-group">
                    <label className="cu-label">Sterne</label>
                    <StarRow value={newRating} onChange={setNewRating} />
                  </div>

                  <div className="cu-form-group">
                    <label className="cu-label">Kommentar</label>
                    <textarea
                      className="cu-textarea"
                      placeholder="Wie war dein Termin im Salon?"
                      value={newComment}
                      onChange={(e) => setNewComment(e.target.value)}
                    />
                  </div>

                  <div className="cu-actions">
                    <button className="cu-primary-btn" onClick={handleSubmitReview}>
                      Bewertung speichern
                    </button>
                  </div>

                  {reviewSaved ? (
                    <div className="cu-save-success">
                      Deine Bewertung wurde gespeichert.
                    </div>
                  ) : null}
                </div>

                <div className="cu-card cu-card-padding">
                  <span className="cu-mini-badge">Durchschnitt</span>
                  <h3 style={{ marginTop: 12, fontSize: 18 }}>⭐ {averageRating} / 5</h3>
                  <p className="cu-muted" style={{ marginTop: 8 }}>
                    Basierend auf den letzten Kundenerfahrungen im Hair Pass Studio.
                  </p>

                  <div className="cu-request-list" style={{ marginTop: 16 }}>
                    {reviews.slice(0, 3).map((item) => (
                      <div key={item.id} className="cu-request-item">
                        <div className="cu-request-top">
                          <div>
                            <strong>{item.customerName}</strong>
                            <p className="cu-muted" style={{ margin: "6px 0 0 0" }}>
                              {item.date}
                            </p>
                          </div>
                          <span className="cu-request-status">⭐ {item.rating}</span>
                        </div>

                        <div className="cu-summary-block">
                          <span className="cu-summary-label">Kommentar</span>
                          <p className="cu-summary-text">{item.comment}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>
          )}

          {activeTab === "summary" && (
            <section className="cu-grid">
              <div className="cu-section-head">
                <div>
                  <span className="cu-mini-badge">Zusammenfassung</span>
                  <h2 className="cu-section-title">Alles auf einen Blick vor dem Absenden</h2>
                  <p className="cu-muted">
                    So würde dein Wunsch an den Salon übermittelt werden.
                  </p>
                </div>
              </div>

              <div className="cu-grid-2">
                <div className="cu-card cu-card-padding">
                  <h3 style={{ marginBottom: 16 }}>Kunde</h3>

                  <div className="cu-summary-block">
                    <span className="cu-summary-label">Name</span>
                    <p className="cu-summary-text">
                      {customer.firstName} {customer.lastName}
                    </p>
                  </div>

                  <div className="cu-summary-block">
                    <span className="cu-summary-label">Kontakt</span>
                    <p className="cu-summary-text">{customer.email}</p>
                    <p className="cu-summary-text">{customer.phone}</p>
                  </div>

                  <div className="cu-summary-block">
                    <span className="cu-summary-label">Haarprofil</span>
                    <p className="cu-summary-text">
                      {hairProfile.hairLength}, {hairProfile.hairStructure}, {hairProfile.currentHairColor}
                    </p>
                  </div>
                </div>

                <div className="cu-card cu-card-padding">
                  <h3 style={{ marginBottom: 16 }}>Terminwunsch</h3>

                  <div className="cu-summary-block">
                    <span className="cu-summary-label">Hauptleistung</span>
                    <p className="cu-summary-text">
                      {selectedMainService?.name || "Nicht gewählt"}
                    </p>
                  </div>

                  <div className="cu-summary-block">
                    <span className="cu-summary-label">Extras</span>
                    {selectedExtras.length > 0 ? (
                      <div className="cu-tag-list">
                        {selectedExtras.map((item) => (
                          <span key={item.id} className="cu-tag">{item.name}</span>
                        ))}
                      </div>
                    ) : (
                      <p className="cu-summary-text">Keine Extras gewählt</p>
                    )}
                  </div>

                  <div className="cu-summary-block">
                    <span className="cu-summary-label">Wunschlook</span>
                    <p className="cu-summary-text">
                      {appointmentPrep.desiredLook || "Keine Angabe"}
                    </p>
                  </div>

                  <div className="cu-summary-block">
                    <span className="cu-summary-label">Wunschfriseur</span>
                    <p className="cu-summary-text">
                      {appointmentPrep.preferredStylist || "Egal"}
                    </p>
                  </div>

                  <div className="cu-summary-block">
                    <span className="cu-summary-label">Termin</span>
                    <p className="cu-summary-text">
                      {appointmentPrep.preferredDate || "Kein Datum"}
                      {appointmentPrep.preferredTime ? ` um ${appointmentPrep.preferredTime}` : ""}
                    </p>
                  </div>

                  <div className="cu-summary-block">
                    <span className="cu-summary-label">Hinweise an den Salon</span>
                    <p className="cu-summary-text">
                      {appointmentPrep.importantNote || "Keine Angabe"}
                    </p>
                  </div>

                  <div className="cu-actions">
                    <button className="cu-secondary-btn" onClick={() => setActiveTab("appointment")}>
                      Bearbeiten
                    </button>
                    <button className="cu-primary-btn" onClick={handleSubmitRequest}>
                      Anfrage vorbereiten
                    </button>
                  </div>
                </div>
              </div>
            </section>
          )}
        </main>
      </div>

      {popup.visible ? (
        <div className="cu-popup">
          <div className="cu-popup-title">{popup.title}</div>
          <div className="cu-popup-text">{popup.message}</div>
        </div>
      ) : null}

      {showSuccessModal && lastSubmittedRequest ? (
        <div className="cu-modal-backdrop">
          <div className="cu-modal">
            <span className="cu-mini-badge">Anfrage gesendet</span>
            <h3>Dein Terminwunsch wurde synchron gespeichert.</h3>
            <p>
              Die Anfrage für <strong>{lastSubmittedRequest.mainService}</strong> ist jetzt
              auch im Salonbereich sichtbar.
            </p>

            <div className="cu-modal-actions">
              <button
                className="cu-secondary-btn"
                onClick={() => {
                  setShowSuccessModal(false);
                  setActiveTab("dashboard");
                }}
              >
                Zum Dashboard
              </button>

              <button
                className="cu-primary-btn"
                onClick={() => {
                  setShowSuccessModal(false);
                  setActiveTab("summary");
                }}
              >
                Anfrage ansehen
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
