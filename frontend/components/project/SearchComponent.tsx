'use client'
import React, { useState, useEffect } from "react";
import {
  ChevronDoubleRightIcon,
  DocumentTextIcon,
  ChatBubbleLeftIcon,
  UserGroupIcon,
} from "@heroicons/react/24/outline";
import {Spinner} from "@nextui-org/spinner";
import { useRouter } from "next/navigation";
import { Listbox, ListboxItem, Modal, ModalContent, ModalHeader, ModalBody, Input, Kbd } from "@nextui-org/react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Document, Note, Conversation, Project, NoteSearch, DocumentSearch } from "@/src/types/types";
import { searchKeywordConversation, searchKeywordDocument, searchKeywordNote } from "@/service/apis";

interface SearchComponentProps {
  documents: Document[];
  conversations: Conversation[];
  projects: Project[];
  notes: Note[];
  isOpen: boolean;
  onClose: () => void;
}

const SearchComponent: React.FC<SearchComponentProps> = ({
  onClose,
  isOpen,
  documents = [],
  notes = [],
  conversations = [],
  projects = [],
}) => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [filteredDocuments, setFilteredDocuments] = useState<Document[]>([]);
  const [filteredNotes, setFilteredNotes] = useState<Note[]>([]);
  const [filteredProjects, setFilteredProjects] = useState<Project[]>([]);
  const [filteredConversations, setFilteredConversations] = useState<Conversation[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false)
  const [resultDocument, setResultDocument] = useState<DocumentSearch[]>([]) 
  const [resultConversation, setResultConversation] = useState([]) 
  const [resultNote, setResultNote] = useState<NoteSearch[]>([]) 
  const [visibleItems, setVisibleItems] = useState(5);
  const showMore = () => {
    setVisibleItems(prevVisible => prevVisible + 5);
  };
  const router = useRouter();

  useEffect(() => {
    const debounceTimeout = setTimeout(() => {
      if (searchTerm) {
        handleSearch();
      } else {
        setFilteredDocuments([]);
        setFilteredNotes([]);
        setFilteredProjects([]);
        setFilteredConversations([]);
      }
    }, 500); // Delay 500ms

    // Cleanup function để hủy gọi API cũ nếu searchTerm thay đổi trước khi timeout hết
    return () => clearTimeout(debounceTimeout);
  }, [searchTerm]);


  const handleRouterToConversation = (conv: Conversation) => {
    const url = `/project/${conv.project_id}/workspace/${conv.conversation_id}`;
    window.open(url, "_blank");
  };

  const handleRouterToDocument = (document: Document) => {
    const url = `/project/${document.project_id}/document/${document.document_id}`;
    window.open(url, "_blank");
  };

  const handleRouterToProject = (project: Project) => {
    router.push(`/project/${project.project_id}`);
  };

  const handleSearchKeyword = async (keyword: string) => {
    const documentIds = documents.map((document) => document.document_id);
    const projectIds = projects.map((project) => project.project_id);
    const conversationIds = conversations.map((conversation) => conversation.conversation_id);
  
    setIsLoading(true);
  
    try {
      const apiCalls = [];
  
      if (documentIds.length > 0) {
        apiCalls.push(searchKeywordDocument(documentIds, keyword));
      }
  
      if (projectIds.length > 0) {
        apiCalls.push(searchKeywordNote(projectIds, keyword));
      }
  
      if (conversationIds.length > 0) {
        apiCalls.push(searchKeywordConversation(conversationIds, keyword));
      }
  
      const [documentResults, noteResults, conversationResults] = await Promise.all(apiCalls);
  
      if (documentResults) {
        setResultDocument(documentResults.data)
      }
  
      if (conversationResults) {
        console.log("Conversation Results:", conversationResults);
      }
  
      if (noteResults) {
        setResultNote(noteResults.data)
        console.log(noteResults.data)
      }
  
      // Combined Results can be created if needed.
      // const combinedResults = {
      //   documents: documentResults?.data || [],
      //   conversations: conversationResults?.data || [],
      //   notes: noteResults?.data || [],
      // };
      // console.log("Combined Results:", combinedResults);
  
    } catch (error) {
      console.error("Error while searching:", error);
      throw error; // Ném lỗi ra ngoài nếu cần xử lý ở cấp cao hơn
    }
  
    setIsLoading(false);
  };
  
  

  const handleSearch = () => {
    handleSearchKeyword(searchTerm)
    // Filter documents
    const docs = documents.filter((doc) =>
      doc.document_name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    setFilteredDocuments(docs);

    // Filter notes
    const nts = notes.filter((note) => {
      const titleMatch = note.title
        .toLowerCase()
        .includes(searchTerm.toLowerCase());
      const contentMatch = note.content
        .toLowerCase()
        .includes(searchTerm.toLowerCase());

      return titleMatch || contentMatch;
    });

    setFilteredNotes(nts);

    // Filter projects
    const prj = projects.filter((project) =>
      project.name.toLowerCase().includes(searchTerm.toLowerCase()),
    );

    setFilteredProjects(prj);

    // Filter conversations
    const convs = conversations.filter((conversation) =>
      conversation.conversation_name
        .toLowerCase()
        .includes(searchTerm.toLowerCase()),
    );

    setFilteredConversations(convs);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalContent className="dark:bg-zinc-900 bg-slate-50">
        <ModalHeader className="sr-only">Search</ModalHeader>
        <ModalBody>
          <div className="relative">
            <Input
              className="w-[95%] placeholder-gray-400 mt-3"
              placeholder="Search in project"
              type="search"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              endContent={
                <Kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border font-mono">
                  ESC
                </Kbd>
              }
            />
          </div>
          <ScrollArea className="h-[300px] mt-4">
            {filteredDocuments.length > 0 ||
            filteredNotes.length > 0 ||
            filteredProjects.length > 0 ||
            filteredConversations.length > 0 ||
            resultNote.length > 0 ||
            resultDocument.length > 0
            
            ? (
              <div className="space-y-4">
                {/* Document section */}
                {filteredDocuments.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-gray-400">
                      Documents
                    </h3>
                    <Listbox aria-label="Actions" className="space-y-2">
                      {filteredDocuments.map((doc, index) => (
                        <ListboxItem
                          key={index}
                          textValue="item"
                          className="group flex items-center justify-between"
                          endContent={
                            <ChevronDoubleRightIcon className="h-4 w-4 dark:text-gray-400 text-gray-700 opacity-0 group-hover:opacity-95 transition-all" />
                          }
                          onClick={() => handleRouterToDocument(doc)}
                        >
                          <span className="flex items-center">
                            <DocumentTextIcon className="w-4 h-4 mr-2" />
                            {doc.document_name}
                          </span>
                        </ListboxItem>
                      ))}
                    </Listbox>
                  </div>
                )}
                {/* Notes section */}
                {filteredNotes.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-gray-400">
                      Notes
                    </h3>
                    <Listbox aria-label="Actions" className="space-y-2">
                      {filteredNotes.map((note, index) => (
                        <ListboxItem
                          textValue="item"
                          key={index}
                          className="group flex items-center justify-between"
                          endContent={
                            <ChevronDoubleRightIcon className="h-4 w-4 dark:text-gray-400 text-gray-700 opacity-0 group-hover:opacity-95 transition-all" />
                          }
                        >
                          <span className="flex items-center">
                            <DocumentTextIcon className="w-4 h-4 mr-2" />
                            {note.title}
                          </span>
                        </ListboxItem>
                      ))}
                    </Listbox>
                  </div>
                )}
                {/* Projects section */}
                {filteredProjects.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-gray-400">
                      Projects
                    </h3>
                    <Listbox aria-label="Actions" className="space-y-2">
                      {filteredProjects.map((project, index) => (
                        <ListboxItem
                          textValue="item"
                          key={index}
                          className="group flex items-center justify-between"
                          endContent={
                            <ChevronDoubleRightIcon className="h-4 w-4 dark:text-gray-400 text-gray-700 opacity-0 group-hover:opacity-95 transition-all" />
                          }
                          onClick={() => handleRouterToProject(project)}
                        >
                          <span className="flex items-center">
                            <UserGroupIcon className="w-4 h-4 mr-2" />
                            {project.name}
                          </span>
                        </ListboxItem>
                      ))}
                    </Listbox>
                  </div>
                )}
                {/* Conversations section */}
                {filteredConversations.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-gray-400">
                      Conversations
                    </h3>
                    <Listbox aria-label="Actions" className="space-y-2">
                      {filteredConversations.map((conversation, index) => (
                        <ListboxItem
                          textValue="item"
                          key={index}
                          className="group flex items-center justify-between"
                          endContent={
                            <ChevronDoubleRightIcon className="h-4 w-4 dark:text-gray-400 text-gray-700 opacity-0 group-hover:opacity-95 transition-all" />
                          }
                          onClick={() => handleRouterToConversation(conversation)}
                        >
                          <span className="flex items-center">
                            <ChatBubbleLeftIcon className="w-4 h-4 mr-2" />
                            {conversation.conversation_name}
                          </span>
                        </ListboxItem>
                      ))}
                    </Listbox>
                  </div>
                )}

                {resultNote.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-gray-400">
                      Note Content
                    </h3>
                    <Listbox aria-label="Actions" className="space-y-2">
                      {resultNote.map((note, index) => (
                        <ListboxItem
                          textValue="item"
                          key={index}
                          className="group flex items-center justify-between"
                          endContent={
                            <ChevronDoubleRightIcon className="h-4 w-4 dark:text-gray-400 text-gray-700 opacity-0 group-hover:opacity-95 transition-all" />
                          }
                        >
                          <span className="flex items-center">
                            <UserGroupIcon className="w-4 h-4 mr-2" />
                            {note?.note_title}
                          </span>
                          <span className="ml-5 truncate w-full">
                            {note.note_content}
                          </span>
                        </ListboxItem>
                      ))}
                    </Listbox>
                  </div>
                )}
                {resultDocument.length > 0 && (
                  <div>
                    <h3 className="mb-2 text-sm font-semibold text-gray-400">
                      Document Content
                    </h3>
                    <Listbox aria-label="Actions" className="space-y-2">
                      {resultDocument.slice(0, visibleItems).map((document, index) => (
                        <ListboxItem
                          textValue="item"
                          key={index}
                          className="group flex items-center justify-between"
                          endContent={
                            <ChevronDoubleRightIcon className="h-4 w-4 dark:text-gray-400 text-gray-700 opacity-0 group-hover:opacity-95 transition-all" />
                          }
                        >
                          <span className="flex items-center">
                            <UserGroupIcon className="w-4 h-4 mr-2" />
                            {document.document_name}
                          </span>
                          <span className="ml-5 truncate w-full">
                            {document.content}
                          </span>
                        </ListboxItem>
                      ))}
                    </Listbox>
                    {resultDocument.length > visibleItems && (
                      <div className="mt-4 text-center">
                        <button
                          onClick={showMore}
                          className="text-xs text-right w-full mr-4"
                        >
                          Xem thêm
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ) : (
              <>
                {isLoading ? (
                  <div className="w-full flex items-center justify-center">
                    <Spinner color="default" />
                  </div>
                ) : (
                  <ScrollArea>
                    <p className="text-center text-gray-400">No recent searches</p>
                  </ScrollArea>
                )}
              </>
            )}
          </ScrollArea>
        </ModalBody>
      </ModalContent>
    </Modal>
  );
};

export default SearchComponent;

