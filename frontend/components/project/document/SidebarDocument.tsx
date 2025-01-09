import React, { useState, useEffect, useRef } from "react";
import { Button, Listbox, ListboxItem } from "@nextui-org/react";
import {
  EllipsisHorizontalIcon,
  PlusIcon,
  TrashIcon,
  PencilSquareIcon,
  ExclamationCircleIcon,
  ArrowTopRightOnSquareIcon
} from "@heroicons/react/24/outline";

import MiniNote from "@/components/document/MiniNote";
import { Conversation } from "@/src/types/types";
import { ListboxWrapper } from "@/components/ListboxWrapper";
import { renameConversation, deleteConversation } from "@/service/projectApi";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

interface SidebarDocumentProps {
  documentName: string;
  conversations: Conversation[];
  onSelectConversation: (conv: Conversation) => void;
  selectedConversation: string;
  createNewConversation: () => void;
  updatedConversations: () => void;
  isLoadingCreate: boolean;
  projectId: string
}

const SidebarDocument: React.FC<SidebarDocumentProps> = ({
  createNewConversation,
  documentName,
  conversations,
  selectedConversation,
  onSelectConversation,
  updatedConversations,
  isLoadingCreate,
  projectId
}) => {
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    id: string | null;
  }>({ x: 0, y: 0, id: null });
  const [isRenaming, setIsRenaming] = useState<string | null>(null); // Track which conversation is being renamed
  const [newName, setNewName] = useState<string>("");
  const { toast } = useToast();
  const [selectedConvId, setSelectedConvId] = useState<string>("");
  const [isDeleteConversation, setIsDeleteConversation] =
    useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const handleOpenDeleteConversation = () => {
    setContextMenu({ ...contextMenu, id: null });
    setIsDeleteConversation(!isDeleteConversation);
  };

  // Handle right-click context menu
  const handleContextMenu = (
    e: React.MouseEvent<HTMLDivElement>,
    conversationId: string,
    name: string,
  ) => {
    e.preventDefault();
    setNewName(name);
    setSelectedConvId(conversationId);
    setContextMenu({ x: e.clientX, y: e.clientY, id: conversationId });
  };

  const handleRenameSubmit = async (convId: string, oldName: string) => {
    console.log("Rename conversation:", convId, "to", newName);
    if (newName?.trim() === "" || newName === oldName) {
      toast({
        description: "Name is same or empty. No changes made.",
      });
      setIsRenaming(null);

      return;
    }

    toast({
      description: "Loading...",
    });
    try {
      const data = await renameConversation(convId, newName);

      updatedConversations();
      toast({
        description: "Rename Successfully!",
      });
    } catch (e) {
      console.log(e);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      setIsRenaming(null);
    }
    setIsRenaming(null);
  };

  const handleDelete = async () => {
    setIsRenaming(null);
    setIsLoading(true);
    try {
      const data = await deleteConversation(selectedConvId);

      updatedConversations();
      toast({
        description: "Delete Successfully!",
      });
    } catch (e) {
      console.log(e);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
    setIsLoading(false);
    handleOpenDeleteConversation();
  };

  const handleClickOutside = (event: MouseEvent) => {
    if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
      setContextMenu({ ...contextMenu, id: null }); // Tắt menu nếu click ra ngoài
    }
  };

  useEffect(() => {
    if (contextMenu.id) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }

    // Clean up event listener
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contextMenu]);

  const renderConversations = () =>
    conversations?.length > 0 ? (
      <div className="ml-1 mt-1 space-y-1">
        {conversations.map((conv) => {
          const isSelected = selectedConversation === conv.conversation_id;

          return (
            <div
              key={conv.conversation_id}
              className={`relative transition-all ml-2 group flex justify-between items-center space-x-2 text-sm cursor-pointer p-2 rounded-lg ${
                isSelected
                  ? "bg-zinc-300 dark:bg-zinc-700 text-white"
                  : "text-gray-700 dark:text-gray-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
              }`}
              onClick={() => onSelectConversation(conv)}
              role="button" 
              tabIndex={0} 
              onKeyPress={(e) => {
                if (e.key === 'Enter' || e.key === ' ') {
                  onSelectConversation(conv); 
                }
              }}
              onContextMenu={(e) =>
                handleContextMenu(
                  e,
                  conv.conversation_id,
                  conv.conversation_name,
                )
              }
            >
              {isRenaming === conv.conversation_id ? (
                <input
                  className="absolute left-0 w-full p-1 text-sm bg-white rounded shadow-md dark:text-gray-100 text-gray-900 dark:bg-zinc-900 dark:border-zinc-700"
                  value={newName}
                  onBlur={() =>
                    handleRenameSubmit(
                      conv.conversation_id,
                      conv.conversation_name,
                    )
                  } // Submit when user clicks outside
                  onChange={(e) => setNewName(e.target.value)}
                />
              ) : (
                <span>{conv.conversation_name}</span>
              )}
              <div
                className="opacity-0 group-hover:opacity-100"
                onClick={(e) =>
                  handleContextMenu(
                    e,
                    conv.conversation_id,
                    conv.conversation_name,
                  )
                }
              >
                <EllipsisHorizontalIcon className="h-4 w-4 text-gray-400" />
              </div>
            </div>
          );
        })}
      </div>
    ) : (
      <div className="ml-4 mt-1 text-gray-500 italic text-sm">
        Không có cuộc trò chuyện nào.
      </div>
    );

  return (
    <div className="w-64 h-screen dark:bg-zinc-900 bg-zinc-50 p-4 relative">
      <div className="text-left">
        <p className="text-lg font-bold">{documentName}</p>
      </div>

      <div className="my-4">
       
      <MiniNote projectId={projectId}/>

      </div>

     

      <h2 className="text-sm font-semibold text-gray-500">Conversations</h2>

      {renderConversations()}

      <Button
        className={`w-full bg-transparent transition-all ml-2 justify-center group flex items-center space-x-2 text-sm cursor-pointer p-2 rounded-lg `}
        isLoading={isLoadingCreate}
        startContent={!isLoadingCreate ? <PlusIcon className="w-4 h-4" /> : ""}
        onClick={createNewConversation}
      >
        <span>New Conversation</span>
      </Button>

      {/* Hiển thị context menu nếu có cuộc trò chuyện được nhấp chuột phải */}
      {contextMenu.id && (
        <div
          ref={menuRef}
          className="z-20 absolute bg-white dark:bg-zinc-800 rounded-md"
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <ListboxWrapper>
            <Listbox aria-label="Actions">
              <ListboxItem key="rename" textValue="Pop Up">
                <div
                  className="flex items-center"
                  onClick={() => {
                    setIsRenaming(contextMenu.id);
                    setContextMenu({ ...contextMenu, id: null });
                  }}
                >
                  <PencilSquareIcon className="h-4 w-4 mr-2" />
                  Rename
                </div>
              </ListboxItem>
              <ListboxItem
                key="delete"
                className="text-danger"
                color="danger"
                textValue="Pop Up"
                onClick={handleOpenDeleteConversation}
              >
                <div className="flex items-center">
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete
                </div>
              </ListboxItem>
            </Listbox>
          </ListboxWrapper>
        </div>
      )}

      <AlertDialog
        open={isDeleteConversation}
        onOpenChange={() => handleOpenDeleteConversation()}
      >
        <AlertDialogContent className="dark:bg-zinc-800 border-none">
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center">
              <ExclamationCircleIcon className="w-6 h-6 mr-2" />
              Do you really want to delete
            </AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone.{" "}
              <span className="font-bold">{newName}</span> cannot be restored.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <Button onClick={() => handleOpenDeleteConversation()}>
              Cancel
            </Button>
            <Button
              color="danger"
              isLoading={isLoading}
              onClick={() => handleDelete()}
            >
              Delete
            </Button>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default SidebarDocument;
