# HospiTech - AI Destekli Veritabanı Raporlama Platformu

HospiTech, GPT-4 teknolojisi ile güçlendirilmiş, modern ve kullanıcı dostu bir veritabanı raporlama platformudur. Doğal dil sorguları, otomatik grafik oluşturma ve canlı veritabanı bağlantı yönetimi özellikleriyle profesyonel analiz deneyimi sunar.

## 🚀 Özellikler

### 🔗 Veritabanı Bağlantıları
- **Çoklu Veritabanı Desteği**: PostgreSQL, MySQL, MSSQL, SQLite
- **Canlı Bağlantı Yönetimi**: Bağlantıları açma/kapama, durum takibi
- **Bağlantı Testi**: Gerçek zamanlı bağlantı testi ve performans ölçümü
- **Otomatik Yeniden Bağlanma**: Bağlantı kopması durumunda otomatik yeniden bağlanma
- **Bağlantı Geçmişi**: Bağlantı aktivitelerinin detaylı geçmişi
- **Performans Metrikleri**: Yanıt süresi ve ping bilgileri

### 🤖 AI Destekli Sorgular
- **Doğal Dil Sorguları**: Türkçe açıklamalarla SQL sorguları oluşturma
- **GPT-4 Entegrasyonu**: Gelişmiş AI modeli ile akıllı sorgu üretimi
- **Sorgu Geçmişi**: Önceki sorguların kaydedilmesi ve tekrar kullanımı
- **Sorgu Optimizasyonu**: AI destekli sorgu performans iyileştirmeleri

### 📊 Akıllı Raporlama
- **Otomatik Grafik Oluşturma**: Veri tipine uygun grafik seçimi
- **Çoklu Grafik Türü**: Çizgi, sütun, pasta, halka grafikleri
- **Rapor Yönetimi**: Raporları kaydetme, düzenleme, paylaşma
- **Favori Raporlar**: Sık kullanılan raporları favorilere ekleme
- **Rapor Dışa Aktarma**: PDF, Excel, CSV formatlarında dışa aktarma

### 🎨 Modern Kullanıcı Arayüzü
- **Responsive Tasarım**: Mobil ve masaüstü uyumlu arayüz
- **Dark/Light Mode**: Kullanıcı tercihine göre tema seçimi
- **Bildirim Sistemi**: Gerçek zamanlı bildirimler ve uyarılar
- **Dashboard Widget'ları**: Sistem durumu ve performans göstergeleri
- **Animasyonlar**: Akıcı geçişler ve etkileşimler

### 🔒 Güvenlik ve Performans
- **Bağlantı Şifreleme**: Hassas bilgilerin güvenli saklanması
- **Performans İzleme**: Bağlantı performansının sürekli takibi
- **Hata Yönetimi**: Kapsamlı hata yakalama ve kullanıcı bildirimleri
- **Veri Doğrulama**: Giriş verilerinin güvenlik kontrolü

## 🛠️ Teknolojiler

### Frontend
- **Next.js 14**: React tabanlı full-stack framework
- **TypeScript**: Tip güvenliği ve geliştirici deneyimi
- **Tailwind CSS**: Utility-first CSS framework
- **Heroicons**: Modern ikon kütüphanesi
- **Chart.js**: İnteraktif grafik kütüphanesi

### Backend
- **Node.js**: Server-side JavaScript runtime
- **PostgreSQL**: İlişkisel veritabanı
- **MySQL**: Açık kaynak veritabanı
- **MSSQL**: Microsoft SQL Server
- **SQLite**: Hafif dosya tabanlı veritabanı

### AI ve Entegrasyon
- **OpenAI GPT-4**: Doğal dil işleme
- **RESTful API**: Modern API tasarımı
- **WebSocket**: Gerçek zamanlı iletişim

## 📦 Kurulum

### Gereksinimler
- Node.js 18+ 
- npm veya yarn
- Git

### Adımlar

1. **Projeyi klonlayın**
```bash
git clone https://github.com/your-username/hospitech.git
cd hospitech/hospi-tech-frontend
```

2. **Bağımlılıkları yükleyin**
```bash
npm install
```

3. **Ortam değişkenlerini ayarlayın**
```bash
cp .env.example .env.local
```

`.env.local` dosyasını düzenleyin:
```env
OPENAI_API_KEY=your_openai_api_key_here
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

4. **Uygulamayı başlatın**
```bash
npm run dev
```

5. **Tarayıcıda açın**
```
http://localhost:3000
```

## 🚀 Kullanım

### İlk Kurulum
1. **Giriş Yapın**: Demo hesabı ile giriş yapın
2. **Veritabanı Bağlayın**: Bağlantı Yöneticisi'nden veritabanınızı ekleyin
3. **Bağlantıyı Test Edin**: Bağlantı dizesini test edin
4. **Bağlanın**: Veritabanına bağlanın

### AI Sorguları
1. **Sorgu Sayfasına Gidin**: `/query` sayfasını açın
2. **Doğal Dil Sorgusu Yazın**: "En çok satan ürünleri göster" gibi
3. **Sorguyu Çalıştırın**: AI otomatik SQL oluşturacak
4. **Sonuçları İnceleyin**: Tablo ve grafik formatında sonuçlar

### Rapor Oluşturma
1. **Rapor Oluştur Sayfasına Gidin**: `/create-report` sayfasını açın
2. **Rapor Açıklaması Yazın**: AI rapor açıklamasını analiz edecek
3. **Grafik Türünü Seçin**: Otomatik önerilen grafik türü
4. **Raporu Kaydedin**: Raporu kaydedin ve paylaşın

## 📁 Proje Yapısı

```
hospi-tech-frontend/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── api/               # API endpoints
│   │   ├── connections/       # Bağlantı yöneticisi sayfası
│   │   ├── create-report/     # Rapor oluşturma sayfası
│   │   ├── db-upload/         # Veritabanı yükleme sayfası
│   │   ├── query/             # AI sorgu sayfası
│   │   └── reports/           # Raporlar sayfası
│   ├── components/            # React bileşenleri
│   │   ├── ConnectionManager.tsx
│   │   ├── DashboardWidget.tsx
│   │   ├── NotificationSystem.tsx
│   │   ├── QueryInput.tsx
│   │   ├── ResultChart.tsx
│   │   └── Sidebar.tsx
│   └── styles/               # CSS stilleri
├── public/                   # Statik dosyalar
├── package.json
└── README.md
```

## 🔧 API Endpoints

### Veritabanı Bağlantıları
- `POST /api/connect-database` - Veritabanına bağlan
- `POST /api/disconnect-database` - Bağlantıyı kes
- `POST /api/test-connection` - Bağlantı testi

### Sorgu ve Raporlar
- `POST /api/generate-sql` - AI ile SQL oluştur
- `POST /api/run-query` - SQL sorgusu çalıştır

## 🎯 Gelecek Özellikler

- [ ] **Gerçek Zamanlı Veri Güncelleme**: WebSocket ile canlı veri
- [ ] **Gelişmiş Analitik**: Makine öğrenmesi tabanlı öngörüler
- [ ] **Takım Çalışması**: Çoklu kullanıcı desteği
- [ ] **API Entegrasyonu**: Üçüncü parti servis entegrasyonları
- [ ] **Mobil Uygulama**: React Native ile mobil uygulama
- [ ] **Cloud Deployment**: AWS, Azure, GCP desteği

## 🤝 Katkıda Bulunma

1. Fork yapın
2. Feature branch oluşturun (`git checkout -b feature/amazing-feature`)
3. Değişikliklerinizi commit edin (`git commit -m 'Add amazing feature'`)
4. Branch'inizi push edin (`git push origin feature/amazing-feature`)
5. Pull Request oluşturun

## 📄 Lisans

Bu proje MIT lisansı altında lisanslanmıştır. Detaylar için [LICENSE](LICENSE) dosyasına bakın.

## 📞 İletişim

- **Proje Linki**: [https://github.com/your-username/hospitech](https://github.com/your-username/hospitech)
- **E-posta**: info@hospitech.com
- **Website**: [https://hospitech.com](https://hospitech.com)

## 🙏 Teşekkürler

- [OpenAI](https://openai.com) - GPT-4 API
- [Next.js](https://nextjs.org) - React framework
- [Tailwind CSS](https://tailwindcss.com) - CSS framework
- [Chart.js](https://chartjs.org) - Grafik kütüphanesi

---

**HospiTech** - AI destekli veritabanı raporlama platformu ile verilerinizi anlamlandırın! 🚀
