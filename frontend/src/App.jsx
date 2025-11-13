import React, { useEffect, useState } from "react";
import StockChart from "./components/StockChart";
import "./App.css";

export default function App() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");
    fetch("http://localhost:5000/api/stocks")
      .then((res) => res.json())
      .then((data) => {
        const arr = (Array.isArray(data) ? data : []).map((row) => {
          const d = new Date(row.date);
          const valid = !isNaN(d.getTime());
          const formatted = valid ? d.toISOString().slice(0, 10) : "";

          return {
            ...row,
            date: formatted,
          };
        });

        setRows(arr);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load data");
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <div className="full-screen">
        <p>Loading data...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="full-screen">
        <p>{error}</p>
      </div>
    );
  }

  if (!rows || rows.length === 0) {
    return (
      <div className="full-screen">
        <p>No data available</p>
      </div>
    );
  }

  return (
    <div className="app-root">
      <h1 className="app-title">Stock Market Data (SQL Model)</h1>

      <StockChart rows={rows} />

      <div className="card table-card">
        <div className="table-wrapper">
          <table className="data-table">
            <thead>
              <tr>
                <th>date</th>
                <th>trade_code</th>
                <th>open</th>
                <th>high</th>
                <th>low</th>
                <th>close</th>
                <th>volume</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, index) => (
                <tr
                  key={index}
                  className={index % 2 === 0 ? "row-even" : "row-odd"}
                >
                  <td>{row.date}</td>
                  <td>{row.trade_code}</td>
                  <td>{row.open}</td>
                  <td>{row.high}</td>
                  <td>{row.low}</td>
                  <td>{row.close}</td>
                  <td>{row.volume}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
