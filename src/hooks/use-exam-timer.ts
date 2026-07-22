"use client";

import { useState, useEffect, useRef } from "react";

interface UseExamTimerProps {
  startedAt: string;
  durationMinutes: number;
  onTimeUp: () => void;
}

export function useExamTimer({ startedAt, durationMinutes, onTimeUp }: UseExamTimerProps) {
  const [timeLeft, setTimeLeft] = useState<number | null>(null);
  const [isWarning, setIsWarning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  const isTimeUpFired = useRef(false);

  useEffect(() => {
    if (durationMinutes === 0) {
      // 0 means unlimited time
      setTimeLeft(null);
      return;
    }

    const start = new Date(startedAt).getTime();
    const durationMs = durationMinutes * 60 * 1000;
    const end = start + durationMs;

    const calculateTimeLeft = () => {
      const now = new Date().getTime();
      const remaining = end - now;

      if (remaining <= 0) {
        setTimeLeft(0);
        if (!isTimeUpFired.current) {
          isTimeUpFired.current = true;
          onTimeUp();
        }
      } else {
        setTimeLeft(remaining);
        // Warning if less than 5 minutes
        setIsWarning(remaining < 5 * 60 * 1000);
      }
    };

    calculateTimeLeft(); // Initial calculation

    timerRef.current = setInterval(calculateTimeLeft, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [startedAt, durationMinutes, onTimeUp]);

  // Format timeLeft into HH:MM:SS or MM:SS
  const formatTime = () => {
    if (timeLeft === null) return "Tanpa Batas Waktu";
    
    if (timeLeft <= 0) return "00:00";

    const totalSeconds = Math.floor(timeLeft / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    if (hours > 0) {
      return `${hours.toString().padStart(2, "0")}:${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
    }
    return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
  };

  return {
    timeLeft,
    isWarning,
    formattedTime: formatTime(),
  };
}
