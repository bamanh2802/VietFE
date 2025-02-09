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
import { getNoteById, renameNote, editNote, deleteNote, createNewNote } from "@/service/noteApi";
import SearchComponent from "@/components/project/SearchComponent";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { ExclamationCircleIcon } from "@heroicons/react/24/outline"
import NewWorkspace from "@/components/project/workspace/NewWorkspace";
import ShareWorkspace from "@/components/project/workspace/ShareWorkspace";
import NewDocument from "@/components/project/workspace/NewDocument";
import RichTextEditor from "@/components/project/workspace/Note";
import {
  PlusIcon,
  ArrowTopRightOnSquareIcon,
  TrashIcon,
  PencilSquareIcon,
  ChatBubbleLeftIcon,
} from "@heroicons/react/24/outline";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button } from "@nextui-org/react"
import { ListboxWrapper } from "@/components/ListboxWrapper";
import { useToast } from "@/hooks/use-toast";
import { useTranslations } from 'next-intl';
import { renameConversation, deleteConversation } from "@/service/projectApi";
import { renameDocument, deleteDocument } from "@/service/documentApi";
interface ProjectPageProps {
    params: { project_id: string }; 
  }

const ProjectPage: React.FC<ProjectPageProps> = ({ params }) => {
    const { toast } = useToast();
  const [isDialogOpen, setIsDialogOpen] = useState<boolean>(false);
  const [isOpenShare, setIsOpenShare] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true); // State cho loading
  const router = useRouter();
  const { project_id } = params;
  const searchParams = useSearchParams();
  const noteIdParam = searchParams ? searchParams.get('noteIdParam') : null;
  const [isOpenSearch, setIsOpenSearch] = useState<boolean>(false);
  const projects = useSelector((state: RootState) => state.projects.projects);
  const [isDeleteDocument, setIsDeleteDocument] = useState<boolean>(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [images, setImages] = useState<ImageType[]>([]);
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [isOpenNewDocument, setIsOpenNewDocument] = useState<boolean>(false);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedNote, setSelectedNote] = useState<string>("");
  const [note, setNote] = useState<Note>();
  const [owner, setOwner] = useState<string>('')
  const [renameDocId, setRenameDocId] = useState("");
  const [contextMenu, setContextMenu] = useState({
      show: false,
      x: 0,
      y: 0,
      id: "",
    });
  const [selectedId, setSelectedId] = useState<string>("");
  const [selectedName, setSelectedName] = useState<string>("");
  const p = useTranslations('Project');
  const g = useTranslations('Global');
  const [loadingCreateNote, setLoadingCreateNote] = useState<boolean>(false)
  
  const openDialog = () => {
    setIsDialogOpen(true);
    handleCloseContext()
  }
  const openShare = () => setIsOpenShare(true);
  const closeDialog = () => setIsDialogOpen(false);
  const closeShare = () => setIsOpenShare(false);
  const closeNewDocument = () => setIsOpenNewDocument(false);
  const closeSearch = () => setIsOpenSearch(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);
  const openSearch = () => setIsOpenSearch(true);
  const handleOpenDeleteDocument = () => {
    setIsDeleteDocument(!isDeleteDocument);
    handleCloseContext()
  };
  const openNewDocument = () => {
    setIsOpenNewDocument(true);
  };

    const handleCreateNoteLoading = () => {
      setLoadingCreateNote(true)
    }

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

  const setRenameId = (renameId: string) => {
    setRenameDocId(renameId)
  }

  const handleRenameNote = async (noteId: string, newName: string) => {
    try {
      await renameNote(noteId, newName);
      handleGetNotes();
      handleGetNoteById(selectedNote);
    } catch (e) {
      console.log(e);
    }
  };
  const handleOpenRename = (docId: string) => {
    handleCloseContext()
    setRenameDocId(docId);
  };
  const handleEditNote = async (noteId: string, content: string, formatted_text: string) => {
    try {
      await editNote(noteId, content, formatted_text);
    } catch (e) {
      console.log(e);
    }
  };

  const handleGetNoteById = async (noteId: string) => {
    try {
      const data = await getNoteById(noteId);
      setOwner(data.data?.user)
      setNote(data.data.note);
    } catch (e) {
      console.log(e);
    }
  };

  const handleGetDocuments = async () => {
    try {
      const data = await getDocumentInProject(project_id as string); 

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
      console.log(data)
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

  const handleDelete = async (id: string) => {
    handleCloseContext();
    setIsLoadingDelete(true);
    
    try {
      if (!id) throw new Error("Invalid ID");
  
      let response;
  
      if (id.startsWith("doc-")) {
        response = await deleteDocument(id, project_id as string);
        updatedDeleteDocuments(id)
      } else if (id.startsWith("note-")) {
        response = await deleteNote(id);
        updatedDeleteNotes(id)
      } else if (id.startsWith("conv-")) {
        response = await deleteConversation(id);
        updatedDeleteConversations(id)
      } else {
        throw new Error("Invalid ID format");
      }
  
      if (response.status >= 400) {
        throw new Error(`Delete failed with status: ${response.status}`);
      }
  
      toast({
        title: "Delete successfully",
        description: "Waiting for data loading",
      });
    } catch (e: any) {
      console.error("Error during deletion:", e);
  
      let errorMessage = "Something went wrong!";
      if (e.response) {
        const { status, data } = e.response;
        errorMessage = `Error ${status}: ${data?.message || "Unknown error"}`;
      } else if (e.message) {
        errorMessage = e.message;
      }
  
      toast({
        variant: "destructive",
        title: "Delete failed!",
        description: errorMessage,
      });
    } finally {
      setIsLoadingDelete(false);
      handleOpenDeleteDocument();
    }
  };
  
  

  const handleCloseContext = () => {
    setContextMenu({ ...contextMenu, show: false });
  }

  const handleContextMenu = (e: React.MouseEvent, id: string, name: string) => {
      e.preventDefault();
      const menuWidth = 200; 
      const menuHeight = 200; 
      const { innerWidth, innerHeight } = window;
    
      let x = e.pageX;
      let y = e.pageY;
    
      if (x + menuWidth > innerWidth) {
        x = innerWidth - menuWidth - 10; 
      }
    
      if (y + menuHeight > innerHeight) {
        y = innerHeight - menuHeight - 10; 
      }
    
      setContextMenu({ show: true, x, y, id });
      setSelectedId(id);
      setSelectedName(name);
    };
  const handleClick = (e: React.MouseEvent, id: string, name: string) => {
    setSelectedId(id);
    setSelectedName(name);
    e.stopPropagation();
    e.preventDefault();
    if (contextMenu.show && contextMenu.id === id) {
      setContextMenu({ ...contextMenu, show: false }); 
    } else {
      setContextMenu({ show: true, x: e.pageX, y: e.pageY, id }); 
    }
  };
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement | null;

    if (target && !target.closest(".context-menu")) {
      setContextMenu({ ...contextMenu, show: false });
    }
  };
  
  useEffect(() => {
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, [contextMenu]);
  const handleCreateNewNote = async () => {
    setLoadingCreateNote(true);
    try {
      const data = await createNewNote(project_id as string);
  
      if (!data?.data?.note_id) {
        throw new Error("Invalid response from server");
      }
  
      handleSetSelectedNote(data.data.note_id);
      await handleGetNotes(); 
  
      toast({
        title: "Success",
        description: "New note created successfully.",
      });
    } catch (error) {
      console.error("Error creating new note:", error);
  
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to create note.",
        variant: "destructive", 
      });
    } finally {
      setLoadingCreateNote(false);
    }
  };


  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-black dark:invert-0 invert">
        <Image alt="Loading..." height={300} src={PreLoader} width={300} />
      </div>
    );
  }


  const updatedDocuments = (docId: string, newName: string) => {
    setDocuments(documents.map(doc =>
      doc.document_id === docId ? { ...doc, document_name: newName } : doc
    ))
  };
  
  const updatedConversations = (convId: string, newName: string) => {
    setConversations(conversations.map(conv =>
      conv.conversation_id === convId ? { ...conv, conversation_name: newName} : conv
    ))
  }

  const updatedNotes = (noteId: string, newName: string) => {
    setNotes(notes.map(note => 
      note.note_id === noteId ? { ...note, title : newName } : note
    ))
  }

  const updatedDeleteDocuments = (docId: string) => {
    setDocuments(prevDocuments => prevDocuments.filter(doc => doc.document_id !== docId));
  };

  const updatedDeleteConversations = (convId: string) => {
    setConversations(prevConversations => prevConversations.filter(conv => conv.conversation_id !== convId))
  }

  const updatedDeleteNotes = (noteId: string) => {
    setNotes(prevNotes => {
      const updatedNotes = prevNotes.filter(note => note.note_id !== noteId);
      
      if (updatedNotes.length > 0) {
        handleSetSelectedNote(updatedNotes[0].note_id);
      } else {
        router.push(`/project/${project_id}`);
        handleSetSelectedNote("")
      }
      
      return updatedNotes;
    });
  };
  


  const handleRouterDocument = (docId: string) => {
    handleCloseContext()
    const url = `/project/${project_id}/document/${docId}`;

    window.open(url, "_blank");
  };

  const handleRouterConversation = (conversationId: string) => {
    handleCloseContext()
    const url = `/project/${project_id}/conversation/${conversationId}`;

    window.open(url, "_blank");
  };
  

  return (
    <div className="flex box-border">
      <Head>
        <title>{getProjectNameById(project_id as string)}</title>
      </Head>
      <div>
        <Sidebar
          handleCreateNewNote={handleCreateNewNote}
          handleCloseContext={handleCloseContext}
          selectedId={selectedId}
          selectedName={selectedName}
          contextMenu={contextMenu}
          handleClickOutside={handleClickOutside}
          handleClick={handleClick}
          handleContextMenu={handleContextMenu}
          conversations={conversations}
          documents={documents}
          images={images}
          notes={notes}
          openNewDocument={openNewDocument}
          openSearch={openSearch}
          selectedNote={selectedNote}
          setLoading={() => setIsLoading(true)}
          setSelectedNote={handleSetSelectedNote}
          updatedConversations={updatedConversations}
          updatedDocuments={updatedDocuments}
          updatedNotes={updatedNotes}
          onOpenDialog={openDialog}
          params={params}
          renameDocId={renameDocId}
          setRenameDocId={setRenameId}
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
                owner={owner}
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
            loadingCreateNote={loadingCreateNote}
            handleCloseContext={handleCloseContext}
            handleContextMenu={handleContextMenu}
              conversations={conversations}
              documents={documents}
              images={images}
              notes={notes}
              openNewDocument={openNewDocument}
              projectId={project_id as string}
              setSelectedNote={handleSetSelectedNote}
              updatedNotes={handleGetNotes}
              onOpenDialog={openDialog}
              handleCreateNewNote={handleCreateNewNote}
            />
          )}
        </div>
        <NewWorkspace
        onSelectConversation={(convId: string) => {}}
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
      <div
        className={`dark:bg-zinc-800 bg-zinc-50 transition-opacity z-50 ${contextMenu.show && contextMenu.id.startsWith("doc-") ? "visible opacity-100" : "invisible opacity-0"} context-menu absolute rounded-lg shadow-lg w-48`}
        style={{ top: contextMenu.y, left: contextMenu.x }}
      >
        <ListboxWrapper>
          <Listbox aria-label="Actions">
            <ListboxItem
              key="new"
              textValue="New file"
              onPress={() => openNewDocument()}
            >
              <div className="flex items-center">
                <PlusIcon className="h-4 w-4 mr-2" />
                {p('AddDocument')}
              </div>
            </ListboxItem>
            <ListboxItem
              key="popup"
              textValue="Pop Up"
              onPress={() => handleRouterDocument(selectedId)}
            >
              <div className="flex items-center">
                <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-2" />
                {g('Detail')}
              </div>
            </ListboxItem>
            <ListboxItem
              key="rename"
              textValue="Pop Up"
              onPress={() => handleOpenRename(selectedId)}
            >
              <div className="flex items-center">
                <PencilSquareIcon className="h-4 w-4 mr-2" />
                {g('Rename')}
              </div>
            </ListboxItem>
            <ListboxItem
              key="delete"
              className="text-danger"
              color="danger"
              textValue="Pop Up"
              role="button"
              onPress={() => handleOpenDeleteDocument()}
            >
              <div className="flex items-center">
                <TrashIcon className="h-4 w-4 mr-2" />
                {g('Delete')}
              </div>
            </ListboxItem>
          </Listbox>
        </ListboxWrapper>
      </div>
      <div
        className={`dark:bg-zinc-800 bg-zinc-50 transition-opacity z-50 ${contextMenu.show && contextMenu.id.startsWith("conv-") ? "visible opacity-100" : "invisible opacity-0"} context-menu absolute rounded-lg shadow-lg w-52`}
        style={{ top: contextMenu.y, left: contextMenu.x }}
      >
        <ListboxWrapper>
          <Listbox aria-label="Actions">
            <ListboxItem key="create" textValue="Pop Up" 
            onPress={openDialog}
            >
              <div className="flex items-center">
                <ChatBubbleLeftIcon className="h-4 w-4 mr-2" />
                {p('AddConversation')}
              </div>
            </ListboxItem>
            <ListboxItem key="popup" textValue="Pop Up">
              <div
                className="flex items-center"
                onClick={() => handleRouterConversation(selectedId)}
              >
                <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-2" />
                {g('Detail')}
              </div>
            </ListboxItem>
            <ListboxItem
              key="rename"
              textValue="Pop Up"
              onPress={() => handleOpenRename(selectedId)}
            >
              <div className="flex items-center">
                <PencilSquareIcon className="h-4 w-4 mr-2" />
                {g('Rename')}
              </div>
            </ListboxItem>
            <ListboxItem
              key="delete"
              className="text-danger"
              color="danger"
              textValue="Pop Up"
              onPress={() => handleOpenDeleteDocument()}
            >
              <div className="flex items-center">
                <TrashIcon className="h-4 w-4 mr-2" />
                {g('Delete')}
              </div>
            </ListboxItem>
          </Listbox>
        </ListboxWrapper>
      </div>
      <div
        className={`dark:bg-zinc-800 bg-zinc-50 transition-opacity z-50 ${contextMenu.show && contextMenu.id.startsWith("note-") ? "visible opacity-100" : "invisible opacity-0"} context-menu absolute rounded-lg shadow-lg w-48`}
        style={{ top: contextMenu.y, left: contextMenu.x }}
      >
        <ListboxWrapper>
          <Listbox aria-label="Actions">
            <ListboxItem
              key="create"
              textValue="Pop Up"
              onPress={() => {
                setContextMenu({ ...contextMenu, show: false });
                handleCreateNewNote()
              }}
            >
              <div className="flex items-center">
                <ChatBubbleLeftIcon className="h-4 w-4 mr-2" />
                {p('AddNote')}
              </div>
            </ListboxItem>
            <ListboxItem
              key="popup"
              textValue="Pop Up"
              onPress={() => {
                setContextMenu({ ...contextMenu, show: false });
                handleSetSelectedNote(selectedId);
              }}
            >
              <div className="flex items-center">
                <ArrowTopRightOnSquareIcon className="h-4 w-4 mr-2" />
                {g('Detail')}
              </div>
            </ListboxItem>
            <ListboxItem
              key="rename"
              textValue="Pop Up"
              onPress={() => handleOpenRename(selectedId)}
            >
              <div className="flex items-center">
                <PencilSquareIcon className="h-4 w-4 mr-2" />
                {g('Rename')}
              </div>
            </ListboxItem>
            <ListboxItem
              key="delete"
              className="text-danger"
              color="danger"
              textValue="Pop Up"
              onPress={() => handleOpenDeleteDocument()}
            >
              <div className="flex items-center">
                <TrashIcon className="h-4 w-4 mr-2" />
                {g('Delete')}
              </div>
            </ListboxItem>
          </Listbox>
        </ListboxWrapper>
      </div>


      <Modal
      isOpen={isDeleteDocument}
      onClose={() => handleOpenDeleteDocument()}
      placement="center"
      classNames={{
        base: "dark:bg-zinc-800 border-none",
        header: "border-b-[1px] border-[#27272a]",
        footer: "border-t-[1px] border-[#27272a]",
      }}
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">
              <div className="flex items-center">
                <ExclamationCircleIcon className="w-6 h-6 mr-2" />
                {p("DeleteTitle")}
              </div>
            </ModalHeader>
            <ModalBody>
              <p>
                {p("DeleteDescription1")} <span className="font-bold w-full wrap">{selectedName} </span>
                {p("DeleteDescription2")}
              </p>
            </ModalBody>
            <ModalFooter>
              <Button  onPress={() => handleOpenDeleteDocument()}>
                Cancel
              </Button>
              <Button color="danger" isLoading={isLoadingDelete} onPress={() => handleDelete(selectedId)}>
                {g("Delete")}
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
    </div>
  );
};

export default ProjectPage;
