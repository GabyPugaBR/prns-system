import { colors, fontSans } from "../../styles/theme";

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

export default Badge;
