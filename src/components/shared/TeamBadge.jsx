import { fontSans } from "../../styles/theme";

const TEAM_COLORS = {
  "Mitigating Impacts":   { bg: "#E8F5E9", color: "#2E7D32" },
  "Encampment Routes":    { bg: "#FFF3E0", color: "#E65100" },
  "Waterway Abatements":  { bg: "#E3F2FD", color: "#1565C0" },
  "On Land Abatements":   { bg: "#F3E5F5", color: "#6A1B9A" },
};

const TeamBadge = ({ team }) => {
  const c = TEAM_COLORS[team] || { bg: "#F5F5F5", color: "#333" };
  return (
    <span style={{
      background: c.bg, color: c.color,
      fontSize: "10px", fontWeight: "bold", padding: "2px 7px",
      borderRadius: "10px", fontFamily: fontSans,
    }}>
      {team}
    </span>
  );
};

export default TeamBadge;
