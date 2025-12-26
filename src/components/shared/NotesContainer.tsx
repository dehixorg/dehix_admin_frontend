import React from "react";

import MyNoteCard from "./myNoteCard";
import DialogConfirmation from "./DialogConfirmation";
import DialogSelectedNote from "./DialogSelectedNote";
import DialogUpdateType from "./DialogUpdateType";

import { Note, NoteType } from "@/utils/types/note";
import useNotes from "@/hooks/useNotes";
import useDragAndDrop from "@/hooks/useDragAndDrop";

interface NotesContainerProps {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  isArchive: boolean;
  isTrash?: boolean;
  fetchNotes: () => Promise<void>;
}

const NotesContainer = ({
  notes,
  setNotes,
  isArchive,
  isTrash,
  fetchNotes,
}: NotesContainerProps) => {
  const user: string | null = localStorage.getItem("user");
  const parsedUser = user ? JSON.parse(user) : null;

  const uId = parsedUser ? parsedUser.uid : null;

  const userType = parsedUser ? parsedUser.type : null;

  const {
    selectedDeleteNote,
    setSelectedDeleteNote,
    selectedTypeNote,
    setSelectedTypeNote,
    isDeleting,
    setIsDeleting,
    handleSaveEditNote,
    handleDialogClose,
    handleDeletePermanently,
    handleChangeBanner,
    handleUpdateNoteType,
    handleUpdateNoteLabel,
  } = useNotes(fetchNotes, notes);

  const {
    draggingIndex,
    draggingOverIndex,
    handleDragStart,
    handleDragOver,
    handleDrop,
  } = useDragAndDrop(notes, setNotes);

  const navItems = (note: Note) => {
    // Only show edit options if the user is superadmin or the creator of the note
    if (
      userType === "superadmin" ||
      (userType === "admin" && note.userId === uId)
    ) {
      const items = [];

      // For trashed notes, show restore and delete permanently options
      if (isTrash) {
        items.push(
          {
            label: "Restore",
            onClick: (noteId: string | undefined) => {
              handleUpdateNoteType(noteId, NoteType.NOTE);
            },
          },
          {
            label: "Delete Permanently",
            onClick: () => {
              setIsDeleting(true);
              setSelectedDeleteNote(note);
            },
          }
        );
      }
      // For archived notes, show unarchive and move to trash options
      else if (isArchive) {
        items.push(
          {
            label: "Unarchive",
            onClick: (noteId: string | undefined) => {
              handleUpdateNoteType(noteId, NoteType.NOTE);
            },
          },
          {
            label: "Move to Trash",
            onClick: (noteId: string | undefined) => {
              handleUpdateNoteType(noteId, NoteType.TRASH);
            },
          }
        );
      }
      // For regular notes, show archive and move to trash options
      else {
        items.push(
          {
            label: "Archive",
            onClick: (noteId: string | undefined) => {
              handleUpdateNoteType(noteId, NoteType.ARCHIVE);
            },
          },
          {
            label: "Move to Trash",
            onClick: (noteId: string | undefined) => {
              handleUpdateNoteType(noteId, NoteType.TRASH);
            },
          },
          {
            label: "Add Label",
            onClick: (noteId: string | undefined) => {
              setSelectedTypeNote(notes.find((n) => n._id === noteId) || null);
            },
          }
        );
      }

      return items;
    }

    // Return an empty array if the user doesn't have permissions
    return [];
  };

  // Show 'Archive' in archive view, 'My Notes' otherwise
  const getHeading = () => isArchive ? 'Archive' : 'My Notes';

  return (
    <div className="w-full">
      <h2 className="text-2xl font-bold mb-6 px-4">{getHeading()}</h2>
      <div className="flex justify-center items-center">
        <div className="flex flex-wrap justify-center gap-6 p-4 w-full">
          {notes.map((note, index) => (
            <MyNoteCard
              key={note._id}
              note={note}
              onDragStart={() => handleDragStart(index)}
              onDragOver={(e) => {
                e.preventDefault();
                handleDragOver(index);
              }}
              onDrop={handleDrop}
              notes={notes}
              setNotes={setNotes}
              isTrash={!!isTrash}
              isArchive={isArchive}
              onEditNote={async (updatedNote: Note) => {
                if (
                  userType === "superadmin" ||
                  (userType === "admin" && updatedNote.userId === uId)
                ) {
                  await handleSaveEditNote(updatedNote);
                } else {
                  console.error("Permission denied: Cannot edit this note.");
                }
              }}
              onUpdateNoteType={handleUpdateNoteType}
              onDeleteClick={(noteId: string | undefined) => {
                if (userType === "superadmin" || note.userId === uId) {
                  // For trashed notes, show delete confirmation
                  // For others, move to trash
                  if (isTrash) {
                    setIsDeleting(true);
                    setSelectedDeleteNote(
                      notes.find((n) => n._id === noteId) || null
                    );
                  } else {
                    handleUpdateNoteType(noteId, NoteType.TRASH);
                  }
                } else {
                  console.error("Permission denied: Cannot delete this note.");
                }
              }}
              onChangeBanner={(
                noteId: string | undefined,
                newBannerUrl: string
              ) => {
                if (userType === "superadmin" || note.userId === uId) {
                  handleChangeBanner(noteId, newBannerUrl);
                } else {
                  console.error(
                    "Permission denied: Cannot change banner of this note."
                  );
                }
              }}
              navItems={navItems(note)}
            />
          ))}
        </div>
      </div>
      {isDeleting && (
        <DialogConfirmation
          onClose={handleDialogClose}
          note={selectedDeleteNote}
          onDelete={handleDeletePermanently}
        />
      )}
      {selectedTypeNote && (
        <DialogUpdateType
          note={selectedTypeNote}
          onClose={() => setSelectedTypeNote(null)}
          onUpdate={handleUpdateNoteLabel}
        />
      )}
    </div>
  );
};

export default NotesContainer;
