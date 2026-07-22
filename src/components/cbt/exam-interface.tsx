"use client";

import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { Clock, ChevronLeft, ChevronRight, CheckCircle2, AlertTriangle, Send, Flag } from "lucide-react";

import { saveAnswer, submitQuiz } from "@/app/cbt/actions";
import { useExamTimer } from "@/hooks/use-exam-timer";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Progress } from "@/components/ui/progress";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertTitle, AlertDescription } from "@/components/ui/alert";

interface Question {
  id: string;
  question_text: string;
  option_a: string;
  option_b: string;
  option_c: string;
  option_d: string;
  explanation_image_url?: string | null;
  question_image_url?: string | null;
}

interface ExamInterfaceProps {
  attemptId: string;
  quizTitle: string;
  startedAt: string;
  durationMinutes: number;
  questions: Question[];
  initialAnswers: Record<string, string>; // questionId -> selectedOption
}

export function ExamInterface({
  attemptId,
  quizTitle,
  startedAt,
  durationMinutes,
  questions,
  initialAnswers,
}: ExamInterfaceProps) {
  const router = useRouter();
  const [currentIdx, setCurrentIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, string>>(initialAnswers);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = useState(false);
  
  const questionCount = questions.length;
  const answeredCount = Object.keys(answers).length;
  const currentQuestion = questions[currentIdx];

  const [flagged, setFlagged] = useState<Record<string, boolean>>({});

  useEffect(() => {
    try {
      const stored = localStorage.getItem(`smartmed_flags_${attemptId}`);
      if (stored) {
        setFlagged(JSON.parse(stored));
      }
    } catch (e) {}
  }, [attemptId]);

  const toggleFlag = () => {
    const qId = currentQuestion.id;
    setFlagged(prev => {
      const newFlags = { ...prev, [qId]: !prev[qId] };
      try {
        localStorage.setItem(`smartmed_flags_${attemptId}`, JSON.stringify(newFlags));
      } catch (e) {}
      return newFlags;
    });
  };

  // Protect against accidental close/refresh
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      e.preventDefault();
      e.returnValue = "Anda sedang dalam sesi ujian aktif. Progress mungkin tidak tersimpan jika Anda keluar.";
    };
    
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  const handleTimeUp = useCallback(async () => {
    toast.error("Waktu Habis! Ujian disubmit otomatis.");
    await submitFinalQuiz();
  }, []); // eslint-disable-line react-hooks/exhaustive-deps

  const { isWarning, formattedTime } = useExamTimer({
    startedAt,
    durationMinutes,
    onTimeUp: handleTimeUp,
  });

  const handleSelectOption = async (option: string) => {
    const qId = currentQuestion.id;
    
    // Optimistic UI update
    setAnswers(prev => ({ ...prev, [qId]: option }));
    
    // Background save
    const result = await saveAnswer(attemptId, qId, option);
    if (result.error) {
      toast.error("Gagal menyimpan jawaban: " + result.error);
      // Revert if failed (optional, but good UX practice)
    }
  };

  const submitFinalQuiz = async () => {
    setIsSubmitting(true);
    setShowConfirmDialog(false);
    
    // Remove beforeunload listener since we are submitting intentionally
    window.onbeforeunload = null; 

    const result = await submitQuiz(attemptId);
    
    if (result.error) {
      toast.error(result.error);
      setIsSubmitting(false);
    } else if (result.success && result.redirectUrl) {
      toast.success("Ujian berhasil diselesaikan!");
      router.push(result.redirectUrl);
    }
  };

  return (
    <>
      {/* TOP BAR */}
      <header className="sticky top-0 z-10 bg-background border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
          <h1 className="font-bold text-lg truncate hidden sm:block">{quizTitle}</h1>
          <h1 className="font-bold text-lg truncate sm:hidden">CBT Mode</h1>
          
          <div className="flex items-center gap-6">
            <div className="flex flex-col items-end">
              <span className="text-xs text-muted-foreground mb-1">Progres Ujian</span>
              <div className="flex items-center gap-2 w-32">
                <Progress value={(answeredCount / questionCount) * 100} className="h-2" />
                <span className="text-xs font-medium">{answeredCount}/{questionCount}</span>
              </div>
            </div>
            
            <div className={`flex items-center gap-2 px-3 py-1.5 rounded-md font-mono text-lg font-bold border ${isWarning ? 'bg-red-100 text-red-700 border-red-200 animate-pulse' : 'bg-muted border-muted-foreground/20'}`}>
              <Clock className="h-5 w-5" />
              {formattedTime}
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-[1600px] w-full mx-auto p-4 flex flex-col lg:flex-row gap-6 my-6 h-full items-start">
        {/* LEFT COLUMN: Question Info */}
        <aside className="w-full lg:w-48 xl:w-56 shrink-0 order-2 lg:order-1">
          <Card className="bg-muted/30 border-muted">
            <CardContent className="p-4 space-y-4">
              <div>
                <h3 className="font-bold text-lg text-primary">Pertanyaan {currentIdx + 1}</h3>
                <p className="text-sm font-medium mt-1">
                  {answers[currentQuestion.id] ? (
                    <span className="text-green-600">Sudah dijawab</span>
                  ) : (
                    <span className="text-muted-foreground">Belum dijawab</span>
                  )}
                </p>
              </div>
              <div className="text-sm text-muted-foreground pt-4 border-t border-border">
                Bobot Nilai: 1.00
              </div>
              <div className="pt-2">
                <button
                  onClick={toggleFlag}
                  className={`flex items-center text-sm gap-2 transition-colors ${
                    flagged[currentQuestion.id] ? "text-red-600 font-medium" : "text-muted-foreground hover:text-foreground"
                  }`}
                >
                  <Flag className={`h-4 w-4 ${flagged[currentQuestion.id] ? "fill-red-600 text-red-600" : ""}`} />
                  {flagged[currentQuestion.id] ? "Remove flag" : "Flag question"}
                </button>
              </div>
            </CardContent>
          </Card>
        </aside>

        {/* MIDDLE COLUMN: Active Question Content */}
        <div className="flex-1 w-full min-w-0 flex flex-col order-1 lg:order-2">
          <Card className="flex-1 w-full flex flex-col border-primary/10 shadow-sm bg-background">
            <CardContent className="flex-1 w-full p-6 lg:p-10 text-left">
              <div className="text-lg md:text-xl mb-6 leading-relaxed whitespace-pre-wrap text-foreground w-full">
                {currentQuestion.question_text}
              </div>
              
              {currentQuestion.question_image_url && (
                <div className="mb-8 relative w-full max-w-2xl h-64 md:h-80 rounded-md overflow-hidden">
                  <Image
                    src={currentQuestion.question_image_url}
                    alt="Gambar Soal"
                    fill
                    className="object-contain"
                  />
                </div>
              )}

              <RadioGroup
                value={answers[currentQuestion.id] || ""}
                onValueChange={handleSelectOption}
                className="space-y-4"
              >
                {[
                  { id: "A", text: currentQuestion.option_a },
                  { id: "B", text: currentQuestion.option_b },
                  { id: "C", text: currentQuestion.option_c },
                  { id: "D", text: currentQuestion.option_d },
                ].map((opt) => (
                  <div key={opt.id} className="flex items-center space-x-2 w-full">
                    <RadioGroupItem 
                      value={opt.id} 
                      id={`option-${opt.id}`} 
                      className="sr-only" 
                    />
                    <Label
                      htmlFor={`option-${opt.id}`}
                      className={`flex-1 flex items-start gap-4 p-4 rounded-lg cursor-pointer transition-all ${
                        answers[currentQuestion.id] === opt.id
                          ? "border border-primary bg-primary/5 shadow-sm"
                          : "hover:bg-muted/50 border border-transparent"
                      }`}
                    >
                      <span className={`flex shrink-0 items-center justify-center w-6 h-6 rounded-full text-sm font-medium ${
                        answers[currentQuestion.id] === opt.id
                          ? "bg-primary text-primary-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}>
                        {opt.id}
                      </span>
                      <span className="text-base leading-relaxed pt-0.5">{opt.text}</span>
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </CardContent>

            <CardFooter className="flex justify-between items-center bg-background border-t p-4">
              {currentIdx > 0 ? (
                <Button
                  variant="secondary"
                  className="bg-muted text-muted-foreground hover:bg-muted/80"
                  onClick={() => setCurrentIdx(Math.max(0, currentIdx - 1))}
                >
                  Previous page
                </Button>
              ) : <div></div>}
              
              {currentIdx === questionCount - 1 ? (
                <Button variant="default" onClick={() => setShowConfirmDialog(true)}>
                  Finish attempt ...
                </Button>
              ) : (
                <Button variant="default" onClick={() => setCurrentIdx(Math.min(questionCount - 1, currentIdx + 1))}>
                  Next page
                </Button>
              )}
            </CardFooter>
          </Card>
        </div>

        {/* RIGHT COLUMN: Quiz Navigation */}
        <aside className="w-full lg:w-64 xl:w-72 shrink-0 order-3 space-y-4">
          <Card>
            <CardHeader className="py-4 border-b">
              <CardTitle className="text-sm font-medium">Quiz navigation</CardTitle>
            </CardHeader>
            <CardContent className="pt-4">
              <div className="grid grid-cols-5 md:grid-cols-4 gap-2 mb-6">
                {questions.map((q, idx) => {
                  const isAnswered = !!answers[q.id];
                  const isCurrent = idx === currentIdx;
                  
                  let btnClass = "h-10 w-full p-0 font-medium rounded-none ";
                  if (isCurrent) {
                    btnClass += "border-2 border-primary ring-2 ring-primary/20 ";
                  }
                  
                  if (isAnswered) {
                    btnClass += "bg-muted/80 text-foreground border-b-4 border-b-muted-foreground/40 hover:bg-muted/100 border";
                  } else {
                    btnClass += "bg-background text-muted-foreground hover:bg-muted/30 border border-border";
                  }

                  return (
                    <div key={q.id} className="relative">
                      <Button
                        variant="outline"
                        className={btnClass}
                        onClick={() => setCurrentIdx(idx)}
                      >
                        {idx + 1}
                      </Button>
                      {flagged[q.id] && (
                        <div className="absolute top-0 right-0 w-0 h-0 border-t-8 border-l-8 border-t-red-600 border-l-transparent rounded-tr-sm" />
                      )}
                    </div>
                  );
                })}
              </div>
              <Button 
                variant="ghost" 
                className="w-full justify-start text-primary font-medium px-0 hover:bg-transparent hover:underline"
                onClick={() => setShowConfirmDialog(true)}
              >
                Finish attempt ...
              </Button>
            </CardContent>
          </Card>
        </aside>
      </main>

      {/* CONFIRM SUBMIT DIALOG */}
      <Dialog open={showConfirmDialog} onOpenChange={setShowConfirmDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Akhiri Ujian?</DialogTitle>
            <DialogDescription>
              Pastikan Anda telah menjawab semua pertanyaan dengan benar. Anda tidak dapat mengubah jawaban setelah mengakhiri ujian.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            {answeredCount < questionCount ? (
              <Alert variant="destructive" className="bg-yellow-50 border-yellow-200 text-yellow-800">
                <AlertTriangle className="h-4 w-4 stroke-yellow-800" />
                <AlertTitle>Peringatan</AlertTitle>
                <AlertDescription>
                  Masih ada <span className="font-bold">{questionCount - answeredCount}</span> soal yang belum dijawab!
                </AlertDescription>
              </Alert>
            ) : (
              <Alert className="bg-green-50 border-green-200 text-green-800">
                <CheckCircle2 className="h-4 w-4 stroke-green-800" />
                <AlertTitle>Siap Disubmit</AlertTitle>
                <AlertDescription>
                  Anda telah menjawab semua soal.
                </AlertDescription>
              </Alert>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowConfirmDialog(false)} disabled={isSubmitting}>
              Batal, Cek Kembali
            </Button>
            <Button variant="destructive" onClick={submitFinalQuiz} disabled={isSubmitting}>
              {isSubmitting ? "Memproses..." : "Ya, Akhiri Ujian"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
