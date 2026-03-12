import { useState, useEffect } from "react";
import { supabase } from "../supabaseClient";
import { colors, font, fontSans } from "../styles/theme";
import Badge from "../components/shared/Badge";
import FilterBar from "../components/shared/Filterbar";
import TeamBadge from "../components/shared/TeamBadge";
import Spinner from "../components/shared/Spinner";
import useBreakpoint from "../hooks/useBreakpoint";

// ── Small reusable section card ─────────────────────────────
const Section = ({ title, children }) => (
  <div style={{ background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", marginBottom: "16px" }}>
    <h4 style={{ fontFamily: font, color: colors.text, margin: "0 0 16px", fontSize: "14px", borderBottom: `2px solid ${colors.teal}`, paddingBottom: "8px" }}>{title}</h4>
    {children}
  </div>
);

const inputStyle = (err) => ({
  width: "100%", padding: "11px 12px", border: `1px solid ${err ? colors.danger : colors.border}`,
  borderRadius: "8px", fontFamily: fontSans, fontSize: "16px",
  boxSizing: "border-box", minHeight: "44px", marginBottom: "10px",
});

const PrimaryBtn = ({ onClick, disabled, children, fullWidth }) => (
  <button onClick={onClick} disabled={disabled} style={{
    width: fullWidth ? "100%" : "auto",
    background: disabled ? colors.border : `linear-gradient(135deg, ${colors.sjDark}, ${colors.sj})`,
    color: disabled ? colors.muted : "white", border: "none",
    padding: "11px 20px", borderRadius: "8px",
    fontFamily: fontSans, fontSize: "13px", fontWeight: "bold",
    cursor: disabled ? "default" : "pointer", minHeight: "44px",
  }}>{children}</button>
);

const Toast = ({ msg, ok }) => (
  <div style={{
    background: ok ? colors.recognitionBg : "#FFEBEE",
    border: `1px solid ${ok ? "#A5D6A7" : "#EF9A9A"}`,
    borderRadius: "8px", padding: "10px 14px", marginTop: "10px",
  }}>
    <p style={{ fontFamily: fontSans, fontSize: "12px", color: ok ? colors.recognition : colors.danger, margin: 0 }}>
      {ok ? "✅ " : "⚠️ "}{msg}
    </p>
  </div>
);

// ── Role Management Tab ─────────────────────────────────────
const RoleManagementTab = ({ teams, staffList, setStaffList }) => {
  const { isMobile } = useBreakpoint();

  // Profiles state
  const [profiles, setProfiles] = useState([]);
  const [profilesLoading, setProfilesLoading] = useState(true);

  // Add staff
  const [newStaff, setNewStaff]         = useState({ name: "", teamId: teams[0]?.id || "" });
  const [staffMsg, setStaffMsg]         = useState(null);
  const [staffLoading, setStaffLoading] = useState(false);

  // Move staff
  const [moveStaff, setMoveStaff]       = useState({ staffId: "", teamId: teams[0]?.id || "" });
  const [moveMsg, setMoveMsg]           = useState(null);
  const [moveLoading, setMoveLoading]   = useState(false);

  // Edit supervisor team
  const [supEdit, setSupEdit]           = useState({ userId: "", teamId: teams[0]?.id || "" });
  const [supMsg, setSupMsg]             = useState(null);
  const [supLoading, setSupLoading]     = useState(false);

  // Manager team access
  const [selManager, setSelManager]     = useState("");
  const [managerTeams, setManagerTeams] = useState([]);
  const [managerMsg, setManagerMsg]     = useState(null);
  const [managerLoading, setManagerLoading] = useState(false);

  // Change role
  const [roleEdit, setRoleEdit]         = useState({ userId: "", newRole: "supervisor" });
  const [roleMsg, setRoleMsg]           = useState(null);
  const [roleLoading, setRoleLoading]   = useState(false);

  useEffect(() => {
    const fetchProfiles = async () => {
      const { data } = await supabase
        .from("profiles")
        .select("*")
        .order("name");
      setProfiles(data || []);
      setProfilesLoading(false);
    };
    fetchProfiles();
  }, []);

  // When a manager is selected, load their current team access
  useEffect(() => {
    if (!selManager) { setManagerTeams([]); return; }
    const fetchAccess = async () => {
      const { data } = await supabase
        .from("manager_team_access")
        .select("team_id")
        .eq("manager_id", selManager);
      setManagerTeams((data || []).map(r => r.team_id));
    };
    fetchAccess();
  }, [selManager]);

  const flash = (setter, msg, ok) => {
    setter({ msg, ok });
    setTimeout(() => setter(null), 3500);
  };

  // ── Add staff ─────────────────────────────────────────────
  const handleAddStaff = async () => {
    if (!newStaff.name.trim()) { flash(setStaffMsg, "Please enter a name", false); return; }
    setStaffLoading(true);
    const { data, error } = await supabase
      .from("staff")
      .insert({ name: newStaff.name.trim(), team_id: newStaff.teamId })
      .select()
      .single();
    if (error) { flash(setStaffMsg, error.message, false); }
    else {
      setStaffList(prev => [...prev, data].sort((a, b) => a.name.localeCompare(b.name)));
      setNewStaff({ name: "", teamId: teams[0]?.id || "" });
      flash(setStaffMsg, `${data.name} added successfully`, true);
    }
    setStaffLoading(false);
  };

  // ── Move staff ────────────────────────────────────────────
  const handleMoveStaff = async () => {
    if (!moveStaff.staffId) { flash(setMoveMsg, "Please select a staff member", false); return; }
    setMoveLoading(true);
    const { error } = await supabase
      .from("staff")
      .update({ team_id: moveStaff.teamId })
      .eq("id", moveStaff.staffId);
    if (error) { flash(setMoveMsg, error.message, false); }
    else {
      setStaffList(prev => prev.map(s => s.id === moveStaff.staffId ? { ...s, team_id: moveStaff.teamId } : s));
      const staffName = staffList.find(s => s.id === moveStaff.staffId)?.name;
      const teamName  = teams.find(t => t.id === moveStaff.teamId)?.name;
      flash(setMoveMsg, `${staffName} moved to ${teamName}`, true);
      setMoveStaff({ staffId: "", teamId: teams[0]?.id || "" });
    }
    setMoveLoading(false);
  };

  // ── Edit supervisor team ──────────────────────────────────
  const handleSupTeam = async () => {
    if (!supEdit.userId) { flash(setSupMsg, "Please select a supervisor", false); return; }
    setSupLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ team_id: supEdit.teamId })
      .eq("id", supEdit.userId);
    if (error) { flash(setSupMsg, error.message, false); }
    else {
      setProfiles(prev => prev.map(p => p.id === supEdit.userId ? { ...p, team_id: supEdit.teamId } : p));
      const name     = profiles.find(p => p.id === supEdit.userId)?.name;
      const teamName = teams.find(t => t.id === supEdit.teamId)?.name;
      flash(setSupMsg, `${name} assigned to ${teamName}`, true);
      setSupEdit({ userId: "", teamId: teams[0]?.id || "" });
    }
    setSupLoading(false);
  };

  // ── Manager team access ───────────────────────────────────
  const toggleManagerTeam = (teamId) => {
    setManagerTeams(prev =>
      prev.includes(teamId) ? prev.filter(id => id !== teamId) : [...prev, teamId]
    );
  };

  const handleSaveManagerTeams = async () => {
    if (!selManager) { flash(setManagerMsg, "Please select a manager", false); return; }
    setManagerLoading(true);

    // Delete existing then re-insert selected
    const { error: delError } = await supabase
      .from("manager_team_access")
      .delete()
      .eq("manager_id", selManager);

    if (delError) { flash(setManagerMsg, delError.message, false); setManagerLoading(false); return; }

    if (managerTeams.length > 0) {
      const rows = managerTeams.map(team_id => ({ manager_id: selManager, team_id }));
      const { error: insError } = await supabase.from("manager_team_access").insert(rows);
      if (insError) { flash(setManagerMsg, insError.message, false); setManagerLoading(false); return; }
    }

    const name = profiles.find(p => p.id === selManager)?.name;
    flash(setManagerMsg, `Team access updated for ${name}`, true);
    setManagerLoading(false);
  };

  // ── Change role ───────────────────────────────────────────
  const handleRoleChange = async () => {
    if (!roleEdit.userId) { flash(setRoleMsg, "Please select a user", false); return; }
    setRoleLoading(true);
    const { error } = await supabase
      .from("profiles")
      .update({ role: roleEdit.newRole })
      .eq("id", roleEdit.userId);
    if (error) { flash(setRoleMsg, error.message, false); }
    else {
      setProfiles(prev => prev.map(p => p.id === roleEdit.userId ? { ...p, role: roleEdit.newRole } : p));
      const name = profiles.find(p => p.id === roleEdit.userId)?.name;
      flash(setRoleMsg, `${name} is now a ${roleEdit.newRole}`, true);
      setRoleEdit({ userId: "", newRole: "supervisor" });
    }
    setRoleLoading(false);
  };

  if (profilesLoading) return <Spinner />;

  const supervisors = profiles.filter(p => p.role === "supervisor");
  const managers    = profiles.filter(p => p.role === "manager");

  return (
    <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr" : "1fr 1fr", gap: "16px" }}>

      {/* ── Add New Staff ── */}
      <Section title="➕ Add New Staff Member">
        <input
          type="text" placeholder="Full name" value={newStaff.name}
          onChange={e => setNewStaff(f => ({ ...f, name: e.target.value }))}
          style={inputStyle(false)}
        />
        <select value={newStaff.teamId} onChange={e => setNewStaff(f => ({ ...f, teamId: e.target.value }))} style={inputStyle(false)}>
          {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <PrimaryBtn onClick={handleAddStaff} disabled={staffLoading} fullWidth>
          {staffLoading ? "Adding..." : "Add Staff Member"}
        </PrimaryBtn>
        {staffMsg && <Toast msg={staffMsg.msg} ok={staffMsg.ok} />}
      </Section>

      {/* ── Move Staff to Team ── */}
      <Section title="🔀 Move Staff to Different Team">
        <select value={moveStaff.staffId} onChange={e => setMoveStaff(f => ({ ...f, staffId: e.target.value }))} style={inputStyle(false)}>
          <option value="">Select staff member</option>
          {staffList.map(s => {
            const team = teams.find(t => t.id === s.team_id);
            return <option key={s.id} value={s.id}>{s.name} — {team?.name || "No team"}</option>;
          })}
        </select>
        <select value={moveStaff.teamId} onChange={e => setMoveStaff(f => ({ ...f, teamId: e.target.value }))} style={inputStyle(false)}>
          {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <PrimaryBtn onClick={handleMoveStaff} disabled={moveLoading} fullWidth>
          {moveLoading ? "Moving..." : "Move Staff Member"}
        </PrimaryBtn>
        {moveMsg && <Toast msg={moveMsg.msg} ok={moveMsg.ok} />}
      </Section>

      {/* ── Supervisor Team Assignment ── */}
      <Section title="👤 Edit Supervisor's Team">
        <select value={supEdit.userId} onChange={e => setSupEdit(f => ({ ...f, userId: e.target.value }))} style={inputStyle(false)}>
          <option value="">Select supervisor</option>
          {supervisors.map(p => {
            const team = teams.find(t => t.id === p.team_id);
            return <option key={p.id} value={p.id}>{p.name} — {team?.name || "No team"}</option>;
          })}
        </select>
        <select value={supEdit.teamId} onChange={e => setSupEdit(f => ({ ...f, teamId: e.target.value }))} style={inputStyle(false)}>
          {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
        </select>
        <PrimaryBtn onClick={handleSupTeam} disabled={supLoading} fullWidth>
          {supLoading ? "Saving..." : "Update Team"}
        </PrimaryBtn>
        {supMsg && <Toast msg={supMsg.msg} ok={supMsg.ok} />}
      </Section>

      {/* ── Manager Team Access ── */}
      <Section title="🗂 Assign Manager's Team Access">
        <select value={selManager} onChange={e => setSelManager(e.target.value)} style={inputStyle(false)}>
          <option value="">Select manager</option>
          {managers.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
        {selManager && (
          <div style={{ marginBottom: "10px" }}>
            <p style={{ fontFamily: fontSans, fontSize: "12px", color: colors.muted, margin: "0 0 8px" }}>Select all teams this manager can view:</p>
            <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
              {teams.map(t => (
                <label key={t.id} style={{
                  display: "flex", alignItems: "center", gap: "10px",
                  padding: "10px 12px", borderRadius: "8px", cursor: "pointer",
                  border: `1px solid ${managerTeams.includes(t.id) ? colors.sj : colors.border}`,
                  background: managerTeams.includes(t.id) ? "#EEF5FB" : "white",
                  fontFamily: fontSans, fontSize: "13px", minHeight: "44px",
                }}>
                  <input type="checkbox" checked={managerTeams.includes(t.id)}
                    onChange={() => toggleManagerTeam(t.id)}
                    style={{ accentColor: colors.sj, width: "18px", height: "18px" }} />
                  {t.name}
                </label>
              ))}
            </div>
          </div>
        )}
        <PrimaryBtn onClick={handleSaveManagerTeams} disabled={managerLoading || !selManager} fullWidth>
          {managerLoading ? "Saving..." : "Save Team Access"}
        </PrimaryBtn>
        {managerMsg && <Toast msg={managerMsg.msg} ok={managerMsg.ok} />}
      </Section>

      {/* ── Change Role ── */}
      <Section title="🔁 Change User Role">
        <select value={roleEdit.userId} onChange={e => setRoleEdit(f => ({ ...f, userId: e.target.value }))} style={inputStyle(false)}>
          <option value="">Select user</option>
          {profiles.map(p => (
            <option key={p.id} value={p.id}>{p.name} (currently: {p.role})</option>
          ))}
        </select>
        <select value={roleEdit.newRole} onChange={e => setRoleEdit(f => ({ ...f, newRole: e.target.value }))} style={inputStyle(false)}>
          <option value="supervisor">Supervisor</option>
          <option value="manager">Manager</option>
          <option value="admin">Admin</option>
        </select>
        <PrimaryBtn onClick={handleRoleChange} disabled={roleLoading} fullWidth>
          {roleLoading ? "Updating..." : "Change Role"}
        </PrimaryBtn>
        {roleMsg && <Toast msg={roleMsg.msg} ok={roleMsg.ok} />}
      </Section>

    </div>
  );
};

// ── Main AdminView ──────────────────────────────────────────
const AdminView = ({ teams, staff: initialStaff }) => {
  const { isMobile }                        = useBreakpoint();
  const [activeTab, setActiveTab]           = useState("overview");
  const [observations, setObservations]     = useState([]);
  const [loading, setLoading]               = useState(true);
  const [staffList, setStaffList]           = useState(initialStaff || []);
  const [obsFilters, setObsFilters]         = useState({ staffName: "", team: "all", assessment: "all", dateFrom: "", dateTo: "" });
  const [inviteForm, setInviteForm]         = useState({ email: "", role: "supervisor", teamId: teams[0]?.id || "" });
  const [inviteSent, setInviteSent]         = useState(false);
  const [inviteLoading, setInviteLoading]   = useState(false);
  const [inviteError, setInviteError]       = useState(null);

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
    setInviteError(null);
    const { data: { session } } = await supabase.auth.getSession();
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/invite-user`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${session.access_token}`,
          "apikey": import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
        body: JSON.stringify({ email: inviteForm.email, role: inviteForm.role, team_id: inviteForm.teamId }),
      }
    );
    const result = await response.json();
    if (result.error) {
      setInviteError("Failed to send invitation. Please try again.");
    } else {
      setInviteSent(true);
      setTimeout(() => {
        setInviteSent(false);
        setInviteForm({ email: "", role: "supervisor", teamId: teams[0]?.id || "" });
      }, 3000);
    }
    setInviteLoading(false);
  };

  const teamStats = teams.map(t => ({
    team: t.name,
    count: observations.filter(o => o.staff?.team?.name === t.name).length,
    recognition: observations.filter(o => o.staff?.team?.name === t.name && o.assessment === "Worthy of Recognition").length,
    growth: observations.filter(o => o.staff?.team?.name === t.name && o.assessment === "Growth Opportunity").length,
  }));

  const tabs = [
    { id: "overview",     label: isMobile ? "📊" : "📊 Overview" },
    { id: "observations", label: isMobile ? "📋" : "📋 Observations" },
    { id: "invite",       label: isMobile ? "✉️" : "✉️ Invite" },
    { id: "manage",       label: isMobile ? "👥" : "👥 Manage" },
  ];

  const formInputStyle = {
    width: "100%", padding: "11px 12px", border: `1px solid ${colors.border}`,
    borderRadius: "8px", fontFamily: fontSans, fontSize: "16px",
    boxSizing: "border-box", minHeight: "44px",
  };

  if (loading) return <Spinner />;

  return (
    <div style={{ minHeight: "100vh", background: colors.light }}>
      <div style={{ maxWidth: "960px", margin: "0 auto", padding: isMobile ? "16px 12px" : "24px 16px" }}>

        {/* Tab Bar */}
        <div style={{ display: "flex", gap: "4px", background: "white", borderRadius: "12px", padding: "4px", marginBottom: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
          {tabs.map(({ id, label }) => (
            <button key={id} onClick={() => setActiveTab(id)} style={{
              flex: 1, padding: isMobile ? "12px 6px" : "10px",
              border: "none", borderRadius: "8px",
              background: activeTab === id ? `linear-gradient(135deg, ${colors.sjDark}, ${colors.sj})` : "transparent",
              color: activeTab === id ? "white" : colors.muted,
              fontFamily: fontSans, fontSize: isMobile ? "16px" : "12px",
              fontWeight: "bold", cursor: "pointer", minHeight: "44px",
            }}>{label}</button>
          ))}
        </div>

        {/* Overview */}
        {activeTab === "overview" && (
          <div>
            <div style={{ display: "grid", gridTemplateColumns: isMobile ? "1fr 1fr" : "repeat(4, 1fr)", gap: "10px", marginBottom: "16px" }}>
              {[
                { label: "Total", value: observations.length, icon: "📋", color: colors.sj },
                { label: "Recognition", value: observations.filter(o => o.assessment === "Worthy of Recognition").length, icon: "⭐", color: colors.recognition },
                { label: "Growth", value: observations.filter(o => o.assessment === "Growth Opportunity").length, icon: "📈", color: colors.growth },
                { label: "Teams", value: teams.length, icon: "👥", color: colors.teal },
              ].map(s => (
                <div key={s.label} style={{ background: "white", borderRadius: "12px", padding: "16px 12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", textAlign: "center" }}>
                  <div style={{ fontSize: "22px", marginBottom: "4px" }}>{s.icon}</div>
                  <div style={{ fontFamily: font, fontSize: "26px", fontWeight: "bold", color: s.color }}>{s.value}</div>
                  <div style={{ fontFamily: fontSans, fontSize: "10px", color: colors.muted }}>{s.label}</div>
                </div>
              ))}
            </div>
            <div style={{ background: "white", borderRadius: "12px", padding: "20px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)" }}>
              <h3 style={{ fontFamily: font, color: colors.text, margin: "0 0 16px", fontSize: "15px" }}>Submissions by Team</h3>
              {teamStats.map(t => (
                <div key={t.team} style={{ marginBottom: "14px" }}>
                  <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "6px", flexWrap: "wrap", gap: "4px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                      <TeamBadge team={t.team} />
                      <span style={{ fontFamily: fontSans, fontSize: "11px", color: colors.muted }}>⭐{t.recognition} · 📈{t.growth}</span>
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

        {/* All Observations */}
        {activeTab === "observations" && (() => {
          const filtered = observations.filter(o => {
            if (obsFilters.team !== "all" && o.staff?.team?.name !== obsFilters.team) return false;
            if (obsFilters.assessment !== "all" && o.assessment !== obsFilters.assessment) return false;
            if (obsFilters.staffName && !o.staff?.name?.toLowerCase().includes(obsFilters.staffName.toLowerCase())) return false;
            if (obsFilters.dateFrom && o.observation_date < obsFilters.dateFrom) return false;
            if (obsFilters.dateTo   && o.observation_date > obsFilters.dateTo)   return false;
            return true;
          });
          return (
            <div>
              <FilterBar teams={teams} filters={obsFilters} onChange={setObsFilters} resultCount={filtered.length} />
              <div style={{ background: "white", borderRadius: "12px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", overflow: "hidden" }}>
                {filtered.length === 0 ? (
                  <div style={{ padding: "40px", textAlign: "center", fontFamily: fontSans, color: colors.muted }}>No observations found</div>
                ) : filtered.map((obs, i) => (
                  <div key={obs.id} style={{ padding: isMobile ? "12px 14px" : "14px 20px", borderBottom: i < filtered.length - 1 ? `1px solid ${colors.border}` : "none" }}>
                    <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", gap: "10px" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
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
            </div>
          );
        })()}

        {/* Invite */}
        {activeTab === "invite" && (
          <div style={{ background: "white", borderRadius: "12px", padding: isMobile ? "20px 16px" : "28px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)", maxWidth: "480px" }}>
            <h3 style={{ fontFamily: font, color: colors.text, margin: "0 0 6px" }}>Send Invitation</h3>
            <p style={{ fontFamily: fontSans, fontSize: "13px", color: colors.muted, marginBottom: "24px" }}>
              The recipient will receive a secure link to set up their account.
            </p>
            {inviteSent ? (
              <div style={{ background: colors.recognitionBg, border: `1px solid #A5D6A7`, borderRadius: "10px", padding: "20px", textAlign: "center" }}>
                <div style={{ fontSize: "32px", marginBottom: "8px" }}>✉️</div>
                <p style={{ fontFamily: fontSans, fontSize: "13px", color: colors.recognition, fontWeight: "bold", margin: 0 }}>Invitation sent!</p>
              </div>
            ) : (
              <>
                <div style={{ marginBottom: "14px" }}>
                  <label style={{ fontFamily: fontSans, fontSize: "13px", fontWeight: "bold", color: colors.text, display: "block", marginBottom: "6px" }}>Email</label>
                  <input type="email" placeholder="name@sanjoseca.gov" value={inviteForm.email}
                    onChange={e => setInviteForm(f => ({ ...f, email: e.target.value }))}
                    style={formInputStyle} />
                </div>
                <div style={{ marginBottom: "14px" }}>
                  <label style={{ fontFamily: fontSans, fontSize: "13px", fontWeight: "bold", color: colors.text, display: "block", marginBottom: "6px" }}>Role</label>
                  <select value={inviteForm.role} onChange={e => setInviteForm(f => ({ ...f, role: e.target.value }))} style={formInputStyle}>
                    <option value="supervisor">Supervisor (submit only)</option>
                    <option value="manager">Manager (read only)</option>
                  </select>
                </div>
                <div style={{ marginBottom: "24px" }}>
                  <label style={{ fontFamily: fontSans, fontSize: "13px", fontWeight: "bold", color: colors.text, display: "block", marginBottom: "6px" }}>Assign Team</label>
                  <select value={inviteForm.teamId} onChange={e => setInviteForm(f => ({ ...f, teamId: e.target.value }))} style={formInputStyle}>
                    {teams.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
                  </select>
                </div>
                <button onClick={handleInvite} disabled={inviteLoading} style={{
                  width: "100%",
                  background: inviteLoading ? colors.border : `linear-gradient(135deg, ${colors.sjDark}, ${colors.sj})`,
                  color: inviteLoading ? colors.muted : "white", border: "none",
                  padding: "14px", borderRadius: "8px",
                  fontFamily: fontSans, fontSize: "14px", fontWeight: "bold",
                  cursor: inviteLoading ? "default" : "pointer", minHeight: "44px",
                }}>
                  {inviteLoading ? "Sending..." : "Send Invitation ✉️"}
                </button>
                {inviteError && <Toast msg={inviteError} ok={false} />}
              </>
            )}
          </div>
        )}

        {/* Role Management */}
        {activeTab === "manage" && (
          <RoleManagementTab teams={teams} staffList={staffList} setStaffList={setStaffList} />
        )}

      </div>
    </div>
  );
};

export default AdminView;