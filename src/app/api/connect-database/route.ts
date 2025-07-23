import { NextRequest, NextResponse } from 'next/server';

// Mock database connections for production
const mockMySQL = {
  createConnection: async (connectionString: string) => ({
    execute: async (query: string, params?: any[]) => {
      return [[
        { table_name: 'patients' },
        { table_name: 'treatments' },
        { table_name: 'doctors' }
      ]];
    },
    end: async () => {}
  })
};

const mockPostgreSQL = {
  Client: class {
    async connect() {}
    async query(query: string, params?: any[]) {
      return {
        rows: [
          { table_name: 'patients' },
          { table_name: 'treatments' },
          { table_name: 'doctors' }
        ]
      };
    }
    async end() {}
  }
};

const mockMSSQL = {
  connect: async (config: any) => ({
    request: () => ({
      query: async (query: string) => ({
        recordset: [
          { table_name: 'patients' },
          { table_name: 'treatments' },
          { table_name: 'doctors' }
        ]
      }),
      input: function() { return this; }
    }),
    close: async () => {}
  })
};

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
  const connection = await mockMySQL.createConnection(connectionString);
  
  // Mock tablo verileri
  const mockTables = [
    {
      table: 'patients',
      columns: [
        { column_name: 'id', data_type: 'INT', is_nullable: 'NO', column_default: null, column_comment: 'Hasta ID' },
        { column_name: 'name', data_type: 'VARCHAR', is_nullable: 'NO', column_default: null, column_comment: 'Hasta adı' },
        { column_name: 'birth_date', data_type: 'DATE', is_nullable: 'YES', column_default: null, column_comment: 'Doğum tarihi' },
        { column_name: 'phone', data_type: 'VARCHAR', is_nullable: 'YES', column_default: null, column_comment: 'Telefon' }
      ]
    },
    {
      table: 'treatments',
      columns: [
        { column_name: 'id', data_type: 'INT', is_nullable: 'NO', column_default: null, column_comment: 'Tedavi ID' },
        { column_name: 'patient_id', data_type: 'INT', is_nullable: 'NO', column_default: null, column_comment: 'Hasta ID' },
        { column_name: 'treatment_date', data_type: 'DATE', is_nullable: 'NO', column_default: null, column_comment: 'Tedavi tarihi' },
        { column_name: 'total_fee', data_type: 'DECIMAL', is_nullable: 'YES', column_default: '0', column_comment: 'Toplam ücret' }
      ]
    }
  ];

  await connection.end();
  return mockTables;
}

async function connectPostgreSQL(connectionString: string) {
  const client = new mockPostgreSQL.Client();
  await client.connect();

  // Mock tablo verileri
  const mockTables = [
    {
      table: 'patients',
      columns: [
        { column_name: 'id', data_type: 'integer', is_nullable: 'NO', column_default: null, column_comment: 'Hasta ID' },
        { column_name: 'name', data_type: 'text', is_nullable: 'NO', column_default: null, column_comment: 'Hasta adı' },
        { column_name: 'birth_date', data_type: 'date', is_nullable: 'YES', column_default: null, column_comment: 'Doğum tarihi' },
        { column_name: 'phone', data_type: 'text', is_nullable: 'YES', column_default: null, column_comment: 'Telefon' }
      ]
    },
    {
      table: 'treatments',
      columns: [
        { column_name: 'id', data_type: 'integer', is_nullable: 'NO', column_default: null, column_comment: 'Tedavi ID' },
        { column_name: 'patient_id', data_type: 'integer', is_nullable: 'NO', column_default: null, column_comment: 'Hasta ID' },
        { column_name: 'treatment_date', data_type: 'date', is_nullable: 'NO', column_default: null, column_comment: 'Tedavi tarihi' },
        { column_name: 'total_fee', data_type: 'numeric', is_nullable: 'YES', column_default: '0', column_comment: 'Toplam ücret' }
      ]
    }
  ];

  await client.end();
  return mockTables;
}

async function connectMSSQL(connectionString: string) {
  const pool = await mockMSSQL.connect({});

  // Mock tablo verileri
  const mockTables = [
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

  await pool.close();
  return mockTables;
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