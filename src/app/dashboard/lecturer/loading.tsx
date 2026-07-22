import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeader } from "@/components/ui/section-header";

export default function LecturerLoading() {
  return (
    <div className="space-y-6 max-w-7xl mx-auto">
      <SectionHeader
        title="Dashboard Dosen"
        subtitle="Pantau ringkasan kelas dan aktivitas ujian mahasiswa Anda."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
        {[1, 2, 3, 4, 5].map((i) => (
          <div key={i} className="rounded-xl border bg-card text-card-foreground shadow-sm">
            <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
              <Skeleton className="h-4 w-[100px]" />
              <Skeleton className="h-4 w-4" />
            </div>
            <div className="p-6 pt-0">
              <Skeleton className="h-8 w-[60px] mb-1" />
              <Skeleton className="h-3 w-[140px]" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
