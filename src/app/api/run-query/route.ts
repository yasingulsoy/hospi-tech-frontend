import { NextRequest, NextResponse } from "next/server";
import * as xlsx from "xlsx";

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

    // localStorage'dan veritabanı bilgilerini al
    const databaseInfo = req.headers.get('x-database-info');
    if (!databaseInfo) {
      return NextResponse.json({ error: "Veritabanı bağlantısı bulunamadı. Lütfen önce veritabanını bağlayın." }, { status: 400 });
    }

    const dbInfo = JSON.parse(databaseInfo);
    let rows: any[] = [];

    // Veritabanı türüne göre sorgu çalıştır
    switch (dbInfo.type) {
      case "sqlite":
        const sqlite3 = require("sqlite3").verbose();
        const db = new sqlite3.Database(dbInfo.filePath || "./uploads/database.sqlite", sqlite3.OPEN_READONLY);
        rows = await new Promise((resolve, reject) => {
          db.all(sql, [], (err: any, rows: any[]) => {
            if (err) reject(err);
            else resolve(rows);
          });
          db.close();
        });
        break;

      case "postgresql":
        const { Client } = require("pg");
        const client = new Client({ connectionString: dbInfo.connectionString, ssl: false });
        await client.connect();
        const result = await client.query(sql);
        rows = result.rows;
        await client.end();
        break;

      case "mysql":
        const mysql = require("mysql2/promise");
        const conn = await mysql.createConnection(dbInfo.connectionString);
        const [results] = await conn.execute(sql);
        rows = results;
        await conn.end();
        break;

      case "mssql":
        const sqlMSSQL = require("mssql");
        const pool = await sqlMSSQL.connect(dbInfo.connectionString);
        const mssqlResult = await pool.request().query(sql);
        rows = mssqlResult.recordset;
        await pool.close();
        break;

      case "excel": {
        // Excel dosyasını uploads klasöründen oku
        const uploadsDir = process.cwd() + "/uploads/";
        const fileName = dbInfo.fileName || dbInfo.filePath || dbInfo.file || dbInfo.name;
        if (!fileName) {
          return NextResponse.json({ error: "Excel dosyası bulunamadı." }, { status: 400 });
        }
        const fs = require("fs");
        const path = require("path");
        const filePath = path.join(uploadsDir, fileName);
        if (!fs.existsSync(filePath)) {
          return NextResponse.json({ error: "Excel dosyası bulunamadı." }, { status: 400 });
        }
        const workbook = xlsx.readFile(filePath);
        // Tüm sheet'leri alasql'e yükle
        const sheets: Record<string, any[]> = {};
        for (const sheetName of workbook.SheetNames) {
          const json = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName], { defval: null });
          sheets[sheetName] = json;
        }
        // alasql ile sorguyu çalıştır
        try {
          // Dinamik import
          const alasql = (await import("alasql")).default;
          alasql("RESET DATABASE");
          for (const [sheetName, data] of Object.entries(sheets)) {
            alasql.tables[sheetName] = { data };
          }
          const result = alasql(sql);
          rows = Array.isArray(result) ? result : [result];
        } catch (err: any) {
          return NextResponse.json({ error: "Excel üzerinde sorgu çalıştırılırken hata: " + err.message }, { status: 400 });
        }
        break;
      }

      default:
        return NextResponse.json({ error: "Desteklenmeyen veritabanı türü." }, { status: 400 });
    }

    return NextResponse.json({ rows });
  } catch (e: any) {
    return NextResponse.json({ error: "Sorgu çalıştırılırken bir hata oluştu: " + (e.message || e.toString()) }, { status: 500 });
  }
} 