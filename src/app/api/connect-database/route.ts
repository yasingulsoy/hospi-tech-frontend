import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { Client } from 'pg';
import * as mssql from 'mssql';

// SQLite için basit bir mock implementasyon
const mockSQLite = {
  open: async (config: any) => ({
    all: async (query: string) => {
      // Mock veri döndür
      return [
        { name: 'patients' },
        { name: 'treatments' },
        { name: 'doctors' }
      ];
    },
    close: async () => {}
  })
};

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
  // Mock SQLite implementasyonu
  const db = await mockSQLite.open({ filename: filePath });

  // Mock tablo verileri
  const mockTables = [
    {
      table: 'patients',
      columns: [
        { column_name: 'id', data_type: 'INTEGER', is_nullable: 'NO', column_default: null, column_comment: 'Hasta ID' },
        { column_name: 'name', data_type: 'TEXT', is_nullable: 'NO', column_default: null, column_comment: 'Hasta adı' },
        { column_name: 'birth_date', data_type: 'DATE', is_nullable: 'YES', column_default: null, column_comment: 'Doğum tarihi' },
        { column_name: 'phone', data_type: 'TEXT', is_nullable: 'YES', column_default: null, column_comment: 'Telefon' }
      ]
    },
    {
      table: 'treatments',
      columns: [
        { column_name: 'id', data_type: 'INTEGER', is_nullable: 'NO', column_default: null, column_comment: 'Tedavi ID' },
        { column_name: 'patient_id', data_type: 'INTEGER', is_nullable: 'NO', column_default: null, column_comment: 'Hasta ID' },
        { column_name: 'treatment_date', data_type: 'DATE', is_nullable: 'NO', column_default: null, column_comment: 'Tedavi tarihi' },
        { column_name: 'total_fee', data_type: 'DECIMAL', is_nullable: 'YES', column_default: '0', column_comment: 'Toplam ücret' }
      ]
    },
    {
      table: 'doctors',
      columns: [
        { column_name: 'id', data_type: 'INTEGER', is_nullable: 'NO', column_default: null, column_comment: 'Doktor ID' },
        { column_name: 'name', data_type: 'TEXT', is_nullable: 'NO', column_default: null, column_comment: 'Doktor adı' },
        { column_name: 'specialty', data_type: 'TEXT', is_nullable: 'YES', column_default: null, column_comment: 'Uzmanlık' }
      ]
    }
  ];

  await db.close();
  return mockTables;
} 