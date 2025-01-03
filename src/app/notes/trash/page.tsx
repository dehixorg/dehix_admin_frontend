"use client"
import React, { useEffect, useState } from 'react'
import { Note } from '../page';
import NotesRender from '@/components/shared/NotesRender';
import NotesHeader from '@/components/business/header/NotesHeader';
import SidebarMenu from '@/components/menu/sidebarMenu';
import { menuItemsBottom, menuItemsTop } from '@/config/menuItems/business/dashboardMenuItems';
import { notesMenu } from '@/config/menuItems/admin/dashboardMenuItems';
import CollapsibleSidebarMenu from '@/components/menu/collapsibleSidebarMenu';

const page = () => {
    const [trash, setTrash] = useState<Note[]>([]);

    useEffect(() => {
        const storedNotes = JSON.parse(localStorage.getItem('trash') || "[]") || [];
        setTrash(storedNotes);
    }, []);

    const handleCreateNote = (note: Note) => {
        const updatedNotes = [note, ...trash];
        setTrash(updatedNotes);
        localStorage.setItem("trash", JSON.stringify(updatedNotes));
    };


    return (
        <section className="p-3 relative sm:pl-6">
            {/* Sidebar menus */}
            <SidebarMenu
                menuItemsTop={notesMenu}
                menuItemsBottom={menuItemsBottom}
                active="Trash"
            />
            <CollapsibleSidebarMenu
                menuItemsTop={menuItemsTop}
                menuItemsBottom={menuItemsBottom}
                active="Trash"
            />
            {/* Main content area */}
            <div className="ml-12">
                <NotesHeader isTrash={true} setNotes={setTrash} notes={trash} onNoteCreate={handleCreateNote} />
                <div className="p-6">
                    <div>
                        {trash.length > 0 ? (
                            <NotesRender isTrash={true} notes={trash} setNotes={setTrash} isArchive={true} />
                        ) : (
                            <div className='flex justify-center items-center h-[40vh] w-full'>
                                <p>No trash here! Add some to get started!</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default page