'use client';

import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { Loader2 } from 'lucide-react';

import { LabelType, Note, NoteType } from '@/utils/types/note';
import NotesRender from '@/components/shared/NotesRender';
import NotesHeader from '@/components/business/header/NotesHeader';
import SidebarMenu from '@/components/menu/sidebarMenu';
import {
  menuItemsBottom,
  menuItemsTop,
} from '@/config/menuItems/business/dashboardMenuItems';
import { notesMenu } from '@/config/menuItems/admin/dashboardMenuItems';
import CollapsibleSidebarMenu from '@/components/menu/collapsibleSidebarMenu';
import { axiosInstance } from '@/lib/axiosinstance';
import useFetchNotes from '@/hooks/useFetchNotes';
import { toast } from '@/components/ui/use-toast';

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
      });
      return;
    }

    // Create a properly formatted note object with all required fields
    const newNote: Note = {
      title: note.title || '',
      content: note.content || '',
      userId,
      bgColor: note.bgColor || '#FFFFFF',
      banner: note.banner || '',
      isHTML: false, // Default to false for plain text
      noteType: NoteType.ARCHIVE,
      type: LabelType.PERSONAL,
      entityType: user?.type?.toUpperCase() || 'BUSINESS',
      isPinned: false,
      createdAt: new Date(),
      updatedAt: new Date(),
      _id: '' // This will be set by the server
    };

    try {
      const response = await axiosInstance.post('/notes', newNote);
      
      if (response.data && response.data.data && response.data.data._id) {
        // The server returns the created note in response.data.data
        const createdNote = response.data.data;
        
        // Update the local state with the new note
        setArchive(prevNotes => [createdNote, ...prevNotes]);
        
        // Refresh the notes list to ensure consistency
        await fetchNotes();
        
        toast({
          title: 'Note Created',
          description: 'Your note has been successfully created and archived.',
          duration: 5000,
        });
      } else {
        throw new Error('Invalid response format from server');
      }
    } catch (error: any) {
      console.error('Failed to create note:', error);
      
      let errorMessage = 'Failed to create note. Please try again.';
      if (error.response) {
        // The request was made and the server responded with a status code
        // that falls out of the range of 2xx
        errorMessage = error.response.data?.message || 
                      error.response.data?.error || 
                      errorMessage;
        
        // Log the full error for debugging
        console.error('Server error response:', error.response.data);
      } else if (error.request) {
        // The request was made but no response was received
        console.error('No response received:', error.request);
        errorMessage = 'No response from server. Please check your connection.';
      } else {
        // Something happened in setting up the request
        console.error('Request setup error:', error.message);
      }
      
      toast({
        title: 'Error Creating Note',
        description: errorMessage,
        variant: 'destructive',
      });
    }
  };

  return (
    <section className="p-3 relative sm:pl-6">
      {/* Sidebar menus */}
      <SidebarMenu
        menuItemsTop={notesMenu}
        menuItemsBottom={menuItemsBottom}
        active="Archive"
      />
      <CollapsibleSidebarMenu
        menuItemsTop={menuItemsTop}
        menuItemsBottom={menuItemsBottom}
        active="Archive"
      />

      {/* Main content area */}
      <div className="ml-12">
        <NotesHeader
          isTrash={false}
          setNotes={setArchive}
          notes={archive}
          onNoteCreate={handleCreateNote}
          userId={userId}
          pageTitle="Archived Notes"
        />
        <div className="p-6">
          {isLoading ? (
            <div className="flex justify-center items-center h-[40vh]">
              <Loader2 className="my-4 h-8 w-8 animate-spin" />
            </div>
          ) : archive?.length > 0 ? (
            <NotesRender
              notes={archive}
              setNotes={setArchive}
              isArchive={true}
              fetchNotes={fetchNotes}
            />
          ) : (
            <div className="flex justify-center items-center h-[40vh]">
              <p>No archive available. Start adding some!</p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default Page;