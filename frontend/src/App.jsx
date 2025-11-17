import { useEffect, useState } from "react";
import StockChart from "./components/StockChart";
import "./App.css";

const emptyRow = {
  date: "",
  trade_code: "",
  open: "",
  high: "",
  low: "",
  close: "",
  volume: "",
};

const API_BASE = "http://localhost:5000/api/stocks";

export default function App() {
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [newRow, setNewRow] = useState(emptyRow);
  const [editIndex, setEditIndex] = useState(null);
  const [editRow, setEditRow] = useState(emptyRow);

  const fetchRows = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(API_BASE);
      const data = await res.json();

      const cleaned = (Array.isArray(data) ? data : []).map((row) => {
        const d = new Date(row.date);
        const valid = !isNaN(d.getTime());
        return {
          ...row,
          date: valid ? d.toISOString().slice(0, 10) : row.date,
        };
      });

      setRows(cleaned);
    } catch (err) {
      setError("Failed to load data from server");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRows();
  }, []);

  const handleNewChange = (e) => {
    const { name, value } = e.target;
    setNewRow((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddRow = async (e) => {
    e.preventDefault();
    if (!newRow.date || !newRow.trade_code) return;

    try {
      const res = await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newRow),
      });

      if (!res.ok) {
        throw new Error("Failed to add row");
      }

      const result = await res.json();

      setRows((prev) => [
        ...prev,
        {
          id: result.id,
          ...newRow,
        },
      ]);

      setNewRow(emptyRow);
    } catch (err) {
      console.error(err);
      alert("Failed to add row. Check server and try again.");
    }
  };

  const handleEditClick = (index) => {
    setEditIndex(index);
    setEditRow(rows[index]);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditRow((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async (index) => {
    const rowToUpdate = rows[index];
    const id = rowToUpdate.id;

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          date: editRow.date,
          trade_code: editRow.trade_code,
          open: editRow.open,
          high: editRow.high,
          low: editRow.low,
          close: editRow.close,
          volume: editRow.volume,
        }),
      });

      if (!res.ok) {
         const text = await res.text();      
      console.error("Update failed:", res.status, text);
        throw new Error("Failed to update row");
      }

      setRows((prev) => {
        const updated = [...prev];
        updated[index] = { ...editRow, id };
        return updated;
      });

      setEditIndex(null);
      setEditRow(emptyRow);
    } catch (err) {
      console.error(err);
      alert("Failed to update row. Check server and try again.");
    }
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditRow(emptyRow);
  };

  const handleDeleteRow = async (index) => {
    const rowToDelete = rows[index];
    const id = rowToDelete.id;

    if (!window.confirm("Are you sure you want to delete this row?")) return;

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        throw new Error("Failed to delete row");
      }

      setRows((prev) => prev.filter((_, i) => i !== index));
    } catch (err) {
      console.error(err);
      alert("Failed to delete row. Check server and try again.");
    }
  };

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
            <p className="app-subtitle">SQL model</p>
          </div>
        </header>

        <section className="panel">
          <StockChart rows={rows} />
        </section>

        <section className="panel">
          <h2 className="section-title">Add New Row</h2>
          <form className="form-row" onSubmit={handleAddRow}>
            <div className="form-group">
              <label className="form-label">Date</label>
              <input
                className="form-input"
                type="date"
                name="date"
                value={newRow.date}
                onChange={handleNewChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Trade Code</label>
              <input
                className="form-input"
                type="text"
                name="trade_code"
                value={newRow.trade_code}
                onChange={handleNewChange}
                placeholder="e.g. 1JANATAMF"
              />
            </div>
            <div className="form-group">
              <label className="form-label">Open</label>
              <input
                className="form-input"
                type="number"
                name="open"
                value={newRow.open}
                onChange={handleNewChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">High</label>
              <input
                className="form-input"
                type="number"
                name="high"
                value={newRow.high}
                onChange={handleNewChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Low</label>
              <input
                className="form-input"
                type="number"
                name="low"
                value={newRow.low}
                onChange={handleNewChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Close</label>
              <input
                className="form-input"
                type="number"
                name="close"
                value={newRow.close}
                onChange={handleNewChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Volume</label>
              <input
                className="form-input"
                type="number"
                name="volume"
                value={newRow.volume}
                onChange={handleNewChange}
              />
            </div>

            <div className="form-actions">
              <button type="submit" className="btn btn-primary">
                Add Row
              </button>
            </div>
          </form>
        </section>

        <section className="panel">
          <div className="table-header">
            <h2 className="section-title">All Records</h2>
            <p className="table-meta">Total rows: {rows.length}</p>
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
                  <th className="actions-header">Actions</th>
                </tr>
              </thead>

              <tbody>
                {rows.map((row, index) => {
                  const isEditing = editIndex === index;
                  const current = isEditing ? editRow : row;

                  return (
                    <tr
                      key={row.id ?? index}
                      className={index % 2 === 0 ? "row-even" : "row-odd"}
                    >
                      <td>
                        {isEditing ? (
                          <input
                            className="input-cell"
                            type="date"
                            name="date"
                            value={current.date}
                            onChange={handleEditChange}
                          />
                        ) : (
                          row.date
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            className="input-cell"
                            type="text"
                            name="trade_code"
                            value={current.trade_code}
                            onChange={handleEditChange}
                          />
                        ) : (
                          <span className="badge">{row.trade_code}</span>
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            className="input-cell"
                            type="number"
                            name="open"
                            value={current.open}
                            onChange={handleEditChange}
                          />
                        ) : (
                          row.open
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            className="input-cell"
                            type="number"
                            name="high"
                            value={current.high}
                            onChange={handleEditChange}
                          />
                        ) : (
                          row.high
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            className="input-cell"
                            type="number"
                            name="low"
                            value={current.low}
                            onChange={handleEditChange}
                          />
                        ) : (
                          row.low
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            className="input-cell"
                            type="number"
                            name="close"
                            value={current.close}
                            onChange={handleEditChange}
                          />
                        ) : (
                          row.close
                        )}
                      </td>
                      <td>
                        {isEditing ? (
                          <input
                            className="input-cell"
                            type="number"
                            name="volume"
                            value={current.volume}
                            onChange={handleEditChange}
                          />
                        ) : (
                          row.volume
                        )}
                      </td>
                      <td className="actions-cell">
                        {isEditing ? (
                          <>
                            <button
                              className="btn btn-primary btn-sm"
                              onClick={() => handleSaveEdit(index)}
                            >
                              Save
                            </button>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={handleCancelEdit}
                            >
                              Cancel
                            </button>
                          </>
                        ) : (
                          <>
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleEditClick(index)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDeleteRow(index)}
                            >
                              Delete
                            </button>
                          </>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </section>
      </div>
    </div>
  );
}
