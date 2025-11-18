import os
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import mysql.connector

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def get_db():
    return mysql.connector.connect(
        host=os.environ.get("MYSQLHOST", "localhost"),
        user=os.environ.get("MYSQLUSER", "root"),
        password=os.environ.get("MYSQLPASSWORD", ""),
        database=os.environ.get("MYSQLDATABASE", "stock_market"),
        port=int(os.environ.get("MYSQLPORT", 3306)),
    )

class Stock(BaseModel):
    date: str
    trade_code: str
    open: float
    high: float
    low: float
    close: float
    volume: float

@app.get("/")
def root():
    return "Backend is running"

@app.get("/api/stocks")
def get_stocks():
    try:
        db = get_db()
        cursor = db.cursor(dictionary=True)
        cursor.execute("SELECT * FROM stocks ORDER BY date ASC, id ASC")
        rows = cursor.fetchall()
        cursor.close()
        db.close()
        return rows
    except:
        raise HTTPException(status_code=500, detail="Database error")

@app.post("/api/stocks")
def create_stock(stock: Stock):
    try:
        db = get_db()
        cursor = db.cursor()
        sql = """INSERT INTO stocks (date, trade_code, open, high, low, close, volume)
                 VALUES (%s, %s, %s, %s, %s, %s, %s)"""
        cursor.execute(sql, (
            stock.date,
            stock.trade_code,
            stock.open,
            stock.high,
            stock.low,
            stock.close,
            stock.volume,
        ))
        db.commit()
        new_id = cursor.lastrowid
        cursor.close()
        db.close()
        return {"message": "Row added", "id": new_id}
    except:
        raise HTTPException(status_code=500, detail="Database error")

@app.put("/api/stocks/{id}")
def update_stock(id: int, stock: Stock):
    try:
        db = get_db()
        cursor = db.cursor()
        sql = """UPDATE stocks SET date=%s, trade_code=%s, open=%s, high=%s,
                 low=%s, close=%s, volume=%s WHERE id=%s"""
        cursor.execute(sql, (
            stock.date,
            stock.trade_code,
            stock.open,
            stock.high,
            stock.low,
            stock.close,
            stock.volume,
            id,
        ))
        db.commit()
        cursor.close()
        db.close()
        return {"message": "Row updated"}
    except:
        raise HTTPException(status_code=500, detail="Database error")

@app.delete("/api/stocks/{id}")
def delete_stock(id: int):
    try:
        db = get_db()
        cursor = db.cursor()
        cursor.execute("DELETE FROM stocks WHERE id=%s", (id,))
        db.commit()
        cursor.close()
        db.close()
        return {"message": "Row deleted"}
    except:
        raise HTTPException(status_code=500, detail="Database error")
