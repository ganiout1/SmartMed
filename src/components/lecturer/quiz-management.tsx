"use client";

import { useState } from "react";
import Link from "next/link";
import { Plus, Search, Edit2, Trash2, Settings, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { createQuiz, updateQuiz, deleteQuiz } from "@/app/dashboard/lecturer/courses/[courseId]/actions";

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
import { Badge } from "@/components/ui/badge";

type QuizData = {
  id: string;
  title: string;
  description: string;
  duration_minutes: number;
  passing_score: number;
  status: string;
  question_count: number;
  attempt_count: number;
  max_attempts?: number | null;
};

interface QuizManagementProps {
  courseId: string;
  quizzes: QuizData[];
}

export function QuizManagement({ courseId, quizzes }: QuizManagementProps) {
  const [search, setSearch] = useState("");
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedQuiz, setSelectedQuiz] = useState<QuizData | null>(null);
  const [loading, setLoading] = useState(false);

  const filteredQuizzes = quizzes.filter(
    (q) => q.title.toLowerCase().includes(search.toLowerCase())
  );

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await createQuiz(courseId, formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Kuis berhasil ditambahkan");
      setIsAddOpen(false);
    }
    setLoading(false);
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedQuiz) return;
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateQuiz(courseId, selectedQuiz.id, formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Kuis berhasil diubah");
      setIsEditOpen(false);
    }
    setLoading(false);
  };

  const handleDeleteSubmit = async () => {
    if (!selectedQuiz) return;
    setLoading(true);
    const result = await deleteQuiz(courseId, selectedQuiz.id);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Kuis berhasil dihapus");
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
            placeholder="Cari kuis..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Kuis
        </Button>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Judul Kuis</TableHead>
              <TableHead className="text-center">Soal</TableHead>
              <TableHead className="text-center">Durasi</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredQuizzes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center">
                  Belum ada kuis untuk kursus ini.
                </TableCell>
              </TableRow>
            ) : (
              filteredQuizzes.map((quiz) => (
                <TableRow key={quiz.id}>
                  <TableCell>
                    <div className="font-medium">{quiz.title}</div>
                    <div className="text-xs text-muted-foreground line-clamp-1">{quiz.description}</div>
                  </TableCell>
                  <TableCell className="text-center">{quiz.question_count}</TableCell>
                  <TableCell className="text-center">
                    {quiz.duration_minutes > 0 ? `${quiz.duration_minutes} Menit` : "-"}
                  </TableCell>
                  <TableCell className="text-center">
                    {quiz.status === "published" ? (
                      <Badge variant="secondary" className="bg-green-100 text-green-800">Published</Badge>
                    ) : (
                      <Badge variant="outline" className="text-yellow-600 border-yellow-600">Draft</Badge>
                    )}
                  </TableCell>
                  <TableCell className="text-right space-x-2">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => {
                        setSelectedQuiz(quiz);
                        setIsEditOpen(true);
                      }}
                      title="Edit Info Kuis"
                    >
                      <Edit2 className="h-4 w-4" />
                    </Button>
                    <Button nativeButton={false} render={
                      <Link href={`/dashboard/lecturer/quizzes/${quiz.id}`}>
                        Kelola
                        <ArrowRight className="ml-2 h-4 w-4" />
                      </Link>
                    } variant="outline" size="sm" />
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        setSelectedQuiz(quiz);
                        setIsDeleteOpen(true);
                      }}
                      title="Hapus Kuis"
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
            <DialogTitle>Tambah Kuis Baru</DialogTitle>
            <DialogDescription>Masukkan detail awal kuis. Anda bisa mengatur konfigurasi lebih lanjut nanti.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Judul Kuis</Label>
              <Input id="title" name="title" required placeholder="Contoh: Kuis 1 Anatomi" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="description">Deskripsi (Opsional)</Label>
              <Input id="description" name="description" placeholder="Deskripsi singkat..." />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="duration">Durasi (Menit)</Label>
                <Input id="duration" name="duration" type="number" min={0} defaultValue={60} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="passingScore">Nilai Kelulusan (0-100)</Label>
                <Input id="passingScore" name="passingScore" type="number" min={0} max={100} defaultValue={75} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="maxAttempts">Batas Percobaan</Label>
              <Input id="maxAttempts" name="maxAttempts" type="number" min={1} placeholder="Kosongkan jika tak terbatas" />
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} disabled={loading}>
                Batal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan Kuis"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Informasi Kuis</DialogTitle>
            <DialogDescription>Ubah detail kuis ini.</DialogDescription>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="edit-title">Judul Kuis</Label>
              <Input id="edit-title" name="title" required defaultValue={selectedQuiz?.title} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-description">Deskripsi</Label>
              <Input id="edit-description" name="description" defaultValue={selectedQuiz?.description || ""} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="edit-duration">Durasi (Menit)</Label>
                <Input id="edit-duration" name="duration" type="number" min={0} defaultValue={selectedQuiz?.duration_minutes} />
              </div>
              <div className="space-y-2">
                <Label htmlFor="edit-passingScore">Nilai Kelulusan (0-100)</Label>
                <Input id="edit-passingScore" name="passingScore" type="number" min={0} max={100} defaultValue={selectedQuiz?.passing_score} />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="edit-maxAttempts">Batas Percobaan</Label>
              <Input id="edit-maxAttempts" name="maxAttempts" type="number" min={1} placeholder="Kosongkan jika tak terbatas" defaultValue={selectedQuiz?.max_attempts || ""} />
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
            <DialogTitle>Hapus Kuis</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus kuis <b>{selectedQuiz?.title}</b>?
              Semua soal dan hasil ujian mahasiswa akan ikut terhapus.
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
