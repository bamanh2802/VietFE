'use client'
import React, { useState, useEffect } from "react";
import { createPortal } from 'react-dom';
import { useRouter } from "next/navigation";
import {
  ChatBubbleBottomCenterIcon,
} from "@heroicons/react/24/outline";
import {
  MagnifyingGlassIcon,
  HomeIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  PlusIcon,
  EllipsisHorizontalIcon,
  WindowIcon,
} from "@heroicons/react/24/outline";
import { Button } from "@nextui-org/button";
import {Tooltip} from "@nextui-org/tooltip";
import { useSelector, useDispatch } from "react-redux";

import {
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
} from "@/components/ui/select";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { RootState } from "@/src/store/store";
import { useToast } from "@/hooks/use-toast";
import { setProjects } from "@/src/store/projectsSlice";
import { Document, ImageType, Conversation, Note } from "@/src/types/types";
import { ToastAction } from "@/components/ui/toast";
import { getAllProjectsWithInfo } from "@/service/apis";
import { createNewNote, renameNote } from "@/service/noteApi";
import { renameConversation } from "@/service/projectApi";
import { renameDocument } from "@/service/documentApi";
import { Input, Textarea } from "@nextui-org/input";
import { useTranslations } from 'next-intl';

interface SidebarProps {
  documents: Document[];
  images: ImageType[];
  conversations: Conversation[];
  notes: Note[];
  selectedNote: string;
  setSelectedNote: (note: string) => void;
  setLoading: () => void;
  onOpenDialog: () => void;
  openSearch: () => void;
  openNewDocument: () => void;
  updatedDocuments: (docId: string, newName: string) => void;
  updatedNotes: (noteId: string, newName: string) => void;
  updatedConversations: (convId: string, newName: string) => void;
  handleContextMenu: (e: React.MouseEvent, id: string, name: string) => void;
  handleClick: (e: React.MouseEvent, id: string, name: string) => void;
  handleClickOutside: (event: MouseEvent) => void;
  selectedId: string,
  selectedName: string,
  contextMenu: {
    show: boolean;
    x: number;
    y: number;
    id: string;
  },
  params: { project_id: string }; 
  handleCloseContext: () => void;
  renameDocId: string;
  setRenameDocId: (renameId: string) => void;
  handleCreateNewNote: () => void
}

const Sidebar: React.FC<SidebarProps> = ({
  updatedConversations,
  updatedNotes,
  updatedDocuments,
  onOpenDialog,
  openNewDocument,
  openSearch,
  setLoading,
  documents,
  images,
  selectedNote,
  conversations,
  notes,
  setSelectedNote,
  handleContextMenu,
  handleClick,
  handleClickOutside,
  selectedId,
  selectedName,
  contextMenu,
  handleCloseContext,
  params,
  renameDocId,
  setRenameDocId,
  handleCreateNewNote
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const projects = useSelector((state: RootState) => state.projects.projects);
  const [selectedProjectId, setSelectedProjectId] = useState<string>("");
  const [isLoadingProject, setIsLoadingProject] = useState<boolean>(true);
  const [expandedSections, setExpandedSections] = useState<string[]>([
    "documents", "conversation", "note"
  ]);
  const dispatch = useDispatch();
  const [isUploadDocs, setIsUploadDocs] = useState<boolean>(false);
  const { project_id } = params
  const [newDocumentName, setNewDocumentName] = useState("");

  const p = useTranslations('Project');
  const g = useTranslations('Global');


  useEffect(() => {
    if (selectedName) {
      setNewDocumentName(selectedName)
    }
  }, [selectedName])

  useEffect(() => {
    if (!renameDocId) return; 
  
    let sectionToExpand = "";
    
    if (renameDocId.startsWith("doc-")) {
      sectionToExpand = "documents";
    } else if (renameDocId.startsWith("note-")) {
      sectionToExpand = "note";
    } else if (renameDocId.startsWith("conv-")) {
      sectionToExpand = "conversation";
    }
  
    if (sectionToExpand && !expandedSections.includes(sectionToExpand)) {
      toggleExpand(sectionToExpand);
    }
  }, [renameDocId]);
  


  const handleRename = async (id: string) => {
    if (newDocumentName?.trim() === "" || newDocumentName === selectedName) {
      toast({
        description: "Name is the same or empty. No changes made.",
      });
      setRenameDocId("");
      return;
    }
  
    toast({
      description: "Loading...",
    });
  
    try {
      let data;
  
      if (id.startsWith("doc-")) {
        data = await renameDocument(id, newDocumentName);
        updatedDocuments(id, newDocumentName);
      } else if (id.startsWith("note-")) {
        data = await renameNote(id, newDocumentName);
        updatedNotes(id, newDocumentName);
      } else if (id.startsWith("conv-")) {
        data = await renameConversation(id, newDocumentName);
        updatedConversations(id, newDocumentName);
      }
  
      toast({
        description: "Rename Successfully!",
      });
    } catch (e: any) {
      console.error("Error during renaming:", e);
  
      const errorMessage =
        e?.response?.data?.message || e?.message || "There was a problem with your request.";
  
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: errorMessage,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    } finally {
      setRenameDocId("");
    }
  };
  

 

  useEffect(() => {
    if(project_id !== undefined) {
      if (projects === undefined) {
        handleGetProjects();
      }
      setSelectedProjectId(project_id as string);
      if(projects !== undefined) {
        if (projects?.length > 0) {
          setIsLoadingProject(false);
        }
      }
    }
  }, [project_id, projects]);


  const handleGetProjects = async () => {
    try {
      const data = await getAllProjectsWithInfo();
      dispatch(setProjects(data.data));
    } catch (e) {
      console.log(e);
    }
  };

  
  
  const getProjectNameById = (projectId: string | null) => {
    const project = projects?.find((proj) => proj.project_id === projectId);

    return project ? project.name : "Loading...";
  };

  const handleBackHome = () => {
    router.push("/home");
  };

  const toggleExpand = (section: string) => {
    setExpandedSections((prev) =>
      prev.includes(section)
        ? prev.filter((item) => item !== section)
        : [...prev, section],
    );
  };

  const handleRouterDocument = (docId: string) => {
    const url = `/project/${project_id}/document/${docId}`;

    window.open(url, "_blank");
  };

  const handleRouterConversation = (conversationId: string) => {
    const url = `/project/${project_id}/conversation/${conversationId}`;

    window.open(url, "_blank");
  };

  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [contextMenu]);

  const handleProjectClick = (projectId: string) => {
    router.push(`/project/${projectId}`);
    setLoading();
    setSelectedNote("");
  };

  return (
    <div className="dark:bg-zinc-900 bg-zinc-50 overflow-auto select-none h-screen w-56 flex flex-col justify-between p-2">
      <div>
        <div className="rounded-lg mb-4 border-gray-400">
          <Select
            defaultValue={getProjectNameById(selectedProjectId)}
            disabled={isLoadingProject}
            onValueChange={(projectId) => {
              setSelectedProjectId(projectId);
              handleProjectClick(projectId); // Gọi hàm xử lý sau khi chọn
            }}
          >
            <SelectTrigger className="border-gray-400">
              <SelectValue>{getProjectNameById(selectedProjectId)}</SelectValue>
            </SelectTrigger>
            <SelectContent>
              {projects?.map((project) => (
                <SelectItem
                  key={project.project_id}
                  className="cursor-pointer"
                  value={project.project_id} // Không cần onClick ở đây
                >
                  {project.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div>
          <div
            className="flex dark:text-gray-400 text-gray-700 transition-all p-3 rounded-lg cursor-pointer my-2 hover:bg-zinc-200 dark:hover:bg-zinc-800"
            onClick={() => handleBackHome()}
          >
            <div className="flex items-center space-x-3">
              <HomeIcon className="h-4 w-4 text-gray-300" />
              <span className="text-xs">{g('Home')}</span>
            </div>
          </div>
        </div>

        <Button
          className="w-full mb-6"
          size="sm"
          startContent={<MagnifyingGlassIcon className="w-4 h-4" />}
          variant="flat"
          onPress={openSearch}
        >
          {g('Search')}
        </Button>

        {/* Tùy chỉnh các mục menu ở đây */}
        <div className="my-2">
          <div
            className={`flex group items-center justify-between text-sm font-semibold dark:text-gray-400 text-gray-700 transition-all rounded-lg px-2 p-1 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800`}
            onClick={() => toggleExpand("documents")}
            onContextMenu={(e) => handleContextMenu(e, "documents", "none")}
          >
            <div className="flex justify-between items-center space-x-3">
              <span className="text-xs">{g('Documents')}</span>
            </div>
            <div className="flex items-center">
              <Tooltip content="New">
                <PlusIcon
                  className="mr-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-all"
                  onClick={(e) => {
                    openNewDocument();
                    e.stopPropagation();
                  }}
                />
              </Tooltip>
              <ChevronDownIcon
                className={`w-4 h-4 transform transition-transform duration-300 ${expandedSections.includes("documents") ? "rotate-180" : ""}`}
              />
            </div>
          </div>
          {/* Các item con cho mục "Tài liệu" */}
          <div
            className={`mt-2 overflow-auto transition-max-height duration-300 ease-in-out ${expandedSections.includes("documents") ? "max-h-fit" : "max-h-0"}`}
          >
            {expandedSections.includes("documents") && (
              <div className="transition-all mt-1 space-y-1 border-gray-400">
                {documents.map((doc) => (
                  <div
                    key={doc.document_id}
                    className="relative ml-2 group flex justify-between items-center space-x-2 text-xs cursor-pointer p-2 rounded-lg dark:text-gray-400 text-gray-700 dark:hover:bg-zinc-800 hover:bg-zinc-200"
                    onClick={() => handleRouterDocument(doc.document_id)}
                    onContextMenu={(e) =>
                      handleContextMenu(e, doc.document_id, doc.document_name)
                    }
                  >
                    <div className={` truncate flex flex-col items-center`}>
                      <Tooltip content={doc.document_name}>
                        <div 
                          className="flex items-center w-full cursor-pointer" 
                          onClick={() => setRenameDocId(doc.document_id)}
                        >
                          <DocumentTextIcon className="w-4 h-4 mr-1" />
                          <span className={`truncate max-w-32`}>
                            {doc.document_name}
                          </span>
                        </div>
                      </Tooltip>

                      {/* Rename Input Popup */}
                      {renameDocId === doc.document_id && (
                        <div className="top-full mt-1 w-40 z-50">
                          <Textarea
                            autoFocus
                            className={`w-full bg-white dark:bg-zinc-800 shadow-lg rounded-lg text-base p-2`}
                            size="sm"
                            variant="bordered"
                            value={newDocumentName}
                            minRows={2}
                            placeholder="Enter new name..."
                            onBlur={() => handleRename(doc.document_id)}
                            onChange={(e) => setNewDocumentName(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleRename(doc.document_id);
                              }
                              if (e.key === "Escape") {
                                setRenameDocId("");
                              }
                            }}
                          />
                        </div>
                      )}
                    </div>
                    
                    {
                      renameDocId !== doc.document_id && (
                        <Tooltip content="Thêm">
                          <EllipsisHorizontalIcon
                            className="transition-all w-4 h-4 opacity-0 group-hover:opacity-100"
                            onClick={(e) => {
                              e.stopPropagation();
                              handleClick(e, doc.document_id, doc.document_name);
                            }}
                          />
                        </Tooltip>
                      )
                    }
                  </div>
                ))}
                <div
                  className="ml-2 transition-all flex items-center space-x-2 text-xs  hover:text-white cursor-pointer p-2 rounded-lg dark:text-gray-400 text-gray-700 dark:hover:bg-zinc-800 hover:bg-zinc-200 "
                  onClick={openNewDocument}
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>{g('Add')}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="my-2">
          <div
            className={`flex items-center justify-between text-sm font-semibold dark:text-gray-400 text-gray-700 transition-all rounded-lg px-2 p-1 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800`}
            onContextMenu={(e) => handleContextMenu(e, "images", "none")}
          >
            <Tooltip content="Chức năng hiện đang phát triển">
              <div className="flex justify-between items-center space-x-3">
                <span className="text-xs">{g('Images')}</span>
              </div>
            </Tooltip>
            <ChevronDownIcon
              className={`w-4 h-4 transform transition-transform duration-300 ${expandedSections.includes("images") ? "rotate-180" : ""}`}
            />
          </div>
          <div
            className={`mt-2 overflow-auto transition-max-height duration-300 ease-in-out ${expandedSections.includes("images") ? "max-h-fit" : "max-h-0"}`}
          >
            {/* Các item con cho mục "Hình ảnh" */}
            {/* {expandedSections.includes('images') && (
            <div className="transition-all mt-1 space-y-1 border-gray-400">
              {images.map((img, index) => (
                <div
                  key={index}
                  className="ml-2 group flex justify-between items-center space-x-2 text-xs  hover:text-white cursor-pointer p-2 rounded-lg dark:text-gray-400 text-gray-700 dark:hover:bg-zinc-800 hover:bg-zinc-200 "
                  onContextMenu={(e) => handleContextMenu(e, img.image_id, img.caption)}
                  >
                  <div className='flex justify-center items-center '>
                    <DocumentTextIcon className='w-4 h-4 pr-1' />
                    <Tooltip content={img.caption}>
                      <span className='truncate max-w-32'>{img.caption}</span>
                    </Tooltip>
                  </div>
                  <Tooltip content="Thêm">
                    <EllipsisHorizontalIcon 
                   onClick={(e) => handleClick(e, img.image_id)}
                   className='transition-all w-4 h-4 opacity-0 group-hover:opacity-100' />
                  </Tooltip>
                </div>
              ))}
            </div>
          )} */}
          </div>
        </div>

        {/* Conversation */}
        <div className="my-2">
          <div
            className={`group flex items-center justify-between text-sm font-semibold dark:text-gray-400 text-gray-700 transition-all rounded-lg px-2 p-1 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800`}
            onClick={() => toggleExpand("conversation")}
            onContextMenu={(e) => handleContextMenu(e, "conversation", "none")}
          >
            <div className="flex justify-between items-center space-x-3">
              <span className="text-xs">{g('Conversations')}</span>
            </div>
            <div className="flex items-center">
              <Tooltip content="New">
                <PlusIcon
                  className="mr-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-all"
                  onClick={(e) => {
                    onOpenDialog();
                    e.stopPropagation();
                  }}
                />
              </Tooltip>
              <ChevronDownIcon
                className={`w-4 h-4 transform transition-transform duration-300 ${expandedSections.includes("conversation") ? "rotate-180" : ""}`}
              />
            </div>
          </div>
          <div
            className={`mt-2 overflow-auto transition-max-height duration-300 ease-in-out ${expandedSections.includes("conversation") ? "max-h-fit" : "max-h-0"}`}
          >
            {expandedSections.includes("conversation") && (
              <div className="transition-all mt-1 space-y-1 border-gray-400">
                {conversations.map((conversation, index) => (
                  <div
                    key={index}
                    className="relative ml-2 group flex justify-between items-center space-x-2 text-xs  cursor-pointer p-2 rounded-lg dark:text-gray-400 text-gray-700 dark:hover:bg-zinc-800 hover:bg-zinc-200 "
                    onClick={() =>
                      handleRouterConversation(conversation.conversation_id)
                    }
                    onContextMenu={(e) =>
                      handleContextMenu(
                        e,
                        conversation.conversation_id,
                        conversation.conversation_name,
                      )
                    }
                  >
                    <div className="truncate flex flex-col items-center">
                      <Tooltip content={conversation.conversation_name}>
                          <div 
                            className="flex items-center w-full cursor-pointer" 
                            onClick={() => setRenameDocId(conversation.conversation_id)}
                          >
                            <DocumentTextIcon className="w-4 h-4 mr-1" />
                            <span className={`truncate max-w-32`}>
                              {conversation.conversation_name}
                            </span>
                          </div>
                        </Tooltip>
                      {renameDocId === conversation.conversation_id && (
                        <div className="top-full mt-1 w-40 z-50">
                          <Textarea
                            autoFocus
                            className={`w-full bg-white dark:bg-zinc-800 shadow-lg rounded-lg text-base p-2`}
                            size="sm"
                            variant="bordered"
                            value={newDocumentName}
                            minRows={2}
                            placeholder="Enter new name..."
                            onBlur={() => handleRename(conversation.conversation_id)}
                            onChange={(e) => setNewDocumentName(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleRename(conversation.conversation_id);
                              }
                              if (e.key === "Escape") {
                                setRenameDocId("");
                              }
                            }}
                          />
                        </div>
                      ) }
                    </div>
                    {
                      renameDocId !== conversation.conversation_id && (
                        <Tooltip content="Thêm">
                          <EllipsisHorizontalIcon
                            className="transition-all w-4 h-4 opacity-0 group-hover:opacity-100"
                            onClick={(e) =>
                              {
                                e.stopPropagation();
                                handleClick(
                                e,
                                conversation.conversation_id,
                                conversation.conversation_name,
                              )}
                            }
                          />
                        </Tooltip>
                      )
                    }
                  </div>
                ))}
                <div
                  className="ml-2 transition-all flex items-center space-x-2 text-xs  hover:text-white cursor-pointer p-2 rounded-lg dark:text-gray-400 text-gray-700 dark:hover:bg-zinc-800 hover:bg-zinc-200 "
                  onClick={onOpenDialog}
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>{g('Add')}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="my-2">
          <div
            className={`group flex items-center justify-between text-sm font-semibold dark:text-gray-400 text-gray-700 transition-all rounded-lg px-2 p-1 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800`}
            onClick={() => toggleExpand("note")}
            onContextMenu={(e) => handleContextMenu(e, "Note", "none")}
          >
            <div className="flex justify-between items-center space-x-3">
              <span className="text-xs">{g('Notes')}</span>
            </div>
            <div className="flex items-center">
              <Tooltip content="New">
                <PlusIcon 
                  onClick={handleCreateNewNote}
                className="mr-2 w-4 h-4 opacity-0 group-hover:opacity-100 transition-all" />
              </Tooltip>
              <ChevronDownIcon
                className={`w-4 h-4 transform transition-transform duration-300 ${expandedSections.includes("note") ? "rotate-180" : ""}`}
              />
            </div>
          </div>
          <div
            className={`mt-2 overflow-auto transition-max-height duration-300 ease-in-out ${expandedSections.includes("note") ? "max-h-fit" : "max-h-0"}`}
          >
            {expandedSections.includes("note") && (
              <div className="transition-all mt-1 space-y-1 border-gray-400">
                {notes.map((note, index) => {
                  const isSelected = note.note_id === selectedNote; // Kiểm tra xem note có được chọn hay không

                  return (
                    <div
                      key={index}
                      className={`relative ml-2 group flex justify-between items-center space-x-2 text-xs cursor-pointer p-2 rounded-lg 
                      ${isSelected ? "bg-zinc-200 dark:bg-zinc-500" : "dark:text-gray-400 text-gray-700"} 
                      dark:hover:bg-zinc-800 hover:bg-zinc-200`}
                      onClick={() => setSelectedNote(note.note_id)}
                      onContextMenu={(e) =>
                        handleContextMenu(e, note.note_id, note.title)
                      }
                    >
                      <div className="truncate flex flex-col items-center">
                        <Tooltip content={note.title}>
                          <div 
                            className="flex items-center w-full cursor-pointer" 
                            onClick={() => setRenameDocId(note.note_id)}
                          >
                            <DocumentTextIcon className="w-4 h-4 mr-1" />
                              {note.title === null ? (
                                  <span className="truncate max-w-32">
                                    No Name
                                  </span>
                                ) : (
                                  <span className="truncate max-w-32">
                                    {note.title}
                                  </span>
                                )}
                          </div>
                        </Tooltip>
                        {renameDocId === note.note_id && (
                      
                          <div className="top-full mt-1 w-40 z-50">
                          <Textarea
                            autoFocus
                            className={`w-full bg-white dark:bg-zinc-800 shadow-lg rounded-lg text-base p-2`}
                            size="sm"
                            variant="bordered"
                            value={newDocumentName}
                            minRows={2}
                            placeholder="Enter new name..."
                            onBlur={() => handleRename(note.note_id)}
                            onChange={(e) => setNewDocumentName(e.target.value)}
                            onClick={(e) => e.stopPropagation()}
                            onKeyDown={(e) => {
                              if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                handleRename(note.note_id);
                              }
                              if (e.key === "Escape") {
                                setRenameDocId("");
                              }
                            }}
                          />
                        </div>
                        ) }
                      </div>
                     {
                      renameDocId !== note.note_id && (
                        <Tooltip content="Thêm">
                          <EllipsisHorizontalIcon
                            className="transition-all w-4 h-4 opacity-0 group-hover:opacity-100"
                            onClick={(e) =>
                              {
                                e.stopPropagation();
                                handleClick(e, note.note_id, note.title)
                              }
                            }
                          />
                      </Tooltip>
                      )
                     }
                    </div>
                  );
                })}

                <div
                  className="ml-2 transition-all flex items-center space-x-2 text-xs  hover:text-white cursor-pointer p-2 rounded-lg dark:text-gray-400 text-gray-700 dark:hover:bg-zinc-800 hover:bg-zinc-200 "
                  onClick={handleCreateNewNote}
                >
                  <PlusIcon className="w-4 h-4" />
                  <span>{g('Add')}</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Có thể thêm các mục khác tương tự */}
      </div>
    

      

      

      <Dialog open={isUploadDocs} onOpenChange={() => setIsUploadDocs(false)}>
        <DialogContent>
          <div className="grid w-full max-w-sm items-center gap-1.5">
            <label htmlFor="picture">{p('UploadDocumentTitle')}</label>
            <Input id="picture" type="file" />
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default Sidebar;
