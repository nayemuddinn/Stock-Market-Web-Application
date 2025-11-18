import { useEffect, useMemo, useState } from "react";
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

const API_BASE = "https://YOUR-BACKEND-URL.onrender.com/api/stocks";

function App() {
  const [rows, setRows] = useState([]);
  const [formRow, setFormRow] = useState(emptyRow);
  const [editingId, setEditingId] = useState(null);
  const [loading, setLoading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [page, setPage] = useState(1);
  const pageSize = 10;

  useEffect(() => {
    fetchRows();
  }, []);

  const fetchRows = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await fetch(API_BASE);
      if (!res.ok) {
        throw new Error("Failed to fetch data");
      }
      const data = await res.json();
      setRows(data || []);
    } catch (err) {
      console.error(err);
      setError("Failed to load data from server.");
    } finally {
      setLoading(false);
    }
  };

  const totalPages = useMemo(
    () => Math.max(1, Math.ceil(rows.length / pageSize)),
    [rows.length, pageSize]
  );

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return rows.slice(start, start + pageSize);
  }, [rows, page, pageSize]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormRow((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormRow(emptyRow);
    setEditingId(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    try {
      const payload = {
        ...formRow,
        open: formRow.open ? Number(formRow.open) : null,
        high: formRow.high ? Number(formRow.high) : null,
        low: formRow.low ? Number(formRow.low) : null,
        close: formRow.close ? Number(formRow.close) : null,
        volume: formRow.volume ? Number(formRow.volume) : null,
      };

      const url = editingId ? `${API_BASE}/${editingId}` : API_BASE;
      const method = editingId ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        throw new Error("Failed to save row");
      }

      await fetchRows();
      resetForm();
    } catch (err) {
      console.error(err);
      setError("Failed to save row.");
    } finally {
      setSaving(false);
    }
  };

  const handleEdit = (row) => {
    setEditingId(row.id);
    setFormRow({
      date: row.date ? row.date.slice(0, 10) : "",
      trade_code: row.trade_code || "",
      open: row.open ?? "",
      high: row.high ?? "",
      low: row.low ?? "",
      close: row.close ?? "",
      volume: row.volume ?? "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this row?")) return;

    try {
      setSaving(true);
      setError("");
      const res = await fetch(`${API_BASE}/${id}`, {
        method: "DELETE",
      });
      if (!res.ok) {
        throw new Error("Failed to delete row");
      }
      await fetchRows();
    } catch (err) {
      console.error(err);
      setError("Failed to delete row.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="app-root">
      <div className="app-shell">
        <header className="app-header">
          <h1 className="app-title">Stock Market Dashboard</h1>
          <p className="app-subtitle">
            Visualize and manage stock data with chart and CRUD table.
          </p>
        </header>

        <main className="content-grid">
          <section className="panel">
            <div className="panel-header">
              <h2 className="panel-title">Price and Volume Chart</h2>
              <p className="panel-subtitle">
                Select a trade code to see closing price and volume over time.
              </p>
            </div>

            <div className="panel-body">
              <StockChart rows={rows} />
            </div>
          </section>

          <section className="panel">
            <div className="panel-header">
              <h2 className="panel-title">
                {editingId ? "Edit Row" : "Add New Row"}
              </h2>
              <p className="panel-subtitle">
                Fill the form to add new stock data or update an existing one.
              </p>
            </div>

            <div className="panel-body">
              <form className="form-grid" onSubmit={handleSubmit}>
                <div className="form-group">
                  <label className="form-label" htmlFor="date">
                    Date
                  </label>
                  <input
                    id="date"
                    name="date"
                    type="date"
                    className="form-input"
                    value={formRow.date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="trade_code">
                    Trade Code
                  </label>
                  <input
                    id="trade_code"
                    name="trade_code"
                    className="form-input"
                    value={formRow.trade_code}
                    onChange={handleChange}
                    placeholder="e.g. ACI"
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="open">
                    Open
                  </label>
                  <input
                    id="open"
                    name="open"
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={formRow.open}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="high">
                    High
                  </label>
                  <input
                    id="high"
                    name="high"
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={formRow.high}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="low">
                    Low
                  </label>
                  <input
                    id="low"
                    name="low"
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={formRow.low}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="close">
                    Close
                  </label>
                  <input
                    id="close"
                    name="close"
                    type="number"
                    step="0.01"
                    className="form-input"
                    value={formRow.close}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="volume">
                    Volume
                  </label>
                  <input
                    id="volume"
                    name="volume"
                    type="number"
                    step="1"
                    className="form-input"
                    value={formRow.volume}
                    onChange={handleChange}
                  />
                </div>

                <div className="form-row">
                  <button
                    type="submit"
                    className="btn btn-primary"
                    disabled={saving}
                  >
                    {saving
                      ? "Saving..."
                      : editingId
                      ? "Update Row"
                      : "Add Row"}
                  </button>

                  {editingId && (
                    <button
                      type="button"
                      className="btn btn-secondary"
                      onClick={resetForm}
                    >
                      Cancel
                    </button>
                  )}
                </div>
              </form>
            </div>

            <div className="panel-header">
              <h2 className="panel-title">All Stocks</h2>
              <p className="panel-subtitle">
                Edit or delete any row. Pagination keeps it readable.
              </p>
            </div>

            <div className="panel-body">
              {loading && <p className="status-text">Loading data...</p>}
              {error && <p className="status-text status-error">{error}</p>}

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
                    {paginatedRows.length === 0 ? (
                      <tr>
                        <td colSpan="8" className="status-text">
                          No data available.
                        </td>
                      </tr>
                    ) : (
                      paginatedRows.map((row) => (
                        <tr key={row.id}>
                          <td>{row.date?.slice(0, 10)}</td>
                          <td>{row.trade_code}</td>
                          <td>{row.open}</td>
                          <td>{row.high}</td>
                          <td>{row.low}</td>
                          <td>{row.close}</td>
                          <td>{row.volume}</td>
                          <td className="actions-cell">
                            <button
                              className="btn btn-secondary btn-sm"
                              onClick={() => handleEdit(row)}
                            >
                              Edit
                            </button>
                            <button
                              className="btn btn-danger btn-sm"
                              onClick={() => handleDelete(row.id)}
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>

              <div className="pagination">
                <span className="pagination-info">
                  Page {page} of {totalPages}
                </span>
                <div className="pagination-controls">
                  <button
                    className="btn btn-secondary btn-sm"
                    disabled={page === 1}
                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                  >
                    Previous
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    disabled={page === totalPages}
                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  >
                    Next
                  </button>
                </div>
              </div>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
}

export default App;
