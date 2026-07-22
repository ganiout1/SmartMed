import { Skeleton } from "@/components/ui/skeleton";
import { SectionHeader } from "@/components/ui/section-header";

export default function StudentLoading() {
  return (
    <div className="space-y-8 max-w-7xl mx-auto pb-8">
      <div>
        <SectionHeader
          title="Dashboard Mahasiswa"
          subtitle="Pantau progres belajar dan hasil kuis Anda."
          align="center"
        />

        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 mt-6">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="rounded-xl border bg-card text-card-foreground shadow-sm">
              <div className="flex flex-row items-center justify-between space-y-0 p-6 pb-2">
                <Skeleton className="h-4 w-[100px]" />
                <Skeleton className="h-4 w-4" />
              </div>
              <div className="p-6 pt-0">
                <Skeleton className="h-8 w-[60px] mb-1" />
                <Skeleton className="h-3 w-[120px]" />
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="pt-4">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <Skeleton className="h-7 w-[200px]" />
          <Skeleton className="h-10 w-full sm:w-80 rounded-md" />
        </div>

        <div className="mb-6 flex gap-2">
          <Skeleton className="h-10 w-[120px] rounded-md" />
          <Skeleton className="h-10 w-[120px] rounded-md" />
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex flex-col overflow-hidden rounded-xl border bg-card shadow-sm">
              <Skeleton className="w-full aspect-square" />
              <div className="p-6">
                <Skeleton className="h-6 w-3/4 mb-2" />
                <Skeleton className="h-4 w-full mb-1" />
                <Skeleton className="h-4 w-5/6" />
              </div>
              <div className="p-6 pt-0 mt-auto">
                <Skeleton className="h-10 w-full" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
