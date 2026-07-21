"use client";

import { useState } from "react";
import { Plus, Trash2, Key } from "lucide-react";
import { toast } from "sonner";
import { createEnrollmentKey, deleteEnrollmentKey } from "@/app/dashboard/admin/enrollment-keys/actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";

type CourseData = {
  id: string;
  title: string;
};

type KeyData = {
  id: string;
  course_id: string;
  course_title: string;
  key_code: string;
  usage_limit: number | null;
  usage_count: number;
  created_at: string;
};

export function EnrollmentKeyManagement({
  keys,
  courses,
}: {
  keys: KeyData[];
  courses: CourseData[];
}) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedKey, setSelectedKey] = useState<KeyData | null>(null);
  const [loading, setLoading] = useState(false);

  const generateRandomKey = () => {
    const randomStr = Math.random().toString(36).substring(2, 8).toUpperCase();
    const input = document.getElementById("keyCode") as HTMLInputElement;
    if (input) {
      input.value = `SMARTMED-${randomStr}`;
    }
  };

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await createEnrollmentKey(formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Enrollment Key berhasil dibuat");
      setIsAddOpen(false);
    }
    setLoading(false);
  };

  const handleDeleteSubmit = async () => {
    if (!selectedKey) return;
    setLoading(true);
    const result = await deleteEnrollmentKey(selectedKey.id);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Enrollment Key berhasil dihapus");
      setIsDeleteOpen(false);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4 bg-background p-6 rounded-lg border">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Daftar Enrollment Key</h3>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Generate Key
        </Button>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Kode (Key)</TableHead>
              <TableHead>Kursus</TableHead>
              <TableHead className="text-center">Penggunaan</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead>Tanggal Dibuat</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {keys.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Belum ada enrollment key yang dibuat.
                </TableCell>
              </TableRow>
            ) : (
              keys.map((k) => {
                const isExpired = k.usage_limit !== null && k.usage_count >= k.usage_limit;
                return (
                  <TableRow key={k.id}>
                    <TableCell className="font-mono font-medium">{k.key_code}</TableCell>
                    <TableCell>{k.course_title}</TableCell>
                    <TableCell className="text-center">
                      {k.usage_count} / {k.usage_limit === null ? "∞" : k.usage_limit}
                    </TableCell>
                    <TableCell className="text-center">
                      {isExpired ? (
                        <Badge variant="destructive">Penuh</Badge>
                      ) : (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                          Aktif
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {new Date(k.created_at).toLocaleDateString("id-ID")}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="destructive"
                        size="icon"
                        onClick={() => {
                          setSelectedKey(k);
                          setIsDeleteOpen(true);
                        }}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* ADD DIALOG */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Generate Enrollment Key</DialogTitle>
            <DialogDescription>
              Buat kode rahasia yang bisa digunakan mahasiswa untuk bergabung ke kursus.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="courseId">Pilih Kursus</Label>
              <Select name="courseId" required>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Kursus..." />
                </SelectTrigger>
                <SelectContent>
                  {courses.map((c) => (
                    <SelectItem key={c.id} value={c.id}>
                      {c.title}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="keyCode">Kode Enrollment</Label>
              <div className="flex gap-2">
                <Input id="keyCode" name="keyCode" required placeholder="Contoh: SMARTMED-XYZ123" className="font-mono uppercase" />
                <Button type="button" variant="secondary" onClick={generateRandomKey}>
                  <Key className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="usageLimit">Batas Penggunaan (Opsional)</Label>
              <Input id="usageLimit" name="usageLimit" type="number" min={1} placeholder="Kosongkan jika tidak terbatas" />
              <p className="text-xs text-muted-foreground">Berapa kali kode ini bisa dipakai oleh mahasiswa.</p>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} disabled={loading}>
                Batal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan Key"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Enrollment Key</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus kode <b>{selectedKey?.key_code}</b>?
              Mahasiswa tidak akan bisa lagi menggunakan kode ini untuk bergabung.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsDeleteOpen(false)} disabled={loading}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleDeleteSubmit} disabled={loading}>
              {loading ? "Menghapus..." : "Ya, Hapus"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
