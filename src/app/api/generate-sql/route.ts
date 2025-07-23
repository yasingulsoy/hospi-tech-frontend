import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const apiKey = process.env.OPENAI_API_KEY;

export async function POST(req: NextRequest) {
  if (!apiKey) {
    return NextResponse.json({ error: "OpenAI API anahtarı bulunamadı. Lütfen .env dosyanızı kontrol edin." }, { status: 500 });
  }
  try {
    const { aciklama, tabloYapisi } = await req.json();
    if (!aciklama || !tabloYapisi) {
      return NextResponse.json({ error: "Açıklama ve tablo yapısı zorunludur." }, { status: 400 });
    }
    const systemPrompt = `Sen bir SQL uzmanısın. Kullanıcıdan gelen açıklama ve aşağıdaki tablo/sütun açıklamalarına göre SADECE SELECT sorgusu üret. DELETE, UPDATE, INSERT, DROP, ALTER gibi sorgular kesinlikle üretme. Sorgu çıktısı sadece SQL kodu olsun, açıklama veya başka bir şey ekleme.\n\nTablo ve sütun açıklamaları:\n${tabloYapisi}\n\nKullanıcı açıklaması:\n${aciklama}`;
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: aciklama }
      ],
      max_tokens: 512,
      temperature: 0.1,
    });
    const sql = completion.choices[0].message?.content?.trim() || "";
    if (!sql.toLowerCase().startsWith("select")) {
      return NextResponse.json({ error: "Sadece SELECT sorgusu üretildiğinden emin olunamadı. Lütfen tekrar deneyin." }, { status: 400 });
    }
    return NextResponse.json({ sql });
  } catch (e: any) {
    return NextResponse.json({ error: "GPT-4 ile SQL üretimi sırasında bir hata oluştu: " + (e.message || e.toString()) }, { status: 500 });
  }
} 