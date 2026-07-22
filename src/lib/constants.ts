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
    title: "Pengajar terbaik & berpengalaman",
    description:
      "Tim pengajar terbaik, ramah, dan pastinya berpengalaman sesuai bidang keahlian",
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
    icon: UserCheck,
    title: "Kelas Privat",
    description:
      "Bimbingan tatap muka satu-satu dengan tutor berpengalaman. Materi dan jadwal disesuaikan sepenuhnya dengan kebutuhan mahasiswa.",
    tags: ["Jadwal Fleksibel", "Latihan soal rutin", "SMART Access", "Personal"],
  },
  {
    icon: GraduationCap,
    title: "Paket Platinum",
    description:
      "Bimbingan belajar rutin per blok dengan jadwal terstruktur. Cocok untuk mahasiswa yang ingin mempersiapkan diri secara konsisten sepanjang semester.",
    tags: ["Per Blok", "Grup kecil", "Diskusi aktif"],
  },
  {
    icon: Target,
    title: "Paket Gold",
    description:
      "Program intensif persiapan ujian yang berfokus pada diskusi 2 arah antara pengajar dan siswa",
    tags: ["DST 1x/minggu", "Grup kecil", "Diskusi aktif", "Drill soal"],
  },
  {
    icon: ClipboardCheck,
    title: "Akses SMART-Med",
    description:
      "Simulasi Medis Akademik Realistis Terstandar merupakan pengembangan Try Out CBT dengan soal-soal berkualitas, timer, beserta pembahasan untuk persiapan real CBT.",
    tags: ["Online", "Auto Grading", "Sesuai kurikulum", "Free pembahasan"],
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
    title: "Pengajar terbaik & berpengalaman",
    description:
      "Tim pengajar terbaik, ramah, dan pastinya berpengalaman sesuai bidang keahlian",
  },
  {
    number: "02",
    icon: BookOpen,
    title: "Bentuk Fondasi Belajar",
    description:
      "Memastikan mahasiswa baru memiliki fondasi belajar dengan memberikan Tips & Strategi belajar ala anak FK",
  },
  {
    number: "03",
    icon: Users,
    title: "Kelas kecil & personal",
    description:
      "Maksimal 8-15 peserta per kelas memungkinkan interaksi yang lebih intens dan pemahaman yang lebih mendalam.",
  },
  {
    number: "04",
    icon: Brain,
    title: "Simulasi CBT Realistis",
    description:
      "Latihan dengan SMART-Med yang dirancang menyerupai UI ujian CBT asli untuk membangun kesiapan mental dan teknis.",
  },
  {
    number: "05",
    icon: Target,
    title: "Discussion Service Time",
    description:
      "Fasilitas bimbingan belajar tambahan atau layanan konsultasi di luar jam kelas regular 1x/minggu. Di DST, siswa dapat membahas tutorial, perkuliahan, OSCE, DLL.",
  },
  {
    number: "06",
    icon: CalendarDays,
    title: "Jadwal Fleksibel",
    description:
      "Pilih jadwal belajar yang sesuai dengan kesibukan Anda. Tersedia kelas pagi, siang, dan malam serta opsi bimbingan online.",
  },
  {
    number: "07",
    icon: TrendingUp,
    title: "Modul Sesuai Kurikulum",
    description:
      "Fakultas kedokteran sesuai universitas masing-masing",
  },
  {
    number: "08",
    icon: MapPin,
    title: "Pilih Lokasi les",
    description:
      "Bisa les online, offline di rumah, atau di kafe sesuai kebutuhan",
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

export const FAQ_ITEMS: FAQItem[] = [];

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
    value: "+62 878-6714-1403",
    href: "https://wa.me/6287867141403",
  },
  {
    icon: Mail,
    label: "Email",
    value: "smartmededu30@gmail.com",
    href: "mailto:smartmededu30@gmail.com",
  },
  {
    icon: Camera,
    label: "Instagram",
    value: "@smartmed_edu",
    href: "https://instagram.com/smartmed_edu",
  },
  {
    icon: MapPin,
    label: "Alamat",
    value: "Mataram, Nusa Tenggara Barat, Indonesia",
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
    ],
  },
  {
    title: "Program",
    links: [
      { label: "Kelas Privat", href: "#program" },
      { label: "Paket Platinum", href: "#program" },
      { label: "Paket Gold", href: "#program" },
      { label: "Akses SMART-Med", href: "#program" },
    ],
  },
];
