'use client'
import React, { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useSelector, useDispatch } from "react-redux";

import SidebarHome from "@/components/global/SidebarHome";
import NavbarHome from "@/components/global/NavbarHome";
import HomeMain from "@/components/global/MainHome";
import { RootState } from "@/src/store/store";
import Head from 'next/head';
import {
  getAllProjectsWithInfo,
  getAllDocumentByUser,
  getAllConversationByUser,
} from "@/service/apis";
import { setProjects } from "@/src/store/projectsSlice";
import { setDocuments } from "@/src/store/documentSlice";
import { setConversations } from "@/src/store/conversationSlice";
import { Project, Document, Conversation } from "@/src/types/types";
import SearchComponent from "@/components/project/SearchComponent";

const Home = () => {
  const router = useRouter();
  const dispatch = useDispatch();
  const user = useSelector((state: RootState) => state.user);
  const projects = useSelector((state: RootState) => state.projects.projects);
  const documents = useSelector((state: RootState) => state.documents.documents)
  const conversations = useSelector((state: RootState) => state.conversations.conversations)
  const [isOpenSearch, setIsOpenSearch] = useState<boolean>(false);

  const handleToogleSearch = () => setIsOpenSearch(!isOpenSearch);

  useEffect(() => {
    // Gọi API để lấy danh sách dự án
    handleGetProjects();
    handleGetConversations();
    handleGetDocuments();
  }, []);

  const handleGetDocuments = async () => {
    try {
      const data = await getAllDocumentByUser();
      dispatch(setDocuments(data.data))
    } catch (e) {
      console.log(e);
    }
  };

  const handleGetConversations = async () => {
    try {
      const data = await getAllConversationByUser();
      dispatch(setConversations(data.data))
      console.log(data)
    } catch (e) {
      console.log(e);
    }
  };

  const handleGetProjects = async () => {
    try {
      const data = await getAllProjectsWithInfo();

      dispatch(setProjects(data.data));
    } catch (e) {
      console.log(e);
    }
  };

  const handleProjectsUpdate = (updatedProjects: Project[]) => {
    dispatch(setProjects(updatedProjects));
  };

  return (
    <div className="flex">
      <Head>
        <title>Viet Home</title>
      </Head>
      <SidebarHome
        conversations={conversations as Conversation[]}
        documents={documents as Document[]}
        openSearch={handleToogleSearch}
        projects={projects as Project[]}
      />
      <div className="flex flex-col w-full">
        <NavbarHome updatedProject={handleGetProjects} user={user} />
        <HomeMain
          conversations={conversations as Conversation[]}
          documents={documents as Document[]}
          projects={projects as Project[]}
          userName={`${user?.first_name ?? ""} ${user?.last_name ?? ""}`.trim()}
          onProjectsUpdate={handleProjectsUpdate}
        />
      </div>
      <SearchComponent
        conversations={conversations as Conversation[]}
        documents={documents as Document[]}
        isOpen={isOpenSearch}
        notes={[]}
        projects={projects as Project[]}
        onClose={handleToogleSearch}
      />
    </div>
  );
};

export default Home;
