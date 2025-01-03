'use client';

import React, { useEffect, useState } from 'react';
import SidebarMenu from '@/components/menu/sidebarMenu';
import CollapsibleSidebarMenu from '@/components/menu/collapsibleSidebarMenu';
import { menuItemsBottom, menuItemsTop } from '@/config/menuItems/business/dashboardMenuItems';
import { notesMenu } from '@/config/menuItems/admin/dashboardMenuItems';
import NotesHeader from '@/components/business/header/NotesHeader';
import NotesRender from '@/components/shared/NotesRender';

export type Note = {
  id: string;
  title: string;
  content: string;
  color?: string;
  banner?: string;
  createdAt: Date;
  isHTML: boolean;
};

const Notes = () => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    setIsLoading(true);
    const storedNotes = localStorage.getItem("notes");
    if (storedNotes) {
      setNotes(JSON.parse(storedNotes));
    }
    setIsLoading(false);
  }, []);

  const handleCreateNote = (note: Note) => {
    const updatedNotes = [note, ...notes];
    setNotes(updatedNotes);
    localStorage.setItem("notes", JSON.stringify(updatedNotes));
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
        <NotesHeader isTrash={false} setNotes={setNotes} notes={notes} onNoteCreate={handleCreateNote} />
        <div className="p-6">
          <div>
            {notes.length > 0 ? (
              <NotesRender notes={notes} setNotes={setNotes} isArchive={false} />
            ) : (
              <div className='flex justify-center items-center h-[40vh] w-full'>
                <p>No notes available. Start adding some!</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Notes;