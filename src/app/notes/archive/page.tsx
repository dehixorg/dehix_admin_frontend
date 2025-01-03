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
    const [archive, setArchive] = useState<Note[]>([]);

    useEffect(() => {
        const storedNotes = JSON.parse(localStorage.getItem('archive') || "[]") || [];
        setArchive(storedNotes);
    }, []);

    const handleCreateNote = (note: Note) => {
        const updatedNotes = [note, ...archive];
        setArchive(updatedNotes);
        localStorage.setItem("archive", JSON.stringify(updatedNotes));
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
                <NotesHeader isTrash={false} setNotes={setArchive} notes={archive} onNoteCreate={handleCreateNote} />
                <div className="p-6">
                    <div>
                        {archive.length > 0 ? (
                            <NotesRender notes={archive} setNotes={setArchive} isArchive={true} />
                        ) : (
                            <div className='flex justify-center items-center h-[40vh] w-full'>
                                <p>No archive available. Start adding some!</p>
                            </div>

                        )}
                    </div>
                </div>
            </div>
        </section>
    )
}

export default page
