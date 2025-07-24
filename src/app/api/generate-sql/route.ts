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
    const systemPrompt = `
Sen bir SQL uzmanısın.
Kullanıcıdan gelen açıklama ve aşağıdaki tablo/sütun açıklamalarına göre SADECE ve SADECE SELECT ile başlayan bir SQL sorgusu üret.
DELETE, UPDATE, INSERT, DROP, ALTER gibi sorgular kesinlikle üretme.
Çıktı SADECE SQL kodu olsun, açıklama veya başka bir şey ekleme.
Yanıtın sadece tek satırda ve SELECT ile başlasın.
Tablo ve sütun açıklamaları:
${tabloYapisi}

Kullanıcı açıklaması:
${aciklama}
`;
    const openai = new OpenAI({ apiKey });
    const completion = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: aciklama }
      ],
      max_tokens: 512,
      temperature: 0.1,
    });
    const sql = completion.choices[0].message?.content?.trim() || "";
    console.log("OpenAI yanıtı:", sql);
    if (!sql.toLowerCase().startsWith("select")) {
      return NextResponse.json({ error: "Sadece SELECT sorgusu üretildiğinden emin olunamadı. Lütfen tekrar deneyin." }, { status: 400 });
    }
    return NextResponse.json({ sql });
  } catch (e: any) {
    return NextResponse.json({ error: "GPT-4 ile SQL üretimi sırasında bir hata oluştu: " + (e.message || e.toString()) }, { status: 500 });
  }
} 