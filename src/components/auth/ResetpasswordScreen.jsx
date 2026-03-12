import { useState } from "react";
import { supabase } from "../../supabaseClient";
import { colors, font, fontSans } from "../../styles/theme";

const ResetpasswordScreen = ({ onComplete }) => {
  const [password, setPassword]   = useState("");
  const [confirm, setConfirm]     = useState("");
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState(null);
  const [success, setSuccess]     = useState(false);

  const handleReset = async () => {
    if (password.length < 8) { setError("Password must be at least 8 characters"); return; }
    if (password !== confirm) { setError("Passwords do not match"); return; }
    setLoading(true); setError(null);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setSuccess(true);
    setLoading(false);
  };

  return (
    <div style={{
      minHeight: "100vh",
      background: `linear-gradient(160deg, ${colors.sjDark} 0%, ${colors.sj} 40%, ${colors.teal} 100%)`,
      display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "24px",
    }}>
      <div style={{ textAlign: "center", marginBottom: "32px" }}>
        <div style={{ width: "72px", height: "72px", background: "white", borderRadius: "50%", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "32px", margin: "0 auto 16px" }}>🏛️</div>
        <h1 style={{ color: "white", fontFamily: font, fontSize: "22px", margin: "0 0 6px" }}>Community Services Division</h1>
        <p style={{ color: "rgba(255,255,255,0.7)", fontFamily: fontSans, fontSize: "13px", margin: 0 }}>Performance Observation System</p>
      </div>

      <div style={{ background: "white", borderRadius: "16px", padding: "32px", width: "100%", maxWidth: "400px", boxShadow: "0 20px 60px rgba(0,0,0,0.3)" }}>

        {success ? (
          <div style={{ textAlign: "center" }}>
            <div style={{ fontSize: "48px", marginBottom: "16px" }}>✅</div>
            <h2 style={{ fontFamily: font, color: colors.text, margin: "0 0 10px", fontSize: "18px" }}>Password Set Successfully</h2>
            <p style={{ fontFamily: fontSans, fontSize: "13px", color: colors.muted, marginBottom: "24px" }}>
              Your password has been updated. Please sign in with your new password.
            </p>
            <button
              onClick={() => supabase.auth.signOut()}
              style={{
                width: "100%",
                background: `linear-gradient(135deg, ${colors.sjDark}, ${colors.sj})`,
                color: "white", border: "none", padding: "13px",
                borderRadius: "8px", fontFamily: fontSans, fontSize: "13px",
                fontWeight: "bold", cursor: "pointer",
              }}
            >
              Return to Sign In
            </button>
          </div>
        ) : (
          <>
            <h2 style={{ fontFamily: font, color: colors.text, margin: "0 0 6px", fontSize: "18px" }}>Set New Password</h2>
            <p style={{ fontFamily: fontSans, fontSize: "12px", color: colors.muted, marginBottom: "24px" }}>
              Choose a strong password for your account.
            </p>

            {error && (
              <div style={{ background: "#FFEBEE", border: "1px solid #EF9A9A", borderRadius: "8px", padding: "10px 14px", marginBottom: "16px" }}>
                <p style={{ fontFamily: fontSans, fontSize: "12px", color: colors.danger, margin: 0 }}>⚠️ {error}</p>
              </div>
            )}

            <div style={{ marginBottom: "14px" }}>
              <label style={{ fontFamily: fontSans, fontSize: "12px", fontWeight: "bold", color: colors.text, display: "block", marginBottom: "6px" }}>New Password</label>
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
                onKeyDown={e => e.key === "Enter" && handleReset()}
                style={{ width: "100%", padding: "10px 12px", border: `1px solid ${colors.border}`, borderRadius: "8px", fontFamily: fontSans, fontSize: "13px", boxSizing: "border-box" }}
              />
            </div>

            <button onClick={handleReset} disabled={loading} style={{
              width: "100%",
              background: loading ? colors.border : `linear-gradient(135deg, ${colors.sjDark}, ${colors.sj})`,
              color: loading ? colors.muted : "white", border: "none", padding: "13px",
              borderRadius: "8px", fontFamily: fontSans, fontSize: "13px", fontWeight: "bold",
              cursor: loading ? "default" : "pointer",
            }}>
              {loading ? "Updating..." : "Update Password"}
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default ResetpasswordScreen;