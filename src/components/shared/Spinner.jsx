import { colors, fontSans } from "../../styles/theme";

const Spinner = () => (
  <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "100vh", background: colors.light }}>
    <div style={{ textAlign: "center" }}>
      <div style={{ fontSize: "32px", marginBottom: "12px" }}>⏳</div>
      <p style={{ fontFamily: fontSans, color: colors.muted, fontSize: "14px" }}>Loading...</p>
    </div>
  </div>
);

export default Spinner;
