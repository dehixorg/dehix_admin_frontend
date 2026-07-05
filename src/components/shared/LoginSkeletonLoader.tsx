import { Skeleton } from '@/components/ui/skeleton';

const LoginSkeletonLoader = () => {
  return (
    <div className="w-full lg:grid lg:min-h-[600px] lg:grid-cols-2 xl:min-h-screen">
      <div className="flex items-center justify-center py-12">
        <div className="mx-auto grid w-[350px] gap-6">
          <div className="grid gap-2 text-center">
            <Skeleton className="h-8 w-24 mx-auto" />
            <Skeleton className="h-4 w-48 mx-auto" />
          </div>

          <Skeleton className="h-4 w-32" />

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Skeleton className="h-4 w-12" />
              <Skeleton className="h-10 w-full" />
            </div>
            <div className="grid gap-2">
              <Skeleton className="h-4 w-16" />
              <Skeleton className="h-10 w-full" />
            </div>
            <Skeleton className="h-10 w-full" />
            <Skeleton className="h-10 w-full" />
          </div>

          <div className="mt-4 text-center text-sm">
            <Skeleton className="h-4 w-40 mx-auto" />
          </div>
        </div>
      </div>
      <div className="hidden lg:block">
        <Skeleton className="h-full w-full" />
      </div>
    </div>
  );
};

export default LoginSkeletonLoader;
