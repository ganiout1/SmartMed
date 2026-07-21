import {
  GraduationCap,
  BookOpen,
  Users,
  Target,
  Stethoscope,
  Brain,
  ClipboardCheck,
  UserCheck,
  CalendarDays,
  TrendingUp,
  Phone,
  Mail,
  MapPin,
  Camera,
  type LucideIcon,
} from "lucide-react";

// ──────────────────────────────────────────
// Navigation
// ──────────────────────────────────────────

export interface NavLink {
  label: string;
  href: string;
}

export const NAV_LINKS: NavLink[] = [
  { label: "Tentang", href: "#tentang" },
  { label: "Program", href: "#program" },
  { label: "Keunggulan", href: "#keunggulan" },
  { label: "Testimoni", href: "#testimoni" },
  { label: "FAQ", href: "#faq" },
  { label: "Kontak", href: "#kontak" },
];

// ──────────────────────────────────────────
// Hero Stats
// ──────────────────────────────────────────

export interface Stat {
  value: string;
  label: string;
}

export const HERO_STATS: Stat[] = [
  { value: "500+", label: "Alumni" },
  { value: "95%", label: "Tingkat Kelulusan" },
  { value: "50+", label: "Pengajar Profesional" },
  { value: "4.9★", label: "Rating Kepuasan" },
];

// ──────────────────────────────────────────
// About Features
// ──────────────────────────────────────────

export interface Feature {
  icon: LucideIcon;
  title: string;
  description: string;
}

export const ABOUT_FEATURES: Feature[] = [
  {
    icon: Stethoscope,
    title: "Pengajar Dokter & Profesional",
    description:
      "Tim pengajar kami terdiri dari dokter praktisi dan profesional medis berpengalaman yang memahami kurikulum kedokteran secara mendalam.",
  },
  {
    icon: BookOpen,
    title: "Kurikulum Terstruktur",
    description:
      "Materi disusun sistematis mengikuti kurikulum kedokteran terkini, memastikan setiap topik dipelajari dengan urutan yang tepat.",
  },
  {
    icon: Users,
    title: "Kelas Kecil & Personal",
    description:
      "Dengan jumlah peserta terbatas di setiap kelas, kami memastikan setiap mahasiswa mendapat perhatian dan bimbingan maksimal.",
  },
];

// ──────────────────────────────────────────
// Programs
// ──────────────────────────────────────────

export interface Program {
  icon: LucideIcon;
  title: string;
  description: string;
  tags: string[];
}

export const PROGRAMS: Program[] = [
  {
    icon: GraduationCap,
    title: "Kelas Reguler",
    description:
      "Bimbingan belajar rutin per blok dengan jadwal terstruktur. Cocok untuk mahasiswa yang ingin mempersiapkan diri secara konsisten sepanjang semester.",
    tags: ["Per Blok", "Grup Kecil", "Terstruktur"],
  },
  {
    icon: Target,
    title: "Kelas Intensif",
    description:
      "Program persiapan intensif menghadapi ujian blok dan OSCE. Fokus pada latihan soal, simulasi ujian, dan review materi secara menyeluruh.",
    tags: ["Persiapan Ujian", "Intensif", "Simulasi"],
  },
  {
    icon: UserCheck,
    title: "Bimbingan Privat",
    description:
      "Bimbingan tatap muka satu-satu dengan tutor berpengalaman. Materi dan jadwal disesuaikan sepenuhnya dengan kebutuhan mahasiswa.",
    tags: ["1-on-1", "Fleksibel", "Personal"],
  },
  {
    icon: ClipboardCheck,
    title: "Try Out CBT",
    description:
      "Simulasi ujian online berbasis Computer Based Test dengan soal-soal berkualitas, timer, dan penilaian otomatis untuk mengukur kesiapan Anda.",
    tags: ["Online", "Auto Grading", "Realistis"],
  },
];

// ──────────────────────────────────────────
// Why Choose SmartMed (Advantages)
// ──────────────────────────────────────────

export interface Advantage {
  number: string;
  icon: LucideIcon;
  title: string;
  description: string;
}

export const ADVANTAGES: Advantage[] = [
  {
    number: "01",
    icon: Stethoscope,
    title: "Pengajar Dokter & Profesional",
    description:
      "Dibimbing langsung oleh dokter dan tenaga medis profesional yang aktif berpraktik di dunia kesehatan.",
  },
  {
    number: "02",
    icon: BookOpen,
    title: "Materi Sesuai Kurikulum",
    description:
      "Seluruh materi disusun berdasarkan kurikulum kedokteran terkini yang digunakan oleh fakultas kedokteran di Indonesia.",
  },
  {
    number: "03",
    icon: Users,
    title: "Kelas Kecil & Personal",
    description:
      "Maksimal 10 peserta per kelas memungkinkan interaksi yang lebih intens dan pemahaman yang lebih mendalam.",
  },
  {
    number: "04",
    icon: Brain,
    title: "Simulasi CBT Realistis",
    description:
      "Latihan dengan sistem Computer Based Test yang dirancang menyerupai ujian asli untuk membangun kesiapan mental dan teknis.",
  },
  {
    number: "05",
    icon: CalendarDays,
    title: "Jadwal Fleksibel",
    description:
      "Pilih jadwal belajar yang sesuai dengan kesibukan Anda. Tersedia kelas pagi, siang, dan malam serta opsi bimbingan online.",
  },
  {
    number: "06",
    icon: TrendingUp,
    title: "Rekam Jejak Kelulusan Tinggi",
    description:
      "Lebih dari 95% alumni SmartMed berhasil melewati ujian blok dan OSCE dengan hasil memuaskan di berbagai universitas.",
  },
];

// ──────────────────────────────────────────
// Testimonials
// ──────────────────────────────────────────

export interface Testimonial {
  quote: string;
  name: string;
  university: string;
  achievement: string;
}

export const TESTIMONIALS: Testimonial[] = [
  {
    quote:
      "SmartMed benar-benar mengubah cara saya belajar kedokteran. Materi yang terstruktur dan pengajar yang sabar membuat saya lebih percaya diri menghadapi ujian blok.",
    name: "Anisa Rahmawati",
    university: "FK Universitas Indonesia",
    achievement: "Lulus Ujian Blok dengan Nilai A",
  },
  {
    quote:
      "Simulasi CBT di SmartMed sangat membantu. Soal-soalnya berkualitas dan sangat mirip dengan ujian asli. Saya jadi terbiasa dengan format dan tekanan waktu ujian.",
    name: "Farhan Pratama",
    university: "FK Universitas Gadjah Mada",
    achievement: "Peringkat 5 Besar Angkatan",
  },
  {
    quote:
      "Kelas intensif menjelang OSCE sangat bermanfaat. Latihan keterampilan klinis dengan bimbingan dokter berpengalaman membuat saya siap menghadapi ujian praktik.",
    name: "Siti Nurhaliza",
    university: "FK Universitas Airlangga",
    achievement: "Lulus OSCE dengan Predikat Istimewa",
  },
  {
    quote:
      "Bimbingan privat di SmartMed sangat fleksibel. Tutor saya memahami kelemahan saya dan membuat rencana belajar yang sesuai. Hasilnya, nilai saya meningkat drastis.",
    name: "Muhammad Rizki",
    university: "FK Universitas Padjadjaran",
    achievement: "Peningkatan Nilai 30% dalam 2 Bulan",
  },
  {
    quote:
      "Yang saya suka dari SmartMed adalah kelasnya yang kecil. Saya bisa bertanya sepuasnya tanpa merasa canggung. Pengajarnya pun sangat responsif dan supportif.",
    name: "Dian Permatasari",
    university: "FK Universitas Diponegoro",
    achievement: "Lulus Seluruh Ujian Blok Semester 1-4",
  },
];

// ──────────────────────────────────────────
// FAQ
// ──────────────────────────────────────────

export interface FAQItem {
  question: string;
  answer: string;
}

export const FAQ_ITEMS: FAQItem[] = [
  {
    question: "Apa itu SmartMed?",
    answer:
      "SmartMed adalah lembaga bimbingan belajar kedokteran preklinik yang menyediakan program belajar terstruktur untuk mahasiswa kedokteran. Kami menawarkan kelas reguler, intensif, privat, dan simulasi ujian CBT online.",
  },
  {
    question: "Siapa yang mengajar di SmartMed?",
    answer:
      "Seluruh pengajar SmartMed adalah dokter dan tenaga medis profesional yang berpengalaman di bidangnya. Mereka memahami kurikulum kedokteran terkini dan mampu menjelaskan materi dengan cara yang mudah dipahami.",
  },
  {
    question: "Bagaimana format simulasi CBT di SmartMed?",
    answer:
      "Simulasi CBT kami menggunakan sistem online dengan format soal pilihan ganda, timer otomatis, dan penilaian instan. Soal-soal disusun menyerupai ujian asli untuk membangun kesiapan Anda secara optimal.",
  },
  {
    question: "Apakah tersedia kelas online?",
    answer:
      "Ya, SmartMed menyediakan opsi belajar online maupun offline. Kelas online dilaksanakan melalui platform video conference dengan materi dan rekaman yang dapat diakses kembali.",
  },
  {
    question: "Berapa jumlah peserta per kelas?",
    answer:
      "Kami membatasi maksimal 10 peserta per kelas untuk memastikan setiap mahasiswa mendapat perhatian dan bimbingan yang optimal dari pengajar.",
  },
  {
    question: "Bagaimana cara mendaftar?",
    answer:
      "Anda dapat mendaftar dengan menghubungi kami melalui WhatsApp atau mengisi formulir kontak di website ini. Tim kami akan membantu Anda memilih program yang paling sesuai dengan kebutuhan Anda.",
  },
  {
    question: "Apakah ada program untuk persiapan OSCE?",
    answer:
      "Ya, kami memiliki program Kelas Intensif yang khusus dirancang untuk persiapan ujian blok dan OSCE. Program ini mencakup latihan keterampilan klinis dengan bimbingan langsung dari dokter praktisi.",
  },
  {
    question: "Apakah materi yang diajarkan sesuai dengan kurikulum kampus saya?",
    answer:
      "Materi SmartMed disusun berdasarkan kurikulum kedokteran standar nasional. Kami juga dapat menyesuaikan materi dengan kurikulum spesifik universitas Anda, terutama untuk program bimbingan privat.",
  },
];

// ──────────────────────────────────────────
// Contact Info
// ──────────────────────────────────────────

export interface ContactInfo {
  icon: LucideIcon;
  label: string;
  value: string;
  href: string;
}

export const CONTACT_INFO: ContactInfo[] = [
  {
    icon: Phone,
    label: "WhatsApp",
    value: "+62 812-3456-7890",
    href: "https://wa.me/6281234567890",
  },
  {
    icon: Mail,
    label: "Email",
    value: "info@smartmed.id",
    href: "mailto:info@smartmed.id",
  },
  {
    icon: Camera,
    label: "Instagram",
    value: "@smartmed.id",
    href: "https://instagram.com/smartmed.id",
  },
  {
    icon: MapPin,
    label: "Alamat",
    value: "Jakarta, Indonesia",
    href: "#",
  },
];

// ──────────────────────────────────────────
// Footer Links
// ──────────────────────────────────────────

export interface FooterLinkGroup {
  title: string;
  links: { label: string; href: string }[];
}

export const FOOTER_LINKS: FooterLinkGroup[] = [
  {
    title: "Tautan",
    links: [
      { label: "Tentang Kami", href: "#tentang" },
      { label: "Program", href: "#program" },
      { label: "Keunggulan", href: "#keunggulan" },
      { label: "Testimoni", href: "#testimoni" },
      { label: "FAQ", href: "#faq" },
    ],
  },
  {
    title: "Program",
    links: [
      { label: "Kelas Reguler", href: "#program" },
      { label: "Kelas Intensif", href: "#program" },
      { label: "Bimbingan Privat", href: "#program" },
      { label: "Try Out CBT", href: "#program" },
    ],
  },
];
