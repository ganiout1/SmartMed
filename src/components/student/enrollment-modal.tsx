"use client";

import { useState } from "react";
import { toast } from "sonner";
import { enrollCourse } from "@/app/dashboard/student/courses/actions";
import { ProUpgradeModal } from "@/components/student/pro-upgrade-modal";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { KeyRound, Star, LockOpen } from "lucide-react";

export function EnrollmentModal({ className }: { className?: string }) {
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await enrollCourse(formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success(result.message);
      setOpen(false);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger render={
        <Button variant="secondary" className={className}>
          <LockOpen className="mr-2 h-4 w-4" />
          Unlock
        </Button>
      } />
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Unlock Kursus</DialogTitle>
          <DialogDescription>
            Buka akses kursus ini menggunakan Enrollment Key atau tingkatkan ke Akun PRO.
          </DialogDescription>
        </DialogHeader>
        
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 space-y-3 mt-2">
          <div className="flex items-center gap-2 text-yellow-800 font-semibold">
            <Star className="w-5 h-5 fill-yellow-500 text-yellow-500" />
            <span>Upgrade ke Akun PRO ⭐</span>
          </div>
          <p className="text-sm text-yellow-700">
            Bebas akses ke seluruh kursus dan bank soal tanpa perlu Enrollment Key!
          </p>
          <ProUpgradeModal 
            trigger={
              <Button size="sm" className="w-full bg-yellow-500 hover:bg-yellow-600 text-white border-none">
                Lihat Keuntungan PRO
              </Button>
            }
          />
        </div>

        <div className="relative py-2">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Atau gunakan key</span>
          </div>
        </div>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="keyCode">Enrollment Key</Label>
            <Input 
              id="keyCode" 
              name="keyCode" 
              placeholder="Contoh: BIO-101-2024" 
              required 
              autoComplete="off"
            />
          </div>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setOpen(false)} disabled={loading}>
              Batal
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Mendaftar..." : "Gabung Sekarang"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
