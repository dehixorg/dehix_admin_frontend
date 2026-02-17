import React from 'react';

import MyNoteCard from './myNoteCard';
import DialogConfirmation from './DialogConfirmation';
import DialogUpdateType from './DialogUpdateType';

import { Note, NoteType } from '@/utils/types/note';
import useNotes from '@/hooks/useNotes';
import useDragAndDrop from '@/hooks/useDragAndDrop';

interface NotesContainerProps {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  isArchive: boolean;
  isTrash?: boolean;
  fetchNotes: () => Promise<void>;
}

const MyNotesContainer = ({
  notes,
  setNotes,
  isArchive,
  isTrash,
  fetchNotes,
}: NotesContainerProps) => {
  const user: string | null = localStorage.getItem('user');
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
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
  } = useDragAndDrop(notes, setNotes);

  const navItems = (note: Note) => {
    if (userType === 'superadmin' || (userType === 'admin' && note.userId === uId)) {
      const items = [];

      if (isTrash) {
        items.push(
          {
            label: 'Restore',
            onClick: (noteId: string | undefined) => {
              handleUpdateNoteType(noteId, NoteType.NOTE);
            },
          },
          {
            label: 'Delete Permanently',
            onClick: () => {
              setIsDeleting(true);
              setSelectedDeleteNote(note);
            },
          }
        );
      } else if (isArchive) {
        items.push(
          {
            label: 'Unarchive',
            onClick: (noteId: string | undefined) => {
              handleUpdateNoteType(noteId, NoteType.NOTE);
            },
          },
          {
            label: 'Move to Trash',
            onClick: (noteId: string | undefined) => {
              handleUpdateNoteType(noteId, NoteType.TRASH);
            },
          }
        );
      } else {
        items.push(
          {
            label: 'Archive',
            onClick: (noteId: string | undefined) => {
              handleUpdateNoteType(noteId, NoteType.ARCHIVE);
            },
          },
          {
            label: 'Move to Trash',
            onClick: (noteId: string | undefined) => {
              handleUpdateNoteType(noteId, NoteType.TRASH);
            },
          },
          {
            label: 'Add Label',
            onClick: (noteId: string | undefined) => {
              setSelectedTypeNote(notes.find((n) => n._id === noteId) || null);
            },
          }
        );
      }
      return items;
    }
    return [];
  };

  // Determine the heading based on the current view
  const getHeading = () => {
    if (isTrash) return 'Trash';
    if (isArchive) return 'Archive';
    return 'My Notes';
  };

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
              onTouchStart={() => handleTouchStart(index)}
              onTouchMove={handleTouchMove}
              onTouchEnd={handleTouchEnd}
              notes={notes}
              setNotes={setNotes}
              isTrash={!!isTrash}
              isArchive={isArchive}
              onEditNote={async (updatedNote: Note) => {
                if (userType === 'superadmin' || (userType === 'admin' && updatedNote.userId === uId)) {
                  try {
                    await handleSaveEditNote(updatedNote);
                  } catch (err) {
                    console.error('Failed to save note:', err);
                  }
                } else {
                  console.error('Permission denied: Cannot edit this note.');
                }
              }}
              onUpdateNoteType={handleUpdateNoteType}
              onDeleteClick={(noteId: string | undefined) => {
                if (userType === 'superadmin' || note.userId === uId) {
                  setIsDeleting(true);
                  setSelectedDeleteNote(notes.find(n => n._id === noteId) || null);
                } else {
                  console.error('Permission denied: Cannot delete this note.');
                }
              }}
              onChangeBanner={(noteId: string | undefined, newBannerUrl: string) => {
                if (userType === 'superadmin' || note.userId === uId) {
                  handleChangeBanner(noteId, newBannerUrl);
                } else {
                  console.error('Permission denied: Cannot change banner of this note.');
                }
              }}
              navItems={navItems(note)}
            />
          ))}
        </div>
      </div>

      {isDeleting && selectedDeleteNote && (
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
export default MyNotesContainer;
