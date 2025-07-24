import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

export async function GET() {
  try {
    const uploadsDir = path.join(process.cwd(), 'uploads');
    await fs.mkdir(uploadsDir, { recursive: true });
    const files = await fs.readdir(uploadsDir);
    return NextResponse.json({ files });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || e.toString() }, { status: 500 });
  }
} 