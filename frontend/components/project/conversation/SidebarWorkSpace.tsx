'use client'

import { FC, useMemo, useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Lấy project_id từ URL
import {
  ExclamationCircleIcon,
  ChevronLeftIcon,
  PlusIcon,
  HomeIcon,
  PencilSquareIcon,
  TrashIcon,
  MagnifyingGlassIcon,
} from "@heroicons/react/24/outline";
import dayjs from "dayjs"; // Thư viện để xử lý ngày tháng
import { EllipsisHorizontalIcon } from "@heroicons/react/24/outline";
import { Listbox, ListboxItem, Button } from "@nextui-org/react";
import MiniNote from "@/components/document/MiniNote";

import { Conversation } from "@/src/types/types";
import { ListboxWrapper } from "@/components/ListboxWrapper";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  renameConversation,
  getDocumentInProject,
  deleteConversation,
} from "@/service/projectApi";
import { useToast } from "@/hooks/use-toast";
import { ToastAction } from "@/components/ui/toast";
import { Document } from "@/src/types/types";

import NewWorkspace from "../workspace/NewWorkspace";


interface SidebarWorkspaceProps {
  onSelectConversation: (conv: Conversation) => void;
  conversations: Conversation[];
  updatedConversations: () => void;
  projectId: string;
  params: { project_id: string, conversation_id: string }
}

const SidebarWorkspace: FC<SidebarWorkspaceProps> = ({
  onSelectConversation,
  conversations,
  updatedConversations,
  projectId,
  params
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [isCompactSidebar, setIsCompactSidebar] = useState<boolean>(false);
  const { project_id, conversation_id } = params
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
    id: string | null;
  }>({ x: 0, y: 0, id: null });
  const [isDeleteConversation, setIsDeleteConversation] =
    useState<boolean>(false);
  const [selectedConversationId, setSelectedConversationId] =
    useState<string>("");
  const [selectedConversationName, setSelectedConversationName] =
    useState<string>("");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [renameConversationId, setRenameConversationId] = useState<string>("");
  const [newName, setNewName] = useState<string>("");
  const [openNewConversation, setOpenNewConversation] =
    useState<boolean>(false);
  const [documents, setDocuments] = useState<Document[]>([]);

  const handleToggleNewConversation = () =>
    setOpenNewConversation(!openNewConversation);
  const handleDelete = async () => {
    setSelectedConversationId("");
    setIsLoading(true);
    try {
      const data = await deleteConversation(conversation_id as string);

      toast({
        description: "Delete Successfully!",
      });
      updatedConversations();
    } catch (e) {
      console.log(e);
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
    handleOpenDeleteConversation();
    setIsLoading(false);
  };

  const handleGetDocuments = async () => {
    try {
      const data = await getDocumentInProject(project_id as string);

      setDocuments(data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleRenameConversation = async (id: string) => {
    if (newName?.trim() === "" || newName === selectedConversationName) {
      toast({
        description: "Name is same or empty. No changes made.",
      });
      setRenameConversationId("");

      return;
    }

    toast({
      description: "Loading...",
    });
    try {
      const data = await renameConversation(id, newName);

      console.log(data);
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
      setRenameConversationId("");
    }
  };

  const sortedConversations = useMemo(() => {
    return conversations?.slice().sort((a, b) => {
      return dayjs(b.updated_at).diff(dayjs(a.updated_at)); // Sắp xếp theo updated_at từ mới đến cũ
    });
  }, [conversations]);

  const handleOpenDeleteConversation = () => {
    setIsDeleteConversation(!isDeleteConversation);
    setContextMenu({ x: 0, y: 0, id: null });
  };

  const handleBackHome = () => {
    router.push(`/project/${project_id}`);
  };

  const handleContextMenu = (
    e: React.MouseEvent<HTMLDivElement>,
    conversationId: string,
    conversationName: string,
  ) => {
    e.preventDefault();
    e.stopPropagation();
    setSelectedConversationName(conversationName);
    setSelectedConversationId(conversationId);
    setContextMenu({ x: e.clientX, y: e.clientY, id: conversationId });
  };

  const handleOpenRename = () => {
    setNewName(selectedConversationName);
    setRenameConversationId(selectedConversationId);
    setContextMenu({ x: 0, y: 0, id: null });
  };

  useEffect(() => {
    if (conversation_id !== undefined) {
      const selectedConv = conversations.find(
        (conv) => conversation_id === conv.conversation_id,
      );

      if (selectedConv) {
        onSelectConversation(selectedConv);
      }
    }
  }, [conversation_id, conversations]);
  useEffect(() => {
    if (project_id !== undefined) {
      handleGetDocuments();
    }
  }, [project_id]);

  const renderConversations = () =>
    sortedConversations?.length > 0 ? (
      <div className="mt-1 space-y-1">
        {sortedConversations.map((conv) => {
          const isSelected = conversation_id === conv.conversation_id;

          return (
            <div
              key={conv.conversation_id}
              className={`relative transition-all group flex justify-between items-center space-x-2 text-sm cursor-pointer p-2 rounded-lg ${
                isSelected
                  ? "bg-zinc-300 dark:bg-zinc-700 text-white" // Highlight selected conversation
                  : "text-gray-700 dark:text-gray-400 hover:bg-zinc-200 dark:hover:bg-zinc-800"
              }`}
              onClick={() => onSelectConversation(conv)}
              onContextMenu={(e) =>
                handleContextMenu(
                  e,
                  conv.conversation_id,
                  conv.conversation_name,
                )
              }
            >
              {renameConversationId === conv.conversation_id ? (
                <input
                  autoFocus
                  className="absolute left-0 w-full p-1 text-sm bg-white rounded shadow-md dark:bg-zinc-900 dark:border-zinc-700"
                  type="text"
                  value={newName}
                  onBlur={() => handleRenameConversation(conv.conversation_id)}
                  onChange={(e) => setNewName(e.target.value)}
                  onClick={(e) => e.stopPropagation()}
                  onKeyDown={(e) =>
                    e.key === "Enter" &&
                    handleRenameConversation(conv.conversation_id)
                  }
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
      <div className="ml-4 mt-1 text-gray-500">
        Không có cuộc trò chuyện nào.
      </div>
    );

  // Đóng menu context khi nhấp ra ngoài
  useEffect(() => {
    const handleClickOutside = () => setContextMenu({ x: 0, y: 0, id: null });

    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  return (
    <div
      className={`${isCompactSidebar ? "w-14 p-1" : "w-60 p-4"} h-screen dark:bg-zinc-900 bg-zinc-50 flex flex-col`}
    >
      <div className="flex justify-between items-center">
        <Button
          isIconOnly
          onClick={() => setIsCompactSidebar(!isCompactSidebar)}
        >
          <ChevronLeftIcon className="w-4 h-4" />
        </Button>
        {!isCompactSidebar && (
          <Button isIconOnly onClick={() => handleToggleNewConversation()}>
            <PlusIcon className="w-4 h-4" />
          </Button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto">
        <div>
        <div
            className="flex dark:text-gray-400 text-gray-700 transition-all p-3 rounded-lg cursor-pointer my-2 hover:bg-zinc-200 dark:hover:bg-zinc-800"
            onClick={() => handleBackHome()}
          >
            <div className="flex items-center space-x-3">
              <HomeIcon className="h-4 w-4 text-gray-300" />
              <span className="text-xs">Home</span>
            </div>
          </div>
        </div>

      <MiniNote projectId={projectId}/>


        <Button
          className="w-full mt-3"
          size="sm"
          startContent={<MagnifyingGlassIcon className="w-4 h-4" />}
          variant="bordered"
        >
          Search something...
        </Button>
        <h3 className="mt-5 flex items-center justify-between text-sm font-semibold dark:text-gray-400 text-gray-700 transition-all rounded-lg px-2 p-1 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800">
          <span>Conversations</span>
        </h3>
        {renderConversations()}

        {/* Menu Context Tùy Chỉnh */}
        <div
          className={`dark:bg-zinc-800 bg-zinc-200 ${contextMenu.id ? "visible opacity-100" : "invisible opacity-0"} absolute rounded shadow-lg z-10`}
          style={{ top: contextMenu.y, left: contextMenu.x }}
        >
          <ListboxWrapper>
            <Listbox aria-label="Actions">
              <ListboxItem
                key="rename"
                textValue="Pop Up"
                onClick={() => handleOpenRename()}
              >
                <div className="flex items-center">
                  <PencilSquareIcon className="h-4 w-4 mr-2" />
                  Rename
                </div>
              </ListboxItem>
              <ListboxItem
                key="delete"
                className="text-danger"
                color="danger"
                textValue="Pop Up"
                onClick={() => handleOpenDeleteConversation()}
              >
                <div className="flex items-center">
                  <TrashIcon className="h-4 w-4 mr-2" />
                  Delete
                </div>
              </ListboxItem>
            </Listbox>
          </ListboxWrapper>
        </div>
      </div>

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
              <span className="font-bold">{selectedConversationName}</span>{" "}
              cannot be restored.
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

      <NewWorkspace
        documents={documents as Document[]}
        from="conversation"
        isOpen={openNewConversation}
        projectId={project_id as string}
        updateConversation={updatedConversations}
        onClose={handleToggleNewConversation}
      />
    </div>
  );
};

export default SidebarWorkspace;
