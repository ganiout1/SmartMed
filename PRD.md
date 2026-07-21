# Product Requirements Document (PRD)

## Project Information

| Item | Detail |
|------|--------|
| **Project Name** | CBT Management System |
| **Version** | 1.0 (MVP) |
| **Platform** | Web Application |
| **Status** | In Development |

---

# 1. Project Overview

CBT Management System adalah aplikasi berbasis web yang digunakan oleh lembaga pendidikan untuk menyelenggarakan ujian online. Sistem memiliki tiga jenis pengguna, yaitu **Admin**, **Dosen**, dan **Mahasiswa**, dengan hak akses yang berbeda.

Selain sistem CBT, aplikasi juga memiliki **Landing Page** sebagai media informasi dan company profile lembaga.

Versi pertama (MVP) hanya berfokus pada fitur inti Computer Based Test (CBT).

---

# 2. Project Goals

Tujuan aplikasi:

- Menyelenggarakan ujian secara online.
- Mempermudah dosen membuat quiz dan soal.
- Mempermudah admin mengelola pengguna.
- Mengurangi proses penilaian manual.
- Menampilkan nilai secara otomatis.
- Dapat diakses melalui desktop maupun smartphone.

---

# 3. Scope

## ✅ Included Features

### Landing Page

- Home
- Tentang
- Program
- FAQ
- Kontak
- Tombol Login
- Responsive

### Authentication

- Login Email & Password
- Logout
- Tidak ada registrasi
- Akun dibuat Admin

### Admin

- Dashboard
- CRUD Dosen
- CRUD Mahasiswa
- CRUD Kursus
- Generate Enrollment Key
- Assign Dosen ke Kursus
- Melihat seluruh hasil ujian

### Dosen

- Dashboard
- Melihat kursus yang ditugaskan
- Membuat Quiz
- Edit Quiz
- Hapus Quiz
- Membuat soal pilihan ganda
- Edit soal
- Hapus soal
- Mengatur durasi quiz
- Menambahkan pembahasan soal
- Upload gambar pembahasan
- Melihat hasil mahasiswa

### Mahasiswa

- Dashboard
- Login
- Memasukkan Enrollment Key
- Mengakses kursus
- Mengerjakan Quiz
- Melihat nilai otomatis
- Melihat riwayat hasil ujian
- Melihat pembahasan soal setelah submit

### Sistem CBT

- Soal pilihan ganda
- Timer ujian
- Question navigator
- Auto submit ketika waktu habis
- Penilaian otomatis
- Riwayat ujian

### Deployment

- Deploy ke server
- SSL HTTPS
- Responsive Desktop
- Responsive Tablet
- Responsive Mobile

---

# 4. Out of Scope

Fitur berikut **tidak termasuk** pada versi pertama:

- Upload materi PDF
- Upload video pembelajaran
- Assignment
- Sertifikat
- Import soal dari Excel
- Export nilai ke Excel
- Payment Gateway
- Forum Diskusi
- Chat
- Email Otomatis
- Video Conference
- Live Streaming
- Multi Language
- AI
- Notifikasi WhatsApp

---

# 5. User Roles

## Admin

### Permissions

- Login
- Dashboard
- Kelola Dosen
- Kelola Mahasiswa
- Kelola Kursus
- Membuat Enrollment Key
- Assign Dosen ke Kursus
- Melihat seluruh hasil ujian

---

## Dosen

### Permissions

- Login
- Dashboard
- Melihat kursus
- Membuat Quiz
- Edit Quiz
- Hapus Quiz
- CRUD Soal
- Mengatur durasi
- Menambahkan pembahasan
- Upload gambar pembahasan
- Melihat nilai mahasiswa

---

## Mahasiswa

### Permissions

- Login
- Dashboard
- Input Enrollment Key
- Mengakses Kursus
- Mengerjakan Quiz
- Submit Quiz
- Lihat Nilai
- Lihat Riwayat
- Lihat Pembahasan

---

# 6. Functional Requirements

## Landing Page

Pengunjung dapat:

- Melihat informasi lembaga
- Melihat program
- Membaca FAQ
- Menghubungi lembaga
- Login ke sistem

---

## Authentication

- Login menggunakan Email
- Login menggunakan Password
- Logout
- Tidak tersedia registrasi publik

---

## Course Management

Admin dapat:

- Create Course
- Read Course
- Update Course
- Delete Course

---

## Enrollment Key

Admin dapat:

- Generate Enrollment Key
- Menghubungkan key dengan kursus

Mahasiswa dapat:

- Memasukkan Enrollment Key
- Membuka akses kursus

---

## Quiz Management

Dosen dapat:

- Membuat Quiz
- Edit Quiz
- Hapus Quiz
- Mengatur durasi
- Mengatur passing score

---

## Question Management

Setiap soal memiliki:

- Pertanyaan
- Pilihan A
- Pilihan B
- Pilihan C
- Pilihan D
- Jawaban Benar
- Pembahasan
- Gambar Pembahasan (Opsional)

---

## Quiz System

Saat quiz dimulai:

- Timer berjalan otomatis
- Semua soal dimuat di awal
- Mahasiswa dapat berpindah soal
- Jawaban disimpan sementara
- Submit manual
- Auto submit saat waktu habis

Setelah submit:

- Nilai dihitung otomatis
- Hasil disimpan
- Pembahasan ditampilkan

---

# 7. Non Functional Requirements

- Responsive
- Mobile Friendly
- Fast Loading
- Modern UI
- Secure Authentication
- HTTPS
- Easy to Use
- Role Based Access

---

# 8. User Flow

## Admin

```text
Login
    ↓
Dashboard
    ↓
Kelola User
    ↓
Kelola Kursus
    ↓
Generate Enrollment Key
    ↓
Assign Dosen
```

## Dosen

```text
Login
    ↓
Dashboard
    ↓
Pilih Kursus
    ↓
Buat Quiz
    ↓
Tambah Soal
    ↓
Publish Quiz
```

## Mahasiswa

```text
Landing Page
      ↓
Login
      ↓
Dashboard
      ↓
Masukkan Enrollment Key
      ↓
Buka Kursus
      ↓
Pilih Quiz
      ↓
Kerjakan Quiz
      ↓
Submit
      ↓
Nilai & Pembahasan
```

---

# 9. Acceptance Criteria

Project dianggap selesai apabila:

- Landing Page dapat diakses.
- Login berjalan sesuai role.
- Admin dapat mengelola user.
- Admin dapat mengelola kursus.
- Dosen dapat membuat quiz.
- Dosen dapat membuat soal.
- Mahasiswa dapat mengikuti quiz.
- Timer berjalan normal.
- Auto submit berjalan.
- Nilai dihitung otomatis.
- Pembahasan tampil setelah submit.
- Responsive di Desktop dan Mobile.

---

# 10. Deliverables

Client akan menerima:

- Landing Page
- Dashboard Admin
- Dashboard Dosen
- Dashboard Mahasiswa
- Database
- Source Code
- Deploy ke Server
- SSL HTTPS
- Dokumentasi singkat
- Revisi minor maksimal 2 kali

---

# 11. Timeline

Estimasi pengerjaan:

**7–14 Hari Kerja**

---

# 12. Payment Terms

- DP **50%** sebelum pengerjaan dimulai.
- Pelunasan **50%** setelah website selesai dan siap digunakan.

---

# 13. Warranty

## Garansi Sistem

Selama **30 hari** setelah website diserahterimakan:

Termasuk:

- Perbaikan bug
- Error fixing
- Minor UI adjustment

Tidak termasuk:

- Penambahan fitur baru
- Perubahan alur sistem
- Redesign
- Integrasi pihak ketiga
- Upgrade fitur

---

# 14. Future Enhancements

Versi berikutnya dapat menambahkan:

- Upload Materi PDF
- Video Pembelajaran
- Import Soal Excel
- Export Nilai Excel
- Sertifikat Otomatis
- Random Soal
- Random Jawaban
- Bank Soal
- Analitik Nilai
- Ranking
- Notifikasi Email
- Notifikasi WhatsApp
- Dashboard Analitik