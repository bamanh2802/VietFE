import React, { useState, useMemo, useEffect } from "react";
import { Rnd } from "react-rnd";
import dynamic from "next/dynamic";
import { Note } from "@/src/types/types";
import { getNotesInProject } from "@/service/projectApi";
import { Button } from "@nextui-org/button";
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
import { Skeleton } from '@nextui-org/skeleton';
interface MiniNoteProps {
  projectId: string
}

const MiniNote: React.FC<MiniNoteProps> = ({ projectId }) => {
  const { toast } = useToast();
  const [isOpen, setIsOpen] = useState(false);
  const [notes, setNotes] = useState<Note[]>();
  const [isLoading, setIsLoading] = useState<boolean>(false)
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
    setIsLoading(true)
    try {
      const data = await getNoteById(noteId);
      setIsEditing(true)
      setSelectedNote(data.data.note);
    } catch (e) {
      console.log(e);
    }
    setIsLoading(false)

  };


  useEffect(() => {
    if(projectId !== undefined) {
      handleGetNotes();
    }
  }, [projectId]);
  const handleEditNote = async (noteId: string, content: string, formatted_text: string) => {
    try {
      const data = await editNote(noteId, content, formatted_text);
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
      const formatted_text = JSON.stringify(content.document);
      const contentObject = content.document; 
      const context = contentObject
        .map((block: any) => 
          block.content
            .map((item: any) => item.text) 
            .join("") 
        )
        .join(" "); 
        
        
        if (selectedNote !== null) {
        console.log(selectedNote.note_id, context, formatted_text)
        handleEditNote(selectedNote.note_id, context, formatted_text);
        setNotes([]);
      }
    }, 1000);

    setDebounceTimeout(timeout);
  };

  const handleSelectNote = (note: Note) => {
    handleGetNoteById(note.note_id)
    setIsEditing(true);
  };

  const handleBackToList = () => {
    handleGetNotes()
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
          className="bg-white shadow-md rounded-lg border border-gray-300 dark:border-gray-900 z-50"
          dragHandleClassName="drag-handle"
        >
          <div className="flex flex-col h-full">
            <div className="drag-handle flex justify-between items-center p-2 bg-gray-100 dark:bg-zinc-800 border-b rounded-t-lg cursor-move">
              <h2 className="text-lg font-semibold">
                {selectedNote ? (selectedNote.title) : (`NoteList`)}
              </h2>
              <button
                onClick={toggleNotepad}
                className="text-red-600 text-xl font-bold cursor-pointer"
              >
                ×
              </button>
            </div>
            <div className="drag-handle border-none">
              <Menubar className="border-none dark:bg-zinc-900 cursor-default rounded-none">
                <MenubarMenu>
                  <MenubarTrigger className="cursor-pointer">Note</MenubarTrigger>
                  <MenubarContent>
                    <MenubarItem className="cursor-pointer" onClick={handleCreateNewNote}>
                      New Note <MenubarShortcut>⌘T</MenubarShortcut>
                    </MenubarItem>
                    <MenubarItem className="cursor-pointer" onClick={handleBackToList}>
                      Note List <MenubarShortcut>⌘N</MenubarShortcut>
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
                {isEditing && (
                  <MenubarMenu>
                    <MenubarTrigger className="cursor-pointer">Edit</MenubarTrigger>
                    <MenubarContent>
                      <MenubarItem className="cursor-pointer">
                        Undo <MenubarShortcut>⌘Z</MenubarShortcut>
                      </MenubarItem>
                      <MenubarItem className="cursor-pointer">
                        Redo <MenubarShortcut>⇧⌘Z</MenubarShortcut>
                      </MenubarItem>
                    </MenubarContent>
                  </MenubarMenu>
                )}
              </Menubar>
            </div>
          
            <div className="flex-grow overflow-auto cursor-auto bg-[#ffffff] dark:bg-[#1f1f1f]">
            {isLoading ? (
              <div className="p-4 space-y-2">
                <Skeleton className="h-3 w-full rounded-lg" />
                <Skeleton className="h-3 w-3/5 rounded-lg" />
                <Skeleton className="h-3 w-full rounded-lg" />
                <Skeleton className="h-3 w-3/5 rounded-lg" />
              </div>
            ) : isEditing && selectedNote ? (
              <Editor
                editable={true}
                initialContent={selectedNote.formatted_text}
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

      <style jsx global>{`
        .drag-handle {
          cursor: move;
        }
      `}</style>
    </div>
  );
};

export default MiniNote;

