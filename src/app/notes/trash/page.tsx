'use client';

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import DashboardShell from '@/components/layouts/DashboardShell';
import {
  menuItemsBottom,
} from '@/config/menuItems/business/dashboardMenuItems';
import { notesMenu } from '@/config/menuItems/admin/dashboardMenuItems';
import NotesRender from '@/components/shared/NotesRender';
import useFetchNotes from '@/hooks/useFetchNotes';

import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import EmptyState from '@/components/shared/EmptyState';

const Trash = () => {
  const user = useSelector((state: any) => state.user);
  const userId = user.uid;
  const { trash, isLoading, fetchNotes, setTrash } = useFetchNotes(userId);

  useEffect(() => {
    if (userId) {
      fetchNotes();
    }
  }, [fetchNotes, userId]);

  return (
    <DashboardShell
      menuItemsTop={notesMenu}
      menuItemsBottom={menuItemsBottom}
      active="Trash"
      breadcrumbItems={[
        { label: "Dashboard", link: "/business" },
        { label: "Notes", link: "/notes" },
        { label: "Trash", link: "/notes/trash" },
      ]}
      mainClassName="p-6"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Trash</h1>
        <p className="text-gray-400 mt-2 hidden md:block">
          Deleted notes will appear here. Notes in trash will be permanently deleted after 30 days.
        </p>
      </div>
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-5">
          {Array.from({ length: 8 }).map((_, i) => (
            <Card key={i} className="p-4">
              <Skeleton className="h-24 w-full mb-3" />
              <Skeleton className="h-4 w-3/4 mb-2" />
              <Skeleton className="h-4 w-1/2" />
            </Card>
          ))}
        </div>
      ) : trash?.length > 0 ? (
        <NotesRender
          fetchNotes={fetchNotes}
          notes={trash}
          setNotes={setTrash}
          isArchive={false}
          isTrash={true}
        />
      ) : (
        <EmptyState
          icon={
            <div className="mb-6 opacity-90">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 200 120"
                className="w-56 h-32 mx-auto"
                aria-hidden
              >
                <rect
                  x="10"
                  y="20"
                  width="180"
                  height="80"
                  rx="12"
                  className="fill-muted"
                />
                <rect
                  x="26"
                  y="36"
                  width="60"
                  height="10"
                  rx="5"
                  className="fill-muted-foreground/40"
                />
                <rect
                  x="26"
                  y="54"
                  width="120"
                  height="10"
                  rx="5"
                  className="fill-muted-foreground/30"
                />
                <rect
                  x="26"
                  y="72"
                  width="90"
                  height="10"
                  rx="5"
                  className="fill-muted-foreground/20"
                />
                <circle
                  cx="160"
                  cy="60"
                  r="10"
                  className="fill-primary/30"
                />
              </svg>
            </div>
          }
          title="Trash is empty"
          description="Deleted notes will appear here. They will be permanently deleted after 30 days."
          className="p-8 sm:p-12 border-0 bg-transparent"
        />
      )}
    </DashboardShell>
  );
};

export default Trash;