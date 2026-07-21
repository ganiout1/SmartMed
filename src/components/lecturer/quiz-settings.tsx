"use client";

import { useState } from "react";
import { toast } from "sonner";
import { updateQuizSettings } from "@/app/dashboard/lecturer/quizzes/[quizId]/actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

type QuizSettingsData = {
  id: string;
  duration_minutes: number;
  passing_score: number;
  status: string;
  randomize_questions: boolean;
  randomize_answers: boolean;
};

interface QuizSettingsProps {
  quiz: QuizSettingsData;
}

export function QuizSettings({ quiz }: QuizSettingsProps) {
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await updateQuizSettings(quiz.id, formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Pengaturan kuis berhasil disimpan");
    }
    setLoading(false);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Pengaturan Kuis</CardTitle>
        <CardDescription>
          Atur durasi, nilai kelulusan, status ketersediaan, serta opsi pengacakan.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6 max-w-2xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="duration">Durasi Pengerjaan (Menit)</Label>
              <Input 
                id="duration" 
                name="duration" 
                type="number" 
                min={0} 
                defaultValue={quiz.duration_minutes} 
                required 
              />
              <p className="text-xs text-muted-foreground">Isi 0 jika tidak ada batas waktu.</p>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="passingScore">Nilai Kelulusan Minimal (0-100)</Label>
              <Input 
                id="passingScore" 
                name="passingScore" 
                type="number" 
                min={0} 
                max={100} 
                defaultValue={quiz.passing_score} 
                required 
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="status">Status Kuis</Label>
            <Select name="status" defaultValue={quiz.status}>
              <SelectTrigger>
                <SelectValue placeholder="Pilih status kuis" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="draft">Draft (Disembunyikan dari mahasiswa)</SelectItem>
                <SelectItem value="published">Published (Dapat diakses mahasiswa)</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-4 pt-4 border-t">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="randomizeQuestions" className="text-base">Acak Urutan Soal</Label>
                <p className="text-sm text-muted-foreground">
                  Setiap mahasiswa akan mendapatkan soal dengan urutan yang berbeda.
                </p>
              </div>
              <Switch 
                id="randomizeQuestions" 
                name="randomizeQuestions" 
                defaultChecked={quiz.randomize_questions} 
              />
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label htmlFor="randomizeAnswers" className="text-base">Acak Urutan Jawaban (Pilihan Ganda)</Label>
                <p className="text-sm text-muted-foreground">
                  Urutan opsi A, B, C, D akan diacak untuk setiap pertanyaan (label tetap sama, tapi isi berubah).
                </p>
              </div>
              <Switch 
                id="randomizeAnswers" 
                name="randomizeAnswers" 
                defaultChecked={quiz.randomize_answers} 
              />
            </div>
          </div>

          <Button type="submit" disabled={loading}>
            {loading ? "Menyimpan..." : "Simpan Pengaturan"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
