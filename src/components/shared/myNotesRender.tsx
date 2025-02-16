import React from 'react';

// import NotesContainer from './NotesContainer';
import { Note } from '@/utils/types/note';
import MyNotesContainer from './myNotesContainer';
interface NotesRenderProps {
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  isArchive: boolean;
  isTrash?: boolean;
  fetchNotes: () => Promise<void>;
}

const myNotesRender = ({
  notes,
  setNotes,
  isArchive,
  isTrash,
  fetchNotes,
}: NotesRenderProps) => (
  <MyNotesContainer
    notes={notes}
    setNotes={setNotes}
    isArchive={isArchive}
    isTrash={isTrash}
    fetchNotes={fetchNotes}
  />
);

export default myNotesRender;