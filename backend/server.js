const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.MYSQLHOST || "localhost",
  user: process.env.MYSQLUSER || "root",
  password: process.env.MYSQLPASSWORD || "",
  database: process.env.MYSQLDATABASE || "stock_market",
  port: process.env.MYSQLPORT || 3306,
});

db.connect((err) => {
  if (err) {
    console.log("DB connection error:", err);
  } else {
    console.log("Connected to MySQL");
  }
});

app.get("/api/stocks", (req, res) => {
  const sql = "SELECT * FROM stocks ORDER BY date ASC, id ASC";
  db.query(sql, (err, results) => {
    if (err) return res.status(500).json({ error: err });
    res.json(results);
  });
});

app.post("/api/stocks", (req, res) => {
  const { date, trade_code, open, high, low, close, volume } = req.body;

  const sql =
    "INSERT INTO stocks (date, trade_code, open, high, low, close, volume) VALUES (?, ?, ?, ?, ?, ?, ?)";

  db.query(
    sql,
    [date, trade_code, open, high, low, close, volume],
    (err, result) => {
      if (err) return res.status(500).json({ error: err });
      res.json({
        message: "Row added",
        id: result.insertId,
      });
    }
  );
});

app.put("/api/stocks/:id", (req, res) => {
  const { id } = req.params;
  const { date, trade_code, open, high, low, close, volume } = req.body;

  const sql =
    "UPDATE stocks SET date=?, trade_code=?, open=?, high=?, low=?, close=?, volume=? WHERE id=?";

  db.query(
    sql,
    [date, trade_code, open, high, low, close, volume, id],
    (err, result) => {
      if (err) {
        console.log("UPDATE ERROR:", err);
        return res.status(500).json({ error: err });
      }
      res.json({ message: "Row updated" });
    }
  );
});

app.delete("/api/stocks/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM stocks WHERE id=?";

  db.query(sql, [id], (err, result) => {
    if (err) return res.status(500).json({ error: err });
    res.json({ message: "Row deleted" });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
