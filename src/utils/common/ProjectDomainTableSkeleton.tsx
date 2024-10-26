// utils/common/ProjectDomainTableSkeleton.tsx

import React from "react";
import { TableRow, TableCell } from "@/components/ui/table";
import { Skeleton } from "@/components/ui/skeleton"; // Ensure this import is correct

const ProjectDomainTableSkeleton: React.FC = () => {
  return (
    <>
      {Array.from({ length: 9 }).map((_, index) => (
        <TableRow key={index}>
          <TableCell>
            <Skeleton className="h-4 w-20" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-16" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-28" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-28" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-7 w-12 rounded-3xl" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-6 w-10" />
          </TableCell>
          <TableCell>
            <Skeleton className="h-4 w-6" />
          </TableCell>
        </TableRow>
      ))}
    </>
  );
};

export default ProjectDomainTableSkeleton;
