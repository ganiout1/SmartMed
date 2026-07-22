"use client";

import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { AlertOctagon, RefreshCcw } from "lucide-react";

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    // Optionally log the error to an error reporting service
    console.error(error);
  }, [error]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-muted/20 px-4 text-center">
      <div className="bg-destructive/10 p-6 rounded-full mb-6">
        <AlertOctagon className="h-16 w-16 text-destructive" />
      </div>
      <h2 className="text-2xl font-bold mb-4">Terjadi Kesalahan</h2>
      <p className="text-muted-foreground max-w-md mb-8">
        Maaf, sistem mendeteksi kesalahan teknis yang tidak terduga. Silakan coba muat ulang halaman ini.
      </p>
      <div className="flex gap-4">
        <Button onClick={() => reset()} variant="default">
          <RefreshCcw className="mr-2 h-4 w-4" />
          Coba Lagi
        </Button>
      </div>
    </div>
  );
}
