import React from 'react';
import { ArchiveRestoreIcon, RotateCwIcon, Trash2Icon } from 'lucide-react';

import { Badge } from '../ui/badge';

import BannerChangerPopover from './BannerChangerPopUp';
import DropdownNavNotes from './DropdownNavNotes';

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { badgeColors, Note, NoteType } from '@/utils/types/note';
import { truncateHTMLContent, truncateText } from '@/utils/notes/notesHelpers';

interface NoteCardProps {
  note: Note;
  notes: Note[];
  setNotes: (notes: Note[]) => void;
  onDragStart: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDrop: () => void;
  isTrash: boolean;
  isArchive: boolean;
  onEditNote: (note: Note) => void;
  onUpdateNoteType: (noteId: string | undefined, noteType: string) => void;
  onDeleteClick: (noteId: string | undefined) => void;
  onChangeBanner: (noteId: string | undefined, banner: string) => void;
  navItems: Array<{
    label: string;
    onClick: (
      noteId: string | undefined,
      notes: Note[],
      setNotes: (notes: Note[]) => void,
    ) => void;
  }>;
}

const MyNoteCard = ({
  note,
  notes,
  setNotes,
  onDragStart,
  onDragOver,
  onDrop,
  isTrash,
  isArchive,
  onEditNote,
  onUpdateNoteType,
  onDeleteClick,
  onChangeBanner,
  navItems,
}: NoteCardProps) => {
  const user: string | null = localStorage.getItem('user');
  const parsedUser = user ? JSON.parse(user) : null;

  const uId = parsedUser ? parsedUser.uid : null;
  const userType = parsedUser ? parsedUser.type : null;
  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className="relative group"
    >
      <Card
        className="break-inside-avoid bg-white border border-gray-300 rounded-lg shadow-md hover:shadow-lg transition-all duration-200 group w-[80vw] mb-6 md:w-[320px] lg:w-[400px] relative"
        style={
          note.banner
            ? {
                backgroundImage: `url(${note.banner})`,
                backgroundSize: 'cover',
                backgroundPosition: 'center',
              }
            : { backgroundColor: note.bgColor || '#ffffff' }
        }
      >
        {note.banner && (
          <div className="absolute inset-0 bg-black/10 rounded-lg" />
        )}
        
        <div onClick={() => onEditNote(note)} className="cursor-pointer relative z-10">
          <CardHeader className="p-6 pb-2">
            {note.type && (
              <div className="relative mb-3">
                <Badge
                  className={`text-sm py-1 ${badgeColors[note.type] || ' '}`}
                >
                  {note.type.toLowerCase()}
                </Badge>
              </div>
            )}
            {note.title && (
              <CardTitle className="font-bold text-2xl text-black">
                {note.title}
              </CardTitle>
            )}
          </CardHeader>
          <CardContent className="p-6 pt-0 min-h-[150px] flex items-center">
            <CardDescription className="text-base whitespace-pre-wrap break-words">
              {note.isHTML ? (
                <div
                  className="text-base whitespace-pre-wrap break-words"
                  dangerouslySetInnerHTML={{
                    __html: truncateHTMLContent(note.content, 30),
                  }}
                />
              ) : (
                <CardDescription className="text-base font-bold bg-opacity-100 whitespace-pre-wrap break-words text-black">
                  {truncateText(note.content, 30)}
                </CardDescription>
              )}
            </CardDescription>
          </CardContent>
        </div>

        <div className="absolute bottom-4 right-4 z-20 hidden group-hover:flex items-center gap-3 justify-center bg-white/50 backdrop-blur-sm rounded-full p-2 transition-all duration-200">
          {(userType === 'superadmin' ||
            (userType === 'admin' && note.userId === uId)) &&
            (isTrash ? (
              <>
                <RotateCwIcon
                  size={18}
                  className="text-black hover:text-gray-600 cursor-pointer"
                  onClick={() => onUpdateNoteType(note._id, NoteType.NOTE)}
                />
                <Trash2Icon
                  size={18}
                  className="text-black hover:text-red-500 cursor-pointer"
                  onClick={() => onDeleteClick(note._id)}
                />
              </>
            ) : !isArchive ? (
              <ArchiveRestoreIcon
                size={18}
                className="text-black hover:text-gray-600 cursor-pointer"
                onClick={() => onUpdateNoteType(note._id, NoteType.ARCHIVE)}
              />
            ) : (
              <ArchiveRestoreIcon
                size={18}
                className="text-black hover:text-gray-600 cursor-pointer"
                onClick={() => onUpdateNoteType(note._id, NoteType.NOTE)}
              />
            ))}
          <BannerChangerPopover
            handleChangeBanner={(banner) => onChangeBanner(note._id, banner)}
          />
          {!isTrash && (
            <DropdownNavNotes
              noteId={note._id}
              navItems={navItems.map((item) => ({
                ...item,
                onClick: () => item.onClick(note._id, notes, setNotes),
              }))}
            />
          )}
        </div>
      </Card>
    </div>
  );
};

export default MyNoteCard;