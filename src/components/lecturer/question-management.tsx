"use client";

import { useState, useRef } from "react";
import { Plus, Trash2, Edit2, Image as ImageIcon, X } from "lucide-react";
import { toast } from "sonner";
import Image from "next/image";
import { createQuestion, updateQuestion, deleteQuestion } from "@/app/dashboard/lecturer/quizzes/[quizId]/actions";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Card, CardContent } from "@/components/ui/card";

type QuestionData = {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  correct_option: string;
  explanation_text: string | null;
  explanation_image_url: string | null;
};

interface QuestionManagementProps {
  quizId: string;
  questions: QuestionData[];
}

export function QuestionManagement({ quizId, questions }: QuestionManagementProps) {
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [selectedQuestion, setSelectedQuestion] = useState<QuestionData | null>(null);
  
  const [loading, setLoading] = useState(false);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [removeExistingImage, setRemoveExistingImage] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 2 * 1024 * 1024) {
        toast.error("Ukuran gambar maksimal 2MB");
        if (fileInputRef.current) fileInputRef.current.value = "";
        return;
      }
      setRemoveExistingImage(false);
      const reader = new FileReader();
      reader.onloadend = () => {
        setPreviewImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const clearImage = () => {
    setPreviewImage(null);
    setRemoveExistingImage(true);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleAddSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    const result = await createQuestion(quizId, formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Soal berhasil ditambahkan");
      setIsAddOpen(false);
      setPreviewImage(null);
    }
    setLoading(false);
  };

  const handleEditSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (!selectedQuestion) return;
    setLoading(true);
    const formData = new FormData(e.currentTarget);
    if (removeExistingImage) {
      formData.append("removeImage", "true");
    }
    formData.append("existingImageUrl", selectedQuestion.explanation_image_url || "");
    
    const result = await updateQuestion(quizId, selectedQuestion.id, formData);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Soal berhasil diubah");
      setIsEditOpen(false);
      setPreviewImage(null);
    }
    setLoading(false);
  };

  const handleDeleteSubmit = async () => {
    if (!selectedQuestion) return;
    setLoading(true);
    const result = await deleteQuestion(quizId, selectedQuestion.id);

    if (result.error) {
      toast.error(result.error);
    } else {
      toast.success("Soal berhasil dihapus");
      setIsDeleteOpen(false);
    }
    setLoading(false);
  };

  const openAdd = () => {
    setPreviewImage(null);
    setIsAddOpen(true);
  };

  const openEdit = (q: QuestionData) => {
    setSelectedQuestion(q);
    setPreviewImage(q.explanation_image_url);
    setRemoveExistingImage(false);
    setIsEditOpen(true);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Daftar Soal ({questions.length})</h3>
        <Button onClick={openAdd}>
          <Plus className="mr-2 h-4 w-4" />
          Tambah Soal
        </Button>
      </div>

      {questions.length === 0 ? (
        <div className="text-center py-12 bg-background border rounded-lg">
          <p className="text-muted-foreground">Belum ada soal untuk kuis ini.</p>
        </div>
      ) : (
        <div className="space-y-4">
          {questions.map((q, index) => (
            <Card key={q.id}>
              <CardContent className="p-6">
                <div className="flex justify-between items-start gap-4">
                  <div className="space-y-4 flex-1">
                    <div className="flex gap-2">
                      <span className="font-bold">{index + 1}.</span>
                      <p className="whitespace-pre-wrap">{q.question_text}</p>
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-6">
                      <div className={`p-2 rounded border ${q.correct_option === 'A' ? 'bg-green-50/50 border-green-200' : ''}`}>
                        <span className="font-semibold mr-2">A.</span> {q.option_a}
                      </div>
                      <div className={`p-2 rounded border ${q.correct_option === 'B' ? 'bg-green-50/50 border-green-200' : ''}`}>
                        <span className="font-semibold mr-2">B.</span> {q.option_b}
                      </div>
                      <div className={`p-2 rounded border ${q.correct_option === 'C' ? 'bg-green-50/50 border-green-200' : ''}`}>
                        <span className="font-semibold mr-2">C.</span> {q.option_c}
                      </div>
                      <div className={`p-2 rounded border ${q.correct_option === 'D' ? 'bg-green-50/50 border-green-200' : ''}`}>
                        <span className="font-semibold mr-2">D.</span> {q.option_d}
                      </div>
                    </div>

                    {(q.explanation_text || q.explanation_image_url) && (
                      <div className="mt-4 p-4 bg-muted/50 rounded-md">
                        <p className="text-sm font-semibold mb-2">Pembahasan:</p>
                        {q.explanation_text && <p className="text-sm mb-2">{q.explanation_text}</p>}
                        {q.explanation_image_url && (
                          <div className="relative h-48 w-full max-w-sm">
                            <Image 
                              src={q.explanation_image_url} 
                              alt="Pembahasan" 
                              fill 
                              className="object-contain"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex flex-col gap-2">
                    <Button variant="outline" size="sm" onClick={() => openEdit(q)}>
                      <Edit2 className="h-4 w-4 mr-2" /> Edit
                    </Button>
                    <Button 
                      variant="destructive" 
                      size="sm"
                      onClick={() => {
                        setSelectedQuestion(q);
                        setIsDeleteOpen(true);
                      }}
                    >
                      <Trash2 className="h-4 w-4 mr-2" /> Hapus
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}

      {/* ADD DIALOG */}
      <Dialog open={isAddOpen} onOpenChange={setIsAddOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Tambah Soal Baru</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleAddSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Pertanyaan</Label>
              <Textarea name="questionText" required rows={4} placeholder="Tuliskan soal di sini..." />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pilihan A</Label>
                <Input name="optionA" required />
              </div>
              <div className="space-y-2">
                <Label>Pilihan B</Label>
                <Input name="optionB" required />
              </div>
              <div className="space-y-2">
                <Label>Pilihan C</Label>
                <Input name="optionC" required />
              </div>
              <div className="space-y-2">
                <Label>Pilihan D</Label>
                <Input name="optionD" required />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Jawaban Benar</Label>
              <Select name="correctOption" required defaultValue="A">
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jawaban benar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Pilihan A</SelectItem>
                  <SelectItem value="B">Pilihan B</SelectItem>
                  <SelectItem value="C">Pilihan C</SelectItem>
                  <SelectItem value="D">Pilihan D</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border-t pt-4 mt-4 space-y-4">
              <h4 className="text-sm font-semibold">Pembahasan (Opsional)</h4>
              <div className="space-y-2">
                <Label>Teks Pembahasan</Label>
                <Textarea name="explanationText" rows={3} placeholder="Penjelasan mengapa jawaban tersebut benar..." />
              </div>
              
              <div className="space-y-2">
                <Label>Gambar Pembahasan</Label>
                <div className="flex items-center gap-4">
                  <Input 
                    ref={fileInputRef}
                    name="explanationImage" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="flex-1"
                  />
                  {previewImage && (
                    <Button type="button" variant="outline" size="icon" onClick={clearImage}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {previewImage && (
                  <div className="relative h-32 w-48 mt-2 border rounded overflow-hidden">
                    <Image src={previewImage} alt="Preview" fill className="object-contain" />
                  </div>
                )}
              </div>
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setIsAddOpen(false)} disabled={loading}>
                Batal
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Menyimpan..." : "Simpan Soal"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* EDIT DIALOG */}
      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Edit Soal</DialogTitle>
          </DialogHeader>
          <form onSubmit={handleEditSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label>Pertanyaan</Label>
              <Textarea name="questionText" required rows={4} defaultValue={selectedQuestion?.question_text} />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Pilihan A</Label>
                <Input name="optionA" required defaultValue={selectedQuestion?.option_a} />
              </div>
              <div className="space-y-2">
                <Label>Pilihan B</Label>
                <Input name="optionB" required defaultValue={selectedQuestion?.option_b} />
              </div>
              <div className="space-y-2">
                <Label>Pilihan C</Label>
                <Input name="optionC" required defaultValue={selectedQuestion?.option_c} />
              </div>
              <div className="space-y-2">
                <Label>Pilihan D</Label>
                <Input name="optionD" required defaultValue={selectedQuestion?.option_d} />
              </div>
            </div>

            <div className="space-y-2">
              <Label>Jawaban Benar</Label>
              <Select name="correctOption" required defaultValue={selectedQuestion?.correct_option}>
                <SelectTrigger>
                  <SelectValue placeholder="Pilih jawaban benar" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="A">Pilihan A</SelectItem>
                  <SelectItem value="B">Pilihan B</SelectItem>
                  <SelectItem value="C">Pilihan C</SelectItem>
                  <SelectItem value="D">Pilihan D</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="border-t pt-4 mt-4 space-y-4">
              <h4 className="text-sm font-semibold">Pembahasan (Opsional)</h4>
              <div className="space-y-2">
                <Label>Teks Pembahasan</Label>
                <Textarea name="explanationText" rows={3} defaultValue={selectedQuestion?.explanation_text || ""} />
              </div>
              
              <div className="space-y-2">
                <Label>Gambar Pembahasan</Label>
                <div className="flex items-center gap-4">
                  <Input 
                    ref={fileInputRef}
                    name="explanationImage" 
                    type="file" 
                    accept="image/*" 
                    onChange={handleImageChange}
                    className="flex-1"
                  />
                  {previewImage && (
                    <Button type="button" variant="outline" size="icon" onClick={clearImage}>
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                </div>
                {previewImage && (
                  <div className="relative h-32 w-48 mt-2 border rounded overflow-hidden bg-muted/50">
                    <Image src={previewImage} alt="Preview" fill className="object-contain" />
                  </div>
                )}
              </div>
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
            <DialogTitle>Hapus Soal</DialogTitle>
            <DialogDescription>
              Apakah Anda yakin ingin menghapus soal ini?
              Tindakan ini tidak dapat dibatalkan.
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
