import { Skeleton } from '@/components/ui/skeleton';

const ReportSkeletonLoader = () => {
  return (
    <div className="flex h-screen w-full items-center justify-center bg-muted/40 dark:bg-zinc-950">
      <div className="w-full max-w-4xl space-y-6 p-6">
        {/* Header Section */}
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>

        {/* Report Details Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="bg-white dark:bg-zinc-900 rounded-md shadow p-4 space-y-2">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-5 w-32" />
            </div>
          ))}
        </div>

        {/* Message Thread Section */}
        <div className="bg-white dark:bg-zinc-900 rounded-md shadow p-6 max-w-3xl mx-auto w-full space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="h-[400px] overflow-y-auto space-y-4 px-2">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex justify-start">
                <div className="max-w-[85%] px-4 py-3 rounded-lg text-sm shadow-sm space-y-2">
                  <Skeleton className="h-3 w-24" />
                  <Skeleton className="h-4 w-48" />
                  <Skeleton className="h-3 w-20" />
                </div>
              </div>
            ))}
          </div>
          <div className="mt-6 space-y-2">
            <Skeleton className="h-20 w-full" />
            <Skeleton className="h-10 w-24 ml-auto" />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportSkeletonLoader;
