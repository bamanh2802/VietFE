'use client'
// Import từ thư viện bên ngoài
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useTranslations } from 'next-intl';

import {Skeleton} from "@nextui-org/skeleton";
import {Button} from "@nextui-org/button";

import {
  UserGroupIcon,
  ChatBubbleLeftIcon,
  ChevronDoubleRightIcon,
  ChevronDownIcon,
  MagnifyingGlassIcon,
  DocumentTextIcon,
  FolderIcon,
  LinkIcon
} from "@heroicons/react/24/outline";

import { Project, Document, Conversation } from "@/src/types/types";


interface SidebarHomeProps {
  projects: Project[];
  documents: Document[];
  conversations: Conversation[];
  openSearch: () => void;
}

const SidebarHome: React.FC<SidebarHomeProps> = ({
  openSearch,
  projects,
  documents,
  conversations,
}) => {
  const t = useTranslations('Home');
  const g = useTranslations('Global');
  const router = useRouter();
  const handleRouterToProject = (project: Project) => {
    router.push(`/project/${project.project_id}`);
  };
  const handleRouterToConversation = (conv: Conversation) => {
    const url = `/project/${conv.project_id}/workspace/${conv.conversation_id}`;

    window.open(url, "_blank");
  };
  const handleRouterToDocument = (document: Document) => {
    const url = `/project/${document.project_id}/document/${document.document_id}`;

    window.open(url, "_blank");
  };
  const [isOpenProjects, setIsOpenProjects] = useState(true);
  const [isOpenDocuments, setIsOpenDocuments] = useState(true);
  const [isOpenConversations, setIsOpenConversations] = useState(true);
  const toggleOpenProjects = () => {
    setIsOpenProjects(!isOpenProjects);
  };
  const toggleOpenDocuments = () => {
    setIsOpenDocuments(!isOpenDocuments);
  };
  const toggleOpenConversations = () => {
    setIsOpenConversations(!isOpenConversations);
  };

  const recentDocuments = [...(documents ?? [])]
  .sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  )
  .slice(0, 6);



  // Lấy 4 conversation gần nhất
  const recentConversations = [...(conversations ?? [])]
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    )
    .slice(0, 6);

  return (
    <div className="overflow-auto w-56 min-w-56 p-4 h-screen dark:bg-zinc-900 bg-zinc-50">
      <div>
        <h1 className="text-xl font-semibold mb-6 text-zinc-900 dark:text-gray-400">
          Viet
        </h1>
        <div className="mb-6">
          <h2 className="text-lg font-medium text-zinc-900 dark:text-gray-400">
            {t('QuickAccess')}
          </h2>
        </div>
        <div className="pb-8">
          <Button
            className="w-full mb-6"
            size="sm"
            startContent={<MagnifyingGlassIcon className="w-4 h-4" />}
            variant="flat"
            onClick={openSearch}
          >
            {g('Search')}
          </Button>
        </div>
        {/* Projects */}
        <div className="mb-6">
          <button
            className="w-full flex items-center justify-between text-sm font-semibold dark:text-gray-400 text-gray-700 transition-all rounded-lg px-2 p-1 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800"
            tabIndex={0} // Thêm để cho phép điều hướng bằng bàn phím
            onClick={toggleOpenProjects}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                toggleOpenProjects(); // Kích hoạt sự kiện khi nhấn Enter hoặc Space
              }
            }}
          >
            <span>{g('Projects')}</span>
            <ChevronDownIcon
              className={`w-4 h-4 transform transition-transform duration-300 ${isOpenProjects ? "rotate-180" : ""}`}
            />
          </button>

          <ul
            className={`mt-2 overflow-hidden transition-max-height duration-300 ease-in-out ${isOpenProjects ? "max-h-96" : "max-h-0"}`}
          >
            {projects === undefined ? (
              <div className="gap-2">
                <Skeleton className="h-3 w-full rounded-lg mt-1 " />
                <Skeleton className="h-3 w-full rounded-lg mt-1 " />
                <Skeleton className="h-3 w-full rounded-lg mt-1 " />
                <Skeleton className="h-3 w-full rounded-lg mt-1 " />
              </div>
            ) : (
              <>
                {projects.map((project: Project, index: number) => (
                  <button
                    key={index}
                    className="w-full group transition-all cursor-pointer px-2 p-1 rounded-lg flex items-center justify-between text-sm space-x-1 dark:text-gray-400 text-gray-700 dark:hover:bg-zinc-800 hover:bg-zinc-200 "
                    onClick={() => handleRouterToProject(project)}
                  >
                    <div className="flex text-start justify-start items-center  w-[90%]">
                      <FolderIcon className="h-4 w-4 dark:text-gray-400 text-gray-700" />
                      <span className="pl-1 truncate  w-[90%]">
                        {project.name}
                      </span>
                    </div>
                    <div>
                      <ChevronDoubleRightIcon className="h-4 w-4 dark:text-gray-400 text-gray-700 opacity-0 group-hover:opacity-95 transition-all" />
                    </div>
                  </button>
                ))}
              </>
            )}
          </ul>
        </div>

        <div className="mb-6">
          <button
            className="w-full flex items-center justify-between text-sm font-semibold dark:text-gray-400 text-gray-700 transition-all rounded-lg px-2 p-1 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800"
            onClick={toggleOpenDocuments}
            tabIndex={0} // Thêm để cho phép điều hướng bằng bàn phím
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                toggleOpenDocuments(); // Kích hoạt sự kiện khi nhấn Enter hoặc Space
              }
            }}
          >
            <span>{g('Documents')}</span>
            <ChevronDownIcon
              className={`w-4 h-4 transform transition-transform duration-300 ${isOpenDocuments ? "rotate-180" : ""}`}
            />
          </button>

          <ul
            className={`mt-2 overflow-hidden transition-max-height duration-300 ease-in-out ${isOpenDocuments ? "max-h-96" : "max-h-0"}`}
          >
            {documents === undefined ? (
              <div className="gap-2">
                <Skeleton className="h-3 w-full rounded-lg mt-1 " />
                <Skeleton className="h-3 w-full rounded-lg mt-1 " />
                <Skeleton className="h-3 w-full rounded-lg mt-1 " />
                <Skeleton className="h-3 w-full rounded-lg mt-1 " />
              </div>
            ) : (
              <>
                {recentDocuments.map((doc: Document, index: number) => (
                  <button
                    key={index}
                    className="w-full group transition-all cursor-pointer px-2 p-1 rounded-lg flex items-center justify-between text-sm space-x-1 dark:text-gray-400 text-gray-700 dark:hover:bg-zinc-800 hover:bg-zinc-200 "
                    onClick={() => handleRouterToDocument(doc)}
                  >
                    <div className="flex text-start justify-start items-center  w-[90%]">
                      {
                        doc.type === 'url' ? (
                          <LinkIcon className="h-4 w-4 dark:text-gray-400 text-gray-700" />
                        ) : (
                          <DocumentTextIcon className="h-4 w-4 dark:text-gray-400 text-gray-700" />
                        )
                      }
                      <span className="pl-1 truncate  w-[90%]">
                        {doc.document_name}
                      </span>
                    </div>
                    <div>
                      <ChevronDoubleRightIcon className="h-4 w-4 dark:text-gray-400 text-gray-700 opacity-0 group-hover:opacity-95 transition-all" />
                    </div>
                  </button>
                ))}
              </>
            )}
          </ul>
        </div>

        <div className="mb-6">
          <button
            className="w-full flex items-center justify-between text-sm font-semibold dark:text-gray-400 text-gray-700 transition-all rounded-lg px-2 p-1 cursor-pointer hover:bg-zinc-200 dark:hover:bg-zinc-800"
            onClick={toggleOpenConversations}
            tabIndex={0} // Thêm để cho phép điều hướng bằng bàn phím
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                toggleOpenConversations(); // Kích hoạt sự kiện khi nhấn Enter hoặc Space
              }
            }}
          >
            <span>{g('Conversations')}</span>
            <ChevronDownIcon
              className={`w-4 h-4 transform transition-transform duration-300 ${isOpenConversations ? "rotate-180" : ""}`}
            />
          </button>

          <ul
            className={`mt-2 overflow-hidden transition-max-height duration-300 ease-in-out ${isOpenConversations ? "max-h-96" : "max-h-0"}`}
          >
            {conversations === undefined ? (
              <div className="gap-2">
                <Skeleton className="h-3 w-full rounded-lg mt-1 " />
                <Skeleton className="h-3 w-full rounded-lg mt-1 " />
                <Skeleton className="h-3 w-full rounded-lg mt-1 " />
                <Skeleton className="h-3 w-full rounded-lg mt-1 " />
              </div>
            ) : (
              <>
                {recentConversations.map((conv: Conversation, index: number) => (
                  <button
                    key={index}
                    className="w-full group transition-all cursor-pointer px-2 p-1 rounded-lg flex items-center justify-between text-sm space-x-1 dark:text-gray-400 text-gray-700 dark:hover:bg-zinc-800 hover:bg-zinc-200 "
                    onClick={() => handleRouterToConversation(conv)}
                  >
                    <div className="flex text-start items-center justify-start  w-[90%]">
                      <ChatBubbleLeftIcon className="h-4 w-4 dark:text-gray-400 text-gray-700" />
                      <span className="pl-1 truncate  w-[90%]">
                        {conv.conversation_name}
                      </span>
                    </div>
                    <div>
                      <ChevronDoubleRightIcon className="h-4 w-4 dark:text-gray-400 text-gray-700 opacity-0 group-hover:opacity-95 transition-all" />
                    </div>
                  </button>
                ))}
              </>
            )}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SidebarHome;
