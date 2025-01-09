"use client";

import React, { useState, useRef, useEffect } from "react";
import { Tabs, Tab, Listbox, ListboxItem } from "@nextui-org/react";
import {
  TrashIcon,
  ChatBubbleBottomCenterIcon,
} from "@heroicons/react/24/outline";
import { useRouter } from "next/navigation";
import Image from "next/image";
import PreLoader from "@/public/img/PreLoader.gif";
import Head from 'next/head';

import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { ListboxWrapper } from "@/components/ListboxWrapper";
import { getDocumentById, getDocumentInProject, getProjectById } from "@/service/projectApi";
import { getConversationByDocument } from "@/service/documentApi";
import { getAllProjects } from "@/service/apis";
import { Document, Project, Conversation } from "@/src/types/types";
import { createNewConversation } from "@/service/projectApi";
import LoadingForSelect from "@/components/document/LoadingForSelect";
import { useToast } from "@/hooks/use-toast";

import ChatWindow from "@/components/project/conversation/ChatWindow";

import Analysis from "@/components/project/document/Analysis";
import TextInteraction from "@/components/project/document/TextInteraction";
import NavbarDocument from "@/components/project/document/NavbarDocument";
import SidebarDocument from "@/components/project/document/SidebarDocument";

interface DocumentPageProps {
    params: { project_id: string, document_id: string }
}

const DocumentPage: React.FC<DocumentPageProps> = ({params}) => {
  const router = useRouter();
  const { project_id, document_id } = params

  // State management with proper type annotations
  const { toast } = useToast();
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [conversation, setConversations] = useState<Conversation[]>([]);
  const [projectName, setProjectName] = useState<string>("Loading...");
  const [documentName, setDocumentName] = useState<string>("Loading...");
  const [isLoadingCreate, setIsLoadingCreate] = useState<boolean>(false);
  const [projectInfo, setProjectInfo] = useState<Project>()
  const [contentChat, setContentChat] = useState<string>('')
  const [optionChat, setOptionChat] = useState<string>('')
  const [contextMenu, setContextMenu] = useState<{
    visible: boolean;
    x: number;
    y: number;
    tabId: string | null;
  }>({
    visible: false,
    x: 0,
    y: 0,
    tabId: null,
  });
  const [selectedConversation, setSelectedConversation] = useState<string>("");

  const containerRef = useRef<HTMLDivElement>(null);
  const menuRef = useRef<HTMLDivElement>(null);

  // Handle click outside the context menu
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(event.target as Node)) {
        hideContextMenu();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleCreateNewConversation = async () => {
    setIsLoadingCreate(true);
    try {
      const data = await createNewConversation(
        "New Conversation",
        project_id as string,
        [`${document_id}`],
      );

      toast({
        description: "Create new conversation successfully!",
      });
      handleGetConversations();
      setSelectedConversation(data.data.conversation_id);
    } catch (e) {
      toast({
        description: "Create new conversation failed!",
      });
      console.log(e);
    }
    setIsLoadingCreate(false);
  };

  const handleGetConversations = async () => {
    try {
      const data = await getConversationByDocument(document_id as string);
      const sortedConversations = data.data.sort(
        (a: any, b: any) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      );

      const conversationExists = sortedConversations.some(
        (conv: Conversation) => conv.conversation_id === selectedConversation,
      );

      if (!conversationExists) {
        setSelectedConversation("");
      }

      setConversations(sortedConversations);
    } catch (e) {
      console.log(e);
    }
  };

  const getDocumentNameById = (documentId: string, documents: Document[]) => {
    const document = documents.find((doc) => doc.document_id === documentId);

    return document ? document.document_name : "Loading...";
  };

  const handleGetDocument = async () => {
    try {
      if (document_id) {
        const data = await getDocumentById(document_id);

        console.log(data);
      }
    } catch (e) {
      console.log(e);
    }
  };
  const handleGetProjectById = async () => {
    try {
      const data = await getProjectById(project_id as string);

      setProjectInfo(data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleGetAllDocument = async () => {
    try {
      if (project_id) {
        const data = await getDocumentInProject(project_id);

        setDocuments(data.data);
        setDocumentName(getDocumentNameById(document_id ?? "", data.data));
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (project_id && document_id) {
      Promise.all([
        handleGetDocument(),
        handleGetAllDocument(),
        handleGetConversations(),
        handleGetProjectById()
      ])
        .then(() => setIsLoading(false))
        .catch((err) => console.error(err))
    }
  }, [project_id, document_id]);

  // Hide context menu
  const hideContextMenu = () => {
    setContextMenu({ visible: false, x: 0, y: 0, tabId: null });
  };

  const handleSelectConversation = (conv: Conversation) => {
    setSelectedConversation(conv.conversation_id);
  };
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black dark:invert-0 invert">
        <Image alt="Loading..." height={300} src={PreLoader} width={300} />
      </div>
    );
  }

  const handleActionDocument = (option: string, selection: string) => {
      setContentChat(selection)
      setOptionChat(option)
  }

  return (
    <ResizablePanelGroup className="w-screen h-screen" direction="horizontal">
      <Head>
        <title>Document</title>
      </Head>
      <div ref={containerRef} className="flex h-full relative w-full">
        <SidebarDocument
          conversations={conversation}
          createNewConversation={handleCreateNewConversation}
          documentName={documentName}
          isLoadingCreate={isLoadingCreate}
          selectedConversation={selectedConversation}
          updatedConversations={handleGetConversations}
          onSelectConversation={handleSelectConversation}
          projectId={project_id as string}
        />
        <div className="flex flex-col w-full">
          <NavbarDocument
            documentName={documentName}
            projectName={projectInfo?.name as string}
            projectId={project_id as string}
          />
          <div
            className="flex"
            style={{ height: "calc(100% - 48px)", width: "100%" }}
          >
            <ResizablePanelGroup direction="horizontal">
              <ResizablePanel defaultSize={50} minSize={40}>
                <div className="flex-1 bg-zinc-100 dark:bg-zinc-800 h-full">
                  <Tabs
                    aria-label="Document Sections" // Đảm bảo Tabs có aria-label
                    className="w-full p-0"
                    variant="underlined"
                  >
                    <Tab
                      key="Conversations"
                      title="Conversations" // Thêm aria-label cho icon
                    >
                      <>
                        {selectedConversation === "" ? (
                          <LoadingForSelect />
                        ) : (
                          <ChatWindow
                            conversation_id={selectedConversation}
                            isDocument={true}
                            project_id={project_id as string}
                            content={contentChat}
                            option={optionChat}
                          />
                        )}
                      </>
                    </Tab>

                    {/* Analysis Tab */}
                    <Tab key="analysis" title="Analysis">
                      <div className="flex justify-center items-center h-full">
                        <Analysis documentName={documentName}/>
                      </div>
                    </Tab>
                  </Tabs>

                  {/* Context Menu for Chat Tabs */}
                  <div
                    ref={menuRef}
                    style={{
                      top: contextMenu.y,
                      left: contextMenu.x,
                      zIndex: 1000,
                      display: contextMenu.visible ? "block" : "none",
                    }}
                    className="absolute dark:bg-zinc-800 bg-zinc-200 rounded-lg shadow-md border"
                    // Thêm aria-label cho context menu
                  >
                    <ListboxWrapper>
                      <Listbox aria-label="Chat Actions">
                        <ListboxItem key="rename" textValue="Rename">
                          <div className="flex items-center">
                            <ChatBubbleBottomCenterIcon
                              aria-hidden="true"
                              className="h-4 w-4 pr-1"
                            />
                            <span>Rename</span>
                          </div>
                        </ListboxItem>
                        <ListboxItem
                          key="delete"
                          className="text-danger"
                          textValue="Delete"
                        >
                          <div className="flex items-center">
                            <TrashIcon
                              aria-hidden="true"
                              className="h-4 w-4 pr-1"
                            />
                            <span>Delete</span>
                          </div>
                        </ListboxItem>
                      </Listbox>
                    </ListboxWrapper>
                  </div>
                </div>
              </ResizablePanel>

              <ResizableHandle />

              <ResizablePanel minSize={20}>
                <div className="flex-1 h-full">
                  <TextInteraction 
                  handleActionDocument={handleActionDocument}
                  params={params}
                  />
                </div>
              </ResizablePanel>
            </ResizablePanelGroup>
          </div>
        </div>
      </div>
    </ResizablePanelGroup>
  );
};

export default DocumentPage;
