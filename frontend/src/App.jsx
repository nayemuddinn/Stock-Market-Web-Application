import { useEffect, useState } from "react";

const headerCell = {
  padding: "12px",
  fontWeight: "bold",
  borderBottom: "2px solid #dfe3eb",
  color: "#111827",
};

const bodyCell = {
  padding: "10px",
  borderBottom: "1px solid #e2e2e2",
  color: "#111827",
};

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
    <div
      style={{
        height: "100vh",
        width: "100vw",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#0f172a",
        color: "#e5e7eb",
        fontFamily: "Arial, sans-serif",
        textAlign: "center",
        margin: 0,
        padding: 0,
        boxSizing: "border-box",
      }}
    >
      <p>Loading data...</p>
    </div>
  );
}


  return (
    <div
      style={{
        minHeight: "100vh",
        width: "100%",        
        display: "flex",
        flexDirection: "column",
        alignItems: "stretch",   
        padding: "30px 20px",
        background: "#0f172a",
        color: "#e5e7eb",
        fontFamily: "Arial, sans-serif",
        boxSizing: "border-box",
      }}
    >
      <h1
        style={{
          marginBottom: "20px",
          color: "#e5e7eb",
          textAlign: "center",
        }}
      >
        📊 Stock Market Data (JSON Model)
      </h1>

      <div
        style={{
          width: "100%",         
          background: "white",
          padding: "20px",
          borderRadius: "10px",
          boxShadow: "0 4px 12px rgba(0,0,0,0.5)",
          overflowX: "auto",
          boxSizing: "border-box",
        }}
      >
        <table
          style={{
            width: "100%",        
            borderCollapse: "collapse",
            tableLayout: "fixed",
            textAlign: "center",
          }}
        >
          <thead>
            <tr style={{ backgroundColor: "#e5e7eb" }}>
              <th style={headerCell}>Date</th>
              <th style={headerCell}>Trade Code</th>
              <th style={headerCell}>Open</th>
              <th style={headerCell}>High</th>
              <th style={headerCell}>Low</th>
              <th style={headerCell}>Close</th>
              <th style={headerCell}>Volume</th>
            </tr>
          </thead>

          <tbody>
            {rows.map((row, index) => (
              <tr
                key={index}
                style={{
                  backgroundColor: index % 2 === 0 ? "#f9fafb" : "#ffffff",
                }}
              >
                <td style={bodyCell}>{row.date}</td>
                <td style={bodyCell}>{row.trade_code}</td>
                <td style={bodyCell}>{row.open}</td>
                <td style={bodyCell}>{row.high}</td>
                <td style={bodyCell}>{row.low}</td>
                <td style={bodyCell}>{row.close}</td>
                <td style={bodyCell}>{row.volume}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
