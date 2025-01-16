import React, { useEffect, useState } from "react";
import { Note } from "@/src/types/types";
import { Pencil, Trash2, FileText } from 'lucide-react';
import { Button } from "@nextui-org/button";
import { Input } from "@/components/ui/input";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@nextui-org/skeleton";

interface NoteListProps {
  notes?: Note[];
  onSelectNote: (note: Note) => void;
  onUpdateNoteTitle: (noteId: string, newName: string) => void;
  onDeleteNote: (noteId: string) => void;
}

const NoteList: React.FC<NoteListProps> = ({ notes, onSelectNote, onUpdateNoteTitle, onDeleteNote }) => {
  const [editingNoteId, setEditingNoteId] = useState<string | null>(null);
  const [editedTitle, setEditedTitle] = useState("");

  const handleEditClick = (note: Note) => {
    setEditingNoteId(note.note_id);
    setEditedTitle(note.title || "Untitled Note");
  };

  const handleSaveTitle = (noteId: string) => {
    onUpdateNoteTitle(noteId, editedTitle);
    setEditingNoteId(null);
  };

  const handleCancelEdit = () => {
    setEditingNoteId(null);
    setEditedTitle("");
  };
  useEffect(() => {
    console.log(notes)
  },[notes])
  if (notes === undefined) {
    return (
      <div className="p-2">
        <ul className="space-y-2">
          {[...Array(3)].map((_, idx) => (
            <li
              key={idx}
              className="flex items-center justify-between  p-2 rounded"
            >
              <Skeleton className="h-5 w-5 rounded-full " />
              <Skeleton className="h-5 flex-grow ml-2 rounded " />
             
            </li>
          ))}
        </ul>
      </div>
    );
  }

  return (
    <div className="p-2">
    {notes?.length === 0 ? (
      <p className="text-gray-500">No notes yet. Create a new note to get started!</p>
    ) : (
      <ul className="space-y-2">
        {notes?.map((note) => (
          <li
            key={note.note_id}
            className="transition-all flex items-center justify-between p-2 py-1 rounded bg-white dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700"
          >
            {editingNoteId === note.note_id ? (
              <div className="flex items-center space-x-2 flex-grow">
                <FileText className="h-5 w-5 text-gray-500 dark:text-gray-300" />
                <Input
                  value={editedTitle}
                  onChange={(e) => setEditedTitle(e.target.value)}
                  className="flex-grow"
                />
                <Button size="sm" onClick={() => handleSaveTitle(note.note_id)}>Save</Button>
                <Button size="sm" variant="light" onClick={handleCancelEdit}>Cancel</Button>
              </div>
            ) : (
              <>
                <div 
                  className="flex items-center space-x-2 cursor-pointer flex-grow"
                  onClick={() => onSelectNote(note)}
                >
                  <FileText className="h-5 w-5 text-gray-500 dark:text-gray-300" />
                  <h4 className="font-medium w-[calc(100%-60px)] truncate">{note.title || "Untitled Note"}</h4>
                </div>
                <div className="flex items-center space-x-2 text-gray-500 dark:text-gray-300">
                  <Button isIconOnly variant="light" onClick={() => handleEditClick(note)}>
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button isIconOnly variant="light">
                        <Trash2 className="h-4 w-4 text-red-500" />
                      </Button>
                    </AlertDialogTrigger>
                  </AlertDialog>
                </div>
              </>
            )}
          </li>
        ))}
      </ul>
    )}
  </div>
  
  );
};

export default NoteList;

