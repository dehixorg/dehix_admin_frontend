import React, { useState } from "react";
import { Note } from "@/utils/types/note";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { ArchiveRestoreIcon, RotateCwIcon, Trash2Icon } from "lucide-react";
import BannerChangerPopover from "./BannerChangerPopUp";
import DropdownNavNotes from "./DropdownNavNotes";

interface NotesRenderProps {
    notes: Note[];
    setNotes: (notes: Note[]) => void;
    isArchive: boolean;
    isTrash?: boolean;
}

const NotesRender = ({ notes, setNotes, isArchive, isTrash }: NotesRenderProps) => {
    const [draggingIndex, setDraggingIndex] = useState<number | null>(null);
    const [draggingOverIndex, setDraggingOverIndex] = useState<number | null>(null);

    const navItems = [
        {
            label: "Delete permanently",
            onClick: (noteId: string, notes: Note[], setNotes: (notes: Note[]) => void) => {
                handleDeletePermanently(noteId);
            },
        },
        {
            label: "Move To Trash",
            onClick: (noteId: string, notes: Note[], setNotes: (notes: Note[]) => void) => {
                const noteToTrash = notes.find((note) => note.id === noteId);
                if (noteToTrash) {
                    const updatedNotes = notes.filter((note) => note.id !== noteId);
                    const storedTrash = JSON.parse(localStorage.getItem("trash") || "[]");
                    const updatedTrash = [...storedTrash, noteToTrash];
                    localStorage.setItem("notes", JSON.stringify(updatedNotes));
                    localStorage.setItem("trash", JSON.stringify(updatedTrash));
                    setNotes(updatedNotes);
                    console.log(`Moved note to trash: ${noteId}`);
                }
            },
        },
        {
            label: "Add Label",
            onClick: (noteId: string) => {
                console.log(`Add label to note with ID: ${noteId}`);
            },
        },
    ];


    const handleDragStart = (index: number) => {
        setDraggingIndex(index);
    };

    const handleDragOver = (index: number) => {
        if (draggingIndex !== index) {
            setDraggingOverIndex(index);
        }
    };

    const handleDrop = () => {
        if (
            draggingIndex !== null &&
            draggingOverIndex !== null &&
            draggingIndex !== draggingOverIndex
        ) {
            const updatedNotesRender = [...notes];
            const draggedNote = updatedNotesRender[draggingIndex];
            const targetNote = updatedNotesRender[draggingOverIndex];

            updatedNotesRender[draggingIndex] = targetNote;
            updatedNotesRender[draggingOverIndex] = draggedNote;

            setNotes(updatedNotesRender);

            localStorage.setItem("notes", JSON.stringify(updatedNotesRender));
        }
        setDraggingIndex(null);
        setDraggingOverIndex(null);
    };

// this is for send the note from notes to archive
    const handleGoToArchive = (noteId: string) => {
        const noteToArchive = notes.find((note) => note.id === noteId);
        console.log("Note to archive:", noteToArchive);

        if (noteToArchive) {
            const updatedNotesRender = notes.filter((note) => note.id !== noteId);

            const storedArchive = JSON.parse(localStorage.getItem("archive") || "[]");
            console.log("Stored archive before update:", storedArchive);

            const updatedArchive = [...storedArchive, noteToArchive];

            setNotes(updatedNotesRender);
            localStorage.setItem("notes", JSON.stringify(updatedNotesRender));
            localStorage.setItem("archive", JSON.stringify(updatedArchive));

            console.log("Updated archive:", updatedArchive);
        } else {
            console.log("Note not found!");
        }
    };

// this is for restore the note from archive to notes
    const handleGoFromArchive = (noteId: string) => {
        const storedArchive = JSON.parse(localStorage.getItem("archive") || "[]");

        const archivedNote = storedArchive?.find((note: Note) => note.id === noteId);

        if (archivedNote) {
            const updatedArchive = storedArchive.filter((note: Note) => note.id !== noteId);

            const storedNotesRender = JSON.parse(localStorage.getItem("notes") || "[]");

            const updatedNotesRender = [...storedNotesRender, archivedNote];

            localStorage.setItem("notes", JSON.stringify(updatedNotesRender));
            localStorage.setItem("archive", JSON.stringify(updatedArchive));

            setNotes(updatedArchive);
        }
    };

    const handleChangeBanner = (noteId: string, banner: string) => {
        const updatedNotesRender = notes.map((note) =>
            note.id === noteId ? { ...note, banner } : note
        );
        setNotes(updatedNotesRender);
        localStorage.setItem("notes", JSON.stringify(updatedNotesRender));
    };

    // this is for restore the note from trash to notes
    const handleRestoreFromTrash = (noteId: string) => {
        const storedTrash = JSON.parse(localStorage.getItem("trash") || "[]");

        const restoredNote = storedTrash.find((note: Note) => note.id === noteId);

        if (restoredNote) {
            const updatedTrash = storedTrash.filter((note: Note) => note.id !== noteId);

            const storedNotes = JSON.parse(localStorage.getItem("notes") || "[]");
            const updatedNotes = [...storedNotes, restoredNote];

            localStorage.setItem("notes", JSON.stringify(updatedNotes));
            localStorage.setItem("trash", JSON.stringify(updatedTrash));

            setNotes(updatedTrash);
        }
    };

    // this is for trash delete icon to del the trash note permanently
    const handleDeletePermanently = (noteId: string) => {
        if (isTrash) {
            const storedTrash = JSON.parse(localStorage.getItem("trash") || "[]");
            const updatedTrash = storedTrash.filter((note: Note) => note.id !== noteId);

            localStorage.setItem("trash", JSON.stringify(updatedTrash));
            setNotes(updatedTrash);
        } else if (isArchive) {
            const storedTrash = JSON.parse(localStorage.getItem("archive") || "[]");
            const updatedTrash = storedTrash.filter((note: Note) => note.id !== noteId);

            localStorage.setItem("archive", JSON.stringify(updatedTrash));
            setNotes(updatedTrash);
        } else {
            const storedTrash = JSON.parse(localStorage.getItem("notes") || "[]");
            const updatedTrash = storedTrash.filter((note: Note) => note.id !== noteId);

            localStorage.setItem("notes", JSON.stringify(updatedTrash));
            setNotes(updatedTrash);
        }
    };


    const handleNavClick = (action: (noteId: string, notes: Note[], setNotes: (notes: Note[]) => void) => void, noteId: string) => {
        action(noteId, notes, setNotes);
    };

    function truncateText(content: string, maxWords: number): string {
        const words = content.split(/\s+/);
        return words.length > maxWords
            ? `${words.slice(0, maxWords).join(' ')}...`
            : content;
    }

    function truncateHTMLContent(html: string, maxWords: number): string {
        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = html;
        const textContent = tempDiv.textContent || tempDiv.innerText || '';
        const truncatedText = truncateText(textContent, maxWords);
        return truncatedText;
    }



    return (
        <div className="flex justify-center items-center">
            <div className="columns-1 mt-3 sm:columns-2 md:columns-3 lg:columns-5 gap-6">
                {notes.map((note, index) => (
                    <div
                        key={note.id}
                        draggable
                        onDragStart={() => handleDragStart(index)}
                        onDragOver={(e) => {
                            e.preventDefault();
                            handleDragOver(index);
                        }}
                        onDrop={handleDrop}
                        className="relative group"
                    >
                        <Card
                            className="break-inside-avoid cursor-pointer bg-white rounded-lg shadow-md hover:shadow-lg transition-all duration-200 group w-[80vw] mb-3 md:w-[200px] relative"
                            style={
                                note.banner
                                    ? {
                                        backgroundImage: `url(${note.banner})`,
                                        backgroundSize: "cover",
                                        backgroundPosition: "center",
                                    }
                                    : { backgroundColor: note.color || "#ffffff" }
                            }
                        >
                            <CardHeader>
                                {note.title && (
                                    <CardTitle className="font-semibold text-lg text-black">{note.title}</CardTitle>
                                )}
                            </CardHeader>

                            <CardContent className="max-h-[320px] overflow-hidden">
                                <CardDescription className="text-sm whitespace-pre-wrap truncate break-words">
                                    {note.isHTML ? (
                                        <div
                                            className="text-sm whitespace-pre-wrap break-words"
                                            dangerouslySetInnerHTML={{
                                                __html: truncateHTMLContent(note.content, 30),
                                            }}
                                        />
                                    ) : (
                                        <CardDescription className="text-sm font-bold truncate bg-opacity-100 whitespace-pre-wrap break-words text-black">
                                            {truncateText(note.content, 30)}
                                        </CardDescription>
                                    )}
                                </CardDescription>

                            </CardContent>

                            <div className="absolute bottom-2 right-2 hidden group-hover:flex items-center gap-4 justify-center">
                                {isTrash ? (
                                    <>
                                        <RotateCwIcon
                                            size={15}
                                            className="text-green-600 cursor-pointer"
                                            onClick={() => handleRestoreFromTrash(note.id)}
                                        />
                                        <Trash2Icon
                                            size={15}
                                            className="text-red-600 cursor-pointer"
                                            onClick={() => handleDeletePermanently(note.id)}
                                        />
                                    </>
                                ) : !isArchive ? (
                                    <ArchiveRestoreIcon
                                        size={15}
                                        className="text-black"
                                        onClick={() => handleGoToArchive(note.id)}
                                    />
                                ) : (
                                    <ArchiveRestoreIcon
                                        size={15}
                                        className="text-black"
                                        onClick={() => handleGoFromArchive(note.id)}
                                    />
                                )}
                                <BannerChangerPopover
                                    handleChangeBanner={(banner) => handleChangeBanner(note.id, banner)}
                                />
                                {!isTrash && <DropdownNavNotes noteId={note.id} navItems={navItems.map((item) => ({
                                    ...item,
                                    onClick: () => handleNavClick(item.onClick, note.id),
                                }))} />}
                            </div>
                        </Card>
                    </div>
                ))}
            </div>
        </div>

    );
};

export default NotesRender; 
