import React, { useMemo, useState } from "react";
import {
  ResponsiveContainer,
  ComposedChart,
  XAxis,
  YAxis,
  Tooltip,
  Legend,
  Line,
  Bar,
} from "recharts";

export default function StockChart({ rows }) {
  if (!rows || rows.length === 0) {
    return (
      <p className="status-text">
        No data yet. Add some rows to see the chart.
      </p>
    );
  }

  const tradeCodes = useMemo(
    () => Array.from(new Set(rows.map((r) => r.trade_code))).filter(Boolean),
    [rows]
  );

  const [selectedCode, setSelectedCode] = useState(tradeCodes[0]);

  const chartData = useMemo(
    () =>
      rows
        .filter((r) => r.trade_code === selectedCode)
        .map((r) => ({
          ...r,
          dateLabel: r.date ? r.date.slice(0, 10) : "",
        })),
    [rows, selectedCode]
  );

  return (
    <div className="chart-wrapper">
      <div className="form-row">
        <label className="form-label" htmlFor="tradeCodeSelect">
          Trade Code
        </label>
        <select
          id="tradeCodeSelect"
          className="form-input"
          value={selectedCode}
          onChange={(e) => setSelectedCode(e.target.value)}
        >
          {tradeCodes.map((code) => (
            <option key={code} value={code}>
              {code}
            </option>
          ))}
        </select>
      </div>

      {chartData.length === 0 ? (
        <p className="status-text">
          No data available for <strong>{selectedCode}</strong>.
        </p>
      ) : (
        <div className="chart-inner">
          <ResponsiveContainer width="100%" height={320}>
            <ComposedChart data={chartData}>
              <XAxis dataKey="dateLabel" />
              <YAxis
                yAxisId="left"
                label={{
                  value: "Close Price",
                  angle: -90,
                  position: "insideLeft",
                }}
              />
              <YAxis
                yAxisId="right"
                orientation="right"
                label={{
                  value: "Volume",
                  angle: -90,
                  position: "insideRight",
                }}
              />
              <Tooltip />
              <Legend />
              <Line
                yAxisId="left"
                type="monotone"
                dataKey="close"
                stroke="#38bdf8"
                strokeWidth={2}
                dot={false}
                name="Close"
              />
              <Bar
                yAxisId="right"
                dataKey="volume"
                barSize={18}
                fill="#10b981"
                name="Volume"
              />
            </ComposedChart>
          </ResponsiveContainer>
        </div>
      )}
    </div>
  );
}
