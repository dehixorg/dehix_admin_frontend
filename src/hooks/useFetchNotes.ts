import { useCallback, useState } from 'react';
import { axiosInstance } from '@/lib/axiosinstance';
import { Note, NoteType } from '@/utils/types/note';

const useFetchNotes = (userId: string | undefined) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [archive, setArchive] = useState<Note[]>([]);
  const [trash, setTrash] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchNotes = useCallback(async () => {
    if (!userId) {
      console.error("userId is not available. Cannot fetch notes.");
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/notes', {
        params: { userId },
      });

      if (response?.data && Array.isArray(response.data.data)) {
        const allNotes = response.data.data;
        
        // Filter the notes and set the state variables
        setNotes(allNotes.filter((note: Note) => note.noteType === NoteType.NOTE));
      setArchive(allNotes.filter((note: Note) => note.noteType === NoteType.ARCHIVE));
      setTrash(allNotes.filter((note: Note) => note.noteType === NoteType.TRASH));
      } else {
        setNotes([]);
        setArchive([]);
        setTrash([]);
      }
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      setNotes([]);
      setArchive([]);
      setTrash([]);
    } finally {
      setIsLoading(false);
    }
  }, [userId]);

  return {
    notes,
    archive,
    isLoading,
    fetchNotes,
    setNotes,
    setArchive,
    trash,
    setTrash,
  };
};

export default useFetchNotes;