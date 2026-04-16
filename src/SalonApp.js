import React, { useEffect, useMemo, useState } from "react";

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

const NAV_ITEMS = [
  { id: "dashboard", label: "Dashboard" },
  { id: "customers", label: "Kunden" },
  { id: "requests", label: "Anfragen" },
  { id: "history", label: "Verlauf" },
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

export default function SalonApp({
  onLogout,
  currentUser,
  sharedRequests,
  onUpdateRequestStatus,
}) {
  const [activeTab, setActiveTab] = useState("dashboard");
  const [customers, setCustomers] = useState(DEMO_CUSTOMERS);
  const [selectedCustomerId, setSelectedCustomerId] = useState(DEMO_CUSTOMERS[0].id);
  const [salonNote, setSalonNote] = useState("");
  const [noteSaved, setNoteSaved] = useState(false);

  useEffect(() => {
    const existing = document.getElementById("hairpass-salon-sync-styles");
    if (existing) return;

    const style = document.createElement("style");
    style.id = "hairpass-salon-sync-styles";
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
        background: rgba(212,175,55,0.11);
        border: 1px solid rgba(212,175,55,0.16);
        color: #e4c15d;
        font-size: 11px;
        font-weight: 800;
        letter-spacing: 0.08em;
        text-transform: uppercase;
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

      .sa-logout-btn, .sa-primary-btn, .sa-secondary-btn, .sa-nav-btn, .sa-chip-btn, .sa-customer-btn {
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
        box-shadow: 0 8px 18px rgba(212,175,55,0.14);
      }

      .sa-secondary-btn {
        border: 1px solid rgba(255,255,255,0.09);
        background: rgba(255,255,255,0.04);
        color: #fff;
      }

      .sa-logout-btn {
        border: 1px solid rgba(255,80,80,0.22);
        background: linear-gradient(135deg, rgba(110,18,18,0.34), rgba(70,8,8,0.88));
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
        background: rgba(255,255,255,0.03);
        color: #fff;
        font-size: 13px;
        font-weight: 650;
        cursor: pointer;
        white-space: nowrap;
      }

      .sa-nav-btn.active {
        background: linear-gradient(135deg, rgba(212,175,55,0.16), rgba(255,255,255,0.05));
        border-color: rgba(212,175,55,0.34);
        box-shadow: 0 0 0 1px rgba(255,255,255,0.04);
      }

      .sa-grid, .sa-grid-2, .sa-grid-3, .sa-grid-4, .sa-layout, .sa-card-grid {
        display: grid;
        gap: 14px;
      }

      .sa-grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
      .sa-grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .sa-grid-4 { grid-template-columns: repeat(4, minmax(0, 1fr)); }
      .sa-card-grid { grid-template-columns: repeat(3, minmax(0, 1fr)); }
      .sa-layout { grid-template-columns: minmax(300px, 0.95fr) minmax(0, 1.35fr); }

      .sa-card {
        min-width: 0;
        background: rgba(255,255,255,0.04);
        border: 1px solid rgba(255,255,255,0.07);
        border-radius: 20px;
        box-shadow: 0 12px 36px rgba(0,0,0,0.18);
        backdrop-filter: blur(14px);
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

      .sa-stat-value {
        display: block;
        margin-top: 10px;
        font-size: 20px;
        font-weight: 800;
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
        background: rgba(255,255,255,0.035);
        color: #fff;
        cursor: pointer;
      }

      .sa-customer-btn.active {
        background: linear-gradient(135deg, rgba(212,175,55,0.16), rgba(255,255,255,0.05));
        border-color: rgba(212,175,55,0.35);
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
        background: rgba(255,255,255,0.035);
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
        background: rgba(255,255,255,0.04);
        color: #fff;
        padding: 12px 14px;
        outline: none;
        resize: vertical;
        font-size: 14px;
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

      @media (max-width: 1050px) {
        .sa-grid-4,
        .sa-grid-3,
        .sa-grid-2,
        .sa-card-grid,
        .sa-layout {
          grid-template-columns: 1fr;
        }
      }

      @media (max-width: 820px) {
        .sa-main {
          padding: 14px;
          padding-bottom: 90px;
        }

        .sa-topbar,
        .sa-section-head {
          flex-direction: column;
          align-items: stretch;
        }

        .sa-logout-btn,
        .sa-actions > * {
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

        .sa-title {
          font-size: 31px;
        }

        .sa-card-padding {
          padding: 14px;
        }
      }
    `;
    document.head.appendChild(style);
  }, []);

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

  const updateLocalNote = (text) => {
    setCustomers((prev) =>
      prev.map((customer) =>
        customer.id === selectedCustomer.id
          ? { ...customer, notes: text }
          : customer
      )
    );
  };

  const saveSalonNote = () => {
    if (!salonNote.trim()) return;

    const nextText = `${selectedCustomer.notes}\n• ${salonNote.trim()}`;
    updateLocalNote(nextText);
    setSalonNote("");
    setNoteSaved(true);
    setTimeout(() => setNoteSaved(false), 2200);
    setActiveTab("notes");
  };

  return (
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

          <button className="sa-logout-btn" onClick={onLogout}>
            Logout
          </button>
        </div>

        <div className="sa-nav-wrap">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.id}
              className={`sa-nav-btn ${activeTab === item.id ? "active" : ""}`}
              onClick={() => setActiveTab(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>

        {activeTab === "dashboard" && (
          <section className="sa-grid">
            <div className="sa-grid-4">
              <div className="sa-card sa-card-padding">
                <span className="sa-mini-badge">Kunden</span>
                <span className="sa-stat-value">{customers.length}</span>
              </div>

              <div className="sa-card sa-card-padding">
                <span className="sa-mini-badge">Anfragen</span>
                <span className="sa-stat-value">{requestsWithCustomer.length}</span>
              </div>

              <div className="sa-card sa-card-padding">
                <span className="sa-mini-badge">Offen</span>
                <span className="sa-stat-value">
                  {requestsWithCustomer.filter((item) => item.status === "Offen").length}
                </span>
              </div>

              <div className="sa-card sa-card-padding">
                <span className="sa-mini-badge">Bestätigt</span>
                <span className="sa-stat-value">
                  {requestsWithCustomer.filter((item) => item.status === "Bestätigt").length}
                </span>
              </div>
            </div>

            <div className="sa-layout">
              <div className="sa-card sa-card-padding">
                <span className="sa-mini-badge">Kunden</span>
                <h2 className="sa-section-title">Übersicht</h2>

                <div className="sa-stack" style={{ marginTop: 14 }}>
                  {customers.map((customer) => {
                    const count = requestsWithCustomer.filter(
                      (request) =>
                        request.customerEmail?.toLowerCase() === customer.email.toLowerCase()
                    ).length;

                    return (
                      <button
                        key={customer.id}
                        className={`sa-customer-btn ${
                          selectedCustomerId === customer.id ? "active" : ""
                        }`}
                        onClick={() => setSelectedCustomerId(customer.id)}
                      >
                        <strong>{customer.fullName}</strong>
                        <p className="sa-muted" style={{ margin: "6px 0 4px 0" }}>
                          {customer.email}
                        </p>
                        <span style={{ color: "#efcf72", fontWeight: 700, fontSize: 13 }}>
                          {count} Anfragen
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>

              <div className="sa-grid">
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
                  <span className="sa-mini-badge">Terminvorbereitung</span>
                  <h2 className="sa-section-title">Kundenwunsch</h2>

                  {customerRequests[0] ? (
                    <>
                      <div className="sa-summary-block">
                        <span className="sa-summary-label">Behandlung</span>
                        <p className="sa-summary-text">{customerRequests[0].mainService}</p>
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
                      <span className="sa-summary-label">Synchronisierte Anfragen</span>
                      <p className="sa-summary-text">{count}</p>
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
                                typeof onUpdateRequestStatus === "function" &&
                                onUpdateRequestStatus(request.id, status)
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
  );
}
