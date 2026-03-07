import { useState, useEffect, useCallback } from "react";

// ─────────────────────────────────────────────────────────────
//  ⚠️  REPLACE THIS WITH YOUR ACTUAL API GATEWAY URL
const API_BASE = "https://76pd12y747.execute-api.ap-south-1.amazonaws.com";
// ─────────────────────────────────────────────────────────────

const TODAY = new Date().toISOString().split("T")[0]; // "2026-03-07"

const STATUS_STYLE = {
  pending:     { bg: "#FEF3C7", text: "#92400E", dot: "#F59E0B", label: "Pending" },
  in_progress: { bg: "#DBEAFE", text: "#1E40AF", dot: "#3B82F6", label: "In Progress" },
  resolved:    { bg: "#D1FAE5", text: "#065F46", dot: "#10B981", label: "Resolved" },
};

const CATEGORY_ICON = {
  "Road Issue":   "🛣️",
  "Water Supply": "💧",
  "Electricity":  "⚡",
  "Garbage":      "🗑️",
  "Drainage":     "🚰",
  "Sanitation":   "🧹",
  "Health":       "🏥",
};

// ── Reusable Components ───────────────────────────────────────

function StatusBadge({ status }) {
  const s = STATUS_STYLE[status] || STATUS_STYLE.pending;
  return (
    <span style={{
      display: "inline-flex", alignItems: "center", gap: 5,
      background: s.bg, color: s.text,
      padding: "3px 10px", borderRadius: 20,
      fontSize: 11, fontWeight: 700, letterSpacing: 0.5,
    }}>
      <span style={{ width: 6, height: 6, borderRadius: "50%", background: s.dot }} />
      {s.label.toUpperCase()}
    </span>
  );
}

function StatCard({ icon, label, value, color }) {
  return (
    <div style={{
      flex: 1, minWidth: 130,
      background: "#fff",
      border: `1.5px solid ${color}25`,
      borderRadius: 14, padding: "16px 20px",
      display: "flex", alignItems: "center", gap: 12,
      boxShadow: `0 2px 10px ${color}12`,
    }}>
      <div style={{
        width: 42, height: 42, borderRadius: 11,
        background: `${color}15`,
        display: "flex", alignItems: "center", justifyContent: "center",
        fontSize: 18,
      }}>{icon}</div>
      <div>
        <div style={{ fontSize: 24, fontWeight: 800, color: "#0F172A", lineHeight: 1 }}>{value}</div>
        <div style={{ fontSize: 10, fontWeight: 700, color: "#94A3B8", letterSpacing: 0.8, marginTop: 2 }}>{label}</div>
      </div>
    </div>
  );
}

function TabBar({ options, value, onChange, activeColor = "#0F172A" }) {
  return (
    <div style={{
      display: "flex", gap: 4, flexWrap: "wrap",
      background: "#F1F5F9", borderRadius: 12, padding: 4,
    }}>
      {options.map(opt => (
        <button key={opt.value} onClick={() => onChange(opt.value)} style={{
          padding: "8px 16px", borderRadius: 9, border: "none",
          cursor: "pointer", fontSize: 13, fontWeight: 600,
          whiteSpace: "nowrap", transition: "all 0.15s",
          background: value === opt.value ? activeColor : "transparent",
          color:      value === opt.value ? "#fff"        : "#64748B",
          boxShadow:  value === opt.value ? "0 2px 6px rgba(0,0,0,0.15)" : "none",
        }}>
          {opt.label}
        </button>
      ))}
    </div>
  );
}

// ── Main Component ────────────────────────────────────────────
export default function IncidentsFilterView() {
  const [incidents, setIncidents]         = useState([]);
  const [stats, setStats]                 = useState({ total: 0, pending: 0, in_progress: 0, resolved: 0 });
  const [filterOptions, setFilterOptions] = useState({ categories: [], departments: [] });
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState(null);
  const [expandedRow, setExpandedRow]     = useState(null);

  const [filters, setFilters] = useState({
    status:     "all",
    category:   "all",
    department: "all",
    dateFrom:   "",
    dateTo:     "",
    sortBy:     "recent",
    limit:      "50",
  });

  // ── Fetch from API ──────────────────────────────────────────
  const fetchIncidents = useCallback(async (f) => {
    setLoading(true);
    setError(null);
    try {
      const qs = new URLSearchParams(
        Object.fromEntries(Object.entries(f).filter(([, v]) => v !== "all" && v !== ""))
      ).toString();
      const res  = await fetch(`${API_BASE}/api/incidents/filter${qs ? "?" + qs : ""}`);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setIncidents(data.incidents || []);
      setStats(data.stats || {});
      if (data.filter_options) setFilterOptions(data.filter_options);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchIncidents(filters); }, []);

  // ── Apply a single filter change ───────────────────────────
  const applyFilter = (key, value) => {
    const next = { ...filters, [key]: value };
    setFilters(next);
    fetchIncidents(next);
  };

  // ── Preset date ranges ──────────────────────────────────────
  const applyPreset = (preset) => {
    const today = new Date();
    let dateFrom = "";
    let dateTo   = TODAY;

    if (preset === "today") {
      dateFrom = TODAY;
    } else if (preset === "week") {
      const d = new Date(today);
      d.setDate(d.getDate() - 7);
      dateFrom = d.toISOString().split("T")[0];
    } else if (preset === "month") {
      const d = new Date(today);
      d.setMonth(d.getMonth() - 1);
      dateFrom = d.toISOString().split("T")[0];
    } else {
      dateFrom = "";
      dateTo   = "";
    }

    const next = { ...filters, dateFrom, dateTo };
    setFilters(next);
    fetchIncidents(next);
  };

  // ── Clear all filters ───────────────────────────────────────
  const resetAll = () => {
    const def = {
      status: "all", category: "all", department: "all",
      dateFrom: "", dateTo: "", sortBy: "recent", limit: "50",
    };
    setFilters(def);
    fetchIncidents(def);
  };

  const activeFilterCount = [
    filters.status !== "all",
    filters.category !== "all",
    filters.department !== "all",
    filters.dateFrom !== "",
    filters.dateTo !== "",
  ].filter(Boolean).length;

  const dateRangeLabel = filters.dateFrom || filters.dateTo
    ? `${filters.dateFrom || "..."} → ${filters.dateTo || "..."}`
    : null;

  // ── Render ──────────────────────────────────────────────────
  return (
    <div style={{ minHeight: "100vh", background: "#F0F4FF", fontFamily: "'Segoe UI', sans-serif" }}>

      {/* ── Header ── */}
      <div style={{
        background: "linear-gradient(135deg, #0F172A 0%, #1E3A8A 100%)",
        padding: "24px 36px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        flexWrap: "wrap", gap: 12,
      }}>
        <div>
          <div style={{ fontSize: 10, letterSpacing: 3, color: "#94A3B8", fontWeight: 700, marginBottom: 4 }}>
            MANGALURU CITY PORTAL · ADMIN DASHBOARD
          </div>
          <h1 style={{ margin: 0, fontSize: 22, fontWeight: 800, color: "#fff", letterSpacing: -0.5 }}>
            📋 Complaints & Incidents
          </h1>
        </div>
        <div style={{ display: "flex", gap: 10, alignItems: "center" }}>
          {activeFilterCount > 0 && (
            <button onClick={resetAll} style={{
              background: "rgba(255,255,255,0.1)", border: "1px solid rgba(255,255,255,0.25)",
              color: "#fff", borderRadius: 8, padding: "7px 14px",
              cursor: "pointer", fontSize: 12, fontWeight: 600,
            }}>
              ✕ Clear {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""}
            </button>
          )}
          <button onClick={() => fetchIncidents(filters)} style={{
            background: "#3B82F6", border: "none", color: "#fff",
            borderRadius: 8, padding: "7px 16px",
            cursor: "pointer", fontSize: 12, fontWeight: 700,
          }}>
            ↻ Refresh
          </button>
        </div>
      </div>

      <div style={{ padding: "24px 36px", maxWidth: 1400, margin: "0 auto" }}>

        {/* ── Stat Cards ── */}
        <div style={{ display: "flex", gap: 12, marginBottom: 24, flexWrap: "wrap" }}>
          <StatCard icon="📊" label="TOTAL"       value={stats.total || 0}       color="#6366F1" />
          <StatCard icon="⏳" label="PENDING"     value={stats.pending || 0}     color="#F59E0B" />
          <StatCard icon="🔄" label="IN PROGRESS" value={stats.in_progress || 0} color="#3B82F6" />
          <StatCard icon="✅" label="RESOLVED"    value={stats.resolved || 0}    color="#10B981" />
        </div>

        {/* ── Filter Panel ── */}
        <div style={{
          background: "#fff", borderRadius: 16, padding: "20px 24px",
          marginBottom: 20, boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
          display: "flex", flexDirection: "column", gap: 16,
        }}>

          {/* Row 1 — Status Tabs */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: 1, minWidth: 80 }}>STATUS</span>
            <TabBar
              value={filters.status}
              onChange={v => applyFilter("status", v)}
              activeColor="#0F172A"
              options={[
                { value: "all",         label: "All" },
                { value: "pending",     label: "⏳ Pending" },
                { value: "in_progress", label: "🔄 In Progress" },
                { value: "resolved",    label: "✅ Resolved" },
              ]}
            />
          </div>

          {/* Row 2 — Category Tabs */}
          <div style={{ display: "flex", alignItems: "center", gap: 12, flexWrap: "wrap" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: 1, minWidth: 80 }}>CATEGORY</span>
            <TabBar
              value={filters.category}
              onChange={v => applyFilter("category", v)}
              activeColor="#3B82F6"
              options={[
                { value: "all", label: "All" },
                ...filterOptions.categories.map(c => ({
                  value: c,
                  label: `${CATEGORY_ICON[c] || "📌"} ${c}`,
                }))
              ]}
            />
          </div>

          {/* Row 3 — Department + Sort + Limit */}
          <div style={{ display: "flex", gap: 12, flexWrap: "wrap", alignItems: "center" }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: 1, minWidth: 80 }}>DEPARTMENT</span>
            <select value={filters.department} onChange={e => applyFilter("department", e.target.value)}
              style={selectStyle}>
              <option value="all">All Departments</option>
              {filterOptions.departments.map(d => <option key={d} value={d}>{d}</option>)}
            </select>

            <div style={{ flex: 1 }} />

            <select value={filters.sortBy} onChange={e => applyFilter("sortBy", e.target.value)}
              style={selectStyle}>
              <option value="recent">🕐 Most Recent</option>
              <option value="oldest">📅 Oldest First</option>
              <option value="most_complaints">📊 Most Complaints</option>
            </select>

            <select value={filters.limit} onChange={e => applyFilter("limit", e.target.value)}
              style={selectStyle}>
              <option value="10">Show 10</option>
              <option value="25">Show 25</option>
              <option value="50">Show 50</option>
              <option value="100">Show 100</option>
              <option value="all">Show All</option>
            </select>
          </div>

          {/* Row 4 — Date Range with Calendar Picker */}
          <div style={{
            display: "flex", alignItems: "center", gap: 12,
            flexWrap: "wrap", paddingTop: 12,
            borderTop: "1px solid #F1F5F9",
          }}>
            <span style={{ fontSize: 11, fontWeight: 700, color: "#94A3B8", letterSpacing: 1, minWidth: 80 }}>DATE RANGE</span>

            {/* Quick Presets */}
            <div style={{ display: "flex", gap: 6 }}>
              {[
                { key: "today", label: "Today" },
                { key: "week",  label: "Last 7 Days" },
                { key: "month", label: "Last Month" },
                { key: "all",   label: "All Time" },
              ].map(p => (
                <button key={p.key} onClick={() => applyPreset(p.key)} style={{
                  padding: "6px 12px", borderRadius: 8,
                  border: "1.5px solid #E2E8F0",
                  background: "#F8FAFC", color: "#475569",
                  cursor: "pointer", fontSize: 12, fontWeight: 600,
                  transition: "all 0.15s",
                }}>
                  {p.label}
                </button>
              ))}
            </div>

            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              {/* From Calendar */}
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute", left: 10, top: "50%",
                  transform: "translateY(-50%)", fontSize: 14, pointerEvents: "none",
                }}>🗓️</span>
                <input
                  type="date"
                  value={filters.dateFrom}
                  max={filters.dateTo || TODAY}
                  onChange={e => applyFilter("dateFrom", e.target.value)}
                  style={{ ...dateInputStyle, paddingLeft: 32 }}
                />
              </div>

              <span style={{ color: "#94A3B8", fontWeight: 700 }}>→</span>

              {/* To Calendar */}
              <div style={{ position: "relative" }}>
                <span style={{
                  position: "absolute", left: 10, top: "50%",
                  transform: "translateY(-50%)", fontSize: 14, pointerEvents: "none",
                }}>🗓️</span>
                <input
                  type="date"
                  value={filters.dateTo}
                  min={filters.dateFrom || ""}
                  max={TODAY}
                  onChange={e => applyFilter("dateTo", e.target.value)}
                  style={{ ...dateInputStyle, paddingLeft: 32 }}
                />
              </div>

              {/* Clear date */}
              {(filters.dateFrom || filters.dateTo) && (
                <button onClick={() => {
                  const next = { ...filters, dateFrom: "", dateTo: "" };
                  setFilters(next);
                  fetchIncidents(next);
                }} style={{
                  background: "#FEE2E2", border: "none", color: "#DC2626",
                  borderRadius: 7, padding: "6px 10px",
                  cursor: "pointer", fontSize: 12, fontWeight: 700,
                }}>
                  ✕ Clear
                </button>
              )}
            </div>

            {/* Active date range label */}
            {dateRangeLabel && (
              <span style={{
                background: "#EFF6FF", color: "#1D4ED8",
                borderRadius: 8, padding: "4px 12px",
                fontSize: 12, fontWeight: 600,
              }}>
                📅 {dateRangeLabel}
              </span>
            )}
          </div>
        </div>

        {/* ── Results Count ── */}
        <div style={{ marginBottom: 12, fontSize: 13, color: "#64748B", fontWeight: 500 }}>
          {loading
            ? "Fetching incidents..."
            : `Showing ${incidents.length} result${incidents.length !== 1 ? "s" : ""}`
          }
          {activeFilterCount > 0 && (
            <span style={{ color: "#3B82F6", marginLeft: 8, fontWeight: 700 }}>
              · {activeFilterCount} filter{activeFilterCount > 1 ? "s" : ""} active
            </span>
          )}
        </div>

        {/* ── Error ── */}
        {error && (
          <div style={{
            background: "#FEE2E2", border: "1px solid #FCA5A5",
            borderRadius: 12, padding: "14px 20px", color: "#991B1B",
            marginBottom: 16, fontWeight: 600, fontSize: 13,
          }}>
            ⚠️ Error: {error} — Make sure your API_BASE URL is correct at the top of the file.
          </div>
        )}

        {/* ── Loading Skeleton ── */}
        {loading && (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[1,2,3,4,5].map(i => (
              <div key={i} style={{
                height: 60, borderRadius: 10,
                background: "linear-gradient(90deg, #E2E8F0 25%, #F8FAFC 50%, #E2E8F0 75%)",
                backgroundSize: "200% 100%",
                animation: "shimmer 1.2s infinite",
              }} />
            ))}
          </div>
        )}

        {/* ── Incidents Table ── */}
        {!loading && incidents.length > 0 && (
          <div style={{
            background: "#fff", borderRadius: 16, overflow: "hidden",
            boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
          }}>
            <table style={{ width: "100%", borderCollapse: "collapse" }}>
              <thead>
                <tr style={{ background: "#F8FAFC", borderBottom: "2px solid #E2E8F0" }}>
                  {["#", "Category", "Description", "Location", "Reported By", "Department", "Status", "Date Filed"].map(h => (
                    <th key={h} style={{
                      padding: "12px 16px", textAlign: "left",
                      fontSize: 10, fontWeight: 800,
                      color: "#94A3B8", letterSpacing: 1,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {incidents.map((inc, idx) => {
                  const isExpanded = expandedRow === inc.id;
                  return (
                    <tr key={inc.id}
                      onClick={() => setExpandedRow(isExpanded ? null : inc.id)}
                      style={{
                        borderBottom: "1px solid #F1F5F9",
                        background: isExpanded ? "#EFF6FF" : idx % 2 === 0 ? "#fff" : "#FAFBFF",
                        cursor: "pointer", transition: "background 0.1s",
                      }}
                    >
                      {/* # */}
                      <td style={tdStyle}>
                        <span style={{ color: "#CBD5E1", fontSize: 11 }}>{idx + 1}</span>
                      </td>

                      {/* Category */}
                      <td style={tdStyle}>
                        <span style={{ fontSize: 16 }}>{CATEGORY_ICON[inc.category] || "📌"}</span>{" "}
                        <span style={{ fontWeight: 600, fontSize: 13, color: "#1E293B" }}>{inc.category}</span>
                      </td>

                      {/* Description */}
                      <td style={{ ...tdStyle, maxWidth: 240 }}>
                        <span style={{
                          fontSize: 13, color: "#475569",
                          display: "block", whiteSpace: isExpanded ? "normal" : "nowrap",
                          overflow: "hidden", textOverflow: isExpanded ? "clip" : "ellipsis",
                        }}>
                          {inc.description}
                        </span>
                      </td>

                      {/* Address */}
                      <td style={tdStyle}>
                        <span style={{
                          background: "#F1F5F9", borderRadius: 6,
                          padding: "2px 8px", fontSize: 12, color: "#334155", fontWeight: 500,
                        }}>
                          📍 {inc.address}
                        </span>
                      </td>

                      {/* User */}
                      <td style={tdStyle}>
                        <div style={{ fontWeight: 600, fontSize: 13, color: "#1E293B" }}>{inc.user_name}</div>
                        <div style={{ fontSize: 11, color: "#94A3B8" }}>{inc.user_phone}</div>
                      </td>

                      {/* Department */}
                      <td style={tdStyle}>
                        <span style={{ fontSize: 12, color: "#64748B" }}>{inc.department}</span>
                      </td>

                      {/* Status */}
                      <td style={tdStyle}>
                        <StatusBadge status={inc.status} />
                      </td>

                      {/* Date */}
                      <td style={tdStyle}>
                        <span style={{ fontSize: 11, color: "#94A3B8" }}>
                          {inc.created_at
                            ? new Date(inc.created_at).toLocaleDateString("en-IN", {
                                day: "2-digit", month: "short", year: "numeric"
                              })
                            : "—"}
                        </span>
                        <div style={{ fontSize: 10, color: "#CBD5E1" }}>
                          {inc.created_at
                            ? new Date(inc.created_at).toLocaleTimeString("en-IN", {
                                hour: "2-digit", minute: "2-digit"
                              })
                            : ""}
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}

        {/* ── Empty State ── */}
        {!loading && !error && incidents.length === 0 && (
          <div style={{
            background: "#fff", borderRadius: 16,
            padding: "60px 40px", textAlign: "center",
            boxShadow: "0 2px 16px rgba(0,0,0,0.07)",
          }}>
            <div style={{ fontSize: 52, marginBottom: 12 }}>🔍</div>
            <div style={{ fontSize: 18, fontWeight: 700, color: "#1E293B" }}>No incidents found</div>
            <div style={{ color: "#94A3B8", marginTop: 6, fontSize: 14 }}>
              Try adjusting your filters or clearing the date range.
            </div>
            <button onClick={resetAll} style={{
              marginTop: 20, background: "#3B82F6", color: "#fff",
              border: "none", borderRadius: 10, padding: "10px 24px",
              cursor: "pointer", fontWeight: 700, fontSize: 13,
            }}>
              Clear All Filters
            </button>
          </div>
        )}

      </div>

      <style>{`
        @keyframes shimmer {
          0%   { background-position: -200% 0; }
          100% { background-position:  200% 0; }
        }
        tr:hover td { background: #F8FAFC !important; }
        input[type="date"]::-webkit-calendar-picker-indicator {
          opacity: 0;
          position: absolute;
          width: 100%;
          height: 100%;
          cursor: pointer;
        }
      `}</style>
    </div>
  );
}

// ── Shared Styles ─────────────────────────────────────────────
const selectStyle = {
  padding: "8px 14px", borderRadius: 9,
  border: "1.5px solid #E2E8F0",
  background: "#F8FAFC", color: "#334155",
  fontSize: 13, fontWeight: 600, cursor: "pointer",
};

const dateInputStyle = {
  padding: "7px 12px",
  border: "1.5px solid #E2E8F0",
  borderRadius: 9, background: "#F8FAFC",
  fontSize: 13, fontWeight: 600, color: "#334155",
  cursor: "pointer",
};

const tdStyle = {
  padding: "13px 16px",
  verticalAlign: "middle",
};