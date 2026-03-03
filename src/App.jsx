import { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";

// ============================================================
// STATIC DATA — Teams and Staff loaded from Supabase
// ============================================================
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

const SJHeader = ({ user, profile, onLogout }) => (
  <div style={{
    background: `linear-gradient(135deg, ${colors.sjDark} 0%, ${colors.sj} 100%)`,
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
      {profile && (
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{ textAlign: "right" }}>
            <div style={{ color: "white", fontFamily: fontSans, fontSize: "12px", fontWeight: "bold" }}>{profile.name}</div>
            <div style={{ color: "rgba(255,255,255,0.65)", fontFamily: fontSans, fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>
              {profile.role}
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

const Spinner = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: colors.light }}>
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "32px", marginBottom: "12px" }}>⏳</div>
      <p style={{ fontFamily: fontSans, color: colors.muted, fontSize: "14px" }}>Loading...</p>
    </div>
  </div>
);

// ============================================================
// LOGIN SCREEN — Real Supabase Auth
// ============================================================
const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [mode, setMode] = useState("login"); // login | signup
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const handleLogin = async () => {
    if (!email || !password) { setError("Please enter email and password"); return; }
    setLoading(true); setError(null);
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    if (error) setError(error.message);
    setLoading(false);
  };

  const handleSignup = async () => {
    if (!email || !password) { setError("Please enter email and password"); return; }
    setLoading(true); setError(null);
    const { error } = await supabase.auth.signUp({ email, password });
    if (error) setError(error.message);
    else setMessage("Check your email for a confirmation link!");
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(160deg, ${colors.sjDark} 0%, ${colors.sj} 40%, ${colors.teal} 100%)`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px"
    }}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ width: "72px", height: "72px", background: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", margin: "0 auto 16px" }}>🏛️</div>
        <h1 style={{ color: "white", fontFamily: font, fontSize: "22px", margin: "0 0 6px" }}>Community Services Division</h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontFamily: fontSans, fontSize: "13px", margin: 0 }}>Performance Observation System</p>
      </div>

      <div style={{ background: "white", borderRadius: "16px", padding: "32px", width: "100%", maxWidth: "400px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        <div style={{ display: "flex", gap: "4px", marginBottom: "24px", background: colors.light, borderRadius: "8px", padding: "4px" }}>
          {["login", "signup"].map(m => (
            <button key={m} onClick={() => { setMode(m); setError(null); setMessage(null); }} style={{
              flex: 1, padding: "8px", border: "none", borderRadius: "6px",
              background: mode === m ? colors.sj : "transparent",
              color: mode === m ? "white" : colors.muted,
              fontFamily: fontSans, fontSize: "12px", fontWeight: "bold", cursor: "pointer",
            }}>{m === "login" ? "Sign In" : "Create Account"}</button>
          ))}
        </div>

        {error && (
          <div style={{ background: "#FFEBEE", border: "1px solid #EF9A9A", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px" }}>
            <p style={{ fontFamily: fontSans, fontSize: "12px", color: colors.danger, margin: 0 }}>⚠️ {error}</p>
          </div>
        )}

        {message && (
          <div style={{ background: colors.recognitionBg, border: "1px solid #A5D6A7", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px" }}>
            <p style={{ fontFamily: fontSans, fontSize: "12px", color: colors.recognition, margin: 0 }}>✅ {message}</p>
          </div>
        )}

        <div style={{ marginBottom: "14px" }}>
          <label style={{ fontFamily: fontSans, fontSize: "12px", fontWeight: "bold", color: colors.text, display: "block", marginBottom: "6px" }}>Email</label>
          <input type="email" placeholder="name@sanjoseca.gov" value={email} onChange={e => setEmail(e.target.value)}
            onKeyDown={e => e.key === "Enter" && (mode === "login" ? handleLogin() : handleSignup())}
            style={{ width: "100%", padding: "10px 12px", border: `1px solid ${colors.border}`, borderRadius: "8px", fontFamily: fontSans, fontSize: "13px", boxSizing: "border-box" }} />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ fontFamily: fontSans, fontSize: "12px", fontWeight: "bold", color: colors.text, display: "block", marginBottom: "6px" }}>Password</label>
          <input type="password" placeholder="••••••••" value={password} onChange={e => setPassword(e.target.value)}
            onKeyDown={e => e.key === "Enter" && (mode === "login" ? handleLogin() : handleSignup())}
            style={{ width: "100%", padding: "10px 12px", border: `1px solid ${colors.border}`, borderRadius: "8px", fontFamily: fontSans, fontSize: "13px", boxSizing: "border-box" }} />
        </div>

        <button onClick={mode === "login" ? handleLogin : handleSignup} disabled={loading} style={{
          width: "100%", background: loading ? colors.border : `linear-gradient(135deg, ${colors.sjDark}, ${colors.sj})`,
          color: loading ? colors.muted : "white", border: "none", padding: "13px",
          borderRadius: "8px", fontFamily: fontSans, fontSize: "13px", fontWeight: "bold",
          cursor: loading ? "default" : "pointer",
        }}>
          {loading ? "Please wait..." : mode === "login" ? "Sign In" : "Create Account"}
        </button>

        <p style={{ fontFamily: fontSans, fontSize: "10px", color: colors.muted, textAlign: "center", marginTop: "16px", marginBottom: 0 }}>
          🔒 Access restricted to invited users only
        </p>
      </div>
    </div>
  );
};

// ============================================================
// SUPERVISOR INTERFACE
// ============================================================
const SupervisorView = ({ profile, teams, staff }) => {
  const [teamMode, setTeamMode] = useState("my");
  const [selectedTeamId, setSelectedTeamId] = useState(profile.team_id);
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
  const [loading, setLoading] = useState(false);

  const myTeam = teams.find(t => t.id === profile.team_id);
  const availableStaff = staff.filter(s => s.team_id === selectedTeamId);
  const otherTeams = teams.filter(t => t.id !== profile.team_id);

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

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    const { data, error } = await supabase.from("observations").insert({
      supervisor_id: profile.id,
      staff_id: form.staffId,
      observation_date: form.date,
      location: form.location,
      criteria: form.criteria,
      assessment: form.assessment,
      description: form.description,
    }).select(`*, staff(name, team:teams(name))`).single();

    if (error) {
      alert("Error submitting: " + error.message);
      setLoading(false);
      return;
    }
    setSubmitted(data);
    setLoading(false);
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
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px" }}>
                <span style={{ fontFamily: fontSans, fontSize: "13px", fontWeight: "bold", color: colors.text }}>{submitted.staff?.name}</span>
                <Badge type={submitted.assessment} />
              </div>
              <div style={{ fontFamily: fontSans, fontSize: "12px", color: colors.muted }}>📅 {submitted.observation_date} · 📍 {submitted.location}</div>
              <p style={{ fontFamily: fontSans, fontSize: "12px", color: colors.text, marginTop: "8px", marginBottom: 0 }}>{submitted.description}</p>
            </div>
            <button onClick={handleClear} style={{
              background: `linear-gradient(135deg, ${colors.sjDark}, ${colors.sj})`,
              color: "white", border: "none", padding: "12px 28px",
              borderRadius: "8px", fontFamily: fontSans, fontSize: "13px", fontWeight: "bold", cursor: "pointer",
            }}>Submit Another Observation</button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: "100vh", background: colors.light }}>
      <div style={{ maxWidth: "520px", margin: "0 auto", padding: "24px 16px" }}>
        <div style={{ background: `linear-gradient(135deg, ${colors.sjDark}, ${colors.sj})`, borderRadius: "12px", padding: "20px 24px", marginBottom: "20px", textAlign: "center" }}>
          <h2 style={{ color: "white", fontFamily: font, margin: "0 0 4px", fontSize: "18px" }}>Welcome, {profile.name}!</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontFamily: fontSans, fontSize: "13px", margin: 0 }}>{myTeam?.name}</p>
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
                    setSelectedTeamId(mode === "my" ? profile.team_id : otherTeams[0]?.id);
                    setForm(f => ({ ...f, staffId: "" }));
                  }} />
                  {mode === "my" ? "My Team" : "Another Team"}
                </label>
              ))}
            </div>
            {teamMode === "other" && (
              <select value={selectedTeamId} onChange={e => { setSelectedTeamId(e.target.value); setForm(f => ({ ...f, staffId: "" })); }} style={{
                width: "100%", padding: "10px 12px", border: `1px solid ${colors.border}`,
                borderRadius: "8px", fontFamily: fontSans, fontSize: "13px", marginBottom: "8px", boxSizing: "border-box",
              }}>
                {otherTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
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
          </div>

          {/* Criteria */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontFamily: fontSans, fontSize: "12px", fontWeight: "bold", color: colors.text, display: "block", marginBottom: "8px" }}>
              Criteria (optional):
            </label>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "6px" }}>
              {CRITERIA_OPTIONS.map(c => (
                <label key={c} style={{ display: "flex", alignItems: "center", gap: "8px", padding: "8px 10px", border: `1px solid ${form.criteria.includes(c) ? colors.sj : colors.border}`, borderRadius: "8px", cursor: "pointer", background: form.criteria.includes(c) ? "#EEF5FB" : "white", fontFamily: fontSans, fontSize: "12px" }}>
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

          <div style={{ display: "flex", gap: "10px" }}>
            <button onClick={handleClear} style={{ flex: 1, background: "white", border: `1px solid ${colors.border}`, color: colors.muted, padding: "12px", borderRadius: "8px", fontFamily: fontSans, fontSize: "13px", cursor: "pointer" }}>
              Clear Form
            </button>
            <button onClick={handleSubmit} disabled={loading} style={{ flex: 2, background: loading ? colors.border : `linear-gradient(135deg, ${colors.sjDark}, ${colors.sj})`, color: loading ? colors.muted : "white", border: "none", padding: "12px", borderRadius: "8px", fontFamily: fontSans, fontSize: "13px", fontWeight: "bold", cursor: loading ? "default" : "pointer" }}>
              {loading ? "Submitting..." : "Submit Feedback"}
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
const ManagerView = ({ profile, teams }) => {
  const [observations, setObservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filterTeam, setFilterTeam] = useState("all");
  const [filterAssessment, setFilterAssessment] = useState("all");
  const [selected, setSelected] = useState(null);

  useEffect(() => {
    const fetchObservations = async () => {
      const { data, error } = await supabase
        .from("observations")
        .select(`*, staff(name, team:teams(name)), supervisor:profiles(name)`)
        .order("submitted_at", { ascending: false });
      if (!error) setObservations(data || []);
      setLoading(false);
    };
    fetchObservations();
  }, []);

  const accessibleTeams = teams.filter(t =>
    observations.some(o => o.staff?.team?.name === t.name)
  );

  const filtered = observations.filter(o => {
    if (filterTeam !== "all" && o.staff?.team?.name !== filterTeam) return false;
    if (filterAssessment !== "all" && o.assessment !== filterAssessment) return false;
    return true;
  });

  const recogCount = observations.filter(o => o.assessment === "Worthy of Recognition").length;
  const growthCount = observations.filter(o => o.assessment === "Growth Opportunity").length;

  if (loading) return <Spinner />;

  return (
    <div style={{ minHeight: "100vh", background: colors.light }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px 16px" }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px", marginBottom: "20px" }}>
          {[
            { label: "Total Observations", value: observations.length, icon: "📋", color: colors.sj },
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

        <div style={{ background: "white", borderRadius: "12px", padding: "16px 20px", marginBottom: "16px", display: "flex", gap: "12px", flexWrap: "wrap", alignItems: "center", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          <span style={{ fontFamily: fontSans, fontSize: "12px", color: colors.muted, fontWeight: "bold" }}>FILTER:</span>
          <select value={filterTeam} onChange={e => setFilterTeam(e.target.value)} style={{ padding: "7px 12px", border: `1px solid ${colors.border}`, borderRadius: "8px", fontFamily: fontSans, fontSize: "12px" }}>
            <option value="all">All Teams</option>
            {accessibleTeams.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
          </select>
          <select value={filterAssessment} onChange={e => setFilterAssessment(e.target.value)} style={{ padding: "7px 12px", border: `1px solid ${colors.border}`, borderRadius: "8px", fontFamily: fontSans, fontSize: "12px" }}>
            <option value="all">All Assessments</option>
            <option value="Worthy of Recognition">Worthy of Recognition</option>
            <option value="Growth Opportunity">Growth Opportunity</option>
          </select>
          <span style={{ fontFamily: fontSans, fontSize: "11px", color: colors.muted, marginLeft: "auto" }}>{filtered.length} records</span>
        </div>

        <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
          {filtered.length === 0 ? (
            <div style={{ padding: "40px", textAlign: "center", fontFamily: fontSans, color: colors.muted }}>No observations found</div>
          ) : filtered.map((obs, i) => (
            <div key={obs.id} onClick={() => setSelected(selected?.id === obs.id ? null : obs)} style={{
              padding: "14px 20px", borderBottom: i < filtered.length - 1 ? `1px solid ${colors.border}` : "none",
              cursor: "pointer", background: selected?.id === obs.id ? "#EEF5FB" : "white",
            }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                <div style={{ flex: 1 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                    <span style={{ fontFamily: fontSans, fontSize: "13px", fontWeight: "bold", color: colors.text }}>{obs.staff?.name}</span>
                    <TeamBadge team={obs.staff?.team?.name} />
                  </div>
                  <div style={{ fontFamily: fontSans, fontSize: "11px", color: colors.muted }}>
                    📅 {obs.observation_date} · 📍 {obs.location} · By {obs.supervisor?.name}
                  </div>
                  {selected?.id === obs.id && (
                    <div style={{ marginTop: "12px", paddingTop: "12px", borderTop: `1px solid ${colors.border}` }}>
                      {obs.criteria?.length > 0 && (
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
          ))}
        </div>
      </div>
    </div>
  );
};

// ============================================================
// ADMIN INTERFACE
// ============================================================
const AdminView = ({ profile, teams, staff }) => {
  const [activeTab, setActiveTab] = useState("overview");
  const [observations, setObservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteForm, setInviteForm] = useState({ email: "", role: "supervisor", teamId: teams[0]?.id || "" });
  const [inviteSent, setInviteSent] = useState(false);
  const [inviteLoading, setInviteLoading] = useState(false);

  useEffect(() => {
    const fetchAll = async () => {
      const { data } = await supabase
        .from("observations")
        .select(`*, staff(name, team:teams(name)), supervisor:profiles(name)`)
        .order("submitted_at", { ascending: false });
      setObservations(data || []);
      setLoading(false);
    };
    fetchAll();
  }, []);

  const handleInvite = async () => {
    if (!inviteForm.email) return;
    setInviteLoading(true);
    const { error } = await supabase.auth.admin.inviteUserByEmail(inviteForm.email, {
      data: { role: inviteForm.role, team_id: inviteForm.teamId }
    });
    if (error) alert("Error sending invite: " + error.message);
    else setInviteSent(true);
    setTimeout(() => { setInviteSent(false); setInviteForm({ email: "", role: "supervisor", teamId: teams[0]?.id || "" }); }, 3000);
    setInviteLoading(false);
  };

  const teamStats = teams.map(t => ({
    team: t.name,
    count: observations.filter(o => o.staff?.team?.name === t.name).length,
    recognition: observations.filter(o => o.staff?.team?.name === t.name && o.assessment === "Worthy of Recognition").length,
    growth: observations.filter(o => o.staff?.team?.name === t.name && o.assessment === "Growth Opportunity").length,
  }));

  if (loading) return <Spinner />;

  return (
    <div style={{ minHeight: "100vh", background: colors.light }}>
      <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px 16px" }}>
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

        {activeTab === "overview" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "12px", marginBottom: "20px" }}>
              {[
                { label: "Total Observations", value: observations.length, icon: "📋", color: colors.sj },
                { label: "Worthy of Recognition", value: observations.filter(o => o.assessment === "Worthy of Recognition").length, icon: "⭐", color: colors.recognition },
                { label: "Growth Opportunities", value: observations.filter(o => o.assessment === "Growth Opportunity").length, icon: "📈", color: colors.growth },
                { label: "Active Teams", value: teams.length, icon: "👥", color: colors.teal },
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
                    <div style={{ width: `${observations.length ? (t.count / observations.length) * 100 : 0}%`, background: `linear-gradient(90deg, ${colors.sj}, ${colors.teal})`, height: "100%", borderRadius: "4px" }} />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === "observations" && (
          <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
            {observations.length === 0 ? (
              <div style={{ padding: "40px", textAlign: "center", fontFamily: fontSans, color: colors.muted }}>No observations yet</div>
            ) : observations.map((obs, i) => (
              <div key={obs.id} style={{ padding: "14px 20px", borderBottom: i < observations.length - 1 ? `1px solid ${colors.border}` : "none" }}>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "12px" }}>
                  <div>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                      <span style={{ fontFamily: fontSans, fontSize: "13px", fontWeight: "bold", color: colors.text }}>{obs.staff?.name}</span>
                      <TeamBadge team={obs.staff?.team?.name} />
                    </div>
                    <div style={{ fontFamily: fontSans, fontSize: "11px", color: colors.muted }}>
                      📅 {obs.observation_date} · 📍 {obs.location} · By {obs.supervisor?.name}
                    </div>
                    <p style={{ fontFamily: fontSans, fontSize: "12px", color: colors.text, margin: "6px 0 0", lineHeight: 1.5 }}>{obs.description}</p>
                  </div>
                  <Badge type={obs.assessment} />
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === "invite" && (
          <div style={{ background: "white", borderRadius: "12px", padding: "28px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", maxWidth: "480px" }}>
            <h3 style={{ fontFamily: font, color: colors.text, margin: "0 0 6px" }}>Send Invitation</h3>
            <p style={{ fontFamily: fontSans, fontSize: "12px", color: colors.muted, marginBottom: "24px" }}>
              The recipient will receive a secure link to create their account.
            </p>
            {inviteSent ? (
              <div style={{ background: colors.recognitionBg, border: `1px solid #A5D6A7`, borderRadius: "10px", padding: "20px", textAlign: "center" }}>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>✉️</div>
                <p style={{ fontFamily: fontSans, fontSize: "13px", color: colors.recognition, fontWeight: "bold", margin: 0 }}>Invitation sent!</p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: "16px" }}>
                  <label style={{ fontFamily: fontSans, fontSize: "12px", fontWeight: "bold", color: colors.text, display: "block", marginBottom: "6px" }}>Email</label>
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
                  <select value={inviteForm.teamId} onChange={e => setInviteForm(f => ({ ...f, teamId: e.target.value }))} style={{ width: "100%", padding: "10px 12px", border: `1px solid ${colors.border}`, borderRadius: "8px", fontFamily: fontSans, fontSize: "13px" }}>
                    {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <button onClick={handleInvite} disabled={inviteLoading} style={{ width: "100%", background: inviteLoading ? colors.border : `linear-gradient(135deg, ${colors.sjDark}, ${colors.sj})`, color: inviteLoading ? colors.muted : "white", border: "none", padding: "13px", borderRadius: "8px", fontFamily: fontSans, fontSize: "13px", fontWeight: "bold", cursor: inviteLoading ? "default" : "pointer" }}>
                  {inviteLoading ? "Sending..." : "Send Invitation ✉️"}
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
// APP ROOT — Real Supabase Auth
// ============================================================
export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [teams, setTeams] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) loadUserData(session.user.id);
      else setLoading(false);
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) loadUserData(session.user.id);
      else { setProfile(null); setLoading(false); }
    });

    return () => subscription.unsubscribe();
  }, []);

  const loadUserData = async (userId) => {
    setLoading(true);
    const [profileRes, teamsRes, staffRes] = await Promise.all([
      supabase.from("profiles").select("*").eq("id", userId).single(),
      supabase.from("teams").select("*").order("name"),
      supabase.from("staff").select("*").order("name"),
    ]);
    if (profileRes.data) setProfile(profileRes.data);
    if (teamsRes.data) setTeams(teamsRes.data);
    if (staffRes.data) setStaff(staffRes.data);
    setLoading(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
    setProfile(null);
    setSession(null);
  };

  if (loading) return <Spinner />;
  if (!session) return <LoginScreen />;
  if (!profile) return (
    <div style={{ minHeight: "100vh", background: colors.light, display: "flex", alignItems: "center", justifyContent: "center" }}>
      <div style={{ background: "white", borderRadius: "16px", padding: "40px", textAlign: "center", maxWidth: "400px" }}>
        <div style={{ fontSize: "40px", marginBottom: "16px" }}>⏳</div>
        <h3 style={{ fontFamily: font, color: colors.text, margin: "0 0 8px" }}>Setting up your account</h3>
        <p style={{ fontFamily: fontSans, color: colors.muted, fontSize: "13px" }}>Your profile is being configured by an administrator. Please check back shortly.</p>
        <button onClick={handleLogout} style={{ marginTop: "16px", background: "none", border: `1px solid ${colors.border}`, padding: "8px 16px", borderRadius: "8px", fontFamily: fontSans, fontSize: "12px", cursor: "pointer", color: colors.muted }}>Sign Out</button>
      </div>
    </div>
  );

  return (
    <div>
      <SJHeader user={session.user} profile={profile} onLogout={handleLogout} />
      {profile.role === "supervisor" && <SupervisorView profile={profile} teams={teams} staff={staff} />}
      {profile.role === "manager" && <ManagerView profile={profile} teams={teams} />}
      {profile.role === "admin" && <AdminView profile={profile} teams={teams} staff={staff} />}
    </div>
  );
}
