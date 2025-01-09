import React, { useState, useMemo, useEffect } from "react";
import { Rnd } from "react-rnd";
import dynamic from "next/dynamic";
import { Note } from "@/src/types/types";
import { getNotesInProject } from "@/service/projectApi";
import { Button } from "@nextui-org/react";
import {
  Menubar,
  MenubarContent,
  MenubarItem,
  MenubarMenu,
  MenubarShortcut,
  MenubarTrigger,
} from "@/components/ui/menubar"
import { createNewNote, deleteNote, renameNote, editNote, getNoteById } from "@/service/noteApi";
import { ArrowTopRightOnSquareIcon } from "@heroicons/react/24/outline";
import { useToast } from "@/hooks/use-toast";
import NoteList from "./NoteList";

interface MiniNoteProps {
  projectId: string
}

const MiniNote: React.FC<MiniNoteProps> = ({ projectId }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>();
  const [selectedNote, setSelectedNote] = useState<Note | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(
    null,
  );
  const Editor = useMemo(
    () => dynamic(() => import("@/components/project/Editor"), { ssr: false }),
    [],
  );

  const toggleNotepad = () => {
    setIsOpen((prev) => !prev);
  };

  const handleGetNotes = async () => {
    try {
      const data = await getNotesInProject(projectId as string);
      setNotes(data.data);
    } catch (e) {
      setNotes([]);
      console.log(e);
    }
  };

  const handleDeleteNote = async (noteId: string) => {
    toast({
      description: "Loading...",
    });
    try {
      const data = await deleteNote(noteId)
      toast({
        title: "Delete successfully",
        description: "Waiting for data loading",
      });
      handleGetNotes()
    } catch (e) {
      console.log(e)
      toast({
        variant: "destructive",
        title: "Delete failed!",
        description: "Something went wrong!",
      });
    }
  }
  const handleRenameNote = async (noteId: string, newName: string) => {
    toast({
      description: "Loading...",
    });
    try {
      const data = await renameNote(noteId, newName)
      toast({
        description: "Rename Successfully!",
      });
      handleGetNotes()
    } catch (e) {
      console.log(e)
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
    }
  }

  const handleCreateNewNote = async () => {
    toast({
      title: "Creating...",
      description: "Waiting for create",
    });
    try {
      const data = await createNewNote(projectId as string);
      console.log(data)
      handleGetNoteById(data.data.note_id)
      toast({
        title: "New note created successfully",
        description: "Waiting for data loading",
      });
      handleGetNotes();
    } catch (e) {
      console.log(e);
    }
  };
  const handleGetNoteById = async (noteId: string) => {
    console.log(noteId)
    try {
      const data = await getNoteById(noteId);
      setIsEditing(true)
      setSelectedNote(data.data.note);
    } catch (e) {
      console.log(e);
    }
  };


  useEffect(() => {
    if(projectId !== undefined) {
      handleGetNotes();
    }
  }, [projectId]);
  const handleEditNote = async (noteId: string, content: string) => {
    try {
      const data = await editNote(noteId, content, content);
      console.log(data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleEditorChange = (content: any) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    // Đặt lại timeout mới sau 1s
    const timeout = setTimeout(() => {
      const contentJson = JSON.stringify(content.document);

      if (selectedNote !== null) {
        handleEditNote(selectedNote.note_id, contentJson);
      }
    }, 1000);

    setDebounceTimeout(timeout);
  };

  const handleSelectNote = (note: Note) => {
    setSelectedNote(note);
    setIsEditing(true);
  };

  const handleBackToList = () => {
    setIsEditing(false);
    setSelectedNote(null);
  };

  return (
    <div>
      <Button
        variant="flat"
        className="w-full"
        size="sm"
        onClick={toggleNotepad}
        endContent={<ArrowTopRightOnSquareIcon className="w-4 h-4"/>}
      >
        Note
      </Button>

      {isOpen && (
        <Rnd
          default={{
            x: 150,
            y: 150,
            width: 400,
            height: 300,
          }}
          minWidth={470}
          minHeight={450}
          maxHeight={600}
          bounds="window"
          className="bg-white shadow-md rounded-lg border border-gray-300 z-50"
        >
          <div className="flex flex-col h-full">
            <div className="flex justify-between items-center p-2 bg-gray-100 border-b rounded-t-lg">
              <h2 className="text-lg font-semibold">
                {selectedNote ? (selectedNote.title) : (`NoteList`)}
                </h2>
              <button
                onClick={toggleNotepad}
                className="text-red-600 text-xl font-bold"
              >
                ×
              </button>
            </div>
            <Menubar className="border-none border-b-1">
              <MenubarMenu>
                <MenubarTrigger>Note</MenubarTrigger>
                <MenubarContent>
                  <MenubarItem onClick={handleCreateNewNote}>
                    New Note <MenubarShortcut>⌘T</MenubarShortcut>
                  </MenubarItem>
                  <MenubarItem onClick={handleBackToList}>
                    Note List <MenubarShortcut>⌘N</MenubarShortcut>
                  </MenubarItem>
                </MenubarContent>
              </MenubarMenu>
              {isEditing && (
                <MenubarMenu>
                  <MenubarTrigger>Edit</MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem>
                      Undo <MenubarShortcut>⌘Z</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem>
                      Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              )}
            </Menubar>
          
            <div className="flex-grow overflow-auto">
              {isEditing && selectedNote ? (
                <Editor
                  editable={true}
                  initialContent={selectedNote.content}
                  onChange={handleEditorChange}
                  docId={selectedNote.note_id}
                />
              ) : (
                <NoteList 
                  notes={notes} 
                  onSelectNote={handleSelectNote}
                  onUpdateNoteTitle={handleRenameNote}
                  onDeleteNote={handleDeleteNote}
                />
              )}
            </div>
          </div>
        </Rnd>
      )}
    </div>
  );
};

export default MiniNote;

