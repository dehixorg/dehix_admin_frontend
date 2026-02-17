'use client';

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import { EntityType, LabelType, Note, NoteType } from '@/utils/types/note';
import NotesRender from '@/components/shared/NotesRender';
import DashboardShell from '@/components/layouts/DashboardShell';
import {
  menuItemsBottom,
} from '@/config/menuItems/business/dashboardMenuItems';
import { notesMenu } from '@/config/menuItems/admin/dashboardMenuItems';
import { axiosInstance } from '@/lib/axiosinstance';
import useFetchNotes from '@/hooks/useFetchNotes';

import { toast } from '@/components/ui/use-toast';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';

import EmptyState from '@/components/shared/EmptyState';

const Page = () => {
  const user = useSelector((state: any) => state.user);
  const userId = user.uid;

  const { archive, isLoading, fetchNotes, setArchive } = useFetchNotes(userId);

  useEffect(() => {
    if (!userId) return;
    fetchNotes();
  }, [userId, fetchNotes]);

  const handleCreateNote = async (note: Partial<Note>) => {
    if (!note.title || !note.content || !userId) {
      toast({
        title: 'Error',
        description: 'Title and content are required fields.',
        variant: 'destructive',
        duration: 5000,
      });
      return;
    }

    const tempNote: Note = {
      title: note.title || '',
      content: note.content || '',
      userId,
      bgColor: note.bgColor || '#FFFFFF',
      banner: note.banner || '',
      isHTML: false,
      noteType: NoteType.ARCHIVE,
      type: LabelType.PERSONAL,
      entityType: (user?.type?.toUpperCase() as EntityType) || EntityType.BUSINESS,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    // Optimistically update the UI
    setArchive((prev) => [tempNote, ...prev]);

    try {
      const response = await axiosInstance.post('/notes', tempNote);
      
      if (response.data) {
        toast({
          title: 'Note Created',
          description: 'Your note has been successfully created and archived.',
          duration: 5000,
        });
        await fetchNotes();
      }
    } catch (error: any) {
      console.error('Failed to create note:', error);
      
      const errorMessage = error.response?.data?.message || 
                          error.response?.data?.error || 
                          'Failed to create note. Please try again.';
      
      toast({
        title: 'Error Creating Note',
        description: errorMessage,
        variant: 'destructive',
        duration: 5000,
      });

      // Revert UI on error
      setArchive((prev) => prev.filter((n) => n !== tempNote));
    }
  };

  return (
    <DashboardShell
      menuItemsTop={notesMenu}
      menuItemsBottom={menuItemsBottom}
      active="Archive"
      breadcrumbItems={[
        { label: "Dashboard", link: "/business" },
        { label: "Notes", link: "/notes" },
        { label: "Archive", link: "/notes/archive" },
      ]}
      mainClassName="p-6"
    >
      <div className="mb-6">
        <h1 className="text-3xl font-bold">Archived Notes</h1>
        <p className="text-gray-400 mt-2 hidden md:block">
          Your archived notes will appear here.
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
      ) : archive?.length > 0 ? (
        <NotesRender
          notes={archive}
          setNotes={setArchive}
          isArchive={true}
          fetchNotes={fetchNotes}
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
          title="No archive yet"
          description="Your archived notes will appear here."
          className="p-8 sm:p-12 border-0 bg-transparent"
        />
      )}
    </DashboardShell>
  );
};

export default Page;