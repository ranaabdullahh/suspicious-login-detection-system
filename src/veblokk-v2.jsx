import { useState } from "react";

/* ── PALETTE ──────────────────────────────────────────── */
const C = {
  // Base
  bg:         "#0B1629",
  surface:    "#112250",   // Royal Blue
  card:       "#1A2F5E",
  sapphire:   "#3C507D",
  quicksand:  "#E0C58F",
  swanWing:   "#F5F0E9",
  shellstone: "#D9CBC2",
  // Functional
  border:     "rgba(60,80,125,0.4)",
  borderHi:   "rgba(224,197,143,0.4)",
  text:       "#F5F0E9",      // Swan Wing
  textSub:    "#D9CBC2",      // Shellstone
  textMuted:  "#8A9BBF",
  // Alerts
  safe:       "#4A9B7F",
  safeBg:     "rgba(74,155,127,0.15)",
  warn:       "#C4A24A",
  warnBg:     "rgba(196,162,74,0.15)",
  danger:     "#B85469",
  dangerBg:   "rgba(184,84,105,0.15)",
  // Accent
  gold:       "#E0C58F",
  goldDim:    "rgba(224,197,143,0.15)",
};

const F = {
  serif: "'Times New Roman', Times, serif",
  sans:  "'DM Sans', 'Segoe UI', sans-serif",
};

/* ── GLOBAL STYLES ────────────────────────────────────── */
const Styles = () => (
  <style>{`
    @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@300;400;500;600;700&display=swap');
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: ${C.bg}; }
    ::-webkit-scrollbar { width: 4px; }
    ::-webkit-scrollbar-track { background: ${C.surface}; }
    ::-webkit-scrollbar-thumb { background: ${C.sapphire}; border-radius: 2px; }
    input { font-family: ${F.sans}; }
    input::placeholder { color: ${C.textMuted}; font-size: 13px; }
    @keyframes fadeUp   { from{opacity:0;transform:translateY(14px);}to{opacity:1;transform:translateY(0);} }
    @keyframes pulse    { 0%,100%{opacity:1;transform:scale(1);}50%{opacity:.3;transform:scale(1.7);} }
    @keyframes blink    { 0%,100%{opacity:1;}50%{opacity:.35;} }
    @keyframes spin     { from{transform:rotate(0deg);}to{transform:rotate(360deg);} }
    @keyframes glow     { 0%,100%{box-shadow:0 0 20px rgba(224,197,143,0.15);}50%{box-shadow:0 0 35px rgba(224,197,143,0.3);} }
    .fu  { animation: fadeUp .42s ease both; }
    .nav-btn { transition: all .16s ease; }
    .nav-btn:hover { background: rgba(224,197,143,0.08) !important; }
    .row-hover:hover { background: rgba(60,80,125,0.35) !important; transition: background .15s; }
    .act-btn { transition: all .16s ease; }
    .act-btn:hover { filter: brightness(1.12); transform: translateY(-1px); }
    .card-hover { transition: all .18s ease; cursor: pointer; }
    .card-hover:hover { transform: translateY(-2px); border-color: rgba(224,197,143,0.35) !important; }
  `}</style>
);

/* ── SHARED ───────────────────────────────────────────── */
const Card = ({ children, style = {}, className = "" }) => (
  <div className={className} style={{
    background: C.card, border: `1px solid ${C.border}`,
    borderRadius: 12, padding: 22, ...style,
  }}>{children}</div>
);

const Lbl = ({ children, style = {} }) => (
  <p style={{
    fontFamily: F.sans, fontSize: 10, fontWeight: 700,
    letterSpacing: ".18em", textTransform: "uppercase",
    color: C.textMuted, marginBottom: 10, ...style,
  }}>{children}</p>
);

const RiskBadge = ({ level }) => {
  const m = {
    Safe:    { c: C.safe,   b: C.safeBg },
    Low:     { c: C.safe,   b: C.safeBg },
    Medium:  { c: C.warn,   b: C.warnBg },
    High:    { c: C.danger, b: C.dangerBg },
    Blocked: { c: C.danger, b: C.dangerBg },
  };
  const s = m[level] || m.Medium;
  return (
    <span style={{
      fontFamily: F.sans, fontSize: 10, fontWeight: 700,
      padding: "3px 10px", borderRadius: 5,
      background: s.b, color: s.c,
      letterSpacing: ".05em",
    }}>{level}</span>
  );
};

const Btn = ({ children, onClick, variant = "primary", style = {} }) => {
  const v = {
    primary: { bg: `linear-gradient(135deg, #3C507D, #2A3D6B)`, color: C.swanWing, border: "none", shadow: "0 4px 18px rgba(60,80,125,0.5)" },
    gold:    { bg: `linear-gradient(135deg, #E0C58F, #C9AC72)`, color: "#112250",   border: "none", shadow: "0 4px 18px rgba(224,197,143,0.4)" },
    danger:  { bg: C.dangerBg, color: C.danger,   border: `1px solid ${C.danger}50`,   shadow: "none" },
    safe:    { bg: C.safeBg,   color: C.safe,     border: `1px solid ${C.safe}50`,     shadow: "none" },
    warn:    { bg: C.warnBg,   color: C.warn,     border: `1px solid ${C.warn}50`,     shadow: "none" },
    outline: { bg: "transparent", color: C.textSub, border: `1px solid ${C.border}`,   shadow: "none" },
  };
  const s = v[variant] || v.primary;
  return (
    <button onClick={onClick} className="act-btn" style={{
      fontFamily: F.sans, fontSize: 12, fontWeight: 600,
      padding: "9px 20px", borderRadius: 8, cursor: "pointer",
      background: s.bg, color: s.color,
      border: s.border, boxShadow: s.shadow,
      letterSpacing: ".04em", ...style,
    }}>{children}</button>
  );
};

/* ── SIDEBAR ──────────────────────────────────────────── */
const NAV = [
  { id: "dashboard", icon: "⊞", label: "Dashboard"     },
  { id: "alert",     icon: "⚠",  label: "Active Alerts" },
  { id: "otp",       icon: "◎",  label: "OTP Verify"   },
  { id: "protected", icon: "⬡",  label: "Protection"   },
  { id: "admin",     icon: "▦",  label: "Admin Monitor" },
];

const Sidebar = ({ page, setPage }) => (
  <div style={{
    width: 230, background: C.surface,
    display: "flex", flexDirection: "column",
    borderRight: `1px solid ${C.border}`, flexShrink: 0,
  }}>
    {/* Logo */}
    <div style={{ padding: "28px 24px 22px", borderBottom: `1px solid ${C.border}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: `linear-gradient(135deg, ${C.quicksand}, #C9AC72)`,
          display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: 17, color: C.surface,
          boxShadow: `0 4px 16px rgba(224,197,143,0.35)`,
        }}>⬡</div>
        <div>
          <p style={{ fontFamily: F.serif, fontSize: 20, fontWeight: 700, color: C.swanWing, letterSpacing: ".01em" }}>Veblokk</p>
          <p style={{ fontFamily: F.sans, fontSize: 9, color: C.quicksand, letterSpacing: ".14em", textTransform: "uppercase", opacity: .8 }}>Login Security</p>
        </div>
      </div>
    </div>

    {/* Nav */}
    <nav style={{ padding: "14px 10px", flex: 1 }}>
      <Lbl style={{ paddingLeft: 12, marginBottom: 8 }}>Navigation</Lbl>
      {NAV.map(n => {
        const active = page === n.id;
        return (
          <button key={n.id} className="nav-btn" onClick={() => setPage(n.id)} style={{
            width: "100%", display: "flex", alignItems: "center", gap: 11,
            padding: "11px 14px", borderRadius: 9, border: "none",
            background: active ? "rgba(224,197,143,0.12)" : "transparent",
            cursor: "pointer", marginBottom: 3,
            borderLeft: active ? `3px solid ${C.gold}` : "3px solid transparent",
          }}>
            <span style={{ fontSize: 14, color: active ? C.gold : C.textMuted, lineHeight: 1 }}>{n.icon}</span>
            <span style={{
              fontFamily: F.sans, fontSize: 13, fontWeight: active ? 600 : 400,
              color: active ? C.swanWing : C.textSub,
            }}>{n.label}</span>
          </button>
        );
      })}
    </nav>

    {/* Status */}
    <div style={{ padding: "16px 24px", borderTop: `1px solid ${C.border}` }}>
      <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5 }}>
        <div style={{ width: 7, height: 7, borderRadius: "50%", background: C.safe, animation: "pulse 2s infinite" }} />
        <span style={{ fontFamily: F.sans, fontSize: 10, fontWeight: 700, color: C.safe, letterSpacing: ".1em" }}>SYSTEM ACTIVE</span>
      </div>
      <p style={{ fontFamily: F.sans, fontSize: 10, color: C.textMuted }}>v2.4.1 · Enterprise Plan</p>
    </div>
  </div>
);

/* ── TOPBAR ───────────────────────────────────────────── */
const Topbar = ({ page, setPage }) => {
  const titles = {
    dashboard: "Security Dashboard",
    alert:     "Suspicious Login Alert",
    otp:       "OTP Verification",
    protected: "Account Protection",
    admin:     "Admin Monitor",
  };
  return (
    <div style={{
      height: 56, background: C.surface,
      borderBottom: `1px solid ${C.border}`,
      display: "flex", alignItems: "center",
      justifyContent: "space-between",
      padding: "0 30px", flexShrink: 0,
    }}>
      <h2 style={{ fontFamily: F.serif, fontSize: 19, fontWeight: 700, color: C.swanWing }}>
        {titles[page] || "Veblokk"}
      </h2>
      <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
        <div style={{
          background: C.dangerBg, border: `1px solid ${C.danger}40`,
          borderRadius: 7, padding: "5px 14px",
          display: "flex", alignItems: "center", gap: 7, cursor: "pointer",
        }} onClick={() => setPage("alert")}>
          <span style={{ fontSize: 10, animation: "blink 1.5s infinite" }}>🔴</span>
          <span style={{ fontFamily: F.sans, fontSize: 12, color: C.danger, fontWeight: 600 }}>3 Active Alerts</span>
        </div>
        <div style={{
          width: 34, height: 34, borderRadius: "50%",
          background: `linear-gradient(135deg, ${C.sapphire}, ${C.surface})`,
          border: `2px solid ${C.gold}44`,
          display: "flex", alignItems: "center", justifyContent: "center",
          fontFamily: F.sans, fontSize: 13, fontWeight: 700, color: C.gold, cursor: "pointer",
        }}>A</div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   LOGIN — CENTERED
══════════════════════════════════════════════════════ */
const LoginPage = ({ onLogin }) => {
  const [email, setEmail] = useState("");
  const [pass,  setPass]  = useState("");
  const [load,  setLoad]  = useState(false);

  const handleLogin = () => {
    setLoad(true);
    setTimeout(() => { setLoad(false); onLogin(); }, 1300);
  };

  const inp = {
    width: "100%", background: "rgba(17,34,80,0.7)",
    border: `1px solid ${C.border}`, borderRadius: 9,
    padding: "13px 16px", color: C.swanWing,
    fontFamily: F.sans, fontSize: 14, outline: "none",
    marginBottom: 14, display: "block",
  };

  return (
    <div style={{
      minHeight: "100vh", background: C.bg,
      display: "flex", alignItems: "center",
      justifyContent: "center", fontFamily: F.sans,
      position: "relative", overflow: "hidden",
    }}>
      <Styles />

      {/* Grid bg */}
      <div style={{
        position: "fixed", inset: 0, pointerEvents: "none", opacity: .025,
        backgroundImage: "linear-gradient(#3C507D 1px,transparent 1px),linear-gradient(90deg,#3C507D 1px,transparent 1px)",
        backgroundSize: "48px 48px",
      }} />

      {/* Glow orbs */}
      <div style={{
        position: "fixed", width: 500, height: 500, borderRadius: "50%",
        background: "radial-gradient(circle, rgba(60,80,125,0.18) 0%, transparent 70%)",
        top: "50%", left: "50%", transform: "translate(-50%,-50%)",
        pointerEvents: "none",
      }} />

      {/* Card */}
      <div className="fu" style={{ width: 420, position: "relative", zIndex: 1 }}>

        {/* Logo block */}
        <div style={{ textAlign: "center", marginBottom: 34 }}>
          <div style={{
            width: 60, height: 60, borderRadius: 16,
            background: `linear-gradient(135deg, ${C.sapphire}, ${C.surface})`,
            border: `2px solid ${C.gold}50`,
            margin: "0 auto 16px",
            display: "flex", alignItems: "center", justifyContent: "center",
            fontSize: 26, color: C.gold,
            boxShadow: `0 8px 32px rgba(224,197,143,0.2)`,
            animation: "glow 3s ease-in-out infinite",
          }}>⬡</div>
          <h1 style={{
            fontFamily: F.serif, fontSize: 34, fontWeight: 700,
            color: C.swanWing, marginBottom: 6, letterSpacing: ".01em",
          }}>Veblokk</h1>
          <p style={{
            fontFamily: F.sans, fontSize: 11, fontWeight: 600,
            color: C.gold, letterSpacing: ".2em", textTransform: "uppercase", opacity: .9,
          }}>Suspicious Login Detection</p>
        </div>

        {/* Form card */}
        <div style={{
          background: C.card,
          border: `1px solid ${C.border}`,
          borderRadius: 16, padding: 30,
          boxShadow: "0 20px 60px rgba(11,22,41,0.7)",
        }}>
          <Lbl>Secure Sign In</Lbl>

          <input
            value={email} onChange={e => setEmail(e.target.value)}
            placeholder="Email address"
            style={inp}
          />
          <input
            type="password" value={pass}
            onChange={e => setPass(e.target.value)}
            placeholder="Password"
            style={{ ...inp, marginBottom: 18 }}
          />

          {/* Security note */}
          <div style={{
            background: C.safeBg, border: `1px solid ${C.safe}35`,
            borderRadius: 8, padding: "10px 14px", marginBottom: 22,
            display: "flex", alignItems: "center", gap: 9,
          }}>
            <span style={{ fontSize: 13 }}>🔒</span>
            <p style={{ fontFamily: F.sans, fontSize: 12, color: C.safe, fontWeight: 500 }}>
              All login attempts are monitored for anomalies
            </p>
          </div>

          {/* Button */}
          <button onClick={handleLogin} style={{
            width: "100%", padding: "14px",
            background: `linear-gradient(135deg, ${C.quicksand}, #C9AC72)`,
            color: C.surface, border: "none", borderRadius: 10,
            fontFamily: F.sans, fontWeight: 700, fontSize: 14,
            letterSpacing: ".06em", cursor: "pointer",
            boxShadow: `0 6px 24px rgba(224,197,143,0.35)`,
            display: "flex", alignItems: "center",
            justifyContent: "center", gap: 9,
            opacity: load ? .8 : 1,
            transition: "opacity .2s",
          }}>
            {load
              ? <><span style={{ animation: "spin 1s linear infinite", display: "inline-block" }}>◌</span> Verifying…</>
              : "Sign In Securely"}
          </button>

          <p style={{
            fontFamily: F.sans, fontSize: 11, color: C.textMuted,
            textAlign: "center", marginTop: 18, lineHeight: 1.6,
          }}>
            Protected by AI-powered behavioral analysis
          </p>
        </div>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   DASHBOARD
══════════════════════════════════════════════════════ */
const LOGINS = [
  { user:"alice@corp.com",  location:"New York, US",   device:"Chrome / macOS",   ip:"104.21.14.8",   time:"2 min ago",  risk:"Safe"    },
  { user:"bob@corp.com",    location:"Lagos, Nigeria",  device:"Firefox / Win",    ip:"197.210.3.41",  time:"8 min ago",  risk:"High"    },
  { user:"carol@corp.com",  location:"London, UK",      device:"Safari / iOS",     ip:"86.9.198.44",   time:"15 min ago", risk:"Safe"    },
  { user:"dan@corp.com",    location:"Unknown VPN",     device:"Unknown Agent",    ip:"45.142.212.9",  time:"22 min ago", risk:"Blocked" },
  { user:"emma@corp.com",   location:"Toronto, CA",     device:"Edge / Windows",   ip:"142.116.4.22",  time:"31 min ago", risk:"Medium"  },
  { user:"frank@corp.com",  location:"Beijing, CN",     device:"Bot / Unknown",    ip:"220.181.38.5",  time:"44 min ago", risk:"High"    },
];

const DashboardPage = ({ setPage }) => {
  const kpis = [
    { label:"Safe Logins",       val:1284, color:C.safe,       bg:C.safeBg,   icon:"✓" },
    { label:"Suspicious",        val:47,   color:C.warn,       bg:C.warnBg,   icon:"⚠" },
    { label:"Blocked Attempts",  val:19,   color:C.danger,     bg:C.dangerBg, icon:"⛔" },
    { label:"Active Sessions",   val:38,   color:C.quicksand,  bg:C.goldDim,  icon:"◎" },
  ];
  return (
    <div style={{ padding:"28px 32px", overflowY:"auto", flex:1 }}>
      {/* KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:26 }}>
        {kpis.map((k,i)=>(
          <Card key={k.label} className="fu card-hover" style={{
            borderTop:`3px solid ${k.color}`,
            animationDelay:`${i*.07}s`,
          }}>
            <div style={{ display:"flex", justifyContent:"space-between", alignItems:"flex-start" }}>
              <div>
                <p style={{ fontFamily:F.serif, fontSize:34, fontWeight:700, color:k.color, marginBottom:4 }}>{k.val}</p>
                <p style={{ fontFamily:F.sans,  fontSize:12, color:C.textSub, fontWeight:500 }}>{k.label}</p>
              </div>
              <div style={{
                width:38, height:38, borderRadius:9,
                background:k.bg, display:"flex", alignItems:"center",
                justifyContent:"center", fontSize:16, color:k.color,
              }}>{k.icon}</div>
            </div>
          </Card>
        ))}
      </div>

      {/* Alert Banner */}
      <div className="fu" style={{
        background:C.dangerBg, border:`1px solid ${C.danger}40`,
        borderLeft:`4px solid ${C.danger}`, borderRadius:"0 10px 10px 0",
        padding:"12px 20px", marginBottom:24,
        display:"flex", justifyContent:"space-between", alignItems:"center",
      }}>
        <div style={{ display:"flex", alignItems:"center", gap:10 }}>
          <span style={{ animation:"blink 1.5s infinite", fontSize:13 }}>🔴</span>
          <p style={{ fontFamily:F.sans, fontSize:13, color:C.danger, fontWeight:500 }}>
            3 high-risk login attempts detected in the last 30 minutes
          </p>
        </div>
        <Btn variant="danger" onClick={()=>setPage("alert")} style={{ padding:"6px 16px", fontSize:11 }}>
          View Alerts →
        </Btn>
      </div>

      {/* Table */}
      <Card className="fu">
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div>
            <h3 style={{ fontFamily:F.serif, fontSize:18, color:C.swanWing, fontWeight:700, marginBottom:3 }}>
              Recent Login Activity
            </h3>
            <p style={{ fontFamily:F.sans, fontSize:11, color:C.textMuted }}>Live monitoring · updates every 30s</p>
          </div>
          <div style={{ display:"flex", alignItems:"center", gap:7 }}>
            <div style={{ width:7, height:7, borderRadius:"50%", background:C.safe, animation:"pulse 2s infinite" }} />
            <span style={{ fontFamily:F.sans, fontSize:10, color:C.safe, fontWeight:700, letterSpacing:".1em" }}>LIVE</span>
          </div>
        </div>

        {/* Header Row */}
        <div style={{
          display:"grid", gridTemplateColumns:"2fr 1.5fr 1.6fr 1.2fr 1fr .85fr",
          padding:"8px 14px", marginBottom:6,
          background:"rgba(17,34,80,0.6)", borderRadius:7,
        }}>
          {["User","Location","Device","IP Address","Time","Risk"].map(h=>(
            <span key={h} style={{ fontFamily:F.sans, fontSize:10, fontWeight:700, color:C.textMuted, letterSpacing:".12em", textTransform:"uppercase" }}>{h}</span>
          ))}
        </div>

        {LOGINS.map((r,i)=>(
          <div key={i} className="row-hover" style={{
            display:"grid", gridTemplateColumns:"2fr 1.5fr 1.6fr 1.2fr 1fr .85fr",
            padding:"12px 14px", borderRadius:7, marginBottom:3,
            background: i%2===0 ? "rgba(17,34,80,0.35)" : "transparent",
            borderLeft:`3px solid ${r.risk==="High"||r.risk==="Blocked"?C.danger+"66":"transparent"}`,
          }}>
            <span style={{ fontFamily:F.sans, fontSize:12, fontWeight:500, color:C.swanWing }}>{r.user}</span>
            <span style={{ fontFamily:F.sans, fontSize:12, color:C.textSub }}>{r.location}</span>
            <span style={{ fontFamily:F.sans, fontSize:12, color:C.textSub }}>{r.device}</span>
            <span style={{ fontFamily:"monospace", fontSize:11, color:C.textMuted }}>{r.ip}</span>
            <span style={{ fontFamily:F.sans, fontSize:11, color:C.textMuted }}>{r.time}</span>
            <RiskBadge level={r.risk} />
          </div>
        ))}
      </Card>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   ALERT
══════════════════════════════════════════════════════ */
const AlertPage = ({ setPage }) => (
  <div style={{ padding:"28px 32px", overflowY:"auto", flex:1 }}>
    {/* Header */}
    <div className="fu" style={{
      background:"rgba(184,84,105,0.08)", border:`1px solid ${C.danger}40`,
      borderRadius:12, padding:"20px 24px", marginBottom:24,
      display:"flex", alignItems:"center", gap:16,
    }}>
      <div style={{
        width:50, height:50, borderRadius:12, background:C.dangerBg,
        border:`1px solid ${C.danger}40`, display:"flex",
        alignItems:"center", justifyContent:"center", fontSize:22,
      }}>⚠</div>
      <div style={{ flex:1 }}>
        <p style={{ fontFamily:F.sans, fontSize:10, fontWeight:700, color:C.danger, letterSpacing:".18em", textTransform:"uppercase", marginBottom:5 }}>
          High Risk Alert
        </p>
        <h3 style={{ fontFamily:F.serif, fontSize:21, color:C.swanWing, fontWeight:700, marginBottom:3 }}>
          Suspicious Login Attempt Detected
        </h3>
        <p style={{ fontFamily:F.sans, fontSize:13, color:C.textSub }}>
          Unrecognized login to <strong style={{ color:C.swanWing }}>bob@corp.com</strong> from an unknown location
        </p>
      </div>
      <RiskBadge level="High" />
    </div>

    <div style={{ display:"grid", gridTemplateColumns:"1.2fr 1fr", gap:20, marginBottom:20 }}>
      {/* Details */}
      <Card>
        <h4 style={{ fontFamily:F.serif, fontSize:17, color:C.swanWing, fontWeight:700, marginBottom:18 }}>Threat Intelligence</h4>
        {[
          { l:"IP Address",     v:"197.210.3.41",          flag:true  },
          { l:"Location",       v:"Lagos, Nigeria",          flag:true  },
          { l:"Device",         v:"Firefox / Windows 10",   flag:false },
          { l:"Login Time",     v:"Today, 14:32:07 UTC",    flag:false },
          { l:"Attempt Count",  v:"7 attempts in 4 min",    flag:true  },
          { l:"VPN Detected",   v:"Yes — suspicious",        flag:true  },
          { l:"Threat Database",v:"IP in 3 blocklists",     flag:true  },
        ].map(d=>(
          <div key={d.l} style={{
            display:"flex", justifyContent:"space-between", alignItems:"center",
            padding:"10px 0", borderBottom:`1px solid ${C.border}`,
          }}>
            <span style={{ fontFamily:F.sans, fontSize:12, color:C.textMuted }}>{d.l}</span>
            <span style={{
              fontFamily: d.l==="IP Address"?"monospace":F.sans,
              fontSize:12, fontWeight:600,
              color: d.flag ? C.danger : C.swanWing,
            }}>{d.v}</span>
          </div>
        ))}
      </Card>

      {/* Risk + Signals */}
      <div style={{ display:"flex", flexDirection:"column", gap:16 }}>
        <Card style={{ textAlign:"center", padding:"28px 20px" }}>
          <Lbl>Risk Score</Lbl>
          <p style={{ fontFamily:F.serif, fontSize:68, fontWeight:700, color:C.danger, lineHeight:1 }}>92</p>
          <p style={{ fontFamily:F.sans, fontSize:11, color:C.danger, marginTop:4, fontWeight:700, letterSpacing:".08em" }}>CRITICAL THREAT</p>
          <div style={{ marginTop:14, background:"rgba(17,34,80,0.8)", borderRadius:6, height:8, overflow:"hidden" }}>
            <div style={{ height:"100%", width:"92%", background:`linear-gradient(90deg,${C.warn},${C.danger})`, borderRadius:6 }} />
          </div>
        </Card>

        <Card>
          <Lbl>Anomaly Signals</Lbl>
          {[
            "New device never seen before",
            "Unfamiliar geographic location",
            "Multiple failed attempts in 4 min",
            "Off-hours login — 2:32 AM local",
            "IP flagged in threat database",
          ].map((s,i)=>(
            <div key={i} style={{ display:"flex", gap:9, marginBottom:10, alignItems:"flex-start" }}>
              <div style={{ width:5, height:5, borderRadius:"50%", background:C.danger, flexShrink:0, marginTop:5 }} />
              <p style={{ fontFamily:F.sans, fontSize:12, color:C.textSub, lineHeight:1.55 }}>{s}</p>
            </div>
          ))}
        </Card>
      </div>
    </div>

    {/* Actions */}
    <Card>
      <h4 style={{ fontFamily:F.serif, fontSize:17, color:C.swanWing, fontWeight:700, marginBottom:6 }}>Response Actions</h4>
      <p style={{ fontFamily:F.sans, fontSize:12, color:C.textMuted, marginBottom:18 }}>Choose how to respond to this security event</p>
      <div style={{ display:"flex", gap:12, flexWrap:"wrap" }}>
        <Btn variant="gold" onClick={()=>setPage("otp")}>⊙ Verify via OTP</Btn>
        <Btn variant="warn" onClick={()=>setPage("otp")}>📱 Send SMS Alert</Btn>
        <Btn variant="danger" onClick={()=>setPage("protected")}>⛔ Block Access Now</Btn>
        <Btn variant="outline">◈ Flag for Review</Btn>
        <Btn variant="safe">✓ Mark as Safe</Btn>
      </div>
    </Card>
  </div>
);

/* ══════════════════════════════════════════════════════
   OTP
══════════════════════════════════════════════════════ */
const OTPPage = ({ setPage }) => {
  const [otp, setOtp]       = useState(["","","","","",""]);
  const [verified, setVerified] = useState(false);

  const handleChange = (val, i) => {
    if (!/^\d?$/.test(val)) return;
    const n=[...otp]; n[i]=val; setOtp(n);
  };

  const handleVerify = () => {
    setVerified(true);
    setTimeout(()=>setPage("protected"), 1400);
  };

  return (
    <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"28px 32px" }}>
      <div className="fu" style={{ width:420 }}>
        <div style={{ textAlign:"center", marginBottom:28 }}>
          <div style={{
            width:58, height:58, borderRadius:"50%",
            background:`linear-gradient(135deg, ${C.sapphire}, ${C.surface})`,
            border:`2px solid ${C.gold}60`,
            margin:"0 auto 16px",
            display:"flex", alignItems:"center", justifyContent:"center", fontSize:24,
          }}>◎</div>
          <h2 style={{ fontFamily:F.serif, fontSize:26, color:C.swanWing, fontWeight:700, marginBottom:8 }}>Identity Verification</h2>
          <p style={{ fontFamily:F.sans, fontSize:13, color:C.textSub, lineHeight:1.65 }}>
            A one-time password was sent to<br/>
            <strong style={{ color:C.swanWing }}>b**@corp.com</strong> and your registered phone
          </p>
        </div>

        <Card style={{ padding:28 }}>
          <Lbl style={{ textAlign:"center", marginBottom:20 }}>Enter 6-Digit OTP</Lbl>

          <div style={{ display:"flex", gap:10, justifyContent:"center", marginBottom:24 }}>
            {otp.map((v,i)=>(
              <input key={i} maxLength={1} value={v}
                onChange={e=>handleChange(e.target.value,i)}
                style={{
                  width:48, height:56, textAlign:"center",
                  background:"rgba(17,34,80,0.8)",
                  border:`1.5px solid ${v ? C.gold : C.border}`,
                  borderRadius:9, color:C.swanWing,
                  fontFamily:F.serif, fontSize:24, fontWeight:700, outline:"none",
                  boxShadow: v ? `0 0 0 3px rgba(224,197,143,0.15)` : "none",
                  transition:"all .15s",
                }}
              />
            ))}
          </div>

          <div style={{
            background:"rgba(17,34,80,0.6)", borderRadius:8,
            padding:"11px 15px", marginBottom:20,
            border:`1px solid ${C.border}`,
          }}>
            <p style={{ fontFamily:F.sans, fontSize:11, color:C.textMuted, marginBottom:3 }}>Login attempt from:</p>
            <p style={{ fontFamily:F.sans, fontSize:12, color:C.swanWing, fontWeight:500 }}>
              Lagos, Nigeria · IP 197.210.3.41 · Firefox / Win
            </p>
          </div>

          {verified ? (
            <div style={{
              background:C.safeBg, border:`1px solid ${C.safe}40`,
              borderRadius:9, padding:"13px",
              textAlign:"center", color:C.safe,
              fontFamily:F.sans, fontSize:13, fontWeight:600,
              display:"flex", alignItems:"center", justifyContent:"center", gap:8,
            }}>
              <span>✓</span> Identity Verified — Redirecting…
            </div>
          ):(
            <>
              <button onClick={handleVerify} style={{
                width:"100%", padding:"13px", borderRadius:9,
                background:`linear-gradient(135deg, ${C.quicksand}, #C9AC72)`,
                color:C.surface, border:"none",
                fontFamily:F.sans, fontWeight:700, fontSize:14,
                cursor:"pointer", boxShadow:`0 6px 24px rgba(224,197,143,0.3)`,
              }}>Confirm & Verify Identity</button>
              <div style={{ display:"flex", justifyContent:"space-between", marginTop:14 }}>
                <button onClick={()=>setPage("protected")} style={{
                  background:"none", border:"none", cursor:"pointer",
                  fontFamily:F.sans, fontSize:12, color:C.danger, fontWeight:500,
                }}>⛔ Block This Login</button>
                <button style={{
                  background:"none", border:"none", cursor:"pointer",
                  fontFamily:F.sans, fontSize:12, color:C.textMuted,
                }}>Resend OTP (0:58)</button>
              </div>
            </>
          )}
        </Card>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   PROTECTED
══════════════════════════════════════════════════════ */
const ProtectedPage = ({ setPage }) => (
  <div style={{ flex:1, display:"flex", alignItems:"center", justifyContent:"center", padding:"28px 32px" }}>
    <div className="fu" style={{ width:480, textAlign:"center" }}>
      <div style={{
        width:80, height:80, borderRadius:"50%",
        background:"rgba(224,197,143,0.1)",
        border:`2px solid ${C.gold}50`,
        margin:"0 auto 22px",
        display:"flex", alignItems:"center", justifyContent:"center",
        fontSize:34, position:"relative",
      }}>
        🛡
        <div style={{
          position:"absolute", inset:-10, borderRadius:"50%",
          border:`2px solid ${C.gold}18`,
          animation:"pulse 2.5s infinite",
        }} />
      </div>

      <p style={{ fontFamily:F.sans, fontSize:10, fontWeight:700, letterSpacing:".2em", color:C.gold, textTransform:"uppercase", marginBottom:10 }}>
        Protection Active
      </p>
      <h2 style={{ fontFamily:F.serif, fontSize:30, color:C.swanWing, fontWeight:700, marginBottom:10 }}>
        Account Temporarily Locked
      </h2>
      <p style={{ fontFamily:F.sans, fontSize:13, color:C.textSub, lineHeight:1.75, marginBottom:28 }}>
        Veblokk has detected and blocked a suspicious login attempt.<br/>
        Your account has been secured to prevent unauthorized access.
      </p>

      <Card style={{ textAlign:"left", marginBottom:18, padding:20 }}>
        <Lbl>What Happened</Lbl>
        {[
          { icon:"⚠", text:"High-risk login blocked from Lagos, Nigeria (IP: 197.210.3.41)", c:C.danger },
          { icon:"✓", text:"Your account credentials remain secure and unchanged",            c:C.safe   },
          { icon:"✉", text:"Security notification sent to your registered email",             c:C.gold   },
          { icon:"◎", text:"All active sessions from this device have been terminated",       c:C.warn   },
        ].map((x,i)=>(
          <div key={i} style={{ display:"flex", gap:10, marginBottom:i<3?12:0, alignItems:"flex-start" }}>
            <span style={{ fontSize:13, color:x.c, flexShrink:0, marginTop:1 }}>{x.icon}</span>
            <p style={{ fontFamily:F.sans, fontSize:12, color:C.textSub, lineHeight:1.55 }}>{x.text}</p>
          </div>
        ))}
      </Card>

      <Card style={{ marginBottom:24, padding:"16px 20px" }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center" }}>
          <p style={{ fontFamily:F.sans, fontSize:12, color:C.textSub, fontWeight:500 }}>Auto-unlock in</p>
          <p style={{ fontFamily:F.serif, fontSize:24, fontWeight:700, color:C.gold }}>14:32</p>
        </div>
        <div style={{ background:`rgba(17,34,80,0.7)`, borderRadius:4, height:5, marginTop:10, overflow:"hidden" }}>
          <div style={{ height:"100%", width:"38%", background:`linear-gradient(90deg,${C.sapphire},${C.gold})`, borderRadius:4 }} />
        </div>
      </Card>

      <div style={{ display:"flex", gap:12, justifyContent:"center" }}>
        <Btn variant="gold" onClick={()=>setPage("otp")}>Unlock with OTP</Btn>
        <Btn variant="outline" onClick={()=>setPage("dashboard")}>Return to Dashboard</Btn>
      </div>
    </div>
  </div>
);

/* ══════════════════════════════════════════════════════
   ADMIN
══════════════════════════════════════════════════════ */
const EVENTS = [
  { id:"#4491", user:"bob@corp.com",   event:"Brute-force attempt",  ip:"197.210.3.41", loc:"Lagos, NG",   time:"14:32", risk:"High",   status:"Blocked"  },
  { id:"#4490", user:"dan@corp.com",   event:"VPN / Tor detected",   ip:"45.142.212.9", loc:"VPN Node",    time:"14:10", risk:"High",   status:"Blocked"  },
  { id:"#4489", user:"frank@corp.com", event:"Bot signature match",  ip:"220.181.38.5", loc:"Beijing, CN", time:"13:55", risk:"High",   status:"Blocked"  },
  { id:"#4488", user:"emma@corp.com",  event:"New device login",     ip:"142.116.4.22", loc:"Toronto, CA", time:"13:02", risk:"Medium", status:"OTP Sent" },
  { id:"#4487", user:"alice@corp.com", event:"Successful login",     ip:"104.21.14.8",  loc:"New York, US",time:"12:47", risk:"Safe",   status:"Allowed"  },
  { id:"#4486", user:"carol@corp.com", event:"Successful login",     ip:"86.9.198.44",  loc:"London, UK",  time:"12:21", risk:"Safe",   status:"Allowed"  },
  { id:"#4485", user:"admin@corp.com", event:"Off-hours access",     ip:"10.0.0.14",    loc:"Internal",    time:"02:18", risk:"Medium", status:"Flagged"  },
];

const AdminPage = () => {
  const sc = s => ({ Blocked:"Blocked", "OTP Sent":C.warn, Allowed:C.safe, Flagged:C.warn }[s] === C.warn ? C.warn : s==="Blocked"?C.danger:s==="Allowed"?C.safe:C.warn);

  return (
    <div style={{ padding:"28px 32px", overflowY:"auto", flex:1 }}>
      {/* KPIs */}
      <div style={{ display:"grid", gridTemplateColumns:"repeat(4,1fr)", gap:16, marginBottom:28 }}>
        {[
          { l:"Events Today",    v:"128", c:C.quicksand, icon:"◎" },
          { l:"Threats Blocked", v:"19",  c:C.danger,    icon:"⛔" },
          { l:"Under Review",    v:"4",   c:C.warn,      icon:"⚠" },
          { l:"Clean Logins",    v:"105", c:C.safe,      icon:"✓" },
        ].map((k,i)=>(
          <Card key={k.l} className="fu" style={{
            display:"flex", alignItems:"center", gap:14,
            animationDelay:`${i*.07}s`,
          }}>
            <div style={{
              width:42, height:42, borderRadius:10,
              background:`${k.c}15`,
              display:"flex", alignItems:"center", justifyContent:"center",
              fontSize:18, color:k.c, flexShrink:0,
            }}>{k.icon}</div>
            <div>
              <p style={{ fontFamily:F.serif, fontSize:26, fontWeight:700, color:k.c }}>{k.v}</p>
              <p style={{ fontFamily:F.sans,  fontSize:11, color:C.textMuted, fontWeight:500 }}>{k.l}</p>
            </div>
          </Card>
        ))}
      </div>

      {/* Event Log */}
      <Card style={{ marginBottom:20 }}>
        <div style={{ display:"flex", justifyContent:"space-between", alignItems:"center", marginBottom:20 }}>
          <div>
            <h3 style={{ fontFamily:F.serif, fontSize:18, color:C.swanWing, fontWeight:700, marginBottom:3 }}>Security Event Log</h3>
            <p style={{ fontFamily:F.sans, fontSize:11, color:C.textMuted }}>All login events today</p>
          </div>
          <div style={{ display:"flex", gap:10 }}>
            <Btn variant="outline" style={{ padding:"6px 14px", fontSize:11 }}>Export CSV</Btn>
            <Btn variant="danger"  style={{ padding:"6px 14px", fontSize:11 }}>Clear Blocked</Btn>
          </div>
        </div>

        <div style={{
          display:"grid", gridTemplateColumns:".6fr 1.8fr 2fr 1.2fr 1.3fr .7fr 1fr 1fr",
          padding:"8px 14px", marginBottom:6,
          background:"rgba(17,34,80,0.7)", borderRadius:7,
        }}>
          {["ID","User","Event","IP","Location","Time","Risk","Status"].map(h=>(
            <span key={h} style={{ fontFamily:F.sans, fontSize:10, fontWeight:700, color:C.textMuted, letterSpacing:".1em", textTransform:"uppercase" }}>{h}</span>
          ))}
        </div>

        {EVENTS.map((e,i)=>(
          <div key={i} className="row-hover" style={{
            display:"grid", gridTemplateColumns:".6fr 1.8fr 2fr 1.2fr 1.3fr .7fr 1fr 1fr",
            padding:"12px 14px", borderRadius:7, marginBottom:3,
            background: i%2===0 ? "rgba(17,34,80,0.3)" : "transparent",
            borderLeft:`3px solid ${e.risk==="High"?C.danger+"55":e.risk==="Medium"?C.warn+"44":"transparent"}`,
          }}>
            <span style={{ fontFamily:"monospace", fontSize:11, color:C.textMuted }}>{e.id}</span>
            <span style={{ fontFamily:F.sans, fontSize:12, fontWeight:500, color:C.swanWing }}>{e.user}</span>
            <span style={{ fontFamily:F.sans, fontSize:12, color:C.textSub }}>{e.event}</span>
            <span style={{ fontFamily:"monospace", fontSize:11, color:C.textMuted }}>{e.ip}</span>
            <span style={{ fontFamily:F.sans, fontSize:11, color:C.textSub }}>{e.loc}</span>
            <span style={{ fontFamily:F.sans, fontSize:11, color:C.textMuted }}>{e.time}</span>
            <RiskBadge level={e.risk} />
            <span style={{
              fontFamily:F.sans, fontSize:11, fontWeight:600,
              color: e.status==="Blocked"?C.danger:e.status==="Allowed"?C.safe:C.warn,
            }}>{e.status}</span>
          </div>
        ))}
      </Card>

      {/* Bottom row */}
      <div style={{ display:"grid", gridTemplateColumns:"1fr 1fr", gap:20 }}>
        <Card>
          <h4 style={{ fontFamily:F.serif, fontSize:17, color:C.swanWing, fontWeight:700, marginBottom:18 }}>Risk Distribution</h4>
          {[
            { l:"High Risk / Blocked", v:19, pct:15, c:C.danger },
            { l:"Medium / Flagged",    v:4,  pct:3,  c:C.warn   },
            { l:"Safe Logins",         v:105,pct:82, c:C.safe   },
          ].map(r=>(
            <div key={r.l} style={{ marginBottom:14 }}>
              <div style={{ display:"flex", justifyContent:"space-between", marginBottom:5 }}>
                <span style={{ fontFamily:F.sans, fontSize:12, color:C.textSub }}>{r.l}</span>
                <span style={{ fontFamily:F.sans, fontSize:12, fontWeight:700, color:r.c }}>{r.v} ({r.pct}%)</span>
              </div>
              <div style={{ background:"rgba(17,34,80,0.7)", borderRadius:4, height:7, overflow:"hidden" }}>
                <div style={{ height:"100%", width:`${r.pct}%`, background:r.c, borderRadius:4, transition:"width 1s ease" }} />
              </div>
            </div>
          ))}
        </Card>

        <Card>
          <h4 style={{ fontFamily:F.serif, fontSize:17, color:C.swanWing, fontWeight:700, marginBottom:18 }}>Top Threat Sources</h4>
          {[
            { l:"Lagos, Nigeria",  n:7, c:C.danger },
            { l:"VPN / Tor Nodes", n:5, c:C.danger },
            { l:"Beijing, China",  n:4, c:C.warn   },
            { l:"Unknown Region",  n:3, c:C.warn   },
          ].map((t,i)=>(
            <div key={i} style={{
              display:"flex", justifyContent:"space-between", alignItems:"center",
              padding:"10px 0", borderBottom: i<3?`1px solid ${C.border}`:"none",
            }}>
              <div style={{ display:"flex", alignItems:"center", gap:9 }}>
                <div style={{ width:7, height:7, borderRadius:"50%", background:t.c }} />
                <span style={{ fontFamily:F.sans, fontSize:12, color:C.textSub }}>{t.l}</span>
              </div>
              <span style={{ fontFamily:F.serif, fontSize:18, fontWeight:700, color:t.c }}>{t.n}</span>
            </div>
          ))}
        </Card>
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════════════════
   ROOT
══════════════════════════════════════════════════════ */
export default function App() {
  const [loggedIn, setLoggedIn] = useState(false);
  const [page, setPage]         = useState("dashboard");

  if (!loggedIn) return <LoginPage onLogin={() => setLoggedIn(true)} />;

  const renderPage = () => {
    switch(page) {
      case "dashboard":  return <DashboardPage setPage={setPage} />;
      case "alert":      return <AlertPage setPage={setPage} />;
      case "otp":        return <OTPPage setPage={setPage} />;
      case "protected":  return <ProtectedPage setPage={setPage} />;
      case "admin":      return <AdminPage />;
      default:           return <DashboardPage setPage={setPage} />;
    }
  };

  return (
    <div style={{ display:"flex", height:"100vh", overflow:"hidden", background:C.bg, fontFamily:F.sans }}>
      <Styles />
      <Sidebar page={page} setPage={setPage} />
      <div style={{ flex:1, display:"flex", flexDirection:"column", overflow:"hidden" }}>
        <Topbar page={page} setPage={setPage} />
        <div style={{ flex:1, overflowY:"auto", display:"flex", flexDirection:"column" }}>
          {renderPage()}
        </div>
      </div>
    </div>
  );
}
