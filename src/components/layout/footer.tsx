import Link from "next/link";
import {
  Mail,
  MapPin,
  Phone,
} from "lucide-react";
import Image from "next/image";

import { FOOTER_LINKS, CONTACT_INFO } from "@/lib/constants";

export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-border bg-white">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {/* Main Footer Grid */}
        <div className="grid gap-10 py-12 md:py-16 sm:grid-cols-2 lg:grid-cols-4">
          {/* Brand Column */}
          <div className="lg:col-span-1">
            <Link href="/" className="inline-flex items-center">
              <div className="flex items-center">
                <Image src="/logo.png" alt="SmartMED" width={300} height={90} className="object-contain object-left w-28 md:w-40 h-auto" />
              </div>
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-text-secondary max-w-xs">
              Lembaga bimbingan belajar kedokteran preklinik terpercaya yang
              membantu mahasiswa meraih prestasi akademik terbaik.
            </p>
          </div>

          {/* Link Columns */}
          {FOOTER_LINKS.map((group) => (
            <div key={group.title}>
              <h3 className="text-sm font-semibold tracking-wide text-text-primary">
                {group.title}
              </h3>
              <ul className="mt-4 space-y-3">
                {group.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-text-secondary transition-colors hover:text-accent"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}

          {/* Contact Column */}
          <div>
            <h3 className="text-sm font-semibold tracking-wide text-text-primary">
              Kontak
            </h3>
            <ul className="mt-4 space-y-3">
              {CONTACT_INFO.map((item) => (
                <li key={item.label}>
                  <a
                    href={item.href}
                    target={item.href.startsWith("http") ? "_blank" : undefined}
                    rel={
                      item.href.startsWith("http")
                        ? "noopener noreferrer"
                        : undefined
                    }
                    className="inline-flex items-center gap-2.5 text-sm text-text-secondary transition-colors hover:text-accent"
                  >
                    <item.icon size={15} className="shrink-0" />
                    {item.value}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-border py-6">
          <p className="text-center text-xs text-text-secondary">
            &copy; {currentYear} SmartMed. Seluruh hak cipta dilindungi
            undang-undang.
          </p>
        </div>
      </div>
    </footer>
  );
}
