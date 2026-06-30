'use client';

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';

import SidebarMenu from '@/components/menu/sidebarMenu';
import CollapsibleSidebarMenu from '@/components/menu/collapsibleSidebarMenu';
import {
  menuItemsBottom,
  menuItemsTop
} from '@/config/menuItems/business/dashboardMenuItems';
import { notesMenu } from '@/config/menuItems/admin/dashboardMenuItems';
import NotesHeader from '@/components/business/header/NotesHeader';
import NotesRender from '@/components/shared/NotesRender';
import { axiosInstance } from '@/lib/axiosinstance';
import { EntityType, LabelType, Note, NoteType } from '@/utils/types/note';
import { toast } from '@/components/ui/use-toast';
import useFetchNotes from '@/hooks/useFetchNotes';
import { Skeleton } from '@/components/ui/skeleton';
import { Card } from '@/components/ui/card';
import { CreateNoteDialog } from '@/components/shared/CreateNoteDialog';
import EmptyState from '@/components/shared/EmptyState';

const Notes = () => {
  // Get userId from Redux
  const user = useSelector((state: any) => state.user);
  const userId = user.uid;
  const { notes, isLoading, fetchNotes, setNotes } = useFetchNotes(userId);

  useEffect(() => {
    if (userId) {
      fetchNotes();
    }
  }, [fetchNotes, userId]);

  const handleCreateNote = async (note: Partial<Note>) => {
    if (!note.title || !note.content || !userId) {
      toast({
        title: 'Error',
        description: 'Title and content are required to create a note.',
        variant: 'destructive',
        duration: 5000,
      });
      return;
    }

    const tempNote = {
      ...note,
      userId,
      bgColor: note.bgColor || '#FFFFFF',
      banner: note.banner || '',
      noteType: NoteType.NOTE,
      type: LabelType.PERSONAL,
      entityType: (user?.type?.toUpperCase() as EntityType) || EntityType.BUSINESS,
    } as Note;

    // Optimistically update the UI
    setNotes((prev) => [tempNote, ...prev]);

    try {
      const response = await axiosInstance.post('/notes', tempNote);
      if (response?.data) {
        toast({
          title: 'Note Created',
          description: 'Your note was successfully created.',
          duration: 5000,
        });
        fetchNotes();
      }
    } catch (error) {
      console.error('Failed to create note:', error);
      toast({
        title: 'Error',
        description: 'Failed to create the note.',
        variant: 'destructive',
        duration: 5000,
      });

      // Revert UI on error
      setNotes((prev) => prev.filter((n) => n !== tempNote));
    }
  };

  return (
    <section className="p-3 relative sm:pl-6">
      {/* Sidebar menus */}
      <SidebarMenu
        menuItemsTop={notesMenu}
        menuItemsBottom={menuItemsBottom}
        active="Notes"
      />
      <CollapsibleSidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active="Notes"
      />
      {/* Main content area */}
      <div className="ml-12">
        <NotesHeader
          isTrash={false}
          setNotes={setNotes}
          notes={notes}
          onNoteCreate={handleCreateNote}
          userId={userId}
          pageTitle="Notes"
        />
        <div className="p-6">
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
          ) : notes?.length > 0 ? (
            <NotesRender
              fetchNotes={fetchNotes}
              notes={notes}
              setNotes={setNotes}
              isArchive={false}
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
              title="No notes yet"
              description="Start capturing your thoughts. Create your first note to keep ideas, todos, and inspirations organized."
              actions={<CreateNoteDialog onNoteCreate={handleCreateNote} userId={userId} />}
              className="p-8 sm:p-12 border-0 bg-transparent"
            />
          )}
        </div>
      </div>
    </section>
  );
};

export default Notes;