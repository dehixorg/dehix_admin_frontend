import React from 'react';

import MyNoteCard from './myNoteCard';
import DialogConfirmation from './DialogConfirmation';
import DialogSelectedNote from './DialogSelectedNote';
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

const NotesContainer = ({
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
    selectedNote,
    setSelectedNote,
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
    if (userType === 'superadmin' || (userType === 'admin' && note.userId === uId)) {
      return [
        {
          label: 'Delete permanently',
          onClick: (
            noteId: string | undefined,
            notes: Note[],
            setNotes: (notes: Note[]) => void,
          ) => {
            setIsDeleting(true);
            setSelectedDeleteNote(
              notes.find((note) => note._id === noteId) || null,
            );
          },
        },
        {
          label: 'Move To Trash',
          onClick: (noteId: string | undefined) => {
            handleUpdateNoteType(noteId, NoteType.TRASH);
          },
        },
        {
          label: 'Add Label',
          onClick: (noteId: string | undefined) => {
            setSelectedTypeNote(
              notes.find((note) => note._id === noteId) || null,
            );
          },
        },
      ];
    }
  
    // Return an empty array if the user doesn't have permissions
    return [];
  };
  
  return (
    <div className="flex justify-center items-center">
      <div className="columns-1 mt-3 sm:columns-2 md:columns-3 lg:columns-5 gap-6">
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
            onEditNote={(note: Note) => {
              if (userType === 'superadmin' || (userType === 'admin' && note.userId === uId)) {
                setSelectedNote(note);
              } else {
                console.error('Permission denied: Cannot edit this note.');
              }
            }}
            onUpdateNoteType={handleUpdateNoteType}  
            onDeleteClick={(noteId: string | undefined) => {
              if (userType === 'superadmin' || note.userId === uId) {
                setSelectedDeleteNote(
                  notes.find((note) => note._id === noteId) || null,
                );
              } else {
                console.error('Permission denied: Cannot delete this note.');
              }
            }}
            onChangeBanner={(noteId: string | undefined) => {
                if (userType === 'superadmin' || note.userId === uId) {
                  const banner = note.banner || 'defaultBanner'; // Example logic
                  handleChangeBanner(noteId, banner);
                } else {
                  console.error('Permission denied: Cannot change banner of this note.');
                }
              }}
              
            navItems={navItems(note)}
            // Pass the note to dynamically filter options
          />
        ))}
      </div>
      {isDeleting && (
        <DialogConfirmation
          onClose={handleDialogClose}
          note={selectedDeleteNote}
          onDelete={handleDeletePermanently}
        />
      )}
      {selectedNote && (
        <DialogSelectedNote
          onSave={handleSaveEditNote}
          note={selectedNote}
          onClose={handleDialogClose}
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
