"use client";

import { useState } from "react";
import { Plus, Trash2, X } from "lucide-react";
import { toast } from "sonner";
import { assignLecturer, unassignLecturer } from "@/app/dashboard/admin/assignments/actions";
import { Checkbox } from "@/components/ui/checkbox";

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

  const groupedAssignments = assignments.reduce((acc, curr) => {
    if (!acc[curr.lecturer_id]) {
      acc[curr.lecturer_id] = {
        lecturer_id: curr.lecturer_id,
        lecturer_name: curr.lecturer_name,
        courses: [],
      };
    }
    acc[curr.lecturer_id].courses.push({
      course_id: curr.course_id,
      course_title: curr.course_title,
      created_at: curr.created_at,
    });
    return acc;
  }, {} as Record<string, { lecturer_id: string; lecturer_name: string; courses: { course_id: string; course_title: string; created_at: string }[] }>);

  const groupedArray = Object.values(groupedAssignments);

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
              <TableHead>Dosen Pengampu</TableHead>
              <TableHead>Kursus yang Ditugaskan</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {groupedArray.length === 0 ? (
              <TableRow>
                <TableCell colSpan={2} className="h-24 text-center">
                  Belum ada dosen yang ditugaskan.
                </TableCell>
              </TableRow>
            ) : (
              groupedArray.map((group) => (
                <TableRow key={group.lecturer_id}>
                  <TableCell className="font-medium align-top py-4">
                    {group.lecturer_name}
                  </TableCell>
                  <TableCell className="py-4">
                    <div className="flex flex-wrap gap-2">
                      {group.courses.map((course) => (
                        <div key={course.course_id} className="flex items-center gap-1 bg-secondary text-secondary-foreground px-2.5 py-1 rounded-md text-sm">
                          <span>{course.course_title}</span>
                          <button
                            type="button"
                            className="ml-1 text-muted-foreground hover:text-destructive transition-colors"
                            onClick={() => {
                              setSelectedAssignment({
                                course_id: course.course_id,
                                lecturer_id: group.lecturer_id,
                                course_title: course.course_title,
                                lecturer_name: group.lecturer_name,
                                created_at: course.created_at,
                              });
                              setIsDeleteOpen(true);
                            }}
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                      ))}
                    </div>
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
              <Label>Pilih Kursus</Label>
              <div className="border rounded-md p-4 h-[200px] overflow-y-auto space-y-4">
                {courses.map((c) => (
                  <div key={c.id} className="flex items-center space-x-2">
                    <Checkbox id={`course-${c.id}`} name="courseIds" value={c.id} />
                    <Label htmlFor={`course-${c.id}`} className="font-normal cursor-pointer leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                      {c.title}
                    </Label>
                  </div>
                ))}
              </div>
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
