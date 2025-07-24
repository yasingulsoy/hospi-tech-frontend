import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import * as XLSX from 'xlsx';
import { saveDescription } from '../metadata-db';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    if (!file) {
      return NextResponse.json({ error: 'Dosya zorunlu.' }, { status: 400 });
    }
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const uploadsDir = path.join(process.cwd(), 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });
    const filePath = path.join(uploadsDir, file.name);
    await fs.writeFile(filePath, buffer);

    // Eğer dosya .xlsx ise açıklamaları oku ve kaydet
    if (file.name.endsWith('.xlsx')) {
      const workbook = XLSX.read(buffer, { type: 'buffer' });
      const sheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[sheetName];
      const rows = XLSX.utils.sheet_to_json(worksheet, { header: 1 });
      // İlk satır açıklamalar, ikinci satır kolon isimleri varsayımı
      if (rows.length >= 2) {
        const descRow = rows[0] as any[];
        const colRow = rows[1] as any[];
        for (let i = 0; i < colRow.length; i++) {
          const column = colRow[i];
          const desc = descRow[i] || '';
          if (column && desc) {
            saveDescription(`${file.name}:${column}`, desc);
          }
        }
      }
    }

    return NextResponse.json({ success: true, fileName: file.name });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || e.toString() }, { status: 500 });
  }
} 