import { NextRequest, NextResponse } from 'next/server';

// Global bağlantı havuzu (gerçek uygulamada Redis veya başka bir çözüm kullanılır)
const connectionPool = new Map();

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { dbType, connectionString } = body;

    if (!dbType || !connectionString) {
      return NextResponse.json({ 
        error: 'Veritabanı türü ve bağlantı dizesi gerekli' 
      }, { status: 400 });
    }

    // Bağlantı anahtarını oluştur
    const connectionKey = `${dbType}:${connectionString}`;
    
    // Bağlantıyı havuzdan kaldır
    if (connectionPool.has(connectionKey)) {
      const connection = connectionPool.get(connectionKey);
      
      try {
        // Bağlantıyı güvenli şekilde kapat
        if (connection && typeof connection.end === 'function') {
          await connection.end();
        } else if (connection && typeof connection.close === 'function') {
          await connection.close();
        }
      } catch (closeError) {
        console.warn('Bağlantı kapatma hatası:', closeError);
      }
      
      connectionPool.delete(connectionKey);
    }

    return NextResponse.json({ 
      success: true, 
      message: 'Bağlantı başarıyla kesildi' 
    });

  } catch (error: any) {
    console.error('Bağlantı kesme hatası:', error);
    return NextResponse.json({ 
      error: 'Bağlantı kesilirken hata oluştu: ' + error.message 
    }, { status: 500 });
  }
} 