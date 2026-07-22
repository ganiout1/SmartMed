# SmartMed CBT

Sistem Ujian Berbasis Komputer (CBT) interaktif dan modern yang dirancang khusus untuk Fakultas Kedokteran. Platform ini mencakup manajemen kelas, bank soal bergambar, pengerjaan ujian secara *real-time*, dan penilaian otomatis.

## Fitur Utama
- **Autentikasi Aman:** SSO & Email login melalui Supabase Auth dengan perlindungan Role-Based Access Control (Admin, Dosen, Mahasiswa).
- **Dashboard Multi-Role:** Panel terpisah dan terisolasi untuk masing-masing peran.
- **Engine CBT Real-time:** Pengaturan waktu (*timer*), penyimpanan jawaban otomatis di latar belakang (*autosave*), dan *auto-submit* saat durasi habis.
- **Manajemen Gambar:** Mendukung unggahan gambar pada penjelasan (pembahasan) soal ke Supabase Storage.
- **Keamanan Kuat:** Row Level Security (RLS) di lapisan basis data mencegah akses dan manipulasi data secara tidak sah.

## Teknologi yang Digunakan
- **Frontend:** Next.js 14+ (App Router), React, Tailwind CSS, Shadcn UI
- **Backend & Database:** Supabase (PostgreSQL), Supabase Auth, Supabase Storage
- **Bahasa:** TypeScript

## Prasyarat
1. Node.js (v18 atau lebih baru)
2. Akun Supabase

## Setup Lingkungan (Development)

1. Kloning repositori ini.
2. Salin `.env.example` ke `.env.local` dan isi dengan kredensial proyek Supabase Anda.
   ```bash
   cp .env.example .env.local
   ```
3. Install semua dependensi:
   ```bash
   npm install
   ```
4. Jalankan migrasi basis data. Temukan file SQL di dalam folder `supabase/migrations/` dan jalankan berurutan di dalam SQL Editor Supabase Anda.
5. Jalankan server pengembangan:
   ```bash
   npm run dev
   ```

## Panduan Deployment (Vercel)

Aplikasi ini siap dan sangat dioptimalkan untuk di-deploy ke Vercel:
1. Hubungkan repositori GitHub Anda ke Vercel.
2. Tambahkan **Environment Variables** (yang ada di `.env.example`) ke dalam konfigurasi _Environment_ di _Dashboard_ Vercel.
3. Vercel akan otomatis mengenali kerangka kerja Next.js dan membangun (_build_) aplikasi Anda.
4. Kunjungi tautan produksi Anda. 

---
*Dibuat untuk ekosistem SmartMed.*
