import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { colors, fontSans, font } from "../styles/theme";
import { CRITERIA_OPTIONS } from "../constants/criteria";
import Badge from "../components/shared/Badge";
import FilterBar from "../components/shared/Filterbar";
import TeamBadge from "../components/shared/TeamBadge";
import Spinner from "../components/shared/Spinner";
import useBreakpoint from "../hooks/useBreakpoint";

// ── Submit Tab (mirrors SupervisorView form) ────────────────
const SubmitTab = ({ profile, teams, staff }) => {
  const { isMobile } = useBreakpoint();
  const [selectedTeamId, setSelectedTeamId] = useState(teams[0]?.id || "");
  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    staffId: "", location: "", criteria: [], assessment: "", description: "",
  });
  const [submitted, setSubmitted] = useState(null);
  const [errors, setErrors]       = useState({});
  const [loading, setLoading]     = useState(false);

  const availableStaff = staff.filter(s => s.team_id === selectedTeamId);

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
    if (error) { alert("Error submitting: " + error.message); setLoading(false); return; }
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
    fontFamily: fontSans, fontSize: "16px", boxSizing: "border-box", minHeight: "44px",
  };

  // Success screen
  if (submitted) {
    return (
      <div style={{ maxWidth: "560px", margin: "0 auto", padding: isMobile ? "16px 0" : "24px 0", textAlign: "center" }}>
        <div style={{ background: "white", borderRadius: "16px", padding: isMobile ? "28px 20px" : "40px", boxShadow: "0 4px 20px rgba(0,0,0,0.08)" }}>
          <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
          <h2 style={{ fontFamily: font, color: colors.text, margin: "0 0 8px" }}>Observation Submitted</h2>
          <p style={{ fontFamily: fontSans, color: colors.muted, fontSize: "13px", marginBottom: "24px" }}>
            Your observation has been recorded.
          </p>
          <div style={{ background: colors.light, borderRadius: "10px", padding: "16px", textAlign: "left", marginBottom: "24px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "8px", flexWrap: "wrap", gap: "8px" }}>
              <span style={{ fontFamily: fontSans, fontSize: "13px", fontWeight: "bold", color: colors.text }}>{submitted.staff?.name}</span>
              <Badge type={submitted.assessment} />
            </div>
            <div style={{ fontFamily: fontSans, fontSize: "12px", color: colors.muted }}>
              📅 {submitted.observation_date} · 📍 {submitted.location}
            </div>
            <p style={{ fontFamily: fontSans, fontSize: "12px", color: colors.text, marginTop: "8px", marginBottom: 0 }}>{submitted.description}</p>
          </div>
          <button onClick={handleClear} style={{
            background: `linear-gradient(135deg, ${colors.sjDark}, ${colors.sj})`,
            color: "white", border: "none", padding: "13px 24px",
            borderRadius: "8px", fontFamily: fontSans, fontSize: "13px",
            fontWeight: "bold", cursor: "pointer", minHeight: "44px",
            width: isMobile ? "100%" : "auto",
          }}>
            Submit Another
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "560px", margin: "0 auto" }}>
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

        {/* Team → Staff */}
        <div style={{ marginBottom: "16px" }}>
          <label style={{ fontFamily: fontSans, fontSize: "13px", fontWeight: "bold", color: colors.text, display: "block", marginBottom: "8px" }}>
            Select Staff Observed <span style={{ color: colors.danger }}>*</span>
          </label>
          <select value={selectedTeamId} onChange={e => { setSelectedTeamId(e.target.value); setForm(f => ({ ...f, staffId: "" })); }}
            style={{ ...inputStyle, border: `1px solid ${colors.border}`, marginBottom: "8px" }}>
            {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </select>
          <select value={form.staffId} onChange={e => setForm(f => ({ ...f, staffId: e.target.value }))}
            style={{ ...inputStyle, border: `1px solid ${errors.staffId ? colors.danger : colors.border}` }}>
            <option value="">Select Staff Member</option>
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
                display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px",
                border: `1px solid ${form.criteria.includes(c) ? colors.sj : colors.border}`,
                borderRadius: "8px", cursor: "pointer",
                background: form.criteria.includes(c) ? "#EEF5FB" : "white",
                fontFamily: fontSans, fontSize: "13px", minHeight: "44px",
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
                display: "flex", alignItems: "center", gap: "12px", padding: "12px 14px",
                border: `2px solid ${form.assessment === a ? colors.sj : colors.border}`,
                borderRadius: "8px", cursor: "pointer",
                background: form.assessment === a ? "#EEF5FB" : "white",
                fontFamily: fontSans, fontSize: "14px", minHeight: "44px",
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
            style={{ ...inputStyle, resize: "vertical", minHeight: "100px", border: `1px solid ${errors.description ? colors.danger : colors.border}` }} />
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
            flex: isMobile ? "unset" : 1, background: "white",
            border: `1px solid ${colors.border}`, color: colors.muted,
            padding: "13px", borderRadius: "8px", fontFamily: fontSans,
            fontSize: "14px", cursor: "pointer", minHeight: "44px",
          }}>Clear Form</button>
          <button onClick={handleSubmit} disabled={loading} style={{
            flex: isMobile ? "unset" : 2,
            background: loading ? colors.border : `linear-gradient(135deg, ${colors.sjDark}, ${colors.sj})`,
            color: loading ? colors.muted : "white", border: "none",
            padding: "13px", borderRadius: "8px", fontFamily: fontSans,
            fontSize: "14px", fontWeight: "bold",
            cursor: loading ? "default" : "pointer", minHeight: "44px",
          }}>
            {loading ? "Submitting..." : "Submit Feedback"}
          </button>
        </div>
      </div>
    </div>
  );
};

// ── Observations Tab ────────────────────────────────────────
const EMPTY_FILTERS = { staffName: "", team: "all", assessment: "all", dateFrom: "", dateTo: "" };

const ObservationsTab = ({ teams }) => {
  const { isMobile }                    = useBreakpoint();
  const [observations, setObservations] = useState([]);
  const [loading, setLoading]           = useState(true);
  const [filters, setFilters]           = useState(EMPTY_FILTERS);
  const [selected, setSelected]         = useState(null);

  useEffect(() => {
    const fetch = async () => {
      const { data, error } = await supabase
        .from("observations")
        .select(`*, staff(name, team:teams(name)), supervisor:profiles(name)`)
        .order("submitted_at", { ascending: false });
      if (!error) setObservations(data || []);
      setLoading(false);
    };
    fetch();
  }, []);

  const filtered = observations.filter(o => {
    if (filters.team !== "all" && o.staff?.team?.name !== filters.team) return false;
    if (filters.assessment !== "all" && o.assessment !== filters.assessment) return false;
    if (filters.staffName && !o.staff?.name?.toLowerCase().includes(filters.staffName.toLowerCase())) return false;
    if (filters.dateFrom && o.observation_date < filters.dateFrom) return false;
    if (filters.dateTo   && o.observation_date > filters.dateTo)   return false;
    return true;
  });

  const recogCount  = observations.filter(o => o.assessment === "Worthy of Recognition").length;
  const growthCount = observations.filter(o => o.assessment === "Growth Opportunity").length;

  if (loading) return <Spinner />;

  return (
    <div>
      {/* Stats */}
      <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "repeat(3, 1fr)", gap: "10px", marginBottom: "16px" }}>
        {[
          { label: "Total Observations", value: observations.length, icon: "📋", color: colors.sj },
          { label: "Worthy of Recognition", value: recogCount, icon: "⭐", color: colors.recognition },
          { label: "Growth Opportunities", value: growthCount, icon: "📈", color: colors.growth },
        ].map(s => (
          <div key={s.label} style={{ background: "white", borderRadius: "12px", padding: "16px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", display: "flex", alignItems: "center", gap: isMobile ? "14px" : "0", flexDirection: isMobile ? "row" : "column", textAlign: isMobile ? "left" : "center" }}>
            <div style={{ fontSize: isMobile ? "28px" : "24px" }}>{s.icon}</div>
            <div>
              <div style={{ fontFamily: font, fontSize: isMobile ? "24px" : "28px", fontWeight: "bold", color: s.color, lineHeight: 1 }}>{s.value}</div>
              <div style={{ fontFamily: fontSans, fontSize: "11px", color: colors.muted, marginTop: "2px" }}>{s.label}</div>
            </div>
          </div>
        ))}
      </div>

      <FilterBar teams={teams} filters={filters} onChange={setFilters} resultCount={filtered.length} />

      {/* List */}
      <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
        {filtered.length === 0 ? (
          <div style={{ padding: "40px", textAlign: "center", fontFamily: fontSans, color: colors.muted }}>No observations found</div>
        ) : filtered.map((obs, i) => (
          <div key={obs.id} onClick={() => setSelected(selected?.id === obs.id ? null : obs)} style={{
            padding: isMobile ? "14px" : "14px 20px",
            borderBottom: i < filtered.length - 1 ? `1px solid ${colors.border}` : "none",
            cursor: "pointer", background: selected?.id === obs.id ? "#EEF5FB" : "white",
          }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
              <div style={{ flex: 1, minWidth: 0 }}>
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
                        {obs.criteria.map(c => (
                          <span key={c} style={{ background: "#EEF5FB", color: colors.sj, fontSize: "10px", padding: "2px 7px", borderRadius: "8px", fontFamily: fontSans }}>{c}</span>
                        ))}
                      </div>
                    )}
                    <p style={{ fontFamily: fontSans, fontSize: "13px", color: colors.text, margin: 0, lineHeight: 1.6 }}>{obs.description}</p>
                  </div>
                )}
              </div>
              <Badge type={obs.assessment} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// ── Main ManagerView ────────────────────────────────────────
const ManagerView = ({ profile, teams, staff }) => {
  const { isMobile }      = useBreakpoint();
  const [activeTab, setActiveTab] = useState("submit");

  const tabs = [
    { id: "submit",       label: isMobile ? "📝" : "📝 Submit" },
    { id: "observations", label: isMobile ? "📋" : "📋 Observations" },
  ];

  return (
    <div style={{ minHeight: "100vh", background: colors.light }}>
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: isMobile ? "16px 12px" : "24px 16px" }}>

        {/* Welcome banner */}
        <div style={{ background: `linear-gradient(135deg, ${colors.sjDark}, ${colors.sj})`, borderRadius: "12px", padding: "16px 20px", marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "space-between", flexWrap: "wrap", gap: "8px" }}>
          <div>
            <h2 style={{ color: "white", fontFamily: font, margin: 0, fontSize: isMobile ? "16px" : "18px" }}>Welcome, {profile.name}!</h2>
            <p style={{ color: "rgba(255,255,255,0.8)", fontFamily: fontSans, fontSize: "12px", margin: 0 }}>Manager</p>
          </div>
        </div>

        {/* Tab Bar */}
        <div style={{ display: "flex", gap: "4px", background: "white", borderRadius: "12px", padding: "4px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          {tabs.map(({ id, label }) => (
            <button key={id} onClick={() => setActiveTab(id)} style={{
              flex: 1, padding: isMobile ? "12px 8px" : "10px",
              border: "none", borderRadius: "8px",
              background: activeTab === id ? `linear-gradient(135deg, ${colors.sjDark}, ${colors.sj})` : "transparent",
              color: activeTab === id ? "white" : colors.muted,
              fontFamily: fontSans, fontSize: isMobile ? "18px" : "13px",
              fontWeight: "bold", cursor: "pointer", minHeight: "44px",
            }}>{label}</button>
          ))}
        </div>

        {activeTab === "submit" && <SubmitTab profile={profile} teams={teams} staff={staff} />}
        {activeTab === "observations" && <ObservationsTab teams={teams} />}

      </div>
    </div>
  );
};

export default ManagerView;