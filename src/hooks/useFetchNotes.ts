import { useCallback, useState } from 'react';

import { axiosInstance } from '@/lib/axiosinstance';
import { Note } from '@/utils/types/note';

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
      const response = await axiosInstance.get('/adminnotes', {
        params: { userId },
      });

      // Correctly handle the API response structure { data: [...] }
      if (response?.data && Array.isArray(response.data.data)) {
        setNotes(response.data.data);
      } else if (response?.data) {
        // Fallback for cases where the data is a direct array
        setNotes(response.data);
      } else {
        setNotes([]);
      }
      
    } catch (error) {
      console.error('Failed to fetch notes:', error);
      setNotes([]);
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