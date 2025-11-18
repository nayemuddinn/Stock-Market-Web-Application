const express = require("express");
const mysql = require("mysql2");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
  host: process.env.DB_HOST || "localhost",
  user: process.env.DB_USER || "root",
  password: process.env.DB_PASSWORD || "",
  database: process.env.DB_NAME || "stock_market",
  port: process.env.DB_PORT || 3306,
});

db.connect((err) => {
  if (err) {
    console.error("Error connecting to MySQL:", err);
  } else {
    console.log("Connected to MySQL database");
  }
});

app.get("/", (req, res) => {
  res.send("API is running");
});

app.get("/api/stocks", (req, res) => {
  const sql = "SELECT * FROM stocks ORDER BY date ASC, id ASC";
  db.query(sql, (err, rows) => {
    if (err) {
      console.error("Error fetching stocks:", err);
      return res.status(500).json({ error: "Failed to fetch stocks" });
    }
    res.json(rows);
  });
});

app.post("/api/stocks", (req, res) => {
  const { date, trade_code, open, high, low, close, volume } = req.body;

  if (!date || !trade_code) {
    return res.status(400).json({ error: "date and trade_code are required" });
  }

  const sql =
    "INSERT INTO stocks (date, trade_code, open, high, low, close, volume) VALUES (?, ?, ?, ?, ?, ?, ?)";
  const values = [date, trade_code, open, high, low, close, volume];

  db.query(sql, values, (err, result) => {
    if (err) {
      console.error("Error inserting stock:", err);
      return res.status(500).json({ error: "Failed to insert stock" });
    }

    const insertedId = result.insertId;
    db.query("SELECT * FROM stocks WHERE id = ?", [insertedId], (err2, rows) => {
      if (err2) {
        console.error("Error fetching inserted stock:", err2);
        return res
          .status(500)
          .json({ error: "Inserted but failed to fetch row" });
      }
      res.status(201).json(rows[0]);
    });
  });
});

app.put("/api/stocks/:id", (req, res) => {
  const { id } = req.params;
  const { date, trade_code, open, high, low, close, volume } = req.body;

  if (!date || !trade_code) {
    return res.status(400).json({ error: "date and trade_code are required" });
  }

  const sql =
    "UPDATE stocks SET date = ?, trade_code = ?, open = ?, high = ?, low = ?, close = ?, volume = ? WHERE id = ?";
  const values = [date, trade_code, open, high, low, close, volume, id];

  db.query(sql, values, (err) => {
    if (err) {
      console.error("Error updating stock:", err);
      return res.status(500).json({ error: "Failed to update stock" });
    }

    db.query("SELECT * FROM stocks WHERE id = ?", [id], (err2, rows) => {
      if (err2) {
        console.error("Error fetching updated stock:", err2);
        return res
          .status(500)
          .json({ error: "Updated but failed to fetch row" });
      }
      res.json(rows[0]);
    });
  });
});

app.delete("/api/stocks/:id", (req, res) => {
  const { id } = req.params;

  const sql = "DELETE FROM stocks WHERE id = ?";

  db.query(sql, [id], (err) => {
    if (err) {
      console.error("Error deleting stock:", err);
      return res.status(500).json({ error: "Failed to delete stock" });
    }
    res.json({ message: "Row deleted" });
  });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
