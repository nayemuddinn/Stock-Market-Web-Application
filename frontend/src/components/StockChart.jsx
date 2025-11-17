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
  if (!rows || rows.length === 0) return null;

  const [selectedCode, setSelectedCode] = useState(rows[0].trade_code);

  const tradeCodes = useMemo(
    () => [...new Set(rows.map((row) => row.trade_code))],
    [rows]
  );

  const chartData = useMemo(
    () =>
      rows
        .filter((row) => row.trade_code === selectedCode)
        .sort((a, b) => new Date(a.date) - new Date(b.date))
        .map((row) => ({
          ...row,
          close: Number(row.close),
          volume: Number(String(row.volume).replace(/,/g, "")),
        })),
    [rows, selectedCode]
  );

  return (
    <div className="chart-card">
      <div className="chart-header">
        <div>
          <h2 className="section-title">Price & Volume Overview</h2>
          <p className="chart-subtitle">
            Line shows close price, bars show traded volume.
          </p>
        </div>

        <div className="chart-controls">
          <label htmlFor="tradeCodeSelect" className="chart-label">
            Trade Code
          </label>

          <select
            id="tradeCodeSelect"
            value={selectedCode}
            onChange={(e) => setSelectedCode(e.target.value)}
            className="chart-select"
          >
            {tradeCodes.map((code) => (
              <option key={code} value={code}>
                {code}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="chart-body">
        <ResponsiveContainer width="100%" height={340}>
          <ComposedChart data={chartData}>
            <XAxis
              dataKey="date"
              tick={{ fill: "#6b7280", fontSize: 11 }}
              angle={-30}
              textAnchor="end"
            />
            <YAxis
              yAxisId="left"
              tick={{ fill: "#6b7280", fontSize: 11 }}
              tickLine={false}
            />
            <YAxis
              yAxisId="right"
              orientation="right"
              tick={{ fill: "#6b7280", fontSize: 11 }}
              tickLine={false}
            />

            <Tooltip />
            <Legend />

            <Line
              yAxisId="left"
              type="monotone"
              dataKey="close"
              stroke="#2563eb"
              dot={false}
              strokeWidth={2}
            />

            <Bar
              yAxisId="right"
              dataKey="volume"
              barSize={18}
              fill="#10b981"
            />
          </ComposedChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
}
