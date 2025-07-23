import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { join } from 'path';
import sqlite3 from 'sqlite3';
import { open } from 'sqlite';
import mysql from 'mysql2/promise';
import { Client } from 'pg';

// Veritabanı bağlantıları için gerçek implementasyon
export async function POST(request: NextRequest) {
  try {
    let dbType: string;
    let connectionString: string | undefined;
    let sqliteFile: File | undefined;
    
    // Content-Type'a göre request'i parse et
    const contentType = request.headers.get('content-type');
    
    if (contentType?.includes('application/json')) {
      // JSON request
      const body = await request.json();
      dbType = body.dbType;
      connectionString = body.connectionString;
    } else {
      // FormData request (SQLite için)
      const formData = await request.formData();
      dbType = formData.get('dbType') as string;
      connectionString = formData.get('connectionString') as string;
      sqliteFile = formData.get('sqliteFile') as File;
    }
    
    let tables: any[] = [];

    switch (dbType) {
      case 'sqlite':
        if (!sqliteFile) {
          return NextResponse.json({ error: 'SQLite dosyası seçilmedi' }, { status: 400 });
        }
        tables = await connectSQLite(sqliteFile);
        break;
        
      case 'postgresql':
      case 'mysql':
      case 'mssql':
        if (!connectionString) {
          return NextResponse.json({ error: 'Bağlantı dizesi girilmedi' }, { status: 400 });
        }
        
        switch (dbType) {
          case 'postgresql':
            tables = await connectPostgreSQL(connectionString);
            break;
          case 'mysql':
            tables = await connectMySQL(connectionString);
            break;
          case 'mssql':
            tables = await connectMSSQL(connectionString);
            break;
        }
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

async function connectSQLite(file: File) {
  try {
    // Uploads klasörünü oluştur
    const uploadsDir = join(process.cwd(), 'uploads');
    await mkdir(uploadsDir, { recursive: true });
    
    // Dosyayı kaydet
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    const filePath = join(uploadsDir, file.name);
    await writeFile(filePath, buffer);
    
    // SQLite veritabanını aç
    const db = await open({
      filename: filePath,
      driver: sqlite3.Database
    });
    
    // Tabloları al
    const tableNames = await db.all("SELECT name FROM sqlite_master WHERE type='table'");
    
    const tables = [];
    for (const table of tableNames) {
      const columns = await db.all(`PRAGMA table_info(${table.name})`);
      tables.push({
        table: table.name,
        columns: columns.map((col: any) => ({
          column_name: col.name,
          data_type: col.type,
          is_nullable: col.notnull ? 'NO' : 'YES',
          column_default: col.dflt_value,
          column_comment: ''
        }))
      });
    }
    
    await db.close();
    return tables;
    
  } catch (error: any) {
    throw new Error(`SQLite bağlantı hatası: ${error.message}`);
  }
}

async function connectMySQL(connectionString: string) {
  try {
    const connection = await mysql.createConnection(connectionString);
    
    // Tabloları al
    const [tables] = await connection.execute(`
      SELECT TABLE_NAME 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE()
    `);
    
    const result = [];
    for (const table of tables as any[]) {
      const [columns] = await connection.execute(`
        SELECT 
          COLUMN_NAME,
          DATA_TYPE,
          IS_NULLABLE,
          COLUMN_DEFAULT,
          COLUMN_COMMENT
        FROM INFORMATION_SCHEMA.COLUMNS 
        WHERE TABLE_SCHEMA = DATABASE() 
        AND TABLE_NAME = ?
        ORDER BY ORDINAL_POSITION
      `, [table.TABLE_NAME]);
      
      const columnList = [];
      for (const col of columns as any[]) {
        columnList.push({
          column_name: col.COLUMN_NAME,
          data_type: col.DATA_TYPE,
          is_nullable: col.IS_NULLABLE,
          column_default: col.COLUMN_DEFAULT,
          column_comment: col.COLUMN_COMMENT
        });
      }
      
      result.push({
        table: table.TABLE_NAME,
        columns: columnList
      });
    }
    
    await connection.end();
    return result;
    
  } catch (error: any) {
    throw new Error(`MySQL bağlantı hatası: ${error.message}`);
  }
}

async function connectPostgreSQL(connectionString: string) {
  try {
    const client = new Client({ connectionString });
    await client.connect();
    
    // Tabloları al
    const tablesResult = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    const result = [];
    for (const table of tablesResult.rows) {
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
        columns: columnsResult.rows.map((col: any) => ({
          column_name: col.column_name,
          data_type: col.data_type,
          is_nullable: col.is_nullable,
          column_default: col.column_default,
          column_comment: col.column_comment || ''
        }))
      });
    }
    
    await client.end();
    return result;
    
  } catch (error: any) {
    throw new Error(`PostgreSQL bağlantı hatası: ${error.message}`);
  }
}

async function connectMSSQL(connectionString: string) {
  // MSSQL için şimdilik mock veri döndür
  return [
    {
      table: 'patients',
      columns: [
        { column_name: 'id', data_type: 'int', is_nullable: 'NO', column_default: null, column_comment: 'Hasta ID' },
        { column_name: 'name', data_type: 'varchar', is_nullable: 'NO', column_default: null, column_comment: 'Hasta adı' },
        { column_name: 'birth_date', data_type: 'date', is_nullable: 'YES', column_default: null, column_comment: 'Doğum tarihi' },
        { column_name: 'phone', data_type: 'varchar', is_nullable: 'YES', column_default: null, column_comment: 'Telefon' }
      ]
    },
    {
      table: 'treatments',
      columns: [
        { column_name: 'id', data_type: 'int', is_nullable: 'NO', column_default: null, column_comment: 'Tedavi ID' },
        { column_name: 'patient_id', data_type: 'int', is_nullable: 'NO', column_default: null, column_comment: 'Hasta ID' },
        { column_name: 'treatment_date', data_type: 'date', is_nullable: 'NO', column_default: null, column_comment: 'Tedavi tarihi' },
        { column_name: 'total_fee', data_type: 'decimal', is_nullable: 'YES', column_default: '0', column_comment: 'Toplam ücret' }
      ]
    }
  ];
} 