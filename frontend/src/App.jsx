import { useEffect, useState } from "react";

export default function App() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    setLoading(true);
    setError("");

    fetch("http://localhost:5000/api/stocks")
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .then((data) => {
        console.log("Data from API:", data);
        if (Array.isArray(data)) {
          setRows(data);
        } else {
          setRows([]);
        }
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to load data from API:", err);
        setError("Failed to load data from server");
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
        margin: "0",
        padding: "0",
        boxSizing: "border-box",
      }}
    >
      <p>Loading data...</p>
    </div>
  );
}


  if (error) {
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#0f172a",
          color: "#e5e7eb",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <p>{error}</p>
      </div>
    );
  }


  const columns = rows.length > 0 ? Object.keys(rows[0]) : [];

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
      <h1 style={{ textAlign: "center", marginBottom: "10px" }}>
        Stock Market Data (SQL Model)
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
              {columns.map((col) => (
                <th
                  key={col}
                  style={{
                    padding: "12px",
                    fontWeight: "bold",
                    borderBottom: "2px solid #dfe3eb",
                    color: "#111827",
                  }}
                >
                  {col}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                style={{
                  backgroundColor: rowIndex % 2 === 0 ? "#f9fafb" : "#ffffff",
                }}
              >
                {columns.map((col) => (
                  <td
                    key={col}
                    style={{
                      padding: "10px",
                      borderBottom: "1px solid #e2e2e2",
                      color: "#111827",
                      wordBreak: "break-word",
                    }}
                  >
                    {row[col]}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
