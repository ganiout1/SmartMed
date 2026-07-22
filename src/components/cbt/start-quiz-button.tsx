"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { startQuiz } from "@/app/cbt/actions";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { PlayCircle } from "lucide-react";

interface StartQuizButtonProps {
  quizId: string;
  activeAttemptId?: string;
  label?: string;
}

export function StartQuizButton({ quizId, activeAttemptId, label }: StartQuizButtonProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleStart = async () => {
    setLoading(true);
    
    // Server action to validate and get/create attempt
    const result = await startQuiz(quizId);
    
    if (result.error) {
      toast.error(result.error);
      setLoading(false);
    } else if (result.success && result.attemptId) {
      router.push(`/cbt/${quizId}/attempt/${result.attemptId}`);
    }
  };

  return (
    <Button onClick={handleStart} disabled={loading} className="w-full sm:w-auto font-bold text-md">
      {loading ? (
        "Memproses..."
      ) : activeAttemptId ? (
        <>
          <PlayCircle className="mr-2 h-5 w-5" />
          {label || "Lanjutkan Kuis"}
        </>
      ) : (
        <>
          <PlayCircle className="mr-2 h-5 w-5" />
          {label || "Mulai Kuis Sekarang"}
        </>
      )}
    </Button>
  );
}
