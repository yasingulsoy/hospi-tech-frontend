import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { Client } from 'pg';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import * as mssql from 'mssql';

export async function POST(request: NextRequest) {
  try {
    const { dbType, connectionString, connectionUrl, sqliteFile } = await request.json();

    let tables: any[] = [];

    switch (dbType) {
      case 'mysql':
        tables = await connectMySQL(connectionString);
        break;
      case 'postgresql':
        tables = await connectPostgreSQL(connectionString);
        break;
      case 'mssql':
        tables = await connectMSSQL(connectionString);
        break;
      case 'sqlite':
        tables = await connectSQLite(sqliteFile);
        break;
      default:
        return NextResponse.json({ error: 'Desteklenmeyen veritabanı türü' }, { status: 400 });
    }

    return NextResponse.json({ 
      success: true, 
      tables,
      message: `${tables.length} tablo başarıyla yüklendi`
    });

  } catch (error: any) {
    console.error('Veritabanı bağlantı hatası:', error);
    return NextResponse.json({ 
      error: 'Veritabanına bağlanılamadı: ' + error.message 
    }, { status: 500 });
  }
}

async function connectMySQL(connectionString: string) {
  const connection = await mysql.createConnection(connectionString);
  
  // Tabloları al
  const [tables] = await connection.execute(`
    SELECT TABLE_NAME as table_name 
    FROM INFORMATION_SCHEMA.TABLES 
    WHERE TABLE_SCHEMA = DATABASE()
  `);

  const result = [];
  
  for (const table of tables as any[]) {
    // Her tablo için sütunları al
    const [columns] = await connection.execute(`
      SELECT 
        COLUMN_NAME as column_name,
        DATA_TYPE as data_type,
        IS_NULLABLE as is_nullable,
        COLUMN_DEFAULT as column_default,
        COLUMN_COMMENT as column_comment
      FROM INFORMATION_SCHEMA.COLUMNS 
      WHERE TABLE_SCHEMA = DATABASE() 
      AND TABLE_NAME = ?
      ORDER BY ORDINAL_POSITION
    `, [table.table_name]);

    result.push({
      table: table.table_name,
      columns: columns
    });
  }

  await connection.end();
  return result;
}

async function connectPostgreSQL(connectionString: string) {
  const client = new Client({ connectionString });
  await client.connect();

  // Tabloları al
  const tablesResult = await client.query(`
    SELECT tablename as table_name 
    FROM pg_tables 
    WHERE schemaname = 'public'
  `);

  const result = [];

  for (const table of tablesResult.rows) {
    // Her tablo için sütunları al
    const columnsResult = await client.query(`
      SELECT 
        column_name,
        data_type,
        is_nullable,
        column_default,
        col_description((table_schema||'.'||table_name)::regclass, ordinal_position) as column_comment
      FROM information_schema.columns 
      WHERE table_schema = 'public' 
      AND table_name = $1
      ORDER BY ordinal_position
    `, [table.table_name]);

    result.push({
      table: table.table_name,
      columns: columnsResult.rows
    });
  }

  await client.end();
  return result;
}

async function connectMSSQL(connectionString: string) {
  const config = {
    server: connectionString.split('//')[1]?.split(':')[0] || 'localhost',
    database: connectionString.split('/').pop()?.split('?')[0] || '',
    user: connectionString.match(/User ID=([^;]+)/)?.[1] || '',
    password: connectionString.match(/Password=([^;]+)/)?.[1] || '',
    options: {
      encrypt: true,
      trustServerCertificate: true
    }
  };

  const pool = await mssql.connect(config);

  // Tabloları al
  const tablesResult = await pool.request().query(`
    SELECT TABLE_NAME as table_name 
    FROM INFORMATION_SCHEMA.TABLES 
    WHERE TABLE_TYPE = 'BASE TABLE'
  `);

  const result = [];

  for (const table of tablesResult.recordset) {
    // Her tablo için sütunları al
    const columnsResult = await pool.request()
      .input('tableName', mssql.VarChar, table.table_name)
      .query(`
        SELECT 
          COLUMN_NAME as column_name,
          DATA_TYPE as data_type,
          IS_NULLABLE as is_nullable,
          COLUMN_DEFAULT as column_default,
          '' as column_comment
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_NAME = @tableName
        ORDER BY ORDINAL_POSITION
      `);

    result.push({
      table: table.table_name,
      columns: columnsResult.recordset
    });
  }

  await pool.close();
  return result;
}

async function connectSQLite(filePath: string) {
  const db = await open({
    filename: filePath,
    driver: sqlite3.Database
  });

  // Tabloları al
  const tables = await db.all(`
    SELECT name as table_name 
    FROM sqlite_master 
    WHERE type='table'
  `);

  const result = [];

  for (const table of tables) {
    // Her tablo için sütunları al
    const columns = await db.all(`PRAGMA table_info(${table.table_name})`);
    
    const formattedColumns = columns.map((col: any) => ({
      column_name: col.name,
      data_type: col.type,
      is_nullable: col.notnull === 0 ? 'YES' : 'NO',
      column_default: col.dflt_value,
      column_comment: ''
    }));

    result.push({
      table: table.table_name,
      columns: formattedColumns
    });
  }

  await db.close();
  return result;
} 