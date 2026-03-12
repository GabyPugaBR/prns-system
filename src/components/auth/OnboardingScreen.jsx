import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { colors, font, fontSans } from "../../styles/theme";

const OnboardingScreen = ({ user, onComplete }) => {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [fullName, setFullName] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState(null);

  const handleSetup = async () => {
    if (!fullName.trim()) { setError("Please enter your full name"); return; }
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (password !== confirm) { setError("Passwords do not match"); return; }
    setLoading(true); setError(null);

    const { error: nameError } = await supabase
      .from("profiles")
      .update({ name: fullName })
      .eq("id", user.id);

    if (nameError) { setError(nameError.message); setLoading(false); return; }

    const { error: pwError } = await supabase.auth.updateUser({ password });
    if (pwError) { setError(pwError.message); setLoading(false); return; }

    onComplete();
  };

  const assignedRole = user.user_metadata?.role || "supervisor";

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(160deg, ${colors.sjDark} 0%, ${colors.sj} 40%, ${colors.teal} 100%)`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px",
    }}>
      <div style={{ textAlign: "center", marginBottom: "28px" }}>
        <div style={{ width: "64px", height: "64px", background: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "28px", margin: "0 auto 14px" }}>🏛️</div>
        <h1 style={{ color: "white", fontFamily: font, fontSize: "20px", margin: "0 0 6px" }}>Welcome to the PRNS System</h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontFamily: fontSans, fontSize: "13px", margin: 0 }}>
          You've been invited as a <strong style={{ color: "white", textTransform: "capitalize" }}>{assignedRole}</strong>. Let's finish setting up your account.
        </p>
      </div>

      <div style={{ background: "white", borderRadius: "16px", padding: "32px", width: "100%", maxWidth: "400px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>
        {error && (
          <div style={{ background: "#FFEBEE", border: "1px solid #EF9A9A", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px" }}>
            <p style={{ fontFamily: fontSans, fontSize: "12px", color: colors.danger, margin: 0 }}>⚠️ {error}</p>
          </div>
        )}

        <div style={{ marginBottom: "14px" }}>
          <label style={{ fontFamily: fontSans, fontSize: "12px", fontWeight: "bold", color: colors.text, display: "block", marginBottom: "6px" }}>Full Name</label>
          <input
            type="text" placeholder="First Last" value={fullName}
            onChange={e => setFullName(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", border: `1px solid ${colors.border}`, borderRadius: "8px", fontFamily: fontSans, fontSize: "13px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "14px" }}>
          <label style={{ fontFamily: fontSans, fontSize: "12px", fontWeight: "bold", color: colors.text, display: "block", marginBottom: "6px" }}>Create Password</label>
          <input
            type="password" placeholder="At least 8 characters" value={password}
            onChange={e => setPassword(e.target.value)}
            style={{ width: "100%", padding: "10px 12px", border: `1px solid ${colors.border}`, borderRadius: "8px", fontFamily: fontSans, fontSize: "13px", boxSizing: "border-box" }}
          />
        </div>

        <div style={{ marginBottom: "24px" }}>
          <label style={{ fontFamily: fontSans, fontSize: "12px", fontWeight: "bold", color: colors.text, display: "block", marginBottom: "6px" }}>Confirm Password</label>
          <input
            type="password" placeholder="••••••••" value={confirm}
            onChange={e => setConfirm(e.target.value)}
            onKeyDown={e => e.key === "Enter" && handleSetup()}
            style={{ width: "100%", padding: "10px 12px", border: `1px solid ${colors.border}`, borderRadius: "8px", fontFamily: fontSans, fontSize: "13px", boxSizing: "border-box" }}
          />
        </div>

        <button onClick={handleSetup} disabled={loading} style={{
          width: "100%",
          background: loading ? colors.border : `linear-gradient(135deg, ${colors.sjDark}, ${colors.sj})`,
          color: loading ? colors.muted : "white", border: "none", padding: "13px",
          borderRadius: "8px", fontFamily: fontSans, fontSize: "13px", fontWeight: "bold",
          cursor: loading ? "default" : "pointer",
        }}>
          {loading ? "Setting up..." : "Complete Setup →"}
        </button>
      </div>
    </div>
  );
};

export default OnboardingScreen;
