import { colors, font, fontSans } from "../../styles/theme";
import UseBreakpoint from "../../hooks/UseBreakpoint";

const SJHeader = ({ profile, onLogout }) => {
  const { isMobile } = UseBreakpoint();

  return (
    <div style={{
      background: `linear-gradient(135deg, ${colors.sjDark} 0%, ${colors.sj} 100%)`,
      boxShadow: "0 2px 12px rgba(0,0,0,0.2)",
    }}>
      <div style={{
        background: colors.sjDark,
        padding: isMobile ? "10px 16px" : "8px 24px",
        display: "flex",
        alignItems: isMobile ? "flex-start" : "center",
        justifyContent: "space-between",
        flexDirection: isMobile ? "column" : "row",
        gap: isMobile ? "10px" : "0",
      }}>
        {/* Brand */}
        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
          <div style={{
            width: isMobile ? "36px" : "44px",
            height: isMobile ? "36px" : "44px",
            borderRadius: "50%",
            background: "white", display: "flex", alignItems: "center",
            justifyContent: "center",
            fontSize: isMobile ? "16px" : "20px",
            flexShrink: 0,
          }}>🏛️</div>
          <div>
            <div style={{ color: "white", fontFamily: font, fontSize: isMobile ? "11px" : "13px", fontWeight: "bold", lineHeight: 1.2 }}>
              COMMUNITY SERVICES DIVISION
            </div>
            <div style={{ color: "rgba(255,255,255,0.75)", fontFamily: fontSans, fontSize: "10px", letterSpacing: "1px" }}>
              PERFORMANCE OBSERVATION SYSTEM
            </div>
          </div>
        </div>

        {/* User + logout */}
        {profile && (
          <div style={{
            display: "flex", alignItems: "center", gap: "10px",
            width: isMobile ? "100%" : "auto",
            justifyContent: isMobile ? "space-between" : "flex-end",
            borderTop: isMobile ? "1px solid rgba(255,255,255,0.15)" : "none",
            paddingTop: isMobile ? "8px" : "0",
          }}>
            <div>
              <div style={{ color: "white", fontFamily: fontSans, fontSize: "12px", fontWeight: "bold" }}>
                {profile.name}
              </div>
              <div style={{ color: "rgba(255,255,255,0.65)", fontFamily: fontSans, fontSize: "10px", textTransform: "uppercase", letterSpacing: "1px" }}>
                {profile.role}
              </div>
            </div>
            <button onClick={onLogout} style={{
              background: "rgba(255,255,255,0.15)",
              border: "1px solid rgba(255,255,255,0.3)",
              color: "white", padding: "8px 14px", borderRadius: "6px",
              cursor: "pointer", fontFamily: fontSans, fontSize: "12px",
              minHeight: "36px", whiteSpace: "nowrap",
            }}>Sign Out</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SJHeader;