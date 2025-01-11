"use client";

import { FC, useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image";
import Head from 'next/head';
import { useSelector, useDispatch } from "react-redux";
import { RootState } from "@/src/store/store";

import Sidebar from "@/components/project/Sidebar";
import NavbarProject from "@/components/project/NavbarProject";
import WorkSpace from "@/components/project/WorkSpace";
import {
  getDocumentInProject,
  getConversationInProject,
  getNotesInProject,
} from "@/service/projectApi";
import { Document, ImageType, Conversation, Note, Project } from "@/src/types/types";
import PreLoader from "@/public/img/PreLoader.gif";
import { getNoteById, renameNote, editNote } from "@/service/noteApi";
import SearchComponent from "@/components/project/SearchComponent";

import NewWorkspace from "@/components/project/workspace/NewWorkspace";
import ShareWorkspace from "@/components/project/workspace/ShareWorkspace";
import NewDocument from "@/components/project/workspace/NewDocument";
import RichTextEditor from "@/components/project/workspace/Note";


interface ProjectPageProps {
    params: { project_id: string }; 
  }

const ProjectPage: React.FC<ProjectPageProps> = ({ params }) => {
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isOpenShare, setIsOpenShare] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // State cho loading
  const router = useRouter();
  const { project_id } = params;
  const searchParams = useSearchParams();
  const noteIdParam = searchParams ? searchParams.get('noteIdParam') : null;
  const [isOpenSearch, setIsOpenSearch] = useState<boolean>(false);
  const projects = useSelector((state: RootState) => state.projects.projects);

  const [documents, setDocuments] = useState<Document[]>([]);
  const [images, setImages] = useState<ImageType[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isOpenNewDocument, setIsOpenNewDocument] = useState<boolean>(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<string>("");
  const [note, setNote] = useState<Note>();

  const openDialog = () => setIsDialogOpen(true);
  const openShare = () => setIsOpenShare(true);
  const closeDialog = () => setIsDialogOpen(false);
  const closeShare = () => setIsOpenShare(false);
  const closeNewDocument = () => setIsOpenNewDocument(false);
  const closeSearch = () => setIsOpenSearch(false);
  const openSearch = () => setIsOpenSearch(true);
  const openNewDocument = () => {
    setIsOpenNewDocument(true);
  };


  useEffect(() => {
    if(noteIdParam !== undefined && noteIdParam !== selectedNote && noteIdParam !== null) {
      setSelectedNote(noteIdParam as string)
      handleGetNoteById(noteIdParam as string)
    }
  }, [noteIdParam])
  const handleSetSelectedNote = (noteId: string) => {
    setSelectedNote(noteId);
    router.push(`/project/${project_id}?noteIdParam=${noteId}`, undefined,);
    if (noteId !== "") {
      handleGetNoteById(noteId);
    }
  };

  const handleRenameNote = async (noteId: string, newName: string) => {
    try {
      const data = await renameNote(noteId, newName);

      console.log(data);
      handleGetNotes();
      handleGetNoteById(selectedNote);
    } catch (e) {
      console.log(e);
    }
  };
  const handleEditNote = async (noteId: string, content: string, formatted_text: string) => {
    try {
      const data = await editNote(noteId, content, formatted_text);
    } catch (e) {
      console.log(e);
    }
  };

  const handleGetNoteById = async (noteId: string) => {
    try {
      const data = await getNoteById(noteId);
      console.log(data)
      setNote(data.data.note);
    } catch (e) {
      console.log(e);
    }
  };

  const handleGetDocuments = async () => {
    try {
      const data = await getDocumentInProject(project_id as string); // Sử dụng `as string` cho `project_id`

      setDocuments(data.data);
      if (data.data.length === 0) {
        openNewDocument();
      }
    } catch (e) {
      console.log(e);
    }
  };

  const handleGetNotes = async () => {
    try {
      const data = await getNotesInProject(project_id as string);

      setNotes(data.data);
    } catch (e) {
      console.log(e);
    }
  };

  const ignoreNote = () => {
    setNote(undefined);
  };

  const handleGetConversations = async () => {
    try {
      const data = await getConversationInProject(project_id as string);

      setConversations(data.data);
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    if (project_id !== undefined) {
      Promise.all([
        handleGetDocuments(),
        handleGetConversations(),
        handleGetNotes(),
      ])
        .then(() => setIsLoading(false)) // Tắt loading khi dữ liệu đã tải xong
        .catch((err) => console.error(err));
    }
  }, [project_id]);
  const getProjectNameById = (projectId: string | null) => {
    const project = projects?.find((proj) => proj.project_id === projectId);

    return project ? project.name : "Loading...";
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black dark:invert-0 invert">
        <Image alt="Loading..." height={300} src={PreLoader} width={300} />
      </div>
    );
  }


  return (
    <div className="flex box-border">
      <Head>
        <title>{getProjectNameById(project_id as string)}</title>
      </Head>
      <div>
        <Sidebar
          conversations={conversations}
          documents={documents}
          images={images}
          notes={notes}
          openNewDocument={openNewDocument}
          openSearch={openSearch}
          selectedNote={selectedNote}
          setLoading={() => setIsLoading(true)}
          setSelectedNote={handleSetSelectedNote}
          updatedConversations={handleGetConversations}
          updatedDocuments={handleGetDocuments}
          updatedNotes={handleGetNotes}
          onOpenDialog={openDialog} //new conversation
          params={params}
        />
      </div>
      <div className="flex flex-col w-full">
        <NavbarProject
          ignoreNote={ignoreNote}
          note={note as Note}
          setSelectedNote={handleSetSelectedNote}
          onOpenDialog={openDialog}
          onOpenShare={openShare}
          params={params}
        />
        <div>
          {!!selectedNote ? (
            <div className="w-full h-[calc(100vh-56px)] bg-[#ffffff] dark:bg-[#1f1f1f]">
              <RichTextEditor
                editNote={handleEditNote}
                note={note as Note}
                renameNote={handleRenameNote}
                selectedNote={selectedNote}
                editable={true}
                type="project"
              />
            </div>
          ) : (
            <WorkSpace
              conversations={conversations}
              documents={documents}
              images={images}
              notes={notes}
              openNewDocument={openNewDocument}
              projectId={project_id as string}
              setSelectedNote={handleSetSelectedNote}
              updatedNotes={handleGetNotes}
              onOpenDialog={openDialog}
            />
          )}
        </div>
        <NewWorkspace
          documents={documents}
          from="project"
          isOpen={isDialogOpen}
          projectId={project_id as string}
          updateConversation={handleGetConversations}
          onClose={closeDialog}
        />
        <ShareWorkspace isOpen={isOpenShare} onClose={closeShare} id="user" type="project"/>
        <NewDocument
          documents={documents}
          isOpen={isOpenNewDocument}
          projectId={project_id as string}
          updateDocument={handleGetDocuments}
          onClose={closeNewDocument}
        />
      </div>
      <SearchComponent
        conversations={conversations}
        documents={documents}
        isOpen={isOpenSearch}
        notes={notes}
        projects={projects as Project[]}
        onClose={closeSearch}
      />
    </div>
  );
};

export default ProjectPage;
