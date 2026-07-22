"use client";

import { useState } from "react";
import { Plus, Search, Edit2, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { createCourse, updateCourse, deleteCourse } from "@/app/dashboard/admin/courses/actions";

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
import { Label } from "@/components/ui/label";

type CourseData = {
  id: string;
  title: string;
  description: string;
  lecturer_count: number;
  student_count: number;
};

export function CourseManagement({ courses }: { courses: CourseData[] }) {
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<CourseData | null>(null);
  const [loading, setLoading] = useState(false);

  const filteredCourses = courses.filter(
    (c) => c.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await createCourse(formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Kursus berhasil ditambahkan");
      setIsAddOpen(false);
    }
    setLoading(false);
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedCourse) return;
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateCourse(selectedCourse.id, formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Kursus berhasil diubah");
      setIsEditOpen(false);
    }
    setLoading(false);
  };

  const handleDeleteSubmit = async () => {
    if (!selectedCourse) return;
    setLoading(true);
    const result = await deleteCourse(selectedCourse.id);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Kursus berhasil dihapus");
      setIsDeleteOpen(false);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4 bg-background p-6 rounded-lg border">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari kursus..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Kursus
        </Button>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Nama Kursus</TableHead>
              <TableHead>Deskripsi</TableHead>
              <TableHead className="text-center">Dosen</TableHead>
              <TableHead className="text-center">Mahasiswa</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCourses.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Tidak ada data kursus.
                </TableCell>
              </TableRow>
            ) : (
              filteredCourses.map((course) => (
                <TableRow key={course.id}>
                  <TableCell className="font-medium">{course.title}</TableCell>
                  <TableCell className="max-w-xs truncate text-muted-foreground">
                    {course.description || "-"}
                  </TableCell>
                  <TableCell className="text-center">{course.lecturer_count}</TableCell>
                  <TableCell className="text-center">{course.student_count}</TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setSelectedCourse(course);
                        setIsEditOpen(true);
                      }}
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        setSelectedCourse(course);
                        setIsDeleteOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      {/* ADD DIALOG */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Tambah Kursus Baru</DialogTitle>
            <DialogDescription>Masukkan nama dan deskripsi kursus.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Nama Kursus</Label>
              <Input id="title" name="title" required placeholder="Contoh: Anatomi Dasar" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi (Opsional)</Label>
              <Input id="description" name="description" placeholder="Deskripsi singkat..." />
            </div>
            <div className="space-y-2">
              <Label htmlFor="banner">Gambar Banner (Opsional, Persegi 1:1)</Label>
              <Input id="banner" name="banner" type="file" accept="image/*" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} disabled={loading}>
                Batal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Kursus</DialogTitle>
            <DialogDescription>Ubah nama dan deskripsi kursus ini.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Nama Kursus</Label>
              <Input id="edit-title" name="title" required defaultValue={selectedCourse?.title} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Deskripsi</Label>
              <Input id="edit-description" name="description" defaultValue={selectedCourse?.description || ""} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-banner">Gambar Banner Baru (Opsional, membiarkan kosong tidak akan menghapus banner lama)</Label>
              <Input id="edit-banner" name="banner" type="file" accept="image/*" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsEditOpen(false)} disabled={loading}>
                Batal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan Perubahan"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Kursus</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus kursus <b>{selectedCourse?.title}</b>?
              Semua kuis, soal, dan rekaman nilai terkait kursus ini akan ikut terhapus.
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
