import { NextRequest, NextResponse } from "next/server";

const dbType = process.env.DB_TYPE || "sqlite";
const sqlitePath = process.env.SQLITE_PATH || "./veritabani.sqlite";
const pgUrl = process.env.POSTGRES_URL;
const mysqlUrl = process.env.MYSQL_URL;
const mssqlUrl = process.env.MSSQL_URL;

export async function POST(req: NextRequest) {
  try {
    const { sql } = await req.json();
    if (!sql || typeof sql !== "string") {
      return NextResponse.json({ error: "SQL sorgusu zorunludur." }, { status: 400 });
    }
    if (!sql.trim().toLowerCase().startsWith("select")) {
      return NextResponse.json({ error: "Sadece SELECT sorguları çalıştırılabilir." }, { status: 400 });
    }
    let rows: any[] = [];
    if (dbType === "sqlite") {
      const sqlite3 = require("sqlite3").verbose();
      const db = new sqlite3.Database(sqlitePath, sqlite3.OPEN_READONLY);
      rows = await new Promise((resolve, reject) => {
        db.all(sql, [], (err: any, rows: any[]) => {
          if (err) reject(err);
          else resolve(rows);
        });
        db.close();
      });
    } else if (dbType === "postgresql") {
      const { Client } = require("pg");
      const client = new Client({ connectionString: pgUrl, ssl: false });
      await client.connect();
      const result = await client.query(sql);
      rows = result.rows;
      await client.end();
    } else if (dbType === "mysql") {
      const mysql = require("mysql2/promise");
      const conn = await mysql.createConnection(mysqlUrl);
      const [results] = await conn.execute(sql);
      rows = results;
      await conn.end();
    } else if (dbType === "mssql") {
      const sqlMSSQL = require("mssql");
      const pool = await sqlMSSQL.connect(mssqlUrl);
      const result = await pool.request().query(sql);
      rows = result.recordset;
      await pool.close();
    } else {
      return NextResponse.json({ error: "Desteklenmeyen veritabanı türü." }, { status: 400 });
    }
    return NextResponse.json({ rows });
  } catch (e: any) {
    return NextResponse.json({ error: "Sorgu çalıştırılırken bir hata oluştu: " + (e.message || e.toString()) }, { status: 500 });
  }
} 