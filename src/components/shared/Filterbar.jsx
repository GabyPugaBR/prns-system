import { colors, fontSans } from "../../styles/theme";
import useBreakpoint from "../../hooks/useBreakpoint";

const FilterBar = ({ teams, filters, onChange, resultCount }) => {
  const { isMobile } = useBreakpoint();

  const inputStyle = {
    padding: "8px 12px", border: `1px solid ${colors.border}`,
    borderRadius: "8px", fontFamily: fontSans, fontSize: "13px",
    minHeight: "40px", flex: isMobile ? "1 1 45%" : "unset",
    boxSizing: "border-box",
  };

  return (
    <div style={{
      background: "white", borderRadius: "12px", padding: "14px 16px",
      marginBottom: "14px", boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    }}>
      <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", alignItems: "center" }}>
        <span style={{ fontFamily: fontSans, fontSize: "11px", color: colors.muted, fontWeight: "bold", flexShrink: 0 }}>
          FILTER:
        </span>

        {/* Staff name search */}
        <input
          type="text"
          placeholder="🔍 Search staff name..."
          value={filters.staffName}
          onChange={e => onChange({ ...filters, staffName: e.target.value })}
          style={{
            ...inputStyle,
            flex: isMobile ? "1 1 100%" : "1 1 160px",
            minWidth: isMobile ? "100%" : "160px",
          }}
        />

        {/* Team */}
        <select value={filters.team} onChange={e => onChange({ ...filters, team: e.target.value })} style={inputStyle}>
          <option value="all">All Teams</option>
          {teams.map(t => <option key={t.id} value={t.name}>{t.name}</option>)}
        </select>

        {/* Assessment */}
        <select value={filters.assessment} onChange={e => onChange({ ...filters, assessment: e.target.value })} style={inputStyle}>
          <option value="all">All Assessments</option>
          <option value="Worthy of Recognition">⭐ Recognition</option>
          <option value="Growth Opportunity">📈 Growth</option>
        </select>

        {/* Date from */}
        <input
          type="date"
          value={filters.dateFrom}
          onChange={e => onChange({ ...filters, dateFrom: e.target.value })}
          style={{ ...inputStyle, flex: isMobile ? "1 1 45%" : "unset" }}
          title="From date"
        />

        {/* Date to */}
        <input
          type="date"
          value={filters.dateTo}
          onChange={e => onChange({ ...filters, dateTo: e.target.value })}
          style={{ ...inputStyle, flex: isMobile ? "1 1 45%" : "unset" }}
          title="To date"
        />

        {/* Clear + count */}
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginLeft: "auto", flexWrap: "wrap" }}>
          {(filters.staffName || filters.team !== "all" || filters.assessment !== "all" || filters.dateFrom || filters.dateTo) && (
            <button onClick={() => onChange({ staffName: "", team: "all", assessment: "all", dateFrom: "", dateTo: "" })} style={{
              background: "none", border: `1px solid ${colors.border}`,
              color: colors.muted, padding: "6px 12px", borderRadius: "8px",
              fontFamily: fontSans, fontSize: "12px", cursor: "pointer",
              minHeight: "36px", whiteSpace: "nowrap",
            }}>
              ✕ Clear
            </button>
          )}
          <span style={{ fontFamily: fontSans, fontSize: "11px", color: colors.muted, whiteSpace: "nowrap" }}>
            {resultCount} record{resultCount !== 1 ? "s" : ""}
          </span>
        </div>
      </div>
    </div>
  );
};

export default FilterBar;