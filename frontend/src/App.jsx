import { useEffect, useState } from "react";
import "./App.css";

export default function App() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/stock_market_data.json")
      .then((res) => res.json())
      .then((data) => {
        setRows(Array.isArray(data) ? data : data.data || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load JSON:", err);
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

  return (
    <div className="app-root">
      <h1 className="app-title">Stock Market Data (JSON Model)</h1>

      <div className="card table-card">
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
  );
}
