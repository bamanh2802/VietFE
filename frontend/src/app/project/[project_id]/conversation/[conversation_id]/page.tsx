"use client";

import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation"; // Lấy project_id từ URL
import { Breadcrumbs, BreadcrumbItem } from "@nextui-org/react";
import { HomeIcon, UserGroupIcon, PlusIcon } from "@heroicons/react/24/outline";
import { UsersIcon } from "lucide-react";
import Image from "next/image";
import PreLoader from "@/public/img/PreLoader.gif";
import Head from 'next/head';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Button } from "@nextui-org/react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"

import { useTranslations } from 'next-intl';
import { Conversation, Project } from "@/src/types/types";
import { getConversationInProject, getProjectById } from "@/service/projectApi";
import UserDropdown from "@/components/global/UserDropdown";

import SidebarWorkspace from "@/components/project/conversation/SidebarWorkSpace";
import ChatWindow from "@/components/project/conversation/ChatWindow";

interface WorkSpaceProps {
    params: { project_id: string, conversation_id: string }
}

const WorkSpace: React.FC<WorkSpaceProps> = ({params}) => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [currentConversation, setCurrentConversation] = useState<string | null>(
    null,
  );
  const [name, setName] = useState("")
  const [key, setKey] = useState("")
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [isOpenAPI, setIsOpenAPI] = useState<boolean>(false)
  const [conversationName, setConversationName] = useState<string>("");
  const router = useRouter();
  const { project_id, conversation_id } = params
  const [projectInfo, setProjectInfo] = useState<Project>();
  const p = useTranslations('Project');
  const g = useTranslations('Global');
  const handleToggleAPI = () => {
    setIsOpenAPI(!isOpenAPI)
  }
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setName("")
    setKey("")
  }
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

  const handleBackHome = () => {
    router.push("/home");
  };

  useEffect(() => {
    if (project_id !== undefined) {
      Promise.all([
        handleGetConversation(),
        handleGetProjectById()
      ])
        .then(() => setIsLoading(false))
        .catch((err) => console.error(err))
    }
  }, [project_id]);

  const handleSelectConversation = (conv: Conversation) => {
    router.push(`/project/${project_id}/conversation/${conv.conversation_id}`);
    setConversationName(conv.conversation_name);
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black dark:invert-0 invert">
        <Image alt="Loading..." height={300} src={PreLoader} width={300} />
      </div>
    );
  }

  return (
    <div className="flex h-screen">
      <Head>
        <title>{conversationName}</title>
      </Head>
      <SidebarWorkspace
        conversations={conversations}
        updatedConversations={handleGetConversation}
        onSelectConversation={handleSelectConversation}
        projectId={project_id as string}
        params={params}
      />
      <div className="flex-1 flex flex-col relative">
        <div className="z-[20] absolute top-0 w-full h-11 bg-zinc-100 dark:bg-zinc-800" />
            <div className="absolute top-4 left-5 z-40">
              <Breadcrumbs>
                <BreadcrumbItem onClick={handleBackHome}>
                  <HomeIcon className="w-4 h-4" />
                </BreadcrumbItem>
                <BreadcrumbItem
                  onClick={() => handleRouterToProject(projectInfo as Project)}
                >
                  {projectInfo?.name}
                </BreadcrumbItem>
                <BreadcrumbItem>{conversationName}</BreadcrumbItem>
              </Breadcrumbs>
            </div>
            <div className="absolute flex items-center top-4 right-5 z-40">
              <Button 
              size="sm"
              variant="ghost"
              className="z-10 mr-4 border-none shadow-none bg-zinc-100 dark:bg-zinc-800">
                <UsersIcon className="w-4 h-4 mr-2"/> Share
              </Button>
              <UserDropdown />
            </div>
        <ChatWindow
          conversation_id={conversation_id as string}
          isDocument={false}
          project_id={project_id as string}
          content=''
          option=''
          documentId=""
        />
      </div>
      <Dialog open={isOpenAPI} onOpenChange={handleToggleAPI}>
      <DialogContent className="sm:max-w-[425px] border-none shadow-none bg-zinc-100 dark:bg-zinc-900">
        <DialogHeader>
          <DialogTitle>Add API Key</DialogTitle>
          <DialogDescription>
            Add your API key for Viet
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right">
              Name
            </Label>
            <Input
              id="name"
              className="col-span-3"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="username" className="text-right">
              API Key
            </Label>
            <Input
              id="username"
              className="col-span-3"
            />
          </div>
        </div>
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
    </div>
  );
};

export default WorkSpace;
