import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    fetch("/stock_market_data.json")
      .then((res) => res.json())
      .then((data) => {
        const cleaned = (Array.isArray(data) ? data : data.data || []).map(
          (row) => {
            const d = new Date(row.date);
            const valid = !isNaN(d.getTime());
            return {
              ...row,
              date: valid ? d.toISOString().slice(0, 10) : row.date,
            };
          }
        );

        setRows(cleaned);
        setLoading(false);
      })
      .catch(() => {
        setError("Failed to load JSON data");
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
      <div className="app-container">
        <header className="app-header">
          <div>
            <h1 className="app-title">Stock Market Data</h1>
            <p className="app-subtitle">JSON Model</p>
          </div>
        </header>

        <section className="panel">
          <div className="table-header">
            <h2 className="section-title">All Records</h2>
          </div>

          <div className="table-wrapper">
            <table className="data-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Trade Code</th>
                  <th>Open</th>
                  <th>High</th>
                  <th>Low</th>
                  <th>Close</th>
                  <th>Volume</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((row, index) => (
                  <tr
                    key={index}
                    className={index % 2 === 0 ? "row-even" : "row-odd"}
                  >
                    <td>{row.date}</td>
                    <td>
                      <span className="badge">{row.trade_code}</span>
                    </td>
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
        </section>
      </div>
    </div>
  );
}
