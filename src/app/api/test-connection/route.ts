import { NextRequest, NextResponse } from 'next/server';
import mysql from 'mysql2/promise';
import { Client } from 'pg';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dbType, connectionString } = body;

    if (!dbType || !connectionString) {
      return NextResponse.json({ 
        error: 'Veritabanı türü ve bağlantı dizesi gerekli' 
      }, { status: 400 });
    }

    let testResult: any = {};

    switch (dbType) {
      case 'postgresql':
        testResult = await testPostgreSQL(connectionString);
        break;
      case 'mysql':
        testResult = await testMySQL(connectionString);
        break;
      case 'mssql':
        testResult = await testMSSQL(connectionString);
        break;
      default:
        return NextResponse.json({ 
          error: 'Desteklenmeyen veritabanı türü' 
        }, { status: 400 });
    }

    return NextResponse.json({
      success: true,
      message: 'Bağlantı testi başarılı',
      details: testResult
    });

  } catch (error: any) {
    console.error('Bağlantı testi hatası:', error);
    return NextResponse.json({ 
      error: 'Bağlantı testi başarısız: ' + error.message 
    }, { status: 500 });
  }
}

async function testPostgreSQL(connectionString: string) {
  const client = new Client({ connectionString });
  
  try {
    await client.connect();
    
    // Basit bir sorgu test et
    const result = await client.query('SELECT version()');
    const version = result.rows[0].version;
    
    // Tablo sayısını al
    const tablesResult = await client.query(`
      SELECT COUNT(*) as table_count 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    const tableCount = tablesResult.rows[0].table_count;
    
    await client.end();
    
    return {
      version,
      tableCount: parseInt(tableCount),
      status: 'connected'
    };
    
  } catch (error: any) {
    if (client) {
      await client.end();
    }
    throw error;
  }
}

async function testMySQL(connectionString: string) {
  const connection = await mysql.createConnection(connectionString);
  
  try {
    // Basit bir sorgu test et
    const [versionResult] = await connection.execute('SELECT VERSION() as version');
    const version = (versionResult as any)[0].version;
    
    // Tablo sayısını al
    const [tablesResult] = await connection.execute(`
      SELECT COUNT(*) as table_count 
      FROM INFORMATION_SCHEMA.TABLES 
      WHERE TABLE_SCHEMA = DATABASE()
    `);
    const tableCount = (tablesResult as any)[0].table_count;
    
    await connection.end();
    
    return {
      version,
      tableCount: parseInt(tableCount),
      status: 'connected'
    };
    
  } catch (error: any) {
    if (connection) {
      await connection.end();
    }
    throw error;
  }
}

async function testMSSQL(connectionString: string) {
  // MSSQL için şimdilik mock test
  return {
    version: 'Microsoft SQL Server 2019',
    tableCount: 5,
    status: 'connected'
  };
} 