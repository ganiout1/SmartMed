"use client";

import { useState, useMemo } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2, XCircle } from "lucide-react";
import Image from "next/image";
import { Button } from "@/components/ui/button";

type FilterType = "salah" | "semua" | "benar";

export function HistoryAnswersFilter({ answers }: { answers: any[] }) {
  const [filter, setFilter] = useState<FilterType>("semua");

  const salahCount = answers.filter((a) => !a.is_correct).length;
  const semuaCount = answers.length;
  const benarCount = answers.filter((a) => a.is_correct).length;

  const filteredAnswers = useMemo(() => {
    if (filter === "salah") return answers.filter((a) => !a.is_correct);
    if (filter === "benar") return answers.filter((a) => a.is_correct);
    return answers;
  }, [answers, filter]);

  return (
    <div className="space-y-6 mt-8">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-4">
        <h3 className="text-xl font-bold">Detail Jawaban & Pembahasan</h3>
        <div className="flex bg-muted p-1 rounded-lg gap-1">
          <Button
            variant={filter === "salah" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("salah")}
            className="rounded-md"
          >
            Salah ({salahCount})
          </Button>
          <Button
            variant={filter === "semua" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("semua")}
            className="rounded-md"
          >
            Semua ({semuaCount})
          </Button>
          <Button
            variant={filter === "benar" ? "default" : "ghost"}
            size="sm"
            onClick={() => setFilter("benar")}
            className="rounded-md"
          >
            Benar ({benarCount})
          </Button>
        </div>
      </div>

      {!filteredAnswers || filteredAnswers.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          Tidak ada data jawaban untuk filter ini.
        </p>
      ) : (
        filteredAnswers.map((answer, i) => {
          // Find original index to display correct question number
          const originalIndex = answers.findIndex((a) => a.id === answer.id);
          const q = answer.questions;
          if (!q) return null;

          return (
            <Card
              key={answer.id}
              className={answer.is_correct ? "border-green-200" : "border-red-200"}
            >
              <CardContent className="p-6">
                <div className="flex gap-4">
                  <div className="shrink-0 mt-1">
                    {answer.is_correct ? (
                      <CheckCircle2 className="h-6 w-6 text-green-600" />
                    ) : (
                      <XCircle className="h-6 w-6 text-red-600" />
                    )}
                  </div>
                  <div className="flex-1 space-y-4">
                    <div className="flex gap-2">
                      <span className="font-bold">{originalIndex + 1}.</span>
                      <p className="whitespace-pre-wrap">{q.question_text}</p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-2 pl-6">
                      {[
                        { label: "A", text: q.option_a },
                        { label: "B", text: q.option_b },
                        { label: "C", text: q.option_c },
                        { label: "D", text: q.option_d },
                        ...(q.option_e ? [{ label: "E", text: q.option_e }] : []),
                      ].map((opt) => {
                        const isStudentChoice = answer.selected_option === opt.label;
                        const isCorrectChoice = q.correct_option === opt.label;
                        const isUnanswered = !answer.selected_option;

                        let bgClass = "border";
                        if (isCorrectChoice) {
                          bgClass = "bg-green-50 border-green-300 font-medium";
                        } else if (isStudentChoice && !isCorrectChoice) {
                          bgClass = "bg-red-50 border-red-300";
                        }

                        return (
                          <div
                            key={opt.label}
                            className={`p-3 rounded-md ${bgClass} flex items-start justify-between gap-2 min-w-0`}
                          >
                            <div className="min-w-0 flex-1">
                              <span className="font-semibold mr-2">{opt.label}.</span>
                              <span className="break-all">{opt.text}</span>
                            </div>
                            {isStudentChoice && (
                              <Badge
                                variant="outline"
                                className={`shrink-0 ${isCorrectChoice ? "text-green-700" : "text-red-700"}`}
                              >
                                Jawaban Anda
                              </Badge>
                            )}
                            {isCorrectChoice && isUnanswered && (
                              <Badge variant="outline" className="shrink-0 text-amber-700">
                                Tidak Dijawab
                              </Badge>
                            )}
                          </div>
                        );
                      })}
                    </div>

                    {(q.explanation_text || q.explanation_image_url) && (
                      <div className="mt-6 p-4 bg-muted/30 rounded-lg border ml-6">
                        <p className="font-semibold mb-2 flex items-center gap-2">Pembahasan</p>
                        {q.explanation_text && (
                          <p className="text-sm whitespace-pre-wrap mb-4">{q.explanation_text}</p>
                        )}
                        {q.explanation_image_url && (
                          <div className="relative h-64 w-full max-w-lg rounded-md overflow-hidden border bg-background">
                            <Image
                              src={q.explanation_image_url}
                              alt="Gambar Pembahasan"
                              fill
                              className="object-contain"
                            />
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })
      )}
    </div>
  );
}
