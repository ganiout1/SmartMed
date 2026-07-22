"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Star, CheckCircle, Smartphone } from "lucide-react";

export function ProUpgradeModal({ trigger }: { trigger: React.ReactElement }) {
  const [open, setOpen] = useState(false);

  const handleUpgradeClick = () => {
    // Redirect to WhatsApp
    const waNumber = "6287723029292";
    const message = encodeURIComponent("Halo Admin SmartMed, saya ingin upgrade akun saya menjadi PRO 🌟");
    window.open(`https://wa.me/${waNumber}?text=${message}`, "_blank");
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={trigger} />
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center justify-center w-12 h-12 rounded-full bg-yellow-100 text-yellow-600 mb-4 mx-auto">
            <Star className="w-6 h-6 fill-yellow-500" />
          </div>
          <DialogTitle className="text-center text-xl">Upgrade menjadi Akun PRO</DialogTitle>
          <DialogDescription className="text-center">
            Nikmati kebebasan belajar tanpa batas dengan SmartMed PRO.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-semibold text-foreground block">Akses Semua Kursus Terbuka</span>
              <span className="text-muted-foreground">Tidak perlu lagi repot meminta atau memasukkan Enrollment Key. Semua kursus bisa langsung Anda buka!</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-semibold text-foreground block">Akses Penuh Bank Soal</span>
              <span className="text-muted-foreground">Kerjakan ribuan soal latihan dari berbagai mata kuliah kapan saja tanpa batas.</span>
            </div>
          </div>
          <div className="flex items-start gap-3">
            <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
            <div className="text-sm">
              <span className="font-semibold text-foreground block">Prioritas Layanan Bantuan</span>
              <span className="text-muted-foreground">Dapatkan respon lebih cepat dari tim dukungan kami untuk segala kendala belajar Anda.</span>
            </div>
          </div>
        </div>

        <DialogFooter className="sm:justify-center">
          <Button onClick={handleUpgradeClick} className="w-full bg-green-600 hover:bg-green-700 text-white font-medium text-md h-11">
            <Smartphone className="mr-2 h-5 w-5" />
            Hubungi Admin via WhatsApp
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
