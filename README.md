# HospiTech - Yapay Zekâ Destekli Veritabanı Raporlama Platformu

## Kurulum ve Çalıştırma

1. **Gereksinimler:**
   - Node.js 18+
   - npm 9+

2. **Bağımlılıkları Kurun:**
   ```bash
   npm install
   ```

3. **Ortam Değişkenlerini Ayarlayın:**
   Proje kök dizinine `.env` dosyası oluşturun ve aşağıdaki örneğe göre doldurun:
   ```env
   OPENAI_API_KEY=buraya_anahtarınızı_yazın
   DB_TYPE=sqlite # veya postgresql, mysql, mssql
   SQLITE_PATH=./veritabani.sqlite
   POSTGRES_URL=postgres://kullanici:sifre@localhost:5432/veritabani
   MYSQL_URL=mysql://kullanici:sifre@localhost:3306/veritabani
   MSSQL_URL=mssql://kullanici:sifre@localhost:1433;database=veritabani
   ```

4. **Projeyi Başlatın:**
   ```bash
   npm run dev
   ```
   Ardından tarayıcıda [http://localhost:3000](http://localhost:3000) adresine gidin.

## Özellikler
- Herhangi bir SQLite, PostgreSQL, MySQL veya MSSQL veritabanına bağlanma
- Tüm tablo ve sütunları otomatik listeleme
- Sütunlara Türkçe açıklama ekleme
- Doğal dilde (Türkçe) sorgu yazma ve GPT-4 ile güvenli SQL üretimi
- Sadece SELECT sorguları desteklenir, DELETE/UPDATE/INSERT engellenir
- Sonuçları tablo ve grafik olarak görme
- Excel (.xlsx) ve PDF çıktısı alma (grafik dahil)
- Geçmiş raporlar, favoriler, zamanlanmış raporlar
- Kullanıcı seviyeleri (admin, izleyici)
- Tüm arayüz ve hata/bilgi mesajları Türkçe

## Notlar
- OpenAI API anahtarınızı almak için: https://platform.openai.com/api-keys
- Veritabanı bağlantı bilgilerinizi doğru girdiğinizden emin olun.
- Herhangi bir hata veya öneriniz olursa lütfen iletin.
