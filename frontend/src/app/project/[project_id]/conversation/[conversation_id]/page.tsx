"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Lấy project_id từ URL
import {Breadcrumbs, BreadcrumbItem} from "@nextui-org/breadcrumbs";

import { HomeIcon, UserGroupIcon, PlusIcon, XMarkIcon } from "@heroicons/react/24/outline";
import { UsersIcon } from "lucide-react";
import Image from "next/image";
import PreLoader from "@/public/img/PreLoader.gif";
import Head from 'next/head';
import { Button } from "@nextui-org/button";
import FileViewer from "@/components/global/PDFViewer";
import { useSelector, useDispatch } from 'react-redux'
import { RootState } from "@/src/store/store";
import { useTranslations } from 'next-intl';
import { Conversation, Project } from "@/src/types/types";
import { getConversationInProject, getProjectById } from "@/service/projectApi";
import { openDocumentViewer, closeDocumentViewer } from "@/src/store/uiSlice";
import UserDropdown from "@/components/global/UserDropdown";
import { motion, AnimatePresence } from "framer-motion";
import SidebarWorkspace from "@/components/project/conversation/SidebarWorkSpace";
import { getDocumentUrl } from "@/service/documentApi";
import { Document } from "@/src/types/types";
import ChatWindow from "@/components/project/conversation/ChatWindow";
import { DocumentSkeleton } from "@/components/project/document/DocumentSkeleton";
interface WorkSpaceProps {
    params: { project_id: string, conversation_id: string }
}

const WorkSpace: React.FC<WorkSpaceProps> = ({params}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loadingUrl, setLoadingUrl] = useState<boolean>(true)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [conversationName, setConversationName] = useState<string>("");
  const router = useRouter();
  const { project_id, conversation_id } = params
  const [conversationId, setConversationId] = useState<string>('')
  const [projectInfo, setProjectInfo] = useState<Project>();
  const p = useTranslations('Project');
  const g = useTranslations('Global');
  const dispatch = useDispatch()
  const [isButton, setIsButton] = useState<boolean>(false)
  const isDocumentViewerOpen = useSelector((state: RootState) => state.ui.isDocumentViewerOpen);
  const document = useSelector((state: RootState) => state.documentView.document);
  const [url, setUrl] = useState<string>('')

  const handleGetUrlDocument = async (document: Document) => {
    try {
      const data = await getDocumentUrl(document?.document_id)
      setUrl(data.data)
    } catch (e){
      console.log(e)
    }
    setLoadingUrl(false)
  }

  useEffect(()=> {
    if(isDocumentViewerOpen && document) {
      handleGetUrlDocument(document)
      setIsButton(true)
    }
    

  },[document, isDocumentViewerOpen])
  const toggleFileViewer = () => {
    if (isButton) {
      setIsButton(!isButton)
    }
    if (isDocumentViewerOpen) {
      dispatch(closeDocumentViewer());
    } else {
      dispatch(openDocumentViewer());
    }
  };

  useEffect(() => {
    if (project_id) {
      Promise.all([
        handleGetConversation(),
        handleGetProjectById()
      ])
        .then(() => setIsLoading(false))
        .catch(err => console.error(err));
    }
  }, [project_id]);


  useEffect(() => {
    if(conversation_id) {
      if (conversation_id !== conversationId) {
        setConversationId(conversation_id)
      }
    }

  }, [conversation_id])

  const handleGetConversation = async () => {
    try {
      const data = await getConversationInProject(project_id as string);

      setConversations(data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const handleRouterToProject = (project: Project) => {
    router.push(`/project/${project.project_id}`);
  };

  const handleGetProjectById = async () => {
    try {
      const data = await getProjectById(project_id as string);

      setProjectInfo(data.data);
    } catch (e) {
      console.log(e);
    }
  };
  const convertISOToDate = (isoString: string) => {
    return new Date(isoString).toLocaleDateString();
  };
  const handleBackHome = () => {
    router.push("/home");
  };


  const handleSelectConversation = (convId: string) => {
    window.history.pushState(
      {}, 
      '', 
      `/project/${project_id}/conversation/${convId}`
    );
    setConversationId(convId)
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black dark:invert-0 invert">
        <Image alt="Loading..." src={PreLoader} width={300} />
      </div>
    );
  }

  const updatedConversations = (convId: string, newName: string) => {
    setConversations(conversations.map(conv =>
      conv.conversation_id === convId ? { ...conv, conversation_name: newName} : conv
    ))
  }


  const updatedDeleteConversations = (convId: string) => {
    setConversations(prevConversations => {
      const updatedConversations = prevConversations.filter(conv => conv.conversation_id !== convId);
  
      if (conversationId === convId) {
        const firstConv = updatedConversations[0]; 
  
        if (firstConv) {
          handleSelectConversation(firstConv.conversation_id);
        } else {
          setConversationId("");
          router.push(`/project/${project_id}`);
        }
      }
  
      return updatedConversations;
    });
  };
  
  


  return (
    <div className="flex h-screen overflow-hidden">
      <Head>
        <title>{conversationName}</title>
      </Head>
      <SidebarWorkspace
      updatedDeleteConversations={updatedDeleteConversations}
      getConversation={handleGetConversation}
      consersationId={conversationId}
        conversations={conversations}
        updatedConversations={updatedConversations}
        onSelectConversation={handleSelectConversation}
        projectId={project_id}
        params={params}
        isOpen={!isDocumentViewerOpen}
      />
      
      <div className="flex flex-1 relative">
        <motion.div
          className="flex-1 flex flex-col relative"
          animate={{
            width: isDocumentViewerOpen ? "50%" : "100%"
          }}
          transition={{ duration: 0.3 }}
        >
          <div className="z-20 absolute top-0 w-full h-11 bg-zinc-100 dark:bg-zinc-800" />
          <div className="absolute top-4 left-5 z-40">
            <Breadcrumbs>
              <BreadcrumbItem onPress={handleBackHome}>
                <HomeIcon className="w-4 h-4" />
              </BreadcrumbItem>
              <BreadcrumbItem onPress={() => handleRouterToProject(projectInfo as Project)}>
                {projectInfo?.name}
              </BreadcrumbItem>
              <BreadcrumbItem>{conversationName}</BreadcrumbItem>
            </Breadcrumbs>
          </div>
          <div className="absolute flex items-center top-4 right-5 z-40">
            <Button 
              size="sm"
              variant="ghost"
              className="z-10 mr-4 border-none shadow-none bg-zinc-100 dark:bg-zinc-800"
            >
              <UsersIcon className="w-4 h-4 mr-2"/> Share
            </Button>
            <UserDropdown />
          </div>
          <ChatWindow
            conversation_id={conversationId}
            isDocument={false}
            project_id={project_id}
            content=""
            option=""
            documentId=""
          />
        </motion.div>

        <AnimatePresence>
          {isDocumentViewerOpen && (
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: "50%" }}
              exit={{ width: 0 }}
              transition={{ duration: 0.3 }}
              className="relative h-full bg-zinc-100 dark:bg-zinc-800 border-l-1 border-l-slate-400 flex flex-col justify-around items-center"
            >
             {document && (
              <h1 className="text-2xl w-full text-left py-4 pl-5">
                {document.document_name}
              </h1>
             )}
              
              {
                document && document.type === 'pdf' && !loadingUrl &&(
                  <FileViewer 
                      fileType={document.type} 
                      fileUrl={url}
                      isDocument={true}
                    />
                )
              }
              {
                document && document.type === 'docx' && !loadingUrl &&(
                  <FileViewer 
                      fileType={document.type} 
                      fileUrl={url}
                      isDocument={true}
                    />
                )
              }
              {
                  loadingUrl && (
                    <DocumentSkeleton />
                  )
                }
              
              {
                isButton && (
                  <Button
                    variant="light"
                    onPress={toggleFileViewer}
                    className="absolute top-4 right-4 z-50"
                    isIconOnly
                  >
                    <XMarkIcon className="w-5 h-5"/>
                  </Button>
                )
              }
              {document && (
              <h1 className="text-xl w-full text-right py-4 pr-5">
                Tải lên: {convertISOToDate(document.created_at)}
              </h1>
             )}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default WorkSpace;
