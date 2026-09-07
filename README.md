# 🏭 Teknik Depo - Operasyon, Görev & Bilgi Takip Portalı

Fabrika teknik deposundaki 3 kişilik ekip (**Erkan**, **Berkay**, **Emircan**) için özel olarak geliştirilmiş, mobil uyumlu (iPhone & Android), anlık canlı senkronize çalışan iş ve süreç yönetim web uygulamasıdır.

---

## 📱 Öne Çıkan Özellikler

1. **Hızlı Profil Değişimi (Erkan / Berkay / Emircan):**
   - Şifre ve giriş karmaşası yok! Üst bardaki isminize bir kez dokunmanız yeterli.
   - Eklenen her görevde, tamamlanan her işte ve yazılan her notta kimin işlem yaptığı otomatik görünür.

2. **📋 İş Takibi & Vardiya Devri (To-Do & Handover):**
   - *"Yarın sabah badem sac sayımı ve düzeni"*, *"Gelen rulmanların raflara yerleşimi"* gibi kısa vadeli veya acil görevler.
   - Acil, Normal, Düşük öncelik etiketleri.
   - Göreve başlama ("Yapılıyor") ve tek tıkla tamamlama.
   - Biri telefondan görevi tamamladığında diğer herkesin ekranında **anında yeşile döner**.

3. **💡 Kritik Depo Kuralları & Püf Noktaları (Wiki):**
   - *"Sac verildiğinde ilk badem desenli sac verilecektir"* gibi kalıcı depo kuralları.
   - Malzeme kategorileri: Sac & Metal, Rulman & Kayış, Hırdavat & Cıvata, Yağ & Kimyasal, Genel.
   - **Anında canlı arama:** Arama kutusuna *"badem"* veya *"rulman"* yazdığınız an ilgili kural ekranınıza gelir.
   - Tek tıkla WhatsApp veya nota kopyalama butonu.

4. **⚡ SAP Depo Kılavuzu (T-Code & Süreç Rehberi):**
   - Depoda en çok kullanılan MIGO (311 transfer, 201 masraf merkezi çıkışı, 101 mal kabul), MB52 (stok kontrolü) vb. işlem adımları.
   - Adım adım anlaşılır açıklamalar ve unutulmaması gereken püf noktaları / uyarılar.

5. **📝 Vardiya & Olay Günlüğü (Logbook):**
   - *"Bugün 2. vardiyada hidrolik rakor bitti, satınalmaya bildirildi"*, *"Bakımcı Ahmet abi tork anahtarını ödünç aldı"* gibi anlık notlar.
   - Vardiya seçimi ve zaman damgasıyla kronolojik akış.

6. **📲 iPhone & Android Uygulama Olarak Kullanma (PWA):**
   - **iPhone (Safari):** Web sitesini açın -> Alttaki **Paylaş** butonuna basın -> **"Ana Ekrana Ekle"** seçin.
   - **Android (Chrome):** Web sitesini açın -> Sağ üstteki üç noktaya basın -> **"Ana Ekrana Ekle"** veya **"Uygulamayı Yükle"** seçin.
   - Artık telefonun ana ekranında tıpkı App Store'dan inmiş gibi özel logosuyla açılır, adres çubuğu olmadan tam ekran çalışır.

7. **⚡ Canlı Senkronizasyon (WebSockets):**
   - Sayfayı yenilemeye gerek yoktur. Biri telefonundan bir iş eklediğinde veya bitirdiğinde diğer kişilerin ekranı salisesinde güncellenir.

---

## 🚀 1. Yerel Ağda (Kendi Bilgisayarınızda) Çalıştırma

Eğer depodaki bir bilgisayarda çalıştırmak ve aynı Wi-Fi'daki telefonlardan girmek isterseniz:

1. Proje klasöründeki `start.bat` dosyasına çift tıklayın.
2. Sunucu `http://localhost:3000` adresinde açılacaktır.
3. Telefonunuzdan girmek için: Bilgisayarınızın yerel IP adresini öğrenin (örn: `192.168.1.50`).
4. Telefonun tarayıcısına `http://192.168.1.50:3000` yazarak bağlanın.

---

## 🌐 2. İnternete Yükleme (Bulutta 7/24 Ücretsiz Çalıştırma)

Telefonlardan fabrika Wi-Fi'ına bağlı olmadan, evden veya mobil veriyle her yerden erişmek için bu projeyi ücretsiz olarak **Render.com** veya **Railway.app** üzerine 5 dakikada yükleyebilirsiniz:

### Render.com İle Ücretsiz Yayınlama Adımları:
1. [GitHub](https://github.com)'a bu proje klasörünü yükleyin (veya Render'a doğrudan bağlayın).
2. [Render.com](https://render.com) sitesine ücretsiz üye olun.
3. **New +** butonuna basıp **Web Service** seçin.
4. GitHub deponuzu bağlayın.
5. Ayarları şu şekilde girin:
   - **Runtime:** `Node`
   - **Build Command:** `npm install && cd client && npm install && npm run build`
   - **Start Command:** `node server/index.js`
6. **Create Web Service** butonuna basın.
7. Render size `https://teknik-depo-xxxx.onrender.com` şeklinde ücretsiz bir web adresi verecektir.
8. Bu linki Erkan, Berkay ve Emircan'ın telefonlarına gönderin ve telefonlarında **"Ana Ekrana Ekle"** yapın!

---

## 🛠️ Kullanılan Teknolojiler

- **Backend:** Node.js, Express, Socket.io (Canlı yayın), Yerel SQLite veritabanı (`node:sqlite`).
- **Frontend:** React 19, Tailwind CSS v4, Lucide Icons, Vite.
- **PWA:** Web App Manifest ve mobil responsive arayüz.
