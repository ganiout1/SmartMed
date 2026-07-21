"use client";

import { useState } from "react";
import { Search, Eye } from "lucide-react";

import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

type ResultData = {
  id: string;
  student_name: string;
  score: number | null;
  passing_score: number;
  started_at: string;
  completed_at: string | null;
  duration_minutes: number;
};

interface StudentResultsProps {
  results: ResultData[];
}

export function StudentResults({ results }: StudentResultsProps) {
  const [search, setSearch] = useState("");

  const filteredResults = results.filter(
    (r) => r.student_name.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4 bg-background p-6 rounded-lg border">
      <div className="flex flex-col sm:flex-row justify-between gap-4">
        <div className="relative w-full sm:w-72">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Cari nama mahasiswa..."
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
              <TableHead>Nama Mahasiswa</TableHead>
              <TableHead className="text-center">Nilai</TableHead>
              <TableHead className="text-center">Status</TableHead>
              <TableHead>Waktu Mulai</TableHead>
              <TableHead>Waktu Selesai</TableHead>
              <TableHead className="text-right">Aksi</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredResults.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="h-24 text-center">
                  Belum ada data ujian mahasiswa.
                </TableCell>
              </TableRow>
            ) : (
              filteredResults.map((result) => {
                const isCompleted = result.completed_at !== null;
                const isPassed =
                  isCompleted &&
                  result.score !== null &&
                  result.score >= result.passing_score;

                return (
                  <TableRow key={result.id}>
                    <TableCell className="font-medium">{result.student_name}</TableCell>
                    <TableCell className="text-center font-mono text-lg">
                      {isCompleted ? result.score : "-"}
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
                      {new Date(result.started_at).toLocaleString("id-ID")}
                    </TableCell>
                    <TableCell>
                      {isCompleted
                        ? new Date(result.completed_at!).toLocaleString("id-ID")
                        : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      {/* For now we just place a dummy button or link to detail answers if needed */}
                      <Button variant="outline" size="sm" disabled title="Fitur lihat jawaban detail akan segera hadir">
                        <Eye className="h-4 w-4 mr-2" /> Detail
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
