"use client";

import { useState } from "react";
import { Plus, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { assignLecturer, unassignLecturer } from "@/app/dashboard/admin/assignments/actions";

import { Button } from "@/components/ui/button";
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

type LecturerData = {
  id: string;
  full_name: string;
};

type AssignmentData = {
  course_id: string;
  lecturer_id: string;
  course_title: string;
  lecturer_name: string;
  created_at: string;
};

interface AssignmentManagementProps {
  assignments: AssignmentData[];
  courses: CourseData[];
  lecturers: LecturerData[];
}

export function AssignmentManagement({
  assignments,
  courses,
  lecturers,
}: AssignmentManagementProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedAssignment, setSelectedAssignment] = useState<AssignmentData | null>(null);
  const [loading, setLoading] = useState(false);

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await assignLecturer(formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Dosen berhasil ditugaskan");
      setIsAddOpen(false);
    }
    setLoading(false);
  };

  const handleDeleteSubmit = async () => {
    if (!selectedAssignment) return;
    setLoading(true);
    const result = await unassignLecturer(
      selectedAssignment.course_id,
      selectedAssignment.lecturer_id
    );

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Penugasan berhasil dihapus");
      setIsDeleteOpen(false);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4 bg-background p-6 rounded-lg border">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Daftar Penugasan Dosen</h3>
        <Button onClick={() => setIsAddOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Assign Dosen
        </Button>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Nama Kursus</TableHead>
              <TableHead>Dosen Pengampu</TableHead>
              <TableHead>Tanggal Assign</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {assignments.length === 0 ? (
              <TableRow>
                <TableCell colSpan={4} className="h-24 text-center">
                  Belum ada dosen yang ditugaskan.
                </TableCell>
              </TableRow>
            ) : (
              assignments.map((assignment) => (
                <TableRow key={`${assignment.course_id}-${assignment.lecturer_id}`}>
                  <TableCell className="font-medium">{assignment.course_title}</TableCell>
                  <TableCell>
                    <Badge variant="secondary">{assignment.lecturer_name}</Badge>
                  </TableCell>
                  <TableCell>
                    {new Date(assignment.created_at).toLocaleDateString("id-ID")}
                  </TableCell>
                  <TableCell className="text-right">
                    <Button
                      variant="destructive"
                      size="icon"
                      onClick={() => {
                        setSelectedAssignment(assignment);
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
            <DialogTitle>Assign Dosen ke Kursus</DialogTitle>
            <DialogDescription>
              Pilih dosen dan kursus untuk memberikan hak akses pengelolaan materi.
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="lecturerId">Pilih Dosen</Label>
              <Select name="lecturerId" required>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih Dosen..." />
                </SelectTrigger>
                <SelectContent>
                  {lecturers.map((l) => (
                    <SelectItem key={l.id} value={l.id}>
                      {l.full_name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
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
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} disabled={loading}>
                Batal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Assign"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* DELETE DIALOG */}
      <Dialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Hapus Penugasan</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus <b>{selectedAssignment?.lecturer_name}</b> dari kursus <b>{selectedAssignment?.course_title}</b>?
              Dosen ini tidak akan bisa lagi mengelola kuis di kursus tersebut.
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
