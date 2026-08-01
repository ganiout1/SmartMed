"use client";

import { useState } from "react";
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
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Trophy, CheckCircle, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export type StudentLeaderboardData = {
  student_id: string;
  name: string;
  averageScore: number;
  quizzesCompleted: number;
  quizzes: {
    quiz_id: string;
    title: string;
    maxScore: number;
  }[];
};

export function LeaderboardTable({ data }: { data: StudentLeaderboardData[] }) {
  const [selectedStudent, setSelectedStudent] = useState<StudentLeaderboardData | null>(null);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredData = data.filter((student) =>
    student.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex items-center space-x-2">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama mahasiswa..."
            className="pl-8"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>
      </div>

      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[80px] text-center">Peringkat</TableHead>
              <TableHead>Nama Mahasiswa</TableHead>
              <TableHead className="text-center">Kuis Dikerjakan</TableHead>
              <TableHead className="text-center">Rata-rata Nilai</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredData.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="h-24 text-center text-muted-foreground">
                  Belum ada data nilai mahasiswa.
                </TableCell>
              </TableRow>
            ) : (
              filteredData.map((student, index) => {
                let rankIcon = null;
                if (index === 0) rankIcon = <Trophy className="h-5 w-5 text-yellow-500 mx-auto" />;
                else if (index === 1) rankIcon = <Trophy className="h-5 w-5 text-gray-400 mx-auto" />;
                else if (index === 2) rankIcon = <Trophy className="h-5 w-5 text-amber-700 mx-auto" />;
                else rankIcon = <span className="font-medium text-muted-foreground">{index + 1}</span>;

                return (
                  <TableRow key={student.student_id}>
                    <TableCell className="text-center">{rankIcon}</TableCell>
                    <TableCell className="font-medium">{student.name}</TableCell>
                    <TableCell className="text-center">{student.quizzesCompleted}</TableCell>
                    <TableCell className="text-center font-bold">{student.averageScore.toFixed(2)}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setSelectedStudent(student)}
                      >
                        Lihat Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <Dialog open={!!selectedStudent} onOpenChange={(open) => !open && setSelectedStudent(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Detail Nilai Mahasiswa</DialogTitle>
            <DialogDescription>
              Rentetan kuis yang telah dikerjakan oleh {selectedStudent?.name}. (Hanya nilai tertinggi yang ditampilkan)
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4 max-h-[60vh] overflow-y-auto pr-2">
            {selectedStudent?.quizzes.length === 0 ? (
              <p className="text-muted-foreground text-center py-4">Belum ada kuis yang dikerjakan.</p>
            ) : (
              <div className="grid gap-3">
                {selectedStudent?.quizzes.map((quiz) => (
                  <Card key={quiz.quiz_id} className="overflow-hidden">
                    <CardContent className="p-4 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/10 p-2 rounded-full">
                          <CheckCircle className="h-4 w-4 text-primary" />
                        </div>
                        <div>
                          <p className="font-medium text-sm line-clamp-1">{quiz.title}</p>
                        </div>
                      </div>
                      <div className="text-right ml-4 shrink-0">
                        <p className="text-sm text-muted-foreground mb-1">Nilai Tertinggi</p>
                        <p className="text-xl font-bold">{quiz.maxScore}</p>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
