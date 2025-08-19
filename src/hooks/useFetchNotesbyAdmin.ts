import { useCallback, useState } from 'react';
import { axiosInstance } from '@/lib/axiosinstance';
import { Note } from '@/utils/types/note';

// Hook to fetch notes by adminId
const useFetchNotesByAdminId = (adminId: string | undefined) => {
  const [notes, setNotes] = useState<Note[]>([]);
  const [archive, setArchive] = useState<Note[]>([]);
  const [trash, setTrash] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const fetchNotesByAdminId = useCallback(async () => {
    if (!adminId) return; // Ensure adminId is provided

    setIsLoading(true);
    try {
      const response = await axiosInstance.get('/notes', {
        params: { adminId }, // Fetch notes based on adminId
      });
      

      if (response?.data?.notes) {
        setNotes(response.data.notes.notes);
        setArchive(response.data.notes.archive || []);
        setTrash(response.data.notes.trash || []);
      }
    } catch (error) {
      console.error('Failed to fetch notes by adminId:', error);
    } finally {
      setIsLoading(false);
    }
  }, [adminId]);

  return {
    notes,
    archive,
    trash,
    isLoading,
    fetchNotesByAdminId,
    setNotes,
    setArchive,
    setTrash,
  };
};

export default useFetchNotesByAdminId;
