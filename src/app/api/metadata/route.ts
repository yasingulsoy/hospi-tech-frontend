import { NextRequest, NextResponse } from 'next/server';
import { saveDescription, getDescriptions } from '../metadata-db';

export async function POST(req: NextRequest) {
  try {
    const { fileName, description } = await req.json();
    if (!fileName || !description) {
      return NextResponse.json({ error: 'fileName ve description zorunlu.' }, { status: 400 });
    }
    saveDescription(fileName, description);
    return NextResponse.json({ success: true });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || e.toString() }, { status: 500 });
  }
}

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const fileName = searchParams.get('fileName');
    if (!fileName) {
      return NextResponse.json({ error: 'fileName parametresi zorunlu.' }, { status: 400 });
    }
    const descriptions = getDescriptions(fileName);
    return NextResponse.json({ descriptions });
  } catch (e: any) {
    return NextResponse.json({ error: e.message || e.toString() }, { status: 500 });
  }
} 