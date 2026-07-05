import { Skeleton } from '@/components/ui/skeleton';

const FeedbackSkeletonLoader = () => {
  return (
    <div className="bg-card rounded-lg border p-6 space-y-8">
      {/* Basic Information Section */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-16" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-20 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-12" />
            <Skeleton className="h-6 w-20" />
          </div>
        </div>
      </div>

      {/* Target Audience Section */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-40" />
        <div className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-32" />
            <Skeleton className="h-10 w-full" />
          </div>
          {/* Freelancer Rules Placeholder */}
          <div className="space-y-2">
            <Skeleton className="h-4 w-36" />
            <div className="border p-3 rounded space-y-2">
              <div className="grid grid-cols-2 gap-3">
                {[...Array(4)].map((_, i) => (
                  <div key={i} className="space-y-1">
                    <Skeleton className="h-4 w-24" />
                    <Skeleton className="h-10 w-full" />
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Questions Section */}
      <div className="space-y-4">
        <Skeleton className="h-8 w-32" />
        <div className="space-y-3">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="border p-4 rounded space-y-3">
              <div className="space-y-2">
                <Skeleton className="h-4 w-28" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-16" />
                <Skeleton className="h-10 w-full" />
              </div>
              <div className="space-y-2">
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-6 w-16" />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default FeedbackSkeletonLoader;
