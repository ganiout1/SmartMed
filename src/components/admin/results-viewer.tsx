"use client";

import { useState } from "react";
import { Search, RotateCcw } from "lucide-react";
import { toast } from "sonner";
import { resetQuizAttempt } from "@/app/dashboard/admin/results/actions";

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
import { Badge } from "@/components/ui/badge";

type AttemptData = {
  id: string;
  student_name: string;
  course_title: string;
  quiz_title: string;
  score: number | null;
  passing_score: number;
  completed_at: string | null;
};

export function ResultsViewer({ attempts }: { attempts: AttemptData[] }) {
  const [search, setSearch] = useState("");
  const [isResetOpen, setIsResetOpen] = useState(false);
  const [selectedAttempt, setSelectedAttempt] = useState<AttemptData | null>(null);
  const [loading, setLoading] = useState(false);

  const filteredAttempts = attempts.filter(
    (a) =>
      a.student_name.toLowerCase().includes(search.toLowerCase()) ||
      a.quiz_title.toLowerCase().includes(search.toLowerCase()) ||
      a.course_title.toLowerCase().includes(search.toLowerCase())
  );

  const handleResetSubmit = async () => {
    if (!selectedAttempt) return;
    setLoading(true);
    const result = await resetQuizAttempt(selectedAttempt.id);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Percobaan kuis berhasil direset");
      setIsResetOpen(false);
    }
    setLoading(false);
  };

  return (
    <div className="space-y-4 bg-background p-6 rounded-lg border">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-96">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari mahasiswa, kuis, atau kursus..."
            className="pl-8"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border overflow-hidden">
        <Table>
          <TableHeader className="bg-muted/50">
            <TableRow>
              <TableHead>Mahasiswa</TableHead>
              <TableHead>Kursus & Kuis</TableHead>
              <TableHead className="text-center">Nilai</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead>Waktu Selesai</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredAttempts.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Belum ada data percobaan kuis.
                </TableCell>
              </TableRow>
            ) : (
              filteredAttempts.map((attempt) => {
                const isCompleted = attempt.completed_at !== null;
                const isPassed =
                  isCompleted &&
                  attempt.score !== null &&
                  attempt.score >= attempt.passing_score;

                return (
                  <TableRow key={attempt.id}>
                    <TableCell className="font-medium">{attempt.student_name}</TableCell>
                    <TableCell>
                      <div className="flex flex-col">
                        <span className="text-sm font-medium">{attempt.quiz_title}</span>
                        <span className="text-xs text-muted-foreground">
                          {attempt.course_title}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="text-center font-mono">
                      {isCompleted ? attempt.score : "-"}
                    </TableCell>
                    <TableCell className="text-center">
                      {!isCompleted ? (
                        <Badge variant="outline" className="text-yellow-600 border-yellow-600">
                          Sedang Ujian
                        </Badge>
                      ) : isPassed ? (
                        <Badge variant="secondary" className="bg-green-100 text-green-800 hover:bg-green-100">
                          Lulus
                        </Badge>
                      ) : (
                        <Badge variant="destructive">Tidak Lulus</Badge>
                      )}
                    </TableCell>
                    <TableCell>
                      {isCompleted
                        ? new Date(attempt.completed_at!).toLocaleString("id-ID")
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedAttempt(attempt);
                          setIsResetOpen(true);
                        }}
                        title="Reset Percobaan"
                      >
                        <RotateCcw className="h-4 w-4 mr-2" />
                        Reset
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      {/* RESET DIALOG */}
      <Dialog open={isResetOpen} onOpenChange={setIsResetOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Reset Percobaan Ujian</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus percobaan kuis <b>{selectedAttempt?.quiz_title}</b> dari mahasiswa <b>{selectedAttempt?.student_name}</b>?
              Data nilai dan jawaban untuk percobaan ini akan terhapus secara permanen, memungkinkan mahasiswa untuk mengulang kuis.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => setIsResetOpen(false)} disabled={loading}>
              Batal
            </Button>
            <Button variant="destructive" onClick={handleResetSubmit} disabled={loading}>
              {loading ? "Mereset..." : "Ya, Reset"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
