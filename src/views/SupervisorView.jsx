import { useState } from "react";
import { supabase } from "../supabaseClient";
import { colors, font, fontSans } from "../styles/theme";
import { CRITERIA_OPTIONS } from "../constants/criteria";
import Badge from "../components/shared/Badge";
import useBreakpoint from "../hooks/useBreakpoint";

const SupervisorView = ({ profile, teams, staff, onLogout }) => {
  const { isMobile } = useBreakpoint();
  const [teamMode, setTeamMode]             = useState("my");
  const [selectedTeamId, setSelectedTeamId] = useState(profile.team_id);
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    staffId: "", location: "", criteria: [], assessment: "", description: "",
  });
  const [submitted, setSubmitted] = useState(null);
  const [errors, setErrors]       = useState({});
  const [loading, setLoading]     = useState(false);
  const [submitError, setSubmitError] = useState(null);

  const myTeam         = teams.find(t => t.id === profile.team_id);
  const availableStaff = staff.filter(s => s.team_id === selectedTeamId);
  const otherTeams     = teams.filter(t => t.id !== profile.team_id);

  const toggleCriteria = (c) => setForm(f => ({
    ...f,
    criteria: f.criteria.includes(c) ? f.criteria.filter(x => x !== c) : [...f.criteria, c],
  }));

  const validate = () => {
    const e = {};
    if (!form.date) e.date = "Required";
    if (!form.staffId) e.staffId = "Please select a staff member";
    if (!form.location.trim()) e.location = "Required";
    if (!form.assessment) e.assessment = "Please select an assessment";
    if (!form.description.trim() || form.description.trim().length < 20)
      e.description = "Please provide at least 20 characters";
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async () => {
    if (!validate()) return;
    setLoading(true);
    setSubmitError(null);
    const { data, error } = await supabase
      .from("observations")
      .insert({
        supervisor_id: profile.id,
        staff_id: form.staffId,
        observation_date: form.date,
        location: form.location,
        criteria: form.criteria,
        assessment: form.assessment,
        description: form.description,
      })
      .select(`*, staff(name, team:teams(name))`)
      .single();
    if (error) { setSubmitError("Something went wrong. Please try again."); setLoading(false); return; }
    setSubmitted(data);
    setLoading(false);
  };

  const handleClear = () => {
    setForm({ date: new Date().toISOString().split("T")[0], staffId: "", location: "", criteria: [], assessment: "", description: "" });
    setErrors({});
    setSubmitted(null);
  };

  const inputStyle = {
    width: "100%", padding: "12px", borderRadius: "8px",
    fontFamily: fontSans, fontSize: "16px", boxSizing: "border-box",
    minHeight: "44px",
  };

  // ── Success screen ──────────────────────────────────────────
  if (submitted) {
    return (
      <div style={{ minHeight: "100vh", background: colors.light }}>
        <div style={{ maxWidth: "560px", margin: "0 auto", padding: isMobile ? "24px 16px" : "40px 20px", textAlign: "center" }}>
          <div style={{ background: "white", borderRadius: "16px", padding: isMobile ? "28px 20px" : "40px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
            <h2 style={{ fontFamily: font, color: colors.text, margin: "0 0 8px" }}>Observation Submitted</h2>
            <p style={{ fontFamily: fontSans, color: colors.muted, fontSize: "13px", marginBottom: "24px" }}>
              Your observation has been recorded. You cannot edit this submission.
            </p>
            <div style={{ background: colors.light, borderRadius: "10px", padding: "16px", textAlign: "left", marginBottom: "24px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
                <span style={{ fontFamily: fontSans, fontSize: "13px", fontWeight: "bold", color: colors.text }}>{submitted.staff?.name}</span>
                <Badge type={submitted.assessment} />
              </div>
              <div style={{ fontFamily: fontSans, fontSize: "12px", color: colors.muted }}>
                📅 {submitted.observation_date} · 📍 {submitted.location}
              </div>
              <p style={{ fontFamily: fontSans, fontSize: "12px", color: colors.text, marginTop: "8px", marginBottom: 0 }}>
                {submitted.description}
              </p>
            </div>
            <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "10px", justifyContent: "center" }}>
              <button onClick={handleClear} style={{
                background: `linear-gradient(135deg, ${colors.sjDark}, ${colors.sj})`,
                color: "white", border: "none", padding: "12px 24px",
                borderRadius: "8px", fontFamily: fontSans, fontSize: "13px",
                fontWeight: "bold", cursor: "pointer", minHeight: "44px",
                flex: isMobile ? "unset" : 1,
              }}>
                Submit Another
              </button>
              <button onClick={onLogout} style={{
                background: "white", border: `1px solid ${colors.border}`,
                color: colors.muted, padding: "12px 24px",
                borderRadius: "8px", fontFamily: fontSans, fontSize: "13px",
                cursor: "pointer", minHeight: "44px",
                flex: isMobile ? "unset" : 1,
              }}>
                Sign Out
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Form ────────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: colors.light }}>
      <div style={{ maxWidth: "560px", margin: "0 auto", padding: isMobile ? "16px 12px" : "24px 16px" }}>

        <div style={{ background: `linear-gradient(135deg, ${colors.sjDark}, ${colors.sj})`, borderRadius: "12px", padding: "18px 20px", marginBottom: "16px", textAlign: "center" }}>
          <h2 style={{ color: "white", fontFamily: font, margin: "0 0 4px", fontSize: isMobile ? "16px" : "18px" }}>Welcome, {profile.name}!</h2>
          <p style={{ color: "rgba(255,255,255,0.8)", fontFamily: fontSans, fontSize: "13px", margin: 0 }}>{myTeam?.name}</p>
        </div>

        <div style={{ background: "white", borderRadius: "12px", padding: isMobile ? "18px 16px" : "24px", boxShadow: "0 2px 12px rgba(0,0,0,0.06)" }}>
          <h3 style={{ fontFamily: font, color: colors.text, margin: "0 0 20px", fontSize: "16px", borderBottom: `2px solid ${colors.teal}`, paddingBottom: "10px" }}>
            Performance Observation Form
          </h3>

          {/* Date */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontFamily: fontSans, fontSize: "13px", fontWeight: "bold", color: colors.text, display: "block", marginBottom: "6px" }}>
              Observation Date <span style={{ color: colors.danger }}>*</span>
            </label>
            <input type="date" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))}
              style={{ ...inputStyle, border: `1px solid ${errors.date ? colors.danger : colors.border}` }} />
          </div>

          {/* Staff */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontFamily: fontSans, fontSize: "13px", fontWeight: "bold", color: colors.text, display: "block", marginBottom: "8px" }}>
              Select Staff Observed <span style={{ color: colors.danger }}>*</span>
            </label>
            <div style={{ display: "flex", gap: "16px", marginBottom: "10px" }}>
              {["my", "other"].map(mode => (
                <label key={mode} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", fontFamily: fontSans, fontSize: "14px", minHeight: "44px" }}>
                  <input type="radio" checked={teamMode === mode} onChange={() => {
                    setTeamMode(mode);
                    setSelectedTeamId(mode === "my" ? profile.team_id : otherTeams[0]?.id);
                    setForm(f => ({ ...f, staffId: "" }));
                  }} style={{ width: "18px", height: "18px" }} />
                  {mode === "my" ? "My Team" : "Another Team"}
                </label>
              ))}
            </div>
            {teamMode === "other" && (
              <select value={selectedTeamId} onChange={e => { setSelectedTeamId(e.target.value); setForm(f => ({ ...f, staffId: "" })); }}
                style={{ ...inputStyle, border: `1px solid ${colors.border}`, marginBottom: "8px" }}>
                {otherTeams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
              </select>
            )}
            <select value={form.staffId} onChange={e => setForm(f => ({ ...f, staffId: e.target.value }))}
              style={{ ...inputStyle, border: `1px solid ${errors.staffId ? colors.danger : colors.border}` }}>
              <option value="">Select Staff Observed</option>
              {availableStaff.map(s => <option key={s.id} value={s.id}>{s.name}</option>)}
            </select>
            {errors.staffId && <p style={{ color: colors.danger, fontSize: "12px", margin: "4px 0 0", fontFamily: fontSans }}>{errors.staffId}</p>}
          </div>

          {/* Location */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontFamily: fontSans, fontSize: "13px", fontWeight: "bold", color: colors.text, display: "block", marginBottom: "6px" }}>
              Location <span style={{ color: colors.danger }}>*</span>
            </label>
            <input type="text" placeholder="e.g. Kirk Park" value={form.location}
              onChange={e => setForm(f => ({ ...f, location: e.target.value }))}
              style={{ ...inputStyle, border: `1px solid ${errors.location ? colors.danger : colors.border}` }} />
          </div>

          {/* Criteria */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontFamily: fontSans, fontSize: "13px", fontWeight: "bold", color: colors.text, display: "block", marginBottom: "8px" }}>
              Criteria (optional)
            </label>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "8px" }}>
              {CRITERIA_OPTIONS.map(c => (
                <label key={c} style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "10px 12px",
                  border: `1px solid ${form.criteria.includes(c) ? colors.sj : colors.border}`,
                  borderRadius: "8px", cursor: "pointer",
                  background: form.criteria.includes(c) ? "#EEF5FB" : "white",
                  fontFamily: fontSans, fontSize: "13px",
                  minHeight: "44px",
                }}>
                  <input type="checkbox" checked={form.criteria.includes(c)} onChange={() => toggleCriteria(c)}
                    style={{ accentColor: colors.sj, width: "18px", height: "18px", flexShrink: 0 }} />
                  {c}
                </label>
              ))}
            </div>
          </div>

          {/* Assessment */}
          <div style={{ marginBottom: "16px" }}>
            <label style={{ fontFamily: fontSans, fontSize: "13px", fontWeight: "bold", color: colors.text, display: "block", marginBottom: "8px" }}>
              Assessment <span style={{ color: colors.danger }}>*</span>
            </label>
            <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
              {["Growth Opportunity", "Worthy of Recognition"].map(a => (
                <label key={a} style={{
                  display: "flex", alignItems: "center", gap: "12px",
                  padding: "12px 14px",
                  border: `2px solid ${form.assessment === a ? colors.sj : colors.border}`,
                  borderRadius: "8px", cursor: "pointer",
                  background: form.assessment === a ? "#EEF5FB" : "white",
                  fontFamily: fontSans, fontSize: "14px",
                  minHeight: "44px",
                }}>
                  <input type="radio" name="assessment" value={a} checked={form.assessment === a}
                    onChange={() => setForm(f => ({ ...f, assessment: a }))}
                    style={{ accentColor: colors.sj, width: "18px", height: "18px", flexShrink: 0 }} />
                  {a === "Worthy of Recognition" ? "⭐ " : "📈 "}{a}
                </label>
              ))}
            </div>
            {errors.assessment && <p style={{ color: colors.danger, fontSize: "12px", margin: "4px 0 0", fontFamily: fontSans }}>{errors.assessment}</p>}
          </div>

          {/* Description */}
          <div style={{ marginBottom: "24px" }}>
            <label style={{ fontFamily: fontSans, fontSize: "13px", fontWeight: "bold", color: colors.text, display: "block", marginBottom: "6px" }}>
              Description <span style={{ color: colors.danger }}>*</span>
            </label>
            <textarea rows={isMobile ? 5 : 4} value={form.description}
              onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
              placeholder="Describe the observed behavior in detail..."
              style={{
                ...inputStyle, resize: "vertical", minHeight: "100px",
                border: `1px solid ${errors.description ? colors.danger : colors.border}`,
              }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              {errors.description
                ? <p style={{ color: colors.danger, fontSize: "12px", margin: "4px 0 0", fontFamily: fontSans }}>{errors.description}</p>
                : <span />}
              <span style={{ fontFamily: fontSans, fontSize: "11px", color: colors.muted }}>{form.description.length} chars</span>
            </div>
          </div>

          {/* Actions */}
          <div style={{ display: "flex", flexDirection: isMobile ? "column" : "row", gap: "10px" }}>
            <button onClick={handleClear} style={{
              flex: isMobile ? "unset" : 1,
              background: "white", border: `1px solid ${colors.border}`,
              color: colors.muted, padding: "13px", borderRadius: "8px",
              fontFamily: fontSans, fontSize: "14px", cursor: "pointer", minHeight: "44px",
            }}>
              Clear Form
            </button>
            <button onClick={handleSubmit} disabled={loading} style={{
              flex: isMobile ? "unset" : 2,
              background: loading ? colors.border : `linear-gradient(135deg, ${colors.sjDark}, ${colors.sj})`,
              color: loading ? colors.muted : "white", border: "none",
              padding: "13px", borderRadius: "8px",
              fontFamily: fontSans, fontSize: "14px", fontWeight: "bold",
              cursor: loading ? "default" : "pointer", minHeight: "44px",
            }}>
              {loading ? "Submitting..." : "Submit Feedback"}
            </button>
          </div>
          {submitError && (
            <div style={{ background: "#FFEBEE", border: "1px solid #EF9A9A", borderRadius: "8px", padding: "10px 14px", marginTop: "10px" }}>
              <p style={{ fontFamily: fontSans, fontSize: "12px", color: colors.danger, margin: 0 }}>⚠️ {submitError}</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SupervisorView;