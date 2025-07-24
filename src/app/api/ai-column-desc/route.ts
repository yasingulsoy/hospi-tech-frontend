import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

export async function POST(req: NextRequest) {
  if (!apiKey) {
    return NextResponse.json({ error: "OpenAI API anahtarı bulunamadı." }, { status: 500 });
  }
  try {
    const { table, column, type } = await req.json();
    if (!column) {
      return NextResponse.json({ error: "Sütun adı zorunlu." }, { status: 400 });
    }
    const prompt = `Bir veritabanı tablosunda '${column}' isminde bir sütun var. Veri tipi: ${type}. Türkçe, kısa ve açıklayıcı bir şekilde bu sütunun neyi temsil ettiğini yaz. Sadece açıklama yaz, başka bir şey ekleme.`;
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: prompt }
      ],
      max_tokens: 50,
      temperature: 0.2,
    });
    const desc = completion.choices[0].message?.content?.trim() || "";
    return NextResponse.json({ desc });
  } catch (e: any) {
    return NextResponse.json({ error: "Açıklama üretilemedi: " + (e.message || e.toString()) }, { status: 500 });
  }
} 