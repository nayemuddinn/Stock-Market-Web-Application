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

  const [page, setPage] = useState(1);
  const pageSize = 100;

  const [search, setSearch] = useState("");

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
      setPage(1);
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

      setNewRow(emptyRow);
      await fetchRows();
    } catch (err) {
      console.error(err);
      alert("Failed to add row. Check server and try again.");
    }
  };

  const handleEditClick = (globalIndex) => {
    setEditIndex(globalIndex);
    setEditRow(rows[globalIndex]);
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditRow((prev) => ({ ...prev, [name]: value }));
  };

  const handleSaveEdit = async (globalIndex) => {
    const rowToUpdate = rows[globalIndex];
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

      setEditIndex(null);
      setEditRow(emptyRow);
      await fetchRows();
    } catch (err) {
      console.error(err);
      alert("Failed to update row. Check server and try again.");
    }
  };

  const handleCancelEdit = () => {
    setEditIndex(null);
    setEditRow(emptyRow);
  };

  const handleDeleteRow = async (id) => {
    if (!window.confirm("Are you sure you want to delete this row?")) return;

    try {
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
      });

      if (!res.ok) {
        const text = await res.text();
        console.error("Delete failed:", res.status, text);
        throw new Error("Failed to delete row");
      }

      await fetchRows();
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

  const normalizedSearch = search.trim().toLowerCase();
  const filteredRows = normalizedSearch
    ? rows.filter((row) => {
        const tc = (row.trade_code || "").toLowerCase();
        const dt = (row.date || "").toString().toLowerCase();
        return (
          tc.includes(normalizedSearch) ||
          dt.includes(normalizedSearch)
        );
      })
    : rows;

  const totalPages = Math.max(1, Math.ceil(filteredRows.length / pageSize));
  const startIndex = (page - 1) * pageSize;
  const pageRows = filteredRows.slice(startIndex, startIndex + pageSize);

  return (
    <div className="app-root">
      <div className="app-container">
        <header className="app-header">
          <div>
            <h1 className="app-title">Stock Market Data</h1>
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

            <input
              type="text"
              className="form-input"
              placeholder="Search by trade code or date"
              value={search}
              onChange={(e) => {
                setSearch(e.target.value);
                setPage(1);
              }}
            style={{ maxWidth: "230px", width: "100%" }}

            />
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
                {pageRows.map((row, index) => {
                  const globalIndex = rows.findIndex(
                    (r) => r.id === row.id
                  );
                  const isEditing = editIndex === globalIndex;
                  const current = isEditing ? editRow : row;

                  return (
                    <tr
                      key={row.id ?? globalIndex}
                      className={
                        globalIndex % 2 === 0 ? "row-even" : "row-odd"
                      }
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
                              onClick={() =>
                                handleSaveEdit(globalIndex)
                              }
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
                              onClick={() =>
                                handleEditClick(globalIndex)
                              }
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() =>
                                handleDeleteRow(row.id)
                              }
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

          <div
            style={{
              marginTop: "10px",
              textAlign: "center",
              display: "flex",
              justifyContent: "center",
              gap: "10px",
              fontSize: "12px",
            }}
          >
            <button
              className="btn btn-secondary btn-sm"
              disabled={page === 1}
              onClick={() => setPage((p) => Math.max(1, p - 1))}
            >
              Prev
            </button>

            <span>
              Page {page} of {totalPages}
            </span>

            <button
              className="btn btn-secondary btn-sm"
              disabled={page === totalPages}
              onClick={() =>
                setPage((p) => Math.min(totalPages, p + 1))
              }
            >
              Next
            </button>
          </div>
        </section>
      </div>
    </div>
  );
}
