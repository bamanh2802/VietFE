import React, { useState, useRef, useEffect } from "react";
import { Skeleton } from "@nextui-org/skeleton";
import { UserIcon, 
  MagnifyingGlassIcon, 
  DocumentTextIcon, 
  ListBulletIcon, 
  Bars3Icon,
} from "@heroicons/react/24/outline";
import { UsersIcon } from "lucide-react";
import {
  Dropdown,
  DropdownTrigger,
  DropdownMenu,
  DropdownSection,
  DropdownItem
} from "@heroui/dropdown";
import dynamic from "next/dynamic";
import { useMemo } from "react";

import { Note } from "@/src/types/types";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@nextui-org/button";
import ResultDisplay from "./ResultDisplay";
import ShareWorkspace from "./ShareWorkspace";
interface RichTextEditorProps {
  selectedNote: string;
  note: Note;
  renameNote: (noteId: string, newName: string) => void;
  editNote: (noteId: string, content: string, formatted_text: string) => void;
  editable: boolean;
  type: string,
  owner: string
}

const RichTextEditor: React.FC<RichTextEditorProps> = ({
  selectedNote,
  note,
  renameNote,
  editNote,
  editable,
  type,
  owner
}) => {
  const [editorContent, setEditorContent] = useState("");
  const editorRef = useRef<HTMLDivElement>(null);
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null);
  const [title, setTitle] = useState("Untitled");
  const [typingTimeout, setTypingTimeout] = useState<NodeJS.Timeout | null>(null);
  const isLoading = type === 'project' 
  ? !(selectedNote === note?.note_id && note) 
  : type === 'share' 
  ? !note 
  : false; 

  const [resultType, setResultType] = useState<'summary' | 'outline' | null>(null);
  const [resultContent, setResultContent] = useState<string>("");

  const Editor = useMemo(
    () => dynamic(() => import("@/components/project/Editor"), { ssr: false }),
    [],
  );

  const [isOpenShare, setIsOpenShare] = useState<boolean>(false);
  const closeShare = () => setIsOpenShare(false);
  const openShare = () => setIsOpenShare(true)

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setEditorContent(note.content);
    }
  }, [note, isLoading]);

  const handleEditorChange = (content: any) => {
    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }
  
    const timeout = setTimeout(() => {
      const formatted_text = JSON.stringify(content.document);
  
      const contentObject = content.document; 
      const context = contentObject
      .map((block: any) => 
        Array.isArray(block.content) 
          ? block.content.map((item: any) => item.text).join("") 
          : ""  
      )
      .join(" ");

  
  
      editNote(note.note_id, context, formatted_text);
    }, 1000);
  
    setDebounceTimeout(timeout);
  };
  

  function convertDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);

    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    if (diffInHours < 24) return `${diffInHours}h ago`;
    if (diffInDays < 7) return `${diffInDays}d ago`;
    if (diffInWeeks < 4) return `${diffInWeeks}w ago`;

    const options: Intl.DateTimeFormatOptions = { day: "numeric", month: "short" };
    return date.toLocaleDateString("en-US", options);
  }

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTitle(e.target.value);

    if (typingTimeout) {
      clearTimeout(typingTimeout);
    }

    const newTimeout = setTimeout(() => {
      renameNote(note.note_id, e.target.value);
    }, 2000);

    setTypingTimeout(newTimeout);
  };

  const handleDropdownAction = async (action: 'find' | 'summarize' | 'createOutline' | 'share'): Promise<void> => {
    if (action === 'share') {
      openShare()
    }
  };
  

  return (
    <div className="w-full max-w-3xl mx-auto bg-[#ffffff] dark:bg-[#1f1f1f] p-4 rounded-lg">
      <Card className="border-none border-b-1 w-full max-w-3xl mx-auto bg-[#ffffff] dark:bg-[#1f1f1f] shadow-none">
        <CardHeader className="flex flex-row items-center justify-between">
          {isLoading ? (
            <Skeleton className="h-10 w-full rounded-md" />
          ) : (
            <>
              <Input
                className="text-3xl font-bold bg-transparent border-none opacity-75 focus:outline-none placeholder-gray-500"
                placeholder="Untitled"
                type="text"
                value={title}
                onChange={handleTitleChange}
              />
              <Dropdown>
                <DropdownTrigger asChild>
                  <Button isIconOnly variant="light"><Bars3Icon className="w-4 h-4"/></Button>
                </DropdownTrigger>
                <DropdownMenu >
                  <DropdownItem
                  startContent={<MagnifyingGlassIcon className="mr-2 h-4 w-4" />}
                  className="flex items-center" key='find' onPress={() => handleDropdownAction('find')}>
                    Find
                  </DropdownItem>
                  <DropdownItem
                  startContent={<DocumentTextIcon className="mr-2 h-4 w-4" />}
                  key='summarize' onPress={() => handleDropdownAction('summarize')}>
                    Summarize
                  </DropdownItem>
                  <DropdownItem
                  startContent={<ListBulletIcon className="mr-2 h-4 w-4" />}
                  key='create-outline' onPress={() => handleDropdownAction('createOutline')}>
                    Create Outline
                  </DropdownItem>
                  <DropdownItem
                  startContent={<UsersIcon className="mr-2 h-4 w-4" />}
                  key='share' onPress={() => handleDropdownAction('share')}>
                    Share
                  </DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </>
          )}
        </CardHeader>
        <CardContent className="border-none border-b-gray-500 border-opacity-70">
          {isLoading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-1/4 rounded-md" />
              <Skeleton className="h-4 w-1/2 rounded-md" />
              <Skeleton className="h-4 w-1/3 rounded-md" />
            </div>
          ) : (
            <div className="flex items-center space-x-4 mb-6">
              <div className="flex items-center space-x-2">
                <UserIcon className="h-4 w-4" />
                <span className="text-sm text-gray-400">Owner</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm">{owner ? owner : 'Not found'}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-400">
                  Updated at: {convertDate(note?.updated_at)}
                </span>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {isLoading ? (
        <Skeleton className="h-60 w-full rounded-md" />
      ) : (
        selectedNote === note?.note_id &&
        note && (
          <Editor
            editable={editable}
            initialContent={note?.formatted_text}
            onChange={handleEditorChange}
            docId={note?.note_id}
          />
        )
      )}

      <ResultDisplay type={resultType} content={resultContent} />
      <ShareWorkspace isOpen={isOpenShare} onClose={closeShare} id={note?.note_id} type="note"/>
    </div>
  );
};

export default RichTextEditor;

