import { useState } from "react";

// ============================================================
// DATA LAYER — Replace with Supabase calls in production
// ============================================================
const TEAMS = [
  "Mitigating Impacts",
  "Encampment Routes",
  "Waterway Abatements",
  "On Land Abatements",
];

const STAFF = [
  { id: 1, name: "Aundrea Vargas", team: "Mitigating Impacts" },
  { id: 2, name: "Meghan Ferguson", team: "Mitigating Impacts" },
  { id: 3, name: "Kevin Montoya", team: "Mitigating Impacts" },
  { id: 4, name: "Jorge Pantoja", team: "Mitigating Impacts" },
  { id: 5, name: "Matthew Jimenez", team: "Mitigating Impacts" },
  { id: 6, name: "Ricardo Eledesma", team: "Mitigating Impacts" },
  { id: 7, name: "Jennifer Acevedo", team: "Mitigating Impacts" },
  { id: 8, name: "Sin Ses", team: "Mitigating Impacts" },
  { id: 9, name: "Jorge Ramirez", team: "Encampment Routes" },
  { id: 10, name: "Daniel Gomez Rodriguez", team: "Encampment Routes" },
  { id: 11, name: "Gabriel Tapia", team: "Encampment Routes" },
  { id: 12, name: "Marco Washington", team: "Encampment Routes" },
  { id: 13, name: "Jorge Pantoja", team: "Waterway Abatements" },
  { id: 14, name: "Kevin Montoya", team: "Waterway Abatements" },
  { id: 15, name: "Meghan Ferguson", team: "Waterway Abatements" },
  { id: 16, name: "Ricardo Eledesma", team: "Waterway Abatements" },
  { id: 17, name: "Jennifer Acevedo", team: "Waterway Abatements" },
  { id: 18, name: "Jesse Chavez", team: "On Land Abatements" },
  { id: 19, name: "Matthew Jimenez", team: "On Land Abatements" },
  { id: 20, name: "Ricardo Eledesma", team: "On Land Abatements" },
  { id: 21, name: "Sin Ses", team: "On Land Abatements" },
];

const DEMO_USERS = [
  { id: "admin1", name: "Admin User", role: "admin", email: "admin@sanjoseca.gov", team: null, teamsAccess: TEAMS },
  { id: "sup1", name: "Gaby Rollins", role: "supervisor", email: "gaby@sanjoseca.gov", team: "Mitigating Impacts" },
  { id: "sup2", name: "Carlos Rivera", role: "supervisor", email: "carlos@sanjoseca.gov", team: "Encampment Routes" },
  { id: "mgr1", name: "Diana Lopez", role: "manager", email: "diana@sanjoseca.gov", team: null, teamsAccess: ["Mitigating Impacts", "Encampment Routes"] },
  { id: "mgr2", name: "Robert Kim", role: "manager", email: "robert@sanjoseca.gov", team: null, teamsAccess: ["Waterway Abatements", "On Land Abatements"] },
];

const CRITERIA_OPTIONS = [
  "Job Expertise",
  "Customer Service",
  "Communication Skills",
  "Teamwork / Interpersonal Skills",
  "Reliability",
  "Supervisory & Leadership Skills",
  "Judgement / Problem Solving",
  "Other",
];

const INITIAL_OBSERVATIONS = [
  { id: 1, supervisorName: "Gaby Rollins", supervisorTeam: "Mitigating Impacts", staffName: "Aundrea Vargas", staffTeam: "Mitigating Impacts", date: "2026-02-15", location: "Kirk Park", criteria: ["Job Expertise", "Reliability"], assessment: "Worthy of Recognition", description: "Demonstrated exceptional knowledge during site cleanup. Coordinated team effectively under pressure.", submittedAt: "2026-02-15T10:30:00" },
  { id: 2, supervisorName: "Gaby Rollins", supervisorTeam: "Mitigating Impacts", staffName: "Kevin Montoya", staffTeam: "Mitigating Impacts", date: "2026-02-18", location: "Guadalupe River", criteria: ["Communication Skills", "Teamwork / Interpersonal Skills"], assessment: "Growth Opportunity", description: "Needs improvement in communicating task updates to the team in real time.", submittedAt: "2026-02-18T14:15:00" },
  { id: 3, supervisorName: "Carlos Rivera", supervisorTeam: "Encampment Routes", staffName: "Gabriel Tapia", staffTeam: "Encampment Routes", date: "2026-02-20", location: "Story Road", criteria: ["Customer Service", "Reliability"], assessment: "Worthy of Recognition", description: "Outstanding community interaction during route clearance. Received positive feedback from residents.", submittedAt: "2026-02-20T09:00:00" },
  { id: 4, supervisorName: "Carlos Rivera", supervisorTeam: "Encampment Routes", staffName: "Marco Washington", staffTeam: "Encampment Routes", date: "2026-02-22", location: "Tully Road", criteria: ["Job Expertise"], assessment: "Worthy of Recognition", description: "Showed strong technical skills in operating equipment safely and efficiently.", submittedAt: "2026-02-22T11:45:00" },
];

// ============================================================
// STYLES
// ============================================================
const colors = {
  sj: "#1B6CA8",
  sjDark: "#0D4F7C",
  teal: "#2E8B8B",
  tealLight: "#E8F5F5",
  green: "#4A7C59",
  gold: "#C9A84C",
  light: "#F4F7F9",
  border: "#D1DDE8",
  text: "#1A2332",
  muted: "#6B7E96",
  white: "#FFFFFF",
  recognition: "#2E7D32",
  recognitionBg: "#E8F5E9",
  growth: "#1565C0",
  growthBg: "#E3F2FD",
  danger: "#C62828",
};

const font = "'Georgia', 'Times New Roman', serif";
const fontSans = "'Trebuchet MS', 'Segoe UI', sans-serif";

// ============================================================
// SHARED COMPONENTS
// ============================================================
const Badge = ({ type }) => (
  <span style={{
    background: type === "Worthy of Recognition" ? colors.recognitionBg : colors.growthBg,
    color: type === "Worthy of Recognition" ? colors.recognition : colors.growth,
    fontSize: "11px", fontWeight: "bold", padding: "3px 8px",
    borderRadius: "12px", fontFamily: fontSans, whiteSpace: "nowrap",
  }}>
    {type === "Worthy of Recognition" ? "⭐ Recognition" : "📈 Growth Opp."}
  </span>
);

const TeamBadge = ({ team }) => {
  const teamColors = {
    "Mitigating Impacts": { bg: "#E8F5E9", color: "#2E7D32" },
    "Encampment Routes": { bg: "#FFF3E0", color: "#E65100" },
    "Waterway Abatements": { bg: "#E3F2FD", color: "#1565C0" },
    "On Land Abatements": { bg: "#F3E5F5", color: "#6A1B9A" },
  };
  const c = teamColors[team] || { bg: "#F5F5F5", color: "#333" };
  return (
    <span style={{
      background: c.bg, color: c.color,
      fontSize: "10px", fontWeight: "bold", padding: "2px 7px",
      borderRadius: "10px", fontFamily: fontSans,
    }}>{team}</span>
  );
};

const SJHeader = ({ user, onLogout }) => (
  <div style={{
    background: `linear-gradient(135deg, ${colors.sjDark} 0%, ${colors.sj} 100%)`,
    padding: "0",
    boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
  }}>
    <div style={{
      background: colors.sjDark,
      padding: "8px 24px",
      display: "flex", alignItems: "center", justifyContent: "space-between",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
        <div style={{
          width: "44px", height: "44px", borderRadius: "50%",
          background: "white", display: "flex", alignItems: "center",
          justifyContent: "center", fontSize: "20px", flexShrink: 0,
        }}>🏛️</div>
        <div>
          <div style={{ color: "white", fontFamily: font, fontSize: "13px", fontWeight: "bold", lineHeight: 1.2 }}>
            COMMUNITY SERVICES DIVISION
          </div>
          <div style={{ color: "rgba(255,255,255,0.75)", fontFamily: fontSans, fontSize: "11px", letterSpacing: "1px" }}>
            PERFORMANCE OBSERVATION SYSTEM
          </div>
        </div>
      </div>
      {user && (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "white", fontFamily: fontSans, fontSize: "12px", fontWeight: "bold" }}>{user.name}</div>
            <div style={{ color: "rgba(255,255,255,0.65)", fontFamily: fontSans, fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>
              {user.role} {user.team ? `· ${user.team}` : ""}
            </div>
          </div>
          <button onClick={onLogout} style={{
            background: "rgba(255,255,255,0.15)", border: "1px solid rgba(255,255,255,0.3)",
            color: "white", padding: "6px 12px", borderRadius: "6px",
            cursor: "pointer", fontFamily: fontSans, fontSize: "11px",
          }}>Sign Out</button>
        </div>
      )}
    </div>
  </div>
);

// ============================================================
// LOGIN SCREEN
// ============================================================
const LoginScreen = ({ onLogin }) => {
  const [selected, setSelected] = useState(null);

  return (
    <div style={{ minHeight: "100vh", background: `linear-gradient(160deg, ${colors.sjDark} 0%, ${colors.sj} 40%, ${colors.teal} 100%)`, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px" }}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ width: "72px", height: "72px", background: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", margin: "0 auto 16px" }}>🏛️</div>
        <h1 style={{ color: "white", fontFamily: font, fontSize: "22px", margin: "0 0 6px", letterSpacing: "0.5px" }}>Community Services Division</h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontFamily: fontSans, fontSize: "13px", margin: 0 }}>Performance Observation System · Demo Login</p>
      </div>

      <div style={{ background: "white", borderRadius: "16px", padding: "32px", width: "100%", maxWidth: "420px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <p style={{ fontFamily: fontSans, fontSize: "12px", color: colors.muted, textAlign: "center", marginBottom: "20px", textTransform: "uppercase", letterSpacing: "1px" }}>Select a demo account</p>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "24px" }}>
          {DEMO_USERS.map(u => (
            <button key={u.id} onClick={() => setSelected(u)} style={{
              border: `2px solid ${selected?.id === u.id ? colors.sj : colors.border}`,
              background: selected?.id === u.id ? "#EEF5FB" : "white",
              borderRadius: "10px", padding: "12px 16px",
              cursor: "pointer", textAlign: "left", transition: "all 0.15s",
              display: "flex", alignItems: "center", gap: "12px",
            }}>
              <div style={{
                width: "36px", height: "36px", borderRadius: "50%", flexShrink: 0,
                background: u.role === "admin" ? colors.gold : u.role === "supervisor" ? colors.sj : colors.teal,
                display: "flex", alignItems: "center", justifyContent: "center",
                color: "white", fontSize: "16px",
              }}>
                {u.role === "admin" ? "⚙️" : u.role === "supervisor" ? "📋" : "📊"}
              </div>
              <div>
                <div style={{ fontFamily: fontSans, fontSize: "13px", fontWeight: "bold", color: colors.text }}>{u.name}</div>
                <div style={{ fontFamily: fontSans, fontSize: "11px", color: colors.muted }}>
                  {u.role.toUpperCase()} {u.team ? `· ${u.team}` : u.teamsAccess ? `· ${u.teamsAccess.length} teams` : ""}
                </div>
              </div>
            </button>
          ))}
        </div>

        <button onClick={() => selected && onLogin(selected)} style={{
          width: "100%", background: selected ? `linear-gradient(135deg, ${colors.sjDark}, ${colors.sj})` : colors.border,
          color: selected ? "white" : colors.muted, border: "none", padding: "14px",
          borderRadius: "10px", fontFamily: fontSans, fontSize: "14px", fontWeight: "bold",
          cursor: selected ? "pointer" : "default", letterSpacing: "0.5px",
        }}>
          {selected ? `Sign In as ${selected.name}` : "Select an Account"}
        </button>

        <p style={{ fontFamily: fontSans, fontSize: "10px", color: colors.muted, textAlign: "center", marginTop: "16px", marginBottom: 0 }}>
          🔒 In production: invite-only email authentication via Supabase
        </p>
      </div>
    </div>
  );
};

// ============================================================
// SUPERVISOR INTERFACE
// ============================================================
const SupervisorView = ({ user, observations, onSubmit }) => {
  const [teamMode, setTeamMode] = useState("my");
  const [selectedTeam, setSelectedTeam] = useState(user.team);
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    staffId: "",
    location: "",
    criteria: [],
    assessment: "",
    description: "",
  });
  const [submitted, setSubmitted] = useState(null);
  const [errors, setErrors] = useState({});

  const availableStaff = STAFF.filter(s => s.team === selectedTeam);

  const toggleCriteria = (c) => {
    setForm(f => ({
      ...f,
      criteria: f.criteria.includes(c) ? f.criteria.filter(x => x !== c) : [...f.criteria, c]
    }));
  };

  const validate = () => {
    const e = {};
    if (!form.date) e.date = "Required";
    if (!form.staffId) e.staffId = "Please select a staff member";
    if (!form.location.trim()) e.location = "Required";
    if (!form.assessment) e.assessment = "Please select an assessment";
    if (!form.description.trim() || form.description.trim().length < 20) e.description = "Please provide at least 20 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const staff = STAFF.find(s => s.id === parseInt(form.staffId));
    const obs = {
      id: Date.now(),
      supervisorName: user.name,
      supervisorTeam: user.team,
      staffName: staff.name,
      staffTeam: staff.team,
      date: form.date,
      location: form.location,
      criteria: form.criteria,
      assessment: form.assessment,
      description: form.description,
      submittedAt: new Date().toISOString(),
    };
    onSubmit(obs);
    setSubmitted(obs);
  };

  const handleClear = () => {
    setForm({ date: new Date().toISOString().split("T")[0], staffId: "", location: "", criteria: [], assessment: "", description: "" });
    setErrors({});
    setSubmitted(null);
  };

  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: colors.light }}>
        <div style={{ maxWidth: "520px", margin: "0 auto", padding: "40px 20px", textAlign: "center" }}>
          <div style={{ background: "white", borderRadius: "16px", padding: "40px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
            <h2 style={{ fontFamily: font, color: colors.text, margin: "0 0 8px" }}>Observation Submitted</h2>
            <p style={{ fontFamily: fontSans, color: colors.muted, fontSize: "13px", marginBottom: "24px" }}>
              Your observation has been recorded. You cannot edit this submission.
            </p>
            <div style={{ background: colors.light, borderRadius: "10px", padding: "16px", textAlign: "left", marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
                <span style={{ fontFamily: fontSans, fontSize: "13px", fontWeight: "bold", color: colors.text }}>{submitted.staffName}</span>
                <Badge type={submitted.assessment} />
              </div>
              <div style={{ fontFamily: fontSans, fontSize: "12px", color: colors.muted }}>📅 {submitted.date} · 📍 {submitted.location}</div>
              {submitted.criteria.length > 0 && (
                <div style={{ marginTop: "8px", display: "flex", flexWrap: "wrap", gap: "4px" }}>
                  {submitted.criteria.map(c => (
                    <span key={c} style={{ background: "#EEF5FB", color: colors.sj, fontSize: "10px", padding: "2px 7px", borderRadius: "8px", fontFamily: fontSans }}>{c}</span>
                  ))}
                </div>
              )}
              <p style={{ fontFamily: fontSans, fontSize: "12px", color: colors.text, marginTop: "8px", marginBottom: 0 }}>{submitted.description}</p>
            </div>
            <button onClick={handleClear} style={{
              background: `linear-gradient(135deg, ${colors.sjDark}, ${colors.sj})`,
              color: "white", border: "none", padding: "12px 28px",
              borderRadius: "8px", fontFamily: fontSans, fontSize: "13px",
              fontWeight: "bold", cursor: "pointer",
            }}>Submit Another Observation</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: colors.light }}>
      <div style={{ maxWidth: "520px", margin: "0 auto", padding: "24px 16px" }}>
        {/* Welcome Banner */}
        <div style={{ background: `linear-gradient(135deg, ${colors.sjDark}, ${colors.sj})`, borderRadius: "12px", padding: "20px 24px", marginBottom: "20px", textAlign: "center" }}>
          <h2 style={{ color: "white", fontFamily: font, margin: "0 0 4px", fontSize: "18px" }}>Welcome, {user.name}!</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontFamily: fontSans, fontSize: "13px", margin: 0 }}>{user.team}</p>
        </div>

        <div style={{ background: "white", borderRadius: "12px", padding: "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontFamily: font, color: colors.text, margin: "0 0 20px", fontSize: "16px", borderBottom: `2px solid ${colors.teal}`, paddingBottom: "10px" }}>
            Performance Observation Form
          </h3>

          {/* Date */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontFamily: fontSans, fontSize: "12px", fontWeight: "bold", color: colors.text, display: "block", marginBottom: "6px" }}>
              Observation Date: <span style={{ color: colors.danger }}>*</span>
            </label>
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} style={{
              width: "100%", padding: "10px 12px", border: `1px solid ${errors.date ? colors.danger : colors.border}`,
              borderRadius: "8px", fontFamily: fontSans, fontSize: "13px", boxSizing: "border-box",
            }} />
            {errors.date && <p style={{ color: colors.danger, fontSize: "11px", margin: "4px 0 0", fontFamily: fontSans }}>{errors.date}</p>}
          </div>

          {/* Team Toggle */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontFamily: fontSans, fontSize: "12px", fontWeight: "bold", color: colors.text, display: "block", marginBottom: "8px" }}>
              Select Staff Observed: <span style={{ color: colors.danger }}>*</span>
            </label>
            <div style={{ display: "flex", gap: "12px", marginBottom: "10px" }}>
              {["my", "other"].map(mode => (
                <label key={mode} style={{ display: "flex", alignItems: "center", gap: "6px", cursor: "pointer", fontFamily: fontSans, fontSize: "13px" }}>
                  <input type="radio" checked={teamMode === mode} onChange={() => {
                    setTeamMode(mode);
                    setSelectedTeam(mode === "my" ? user.team : TEAMS.find(t => t !== user.team));
                    setForm(f => ({ ...f, staffId: "" }));
                  }} />
                  {mode === "my" ? "My Team" : "Another Team"}
                </label>
              ))}
            </div>
            {teamMode === "other" && (
              <select value={selectedTeam} onChange={e => { setSelectedTeam(e.target.value); setForm(f => ({ ...f, staffId: "" })); }} style={{
                width: "100%", padding: "10px 12px", border: `1px solid ${colors.border}`,
                borderRadius: "8px", fontFamily: fontSans, fontSize: "13px", marginBottom: "8px", boxSizing: "border-box",
              }}>
                {TEAMS.filter(t => t !== user.team).map(t => <option key={t} value={t}>{t}</option>)}
              </select>
            )}
            <select value={form.staffId} onChange={e => setForm(f => ({ ...f, staffId: e.target.value }))} style={{
              width: "100%", padding: "10px 12px", border: `1px solid ${errors.staffId ? colors.danger : colors.border}`,
              borderRadius: "8px", fontFamily: fontSans, fontSize: "13px", boxSizing: "border-box",
            }}>
              <option value="">Select Staff Observed</option>
              {availableStaff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            {errors.staffId && <p style={{ color: colors.danger, fontSize: "11px", margin: "4px 0 0", fontFamily: fontSans }}>{errors.staffId}</p>}
          </div>

          {/* Location */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontFamily: fontSans, fontSize: "12px", fontWeight: "bold", color: colors.text, display: "block", marginBottom: "6px" }}>
              Location: <span style={{ color: colors.danger }}>*</span>
            </label>
            <input type="text" placeholder="e.g. Kirk Park" value={form.location} onChange={e => setForm(f => ({ ...f, location: e.target.value }))} style={{
              width: "100%", padding: "10px 12px", border: `1px solid ${errors.location ? colors.danger : colors.border}`,
              borderRadius: "8px", fontFamily: fontSans, fontSize: "13px", boxSizing: "border-box",
            }} />
            {errors.location && <p style={{ color: colors.danger, fontSize: "11px", margin: "4px 0 0", fontFamily: fontSans }}>{errors.location}</p>}
          </div>

          {/* Criteria */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontFamily: fontSans, fontSize: "12px", fontWeight: "bold", color: colors.text, display: "block", marginBottom: "8px" }}>
              Criteria (optional):
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
              {CRITERIA_OPTIONS.map(c => (
                <label key={c} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", border: `1px solid ${form.criteria.includes(c) ? colors.sj : colors.border}`, borderRadius: "8px", cursor: "pointer", background: form.criteria.includes(c) ? "#EEF5FB" : "white", fontFamily: fontSans, fontSize: "12px", transition: "all 0.1s" }}>
                  <input type="checkbox" checked={form.criteria.includes(c)} onChange={() => toggleCriteria(c)} style={{ accentColor: colors.sj }} />
                  {c}
                </label>
              ))}
            </div>
          </div>

          {/* Assessment */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontFamily: fontSans, fontSize: "12px", fontWeight: "bold", color: colors.text, display: "block", marginBottom: "8px" }}>
              Assessment: <span style={{ color: colors.danger }}>*</span>
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {["Growth Opportunity", "Worthy of Recognition"].map(a => (
                <label key={a} style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", border: `2px solid ${form.assessment === a ? colors.sj : colors.border}`, borderRadius: "8px", cursor: "pointer", background: form.assessment === a ? "#EEF5FB" : "white", fontFamily: fontSans, fontSize: "13px" }}>
                  <input type="radio" name="assessment" value={a} checked={form.assessment === a} onChange={() => setForm(f => ({ ...f, assessment: a }))} style={{ accentColor: colors.sj }} />
                  {a === "Worthy of Recognition" ? "⭐ " : "📈 "}{a}
                </label>
              ))}
            </div>
            {errors.assessment && <p style={{ color: colors.danger, fontSize: "11px", margin: "4px 0 0", fontFamily: fontSans }}>{errors.assessment}</p>}
          </div>

          {/* Description */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ fontFamily: fontSans, fontSize: "12px", fontWeight: "bold", color: colors.text, display: "block", marginBottom: "6px" }}>
              Description: <span style={{ color: colors.danger }}>*</span>
            </label>
            <textarea rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} placeholder="Describe the observed behavior in detail..." style={{
              width: "100%", padding: "10px 12px", border: `1px solid ${errors.description ? colors.danger : colors.border}`,
              borderRadius: "8px", fontFamily: fontSans, fontSize: "13px", resize: "vertical", boxSizing: "border-box",
            }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {errors.description ? <p style={{ color: colors.danger, fontSize: "11px", margin: "4px 0 0", fontFamily: fontSans }}>{errors.description}</p> : <span />}
              <span style={{ fontFamily: fontSans, fontSize: "10px", color: colors.muted }}>{form.description.length} chars</span>
            </div>
          </div>

          {/* Buttons */}
          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={handleClear} style={{ flex: 1, background: "white", border: `1px solid ${colors.border}`, color: colors.muted, padding: "12px", borderRadius: "8px", fontFamily: fontSans, fontSize: "13px", cursor: "pointer" }}>
              Clear Form
            </button>
            <button onClick={handleSubmit} style={{ flex: 2, background: `linear-gradient(135deg, ${colors.sjDark}, ${colors.sj})`, color: "white", border: "none", padding: "12px", borderRadius: "8px", fontFamily: fontSans, fontSize: "13px", fontWeight: "bold", cursor: "pointer" }}>
              Submit Feedback
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// MANAGER INTERFACE
// ============================================================
const ManagerView = ({ user, observations }) => {
  const [filterTeam, setFilterTeam] = useState("all");
  const [filterAssessment, setFilterAssessment] = useState("all");
  const [selected, setSelected] = useState(null);

  const accessible = observations.filter(o => user.teamsAccess.includes(o.staffTeam));
  const filtered = accessible.filter(o => {
    if (filterTeam !== "all" && o.staffTeam !== filterTeam) return false;
    if (filterAssessment !== "all" && o.assessment !== filterAssessment) return false;
    return true;
  });

  const recogCount = accessible.filter(o => o.assessment === "Worthy of Recognition").length;
  const growthCount = accessible.filter(o => o.assessment === "Growth Opportunity").length;

  return (
    <div style={{ minHeight: "100vh", background: colors.light }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px 16px" }}>

        {/* Stats Row */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "20px" }}>
          {[
            { label: "Total Observations", value: accessible.length, icon: "📋", color: colors.sj },
            { label: "Worthy of Recognition", value: recogCount, icon: "⭐", color: colors.recognition },
            { label: "Growth Opportunities", value: growthCount, icon: "📈", color: colors.growth },
          ].map(s => (
            <div key={s.label} style={{ background: "white", borderRadius: "12px", padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", textAlign: "center" }}>
              <div style={{ fontSize: "24px", marginBottom: "4px" }}>{s.icon}</div>
              <div style={{ fontFamily: font, fontSize: "28px", fontWeight: "bold", color: s.color }}>{s.value}</div>
              <div style={{ fontFamily: fontSans, fontSize: "11px", color: colors.muted }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div style={{ background: "white", borderRadius: "12px", padding: "16px 20px", marginBottom: "16px", display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <span style={{ fontFamily: fontSans, fontSize: "12px", color: colors.muted, fontWeight: "bold" }}>FILTER:</span>
          <select value={filterTeam} onChange={e => setFilterTeam(e.target.value)} style={{ padding: "7px 12px", border: `1px solid ${colors.border}`, borderRadius: "8px", fontFamily: fontSans, fontSize: "12px" }}>
            <option value="all">All Teams</option>
            {user.teamsAccess.map(t => <option key={t} value={t}>{t}</option>)}
          </select>
          <select value={filterAssessment} onChange={e => setFilterAssessment(e.target.value)} style={{ padding: "7px 12px", border: `1px solid ${colors.border}`, borderRadius: "8px", fontFamily: fontSans, fontSize: "12px" }}>
            <option value="all">All Assessments</option>
            <option value="Worthy of Recognition">Worthy of Recognition</option>
            <option value="Growth Opportunity">Growth Opportunity</option>
          </select>
          <span style={{ fontFamily: fontSans, fontSize: "11px", color: colors.muted, marginLeft: "auto" }}>{filtered.length} records</span>
        </div>

        {/* Table */}
        <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", fontFamily: fontSans, color: colors.muted }}>No observations match your filters</div>
          ) : (
            filtered.map((obs, i) => (
              <div key={obs.id} onClick={() => setSelected(selected?.id === obs.id ? null : obs)} style={{
                padding: "14px 20px", borderBottom: i < filtered.length - 1 ? `1px solid ${colors.border}` : "none",
                cursor: "pointer", background: selected?.id === obs.id ? "#EEF5FB" : "white",
                transition: "background 0.1s",
              }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                      <span style={{ fontFamily: fontSans, fontSize: "13px", fontWeight: "bold", color: colors.text }}>{obs.staffName}</span>
                      <TeamBadge team={obs.staffTeam} />
                    </div>
                    <div style={{ fontFamily: fontSans, fontSize: "11px", color: colors.muted }}>
                      📅 {obs.date} · 📍 {obs.location} · Submitted by {obs.supervisorName}
                    </div>
                    {selected?.id === obs.id && (
                      <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: `1px solid ${colors.border}` }}>
                        {obs.criteria.length > 0 && (
                          <div style={{ display: "flex", flexWrap: "wrap", gap: "4px", marginBottom: "8px" }}>
                            {obs.criteria.map(c => <span key={c} style={{ background: "#EEF5FB", color: colors.sj, fontSize: "10px", padding: "2px 7px", borderRadius: "8px", fontFamily: fontSans }}>{c}</span>)}
                          </div>
                        )}
                        <p style={{ fontFamily: fontSans, fontSize: "12px", color: colors.text, margin: 0, lineHeight: 1.6 }}>{obs.description}</p>
                      </div>
                    )}
                  </div>
                  <Badge type={obs.assessment} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// ADMIN INTERFACE
// ============================================================
const AdminView = ({ observations, onInvite }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [inviteForm, setInviteForm] = useState({ email: "", role: "supervisor", team: TEAMS[0] });
  const [inviteSent, setInviteSent] = useState(false);

  const handleInvite = () => {
    if (!inviteForm.email) return;
    onInvite(inviteForm);
    setInviteSent(true);
    setTimeout(() => { setInviteSent(false); setInviteForm({ email: "", role: "supervisor", team: TEAMS[0] }); }, 3000);
  };

  const teamStats = TEAMS.map(t => ({
    team: t,
    count: observations.filter(o => o.staffTeam === t).length,
    recognition: observations.filter(o => o.staffTeam === t && o.assessment === "Worthy of Recognition").length,
    growth: observations.filter(o => o.staffTeam === t && o.assessment === "Growth Opportunity").length,
  }));

  return (
    <div style={{ minHeight: "100vh", background: colors.light }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px 16px" }}>

        {/* Tabs */}
        <div style={{ display: "flex", gap: "4px", background: "white", borderRadius: "12px", padding: "4px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          {[["overview", "📊 Overview"], ["observations", "📋 All Observations"], ["invite", "✉️ Send Invite"]].map(([id, label]) => (
            <button key={id} onClick={() => setActiveTab(id)} style={{
              flex: 1, padding: "10px", border: "none", borderRadius: "8px",
              background: activeTab === id ? `linear-gradient(135deg, ${colors.sjDark}, ${colors.sj})` : "transparent",
              color: activeTab === id ? "white" : colors.muted,
              fontFamily: fontSans, fontSize: "12px", fontWeight: "bold", cursor: "pointer",
            }}>{label}</button>
          ))}
        </div>

        {/* Overview Tab */}
        {activeTab === "overview" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", marginBottom: "20px" }}>
              {[
                { label: "Total Observations", value: observations.length, icon: "📋", color: colors.sj },
                { label: "Worthy of Recognition", value: observations.filter(o => o.assessment === "Worthy of Recognition").length, icon: "⭐", color: colors.recognition },
                { label: "Growth Opportunities", value: observations.filter(o => o.assessment === "Growth Opportunity").length, icon: "📈", color: colors.growth },
                { label: "Active Teams", value: TEAMS.length, icon: "👥", color: colors.teal },
              ].map(s => (
                <div key={s.label} style={{ background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", textAlign: "center" }}>
                  <div style={{ fontSize: "28px", marginBottom: "4px" }}>{s.icon}</div>
                  <div style={{ fontFamily: font, fontSize: "32px", fontWeight: "bold", color: s.color }}>{s.value}</div>
                  <div style={{ fontFamily: fontSans, fontSize: "11px", color: colors.muted }}>{s.label}</div>
                </div>
              ))}
            </div>

            <div style={{ background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontFamily: font, color: colors.text, margin: "0 0 16px", fontSize: "15px" }}>Submissions by Team</h3>
              {teamStats.map(t => (
                <div key={t.team} style={{ marginBottom: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <TeamBadge team={t.team} />
                      <span style={{ fontFamily: fontSans, fontSize: "12px", color: colors.muted }}>⭐{t.recognition} · 📈{t.growth}</span>
                    </div>
                    <span style={{ fontFamily: fontSans, fontSize: "12px", fontWeight: "bold", color: colors.text }}>{t.count}</span>
                  </div>
                  <div style={{ background: colors.border, borderRadius: "4px", height: "8px", overflow: "hidden" }}>
                    <div style={{ width: `${observations.length ? (t.count / observations.length) * 100 : 0}%`, background: `linear-gradient(90deg, ${colors.sj}, ${colors.teal})`, height: "100%", borderRadius: "4px", transition: "width 0.5s" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* All Observations Tab */}
        {activeTab === "observations" && (
          <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
            {observations.map((obs, i) => (
              <div key={obs.id} style={{ padding: "14px 20px", borderBottom: i < observations.length - 1 ? `1px solid ${colors.border}` : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                      <span style={{ fontFamily: fontSans, fontSize: "13px", fontWeight: "bold", color: colors.text }}>{obs.staffName}</span>
                      <TeamBadge team={obs.staffTeam} />
                    </div>
                    <div style={{ fontFamily: fontSans, fontSize: "11px", color: colors.muted }}>
                      📅 {obs.date} · 📍 {obs.location} · By {obs.supervisorName} ({obs.supervisorTeam})
                    </div>
                    <p style={{ fontFamily: fontSans, fontSize: "12px", color: colors.text, margin: "6px 0 0", lineHeight: 1.5 }}>{obs.description}</p>
                  </div>
                  <Badge type={obs.assessment} />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Invite Tab */}
        {activeTab === "invite" && (
          <div style={{ background: "white", borderRadius: "12px", padding: "28px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", maxWidth: "480px" }}>
            <h3 style={{ fontFamily: font, color: colors.text, margin: "0 0 6px" }}>Send Invitation</h3>
            <p style={{ fontFamily: fontSans, fontSize: "12px", color: colors.muted, marginBottom: "24px" }}>
              The recipient will receive a secure link to create their account. Access is limited to invited users only.
            </p>

            {inviteSent ? (
              <div style={{ background: colors.recognitionBg, border: `1px solid ${colors.recognition}`, borderRadius: "10px", padding: "20px", textAlign: "center" }}>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>✉️</div>
                <p style={{ fontFamily: fontSans, fontSize: "13px", color: colors.recognition, fontWeight: "bold", margin: 0 }}>Invitation sent successfully!</p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontFamily: fontSans, fontSize: "12px", fontWeight: "bold", color: colors.text, display: "block", marginBottom: "6px" }}>Email Address</label>
                  <input type="email" placeholder="name@sanjoseca.gov" value={inviteForm.email} onChange={e => setInviteForm(f => ({ ...f, email: e.target.value }))} style={{ width: "100%", padding: "10px 12px", border: `1px solid ${colors.border}`, borderRadius: "8px", fontFamily: fontSans, fontSize: "13px", boxSizing: "border-box" }} />
                </div>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontFamily: fontSans, fontSize: "12px", fontWeight: "bold", color: colors.text, display: "block", marginBottom: "6px" }}>Role</label>
                  <select value={inviteForm.role} onChange={e => setInviteForm(f => ({ ...f, role: e.target.value }))} style={{ width: "100%", padding: "10px 12px", border: `1px solid ${colors.border}`, borderRadius: "8px", fontFamily: fontSans, fontSize: "13px" }}>
                    <option value="supervisor">Supervisor (submit only)</option>
                    <option value="manager">Manager (read only)</option>
                  </select>
                </div>
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ fontFamily: fontSans, fontSize: "12px", fontWeight: "bold", color: colors.text, display: "block", marginBottom: "6px" }}>Assign Team</label>
                  <select value={inviteForm.team} onChange={e => setInviteForm(f => ({ ...f, team: e.target.value }))} style={{ width: "100%", padding: "10px 12px", border: `1px solid ${colors.border}`, borderRadius: "8px", fontFamily: fontSans, fontSize: "13px" }}>
                    {TEAMS.map(t => <option key={t} value={t}>{t}</option>)}
                  </select>
                </div>
                <button onClick={handleInvite} style={{ width: "100%", background: `linear-gradient(135deg, ${colors.sjDark}, ${colors.sj})`, color: "white", border: "none", padding: "13px", borderRadius: "8px", fontFamily: fontSans, fontSize: "13px", fontWeight: "bold", cursor: "pointer" }}>
                  Send Invitation ✉️
                </button>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

// ============================================================
// APP ROOT
// ============================================================
export default function App() {
  const [user, setUser] = useState(null);
  const [observations, setObservations] = useState(INITIAL_OBSERVATIONS);

  const handleSubmit = (obs) => setObservations(prev => [obs, ...prev]);

  if (!user) return <LoginScreen onLogin={setUser} />;

  return (
    <div>
      <SJHeader user={user} onLogout={() => setUser(null)} />
      {user.role === "supervisor" && <SupervisorView user={user} observations={observations} onSubmit={handleSubmit} />}
      {user.role === "manager" && <ManagerView user={user} observations={observations} />}
      {user.role === "admin" && <AdminView observations={observations} onInvite={(inv) => console.log("Invite:", inv)} />}
    </div>
  );
}
