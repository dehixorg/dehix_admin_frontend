import React, { useState, useRef, useEffect } from "react";
import { Archive, Pin, Trash2, Save, X } from "lucide-react";
import { Button } from "../ui/button";
import { cn } from "@/lib/utils";
import BannerChangerPopover from "./BannerChangerPopUp";
import { Card } from "@/components/ui/card";
import { Note, NoteType } from "@/utils/types/note";
import { format } from "date-fns";

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
      setNotes: (notes: Note[]) => void
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
  const cardRef = useRef<HTMLDivElement>(null);
  const titleInputRef = useRef<HTMLInputElement>(null);
  const contentEditableRef = useRef<HTMLDivElement>(null);

  const [isEditing, setIsEditing] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [editedNote, setEditedNote] = useState<Partial<Note>>({ ...note });

  // Sync props -> local state
  useEffect(() => {
    setEditedNote({ ...note });
  }, [note]);

  // When user clicks the card (not controls) open & edit inline
  const handleCardClick = (e?: React.MouseEvent) => {
    // If we're already editing, do nothing
    if (isEditing) return;
    setIsExpanded(true);
    setIsEditing(true);
    // focus title
    setTimeout(() => titleInputRef.current?.focus(), 0);
  };

  const startEditing = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(true);
    setIsEditing(true);
    setTimeout(() => titleInputRef.current?.focus(), 0);
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setEditedNote((prev) => ({ ...prev, title: e.target.value }));
  };

  const handleContentChange = (e: React.FormEvent<HTMLDivElement>) => {
    const target = e.currentTarget as HTMLElement;
    setEditedNote((prev) => ({ ...prev, content: target.innerText || '' }));
  };

  // Save function - used by click Save, Enter, or outside click
  const handleSave = async (e?: any) => {
    e?.stopPropagation?.();
    e?.preventDefault?.();

    // Only save if something changed
    const prevTitle = note.title ?? "";
    const prevContent = note.content ?? "";
    const newTitle = (editedNote.title ?? "").trim();
    const newContent = (editedNote.content ?? "").trim();

    if (newTitle !== prevTitle || newContent !== prevContent) {
      // Build full Note object (keep other fields from original note)
      const updated: Note = {
        ...note,
        title: newTitle,
        content: newContent,
      } as Note;

      try {
        await onEditNote(updated);
      } catch (err) {
        // Optionally handle error (for now we just console.warn)
        console.warn("Failed to save note:", err);
        // revert local changes if desired:
        // setEditedNote({ ...note });
      }
    }

    setIsEditing(false);
    setIsExpanded(false);
  };

  const handleCancel = (e?: React.MouseEvent) => {
    e?.stopPropagation?.();
    // revert local edits
    setEditedNote({ ...note });
    setIsEditing(false);
    setIsExpanded(false);
  };

  // Keyboard handling: Enter => save, Escape => cancel
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isEditing) return;

    if (e.key === "Escape") {
      e.preventDefault();
      handleCancel();
    } else if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSave();
    }
  };

  // Click-outside handler: if editing, save on outside click (Google Keep-like)
  useEffect(() => {
    const onDocMouseDown = (event: MouseEvent) => {
      if (!cardRef.current) return;
      const el = cardRef.current;
      // if click is outside the card
      if (!el.contains(event.target as Node)) {
        if (isEditing) {
          handleSave();
        } else {
          setIsExpanded(false);
        }
      }
    };

    document.addEventListener("mousedown", onDocMouseDown);
    return () => document.removeEventListener("mousedown", onDocMouseDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isEditing, editedNote, note]); // dependencies ensure latest editedNote/note are used

  return (
    <div
      draggable
      onDragStart={onDragStart}
      onDragOver={onDragOver}
      onDrop={onDrop}
      className="relative h-full"
    >
      <Card
        ref={cardRef}
        className={cn(
          "bg-white border border-gray-200 rounded-lg shadow-sm",
          "flex flex-col w-full mb-4 h-auto",
          "hover:shadow-md",
          {
            "cursor-pointer": !isEditing,
            "cursor-text": isEditing,
            "bg-white": !note.bgColor && !note.banner,
            "bg-cover bg-center": note.banner,
          }
        )}
        onClick={handleCardClick}
        style={{
          backgroundColor: note.bgColor ?? undefined,
          backgroundImage: note.banner ? `url(${note.banner})` : undefined,
        }}
      >
        {note.banner && (
          <div className="absolute inset-0 bg-black/10 rounded-lg" />
        )}

        <div className="relative z-10 flex flex-col h-full">
          {/* Header with pin and edit controls */}
          <div className="flex items-center justify-between p-2">
            <div className="flex items-center">
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateNoteType(
                    note._id,
                    note.isPinned ? NoteType.NOTE : NoteType.PINNED
                  );
                }}
                className={cn(
                  "p-2 rounded-full hover:bg-black/5",
                  note.isPinned ? "text-yellow-500" : "text-gray-500"
                )}
                title={note.isPinned ? "Unpin" : "Pin"}
              >
                {/* Reuse Pin icon (import not included here) */}
                <svg
                  className={cn("w-4 h-4", { "fill-current": note.isPinned })}
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                >
                  <path d="M12 2l2 7h7l-5.5 4 2 7L12 16 5.5 20 7.5 13 2 9h7z" />
                </svg>
              </button>

              {isEditing ? (
                <div className="flex space-x-1 ml-1">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSave();
                    }}
                    className="p-1 rounded-full hover:bg-green-50 text-green-600"
                    title="Save"
                  >
                    <Save className="w-4 h-4" />
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleCancel(e);
                    }}
                    className="p-1 rounded-full hover:bg-gray-100 text-gray-600"
                    title="Cancel"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  onClick={startEditing}
                  className="p-1 rounded-full hover:bg-gray-100 text-gray-600 ml-1"
                  title="Edit note"
                >
                  {/* Edit icon */}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="16"
                    height="16"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"></path>
                    <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"></path>
                  </svg>
                </button>
              )}
            </div>
          </div>

          {/* Note Content */}
          <div
            className="flex-1 px-4 pb-2 w-full"
            // clicking the content area should not close while editing; handleCardClick already opens on whole card
            onClick={(e) => {
              if (!isEditing) {
                handleCardClick();
              } else {
                e.stopPropagation();
              }
            }}
          >
            {isEditing ? (
              <div className="space-y-3">
                <input
                  ref={titleInputRef}
                  type="text"
                  value={editedNote.title ?? ""}
                  onChange={handleTitleChange}
                  onKeyDown={handleKeyDown}
                  placeholder="Title"
                  className="w-full text-base font-semibold bg-transparent border-b border-gray-200 focus:border-blue-500 focus:outline-none p-1"
                  onClick={(e) => e.stopPropagation()}
                />
                <div
                  ref={contentEditableRef}
                  contentEditable
                  suppressContentEditableWarning
                  onInput={handleContentChange}
                  onKeyDown={handleKeyDown}
                  className="min-h-[100px] w-full p-1 text-sm text-gray-700 focus:outline-none whitespace-pre-wrap break-words"
                  onClick={(e) => e.stopPropagation()}
                >
                  {editedNote.content ?? ""}
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                {note.title && (
                  <h3 className="text-base font-semibold text-gray-900 break-words">
                    {note.title}
                  </h3>
                )}
                {note.content && (
                  <p className="text-gray-700 whitespace-pre-wrap break-words text-sm">
                    {isExpanded
                      ? note.content
                      : note.content.length > 150
                        ? `${note.content.substring(0, 150)}...`
                        : note.content}
                  </p>
                )}
              </div>
            )}
          </div>

          {/* Footer */}
          <div
            className="px-4 py-2 flex items-center justify-between border-t border-gray-100 w-full"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center space-x-1">
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-gray-500 hover:text-gray-700"
                onClick={(e) => {
                  e.stopPropagation();
                  onUpdateNoteType(note._id, NoteType.ARCHIVE);
                }}
                title="Archive"
              >
                <Archive className="h-4 w-4" />
              </Button>

              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0 text-red-500 hover:text-red-600"
                onClick={(e) => {
                  e.stopPropagation();
                  onDeleteClick(note._id);
                }}
                title="Delete"
              >
                <Trash2 className="h-4 w-4" />
              </Button>

              {note._id && (
                <BannerChangerPopover
                  noteId={note._id}
                  onBannerChange={(banner) =>
                    note._id && onChangeBanner(note._id, banner)
                  }
                />
              )}
            </div>

            {note.updatedAt && (
              <span className="text-xs text-gray-500">
                {format(new Date(note.updatedAt), "MMM d, yyyy")}
              </span>
            )}
          </div>
        </div>
      </Card>
    </div>
  );
};

export default MyNoteCard;
