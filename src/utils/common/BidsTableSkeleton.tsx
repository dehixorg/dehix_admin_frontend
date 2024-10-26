// utils/common/BidsTableSkeleton.tsx

import * as React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton as SkeletonComponent } from "@/components/ui/skeleton"; // Ensure the import is correct

const BidsTableSkeleton: React.FC = () => {
  return (
    <>
      {Array.from({ length: 15 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <SkeletonComponent className="h-4 w-20" />
          </TableCell>
          <TableCell>
            <SkeletonComponent className="h-4 w-16" />
          </TableCell>
          <TableCell>
            <SkeletonComponent className="h-4 w-20" />
          </TableCell>
          <TableCell>
            <SkeletonComponent className="h-4 w-20" />
          </TableCell>
          <TableCell>
            <SkeletonComponent className="h-4 w-12" />
          </TableCell>
          <TableCell>
            <SkeletonComponent className="h-4 w-28" />
          </TableCell>
          <TableCell>
            <SkeletonComponent className="h-4 w-6" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default BidsTableSkeleton;
