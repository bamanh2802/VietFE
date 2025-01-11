'use client'
import { useEffect, useState } from "react"; // React imports
import { useRouter } from "next/navigation";
import { Key } from "react"; // Key import

import {
  BriefcaseIcon,
  ChatBubbleLeftRightIcon,
  UserGroupIcon,
  DocumentTextIcon,
  ClockIcon,
  PencilSquareIcon,
  TrashIcon,
  ExclamationCircleIcon,
} from "@heroicons/react/24/outline";

// NextUI imports
import {
  Tabs,
  Tab,
  Card,
  Skeleton,
  Input,
  Button,
  CardBody,
  Divider,
  Image,
  Avatar,
  Listbox,
  ListboxItem,
} from "@nextui-org/react";

import {
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter } from "@nextui-org/react"

import { deleteProjectById, renameProjectById } from "@/service/apis"; 

import { useTranslations } from 'next-intl';
import { Project, Document, Conversation } from "@/src/types/types"; 

import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

import { Dialog, DialogContent, DialogTitle } from "@/components/ui/dialog";
import { ListboxWrapper } from "../ListboxWrapper";
import NewUserPrompt from "./NewUserPrompt";


interface HomeMainProps {
  projects: Project[];
  onProjectsUpdate: (projects: Project[]) => void;
  userName?: string;
  documents: Document[];
  conversations: Conversation[];
}
const HomeMain: React.FC<HomeMainProps> = ({
  documents,
  conversations,
  userName,
  projects: initialProjects,
  onProjectsUpdate,
}) => {
  const router = useRouter();
  const [selectedTab, setSelectedTab] = useState("recent");
  const [recentProjects, setRecentProject] = useState<Project[]>([]);
  const [isOpenRename, setIsOpenRename] = useState<boolean>(false);
  const [isOpenDelete, setIsOpenDelete] = useState<boolean>(false);
  const [isLoadingDelete, setIsLoadingDelete] = useState<boolean>(false);
  const [isLoadingRename, setIsLoadingRename] = useState<boolean>(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [projects, setProjects] = useState<Project[]>(initialProjects);
  const [contextMenu, setContextMenu] = useState<{
    show: boolean;
    x: number;
    y: number;
    projectId: string | null; // Cho phép projectId là string hoặc null
  }>({
    show: false,
    x: 0,
    y: 0,
    projectId: null,
  });
  const t = useTranslations('Home');
  const g = useTranslations('Global');

  const skeletonCards = [1, 2, 3, 4];
  const recentDocuments = [...(documents ?? [])]
  .sort(
    (a, b) =>
      new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
  )
  .slice(0, 4);



  // Lấy 4 conversation gần nhất
  const recentConversations = [...(conversations ?? [])]
    .sort(
      (a, b) =>
        new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
    )
    .slice(0, 4);

  const handleContextMenu = (event: React.MouseEvent, project: Project) => {
    event.preventDefault(); // Ngăn chặn menu mặc định của trình duyệt
    setContextMenu({
      show: true,
      x: event.pageX,
      y: event.pageY,
      projectId: project.project_id, 
    });
    setSelectedProject(project);
  };

  const handleRouterToConversation = (conv: Conversation) => {
    const url = `/project/${conv.project_id}/conversation/${conv.conversation_id}`;

    window.open(url, "_blank");
  };
  const handleRouterToDocument = (document: Document) => {
    const url = `/project/${document.project_id}/document/${document.document_id}`;

    window.open(url, "_blank");
  };

  function formatDate(dateString: string): string {
    const date = new Date(dateString);

    const formattedDate = new Intl.DateTimeFormat("vi-VN", {
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date);

    return formattedDate;
  }
  const getRecentProjects = (projects: Project[]): Project[] => {
    return projects
      .sort(
        (a, b) =>
          new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime(),
      )
      .slice(0, 3);
  };

  const formatTimeAgo = (dateString: string): string => {
    const date = new Date(dateString);
    const now = new Date();
    const seconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    let interval = Math.floor(seconds / 31536000); // số giây trong 1 năm

    if (interval >= 1) {
      return interval === 1 ? "1 year ago" : `${interval} years ago`;
    }

    interval = Math.floor(seconds / 2592000); // số giây trong 1 tháng
    if (interval >= 1) {
      return interval === 1 ? "1 month ago" : `${interval} months ago`;
    }

    interval = Math.floor(seconds / 86400); // số giây trong 1 ngày
    if (interval >= 1) {
      return interval === 1 ? "1 day ago" : `${interval} days ago`;
    }

    interval = Math.floor(seconds / 3600); // số giây trong 1 giờ
    if (interval >= 1) {
      return interval === 1 ? "1 hour ago" : `${interval} hours ago`;
    }

    interval = Math.floor(seconds / 60); // số giây trong 1 phút
    if (interval >= 1) {
      return interval === 1 ? "1 minute ago" : `${interval} minutes ago`;
    }

    return "just now";
  };

  const handleRouterToProject = (project: Project) => {
    router.push(`/project/${project.project_id}`);
  };

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      // Kiểm tra xem context menu có đang mở và click không nằm trong nó
      if (
        contextMenu.show &&
        !document.getElementById("context-menu")?.contains(event.target as Node)
      ) {
        handleCloseContextMenu(); // Đóng menu nếu nhấp ra ngoài
      }
    };
  
    // Thêm sự kiện lắng nghe click trên document
    document.addEventListener("mousedown", handleClickOutside);
  
    // Cleanup: loại bỏ sự kiện khi component bị hủy
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [contextMenu.show]);


  useEffect(() => {
    if (Array.isArray(initialProjects) && initialProjects.length > 0) {
      setProjects(initialProjects);
      const recentProjects = getRecentProjects([...initialProjects]); // Tạo bản sao mới của projects

      setRecentProject(recentProjects);
    } else {
      setProjects([]);
      setRecentProject([]);
    }
  }, [initialProjects]);

  const handleToggleRename = () => {
    setIsOpenRename(!isOpenRename);
    handleCloseContextMenu();
  };
  const handleToggleDelete = () => {
    setIsOpenDelete(!isOpenDelete);
    handleCloseContextMenu();
  };
  const handleSaveChanges = () => {
    console.log("Project updated:", selectedProject);
    handleRenameProject();
  };
  const handleCloseContextMenu = () => {
    setContextMenu({ show: false, x: 0, y: 0, projectId: null });
  };

  const handleDeleteProject = async () => {
    setIsLoadingDelete(true);
    try {
      const data = await deleteProjectById(
        selectedProject?.project_id as string,
      );

      console.log(data);
      setIsOpenDelete(!isOpenDelete);
      setIsLoadingDelete(false);
      handleDeleteProjectFE(selectedProject?.project_id as string);
    } catch (e) {
      setIsLoadingDelete(false);
      console.log(e);
    }
  };

  const handleRenameProject = async () => {
    setIsLoadingRename(true);
    try {
      const data = await renameProjectById(
        selectedProject?.project_id as string,
        selectedProject?.name as string,
      );

      console.log(data);
      handleRenameProjectFE(selectedProject as Project);
    } catch (e) {
      console.log(e);
    }
    setIsLoadingRename(false);
    setIsOpenRename(false);
  };
  const handleDeleteProjectFE = (project_id: string) => {
    const updatedProjects = projects.filter(
      (project) => project.project_id !== project_id,
    );

    setProjects(updatedProjects);
    onProjectsUpdate(updatedProjects);
  };

  const handleRenameProjectFE = (updatedProject: Project) => {
    const updatedProjects = projects.map((project) =>
      project.project_id === updatedProject.project_id
        ? updatedProject
        : project,
    );

    setProjects(updatedProjects);
    onProjectsUpdate(updatedProjects);
  };

  return (
    <div className="p-10 w-full flex flex-col items-center bg-zinc-200 dark:bg-zinc-800 h-[calc(100vh-56px)] overflow-auto">
      {!userName ? (
        <div className="max-w-[300px] min-h-[128px] w-full flex items-center gap-3 ">
          <div className="w-full flex flex-col gap-2">
            <Skeleton className="h-3 w-3/5 rounded-lg" />
            <Skeleton className="h-3 w-4/5 rounded-lg" />
          </div>
        </div>
      ) : (
        <div className="w-full flex justify-center py-5 ">
          <h2 className="text-2xl font-semibold mb-6">
            Welcome, {userName}.<br />
            How can I help you today?
          </h2>
        </div>
      )}

      {initialProjects !== undefined && initialProjects?.length === 0 ? (
        <>
          <div
            className={`animate-bounce text-center transition-opacity duration-1000 mt-60`}
          >
            <h2 className="text-3xl font-bold text-gray-800 mb-4">
              Viet – Trợ lý AI hỗ trợ quản lý và nghiên cứu tri thức hiệu quả
            </h2>
            <p className="text-lg text-gray-600">
              Khám phá sức mạnh của AI trong việc tổ chức, phân tích và ứng dụng
              kiến thức của bạn
            </p>
          </div>
          <NewUserPrompt />
        </>
      ) : (
        <div className="w-full max-w-4xl ">
          <Tabs
            aria-label="Projects Tabs"
            className=" "
            selectedKey={selectedTab}
            variant="underlined"
            onSelectionChange={(key: Key) => setSelectedTab(key as string)}
          >
            <Tab key="recent" title={t('Recent')}>
              <div className="mt-5">
                <h3 className="flex items-center text-lg  font-medium mb-3">
                  <ClockIcon className="opacity-75 mr-2 w-5 h-5" />
                  {t('RecentProject')}
                </h3>
                <div className="flex flex-wrap gap-6">
                  {initialProjects === undefined ? (
                    <>
                      <Card className="w-[268px] space-y-5 p-4" radius="lg">
                        <div className="space-y-3">
                          <Skeleton className="w-3/5 rounded-lg">
                            <div className="h-3 w-3/5 rounded-lg " />
                          </Skeleton>
                          <Skeleton className="w-4/5 rounded-lg">
                            <div className="h-3 w-4/5 rounded-lg " />
                          </Skeleton>
                          <Skeleton className="w-2/5 rounded-lg">
                            <div className="h-3 w-2/5 rounded-lg " />
                          </Skeleton>
                        </div>
                      </Card>

                      <Card className="w-[268px] space-y-5 p-4" radius="lg">
                        <div className="space-y-3">
                          <Skeleton className="w-3/5 rounded-lg">
                            <div className="h-3 w-3/5 rounded-lg " />
                          </Skeleton>
                          <Skeleton className="w-4/5 rounded-lg">
                            <div className="h-3 w-4/5 rounded-lg " />
                          </Skeleton>
                          <Skeleton className="w-2/5 rounded-lg">
                            <div className="h-3 w-2/5 rounded-lg bg-default-300" />
                          </Skeleton>
                        </div>
                      </Card>

                      <Card className="w-[268px] space-y-5 p-4" radius="lg">
                        <div className="space-y-3">
                          <Skeleton className="w-3/5 rounded-lg">
                            <div className="h-3 w-3/5 rounded-lg " />
                          </Skeleton>
                          <Skeleton className="w-4/5 rounded-lg">
                            <div className="h-3 w-4/5 rounded-lg " />
                          </Skeleton>
                          <Skeleton className="w-2/5 rounded-lg">
                            <div className="h-3 w-2/5 rounded-lg bg-default-300" />
                          </Skeleton>
                        </div>
                      </Card>
                    </>
                  ) : (
                    <>
                      {recentProjects.map((project: Project, index: number) => (
                        <div
                          key={index}
                          className="h-24 w-[268px] cursor-pointer hover:scale-[1.01] transition-all flex-shrink-0"
                          onClick={() => handleRouterToProject(project)}
                          onContextMenu={(e) => handleContextMenu(e, project)}
                        >
                          <Card className="h-full w-full p-3 space-y-0">
                            {" "}
                            {/* Đặt chiều cao và rộng cố định */}
                            <CardHeader className="flex space-y-0 p-0 flex-row items-center">
                              <BriefcaseIcon className="w-4 h-4 mx-2" />
                              <h4 className="truncate w-full block mt-0">
                                {project.name}
                              </h4>
                            </CardHeader>
                            <CardBody className="space-y-0 flex flex-col justify-between p-0">
                              {" "}
                              {/* Sử dụng flex để căn chỉnh nội dung */}
                              <p className="text-xs ml-2 py-1">
                                {project.doc_count} documents,{" "}
                                {project.conv_count} conversations
                              </p>
                              <div className="flex items-center text-xs text-gray-300">
                                <UserGroupIcon className="w-3 h-3 mx-1 ml-2" />
                                {formatTimeAgo(project.updated_at)}
                              </div>
                            </CardBody>
                          </Card>
                        </div>
                      ))}
                    </>
                  )}
                </div>
                <div className="mt-6">
                  {
                    (documents?.length !== 0 || documents === undefined) ? (
                    <h3 className="flex items-center text-lg  font-medium mb-3">
                      <ClockIcon className="opacity-75 mr-2 w-5 h-5" />
                      {t('RecentDocuments')}

                    </h3>
                    ) : (
                      <>
                      </>
                    )
                  }
                  <div className="flex flex-wrap gap-6">
                    {documents === undefined ? (
                      <>
                        {skeletonCards.map((_, index) => (
                          <Card key={index} className="min-w-[180px]">
                            <CardBody className="overflow-hidden p-0 h-[40px]">
                              <Skeleton className="h-full w-full object-cover rounded-t-xl" />
                            </CardBody>
                            <CardHeader className="pb-0 h-20 py-2 pt-2 px-2 flex-col justify-between items-start">
                              <div className="w-full h-8">
                                <Skeleton className="h-5 w-full rounded" />
                              </div>
                              <div className="flex justify-center mt-2">
                                <Skeleton className="w-4 h-4 rounded-full" />
                                <Skeleton className="h-3 w-24 ml-2 rounded" />
                              </div>
                            </CardHeader>
                          </Card>
                        ))}
                      </>
                    ) : (
                      <>
                        {recentDocuments?.map((doc, index) => {
                          let imageSrc = "/img/default.png";

                          if (doc.type === "pdf") {
                            imageSrc = "/img/pdf.jpg";
                          } else if (doc.type === "word") {
                            imageSrc = "/img/word.jpg";
                          } else if (doc.type === "pptx") {
                            imageSrc = "/img/pptx.jpg";
                          } else if (doc.type === "url") {
                            imageSrc = "/img/website.jpg";
                          }

                          return (
                            <Card
                              key={index}
                              className="hover:scale-[1.01] cursor-pointer max-w-[180px]"
                              isPressable={true}
                              onClick={() => {
                                handleRouterToDocument(doc);
                                console.log("haha");
                              }}
                            >
                              <CardBody className="overflow-hidden p-0 h-[40px]">
                                <Image
                                  isZoomed
                                  alt="Card background"
                                  className="object-cover rounded-t-xl"
                                  height={180}
                                  src={imageSrc} // Sử dụng ảnh tương ứng với loại tài liệu
                                  width={180}
                                />
                              </CardBody>
                              <CardHeader className="pb-0 h-20 py-2 pt-2 px-2 flex-col justify-between items-start">
                                <div className="w-full h-8 truncate">
                                  <h4 className="text-md">
                                    {doc.document_name}
                                  </h4>
                                </div>
                                <div className="flex justify-center">
                                  <p className="text-xs opacity-80 pl-2 text-center">
                                    {formatTimeAgo(doc.created_at)}
                                  </p>
                                </div>
                              </CardHeader>
                            </Card>
                          );
                        })}
                      </>
                    )}
                  </div>
                </div>

                <div className="mt-6">
                  {
                    (conversations?.length !== 0 || conversations === undefined)? (
                      <h3 className="flex items-center text-lg  font-medium mb-3">
                        <ClockIcon className="opacity-75 mr-2 w-5 h-5" />
                        {t('RecentConversations')}
                      </h3>
                    ) : (
                      <>
                      </>
                    )
                  }
                  <div className="flex flex-wrap gap-3">
                    {conversations === undefined ? (
                      <>
                        {skeletonCards.map((_, index) => (
                          <Card key={index} className="w-52">
                            <CardHeader className="flex flex-row p-3 gap-3 items-center">
                              <Skeleton className="h-10 w-10 rounded-full" />
                              <div className="flex flex-col gap-1">
                                <Skeleton className="h-4 w-[130px] rounded" />
                                <Skeleton className="h-3 w-20 rounded" />
                              </div>
                            </CardHeader>

                            <Divider />

                            <CardFooter className="p-3 flex flex-col items-start gap-2">
                              <div className="flex items-center gap-1">
                                <Skeleton className="h-3 w-3 rounded" />
                                <Skeleton className="h-3 w-12 rounded" />
                              </div>
                              <div className="flex items-center gap-1">
                                <Skeleton className="h-3 w-3 rounded" />
                                <Skeleton className="h-3 w-16 rounded" />
                              </div>
                            </CardFooter>
                          </Card>
                        ))}
                      </>
                    ) : (
                      <>
                        {recentConversations?.map((conv, index) => (
                          <Card
                            key={index}
                            className="hover:scale-[1.01] w-52 cursor-pointer"
                            isPressable={true}
                            onClick={() => handleRouterToConversation(conv)}
                          >
                            <CardHeader className="flex flex-row p-3 gap-3 items-center">
                              <Image
                                alt="nextui logo"
                                className="flex-shrink-0"
                                height={40}
                                src="/img/workspace-1.png"
                                width={40}
                              />
                              <div className="flex flex-col">
                                <CardTitle className="truncate max-w-[130px]">
                                  {conv.conversation_name}
                                </CardTitle>
                                <CardDescription>
                                  {formatTimeAgo(conv.created_at)}
                                </CardDescription>
                              </div>
                            </CardHeader>

                            <Divider />

                            <CardFooter className="p-3 flex flex-col items-start">
                              <div className="flex opacity-85 items-center">
                                <DocumentTextIcon className="w-3 h-3 mr-1" />
                                <p className="text-xs"> 5 Documents</p>
                              </div>
                              <div className="flex opacity-85 items-center">
                                <ChatBubbleLeftRightIcon className="w-3 h-3 mr-1" />
                                <p className="text-xs"> 12 Conversations</p>
                              </div>
                            </CardFooter>
                          </Card>
                        ))}
                      </>
                    )}
                  </div>
                </div>
              </div>
            </Tab>
            <Tab key="all-projects" title={t('AllProjects')}>
              <div className="mt-5">
                <h3 className="text-lg  font-medium mb-3">{t('AllProjects')}</h3>
                <div className="flex flex-wrap gap-6">
                  {projects === undefined ? (
                    <>
                      <Card className="w-[268px] space-y-5 p-4" radius="lg">
                        <div className="space-y-3">
                          <Skeleton className="w-3/5 rounded-lg">
                            <div className="h-3 w-3/5 rounded-lg " />
                          </Skeleton>
                          <Skeleton className="w-4/5 rounded-lg">
                            <div className="h-3 w-4/5 rounded-lgx" />
                          </Skeleton>
                          <Skeleton className="w-2/5 rounded-lg">
                            <div className="h-3 w-2/5 rounded-lg bg-default-300" />
                          </Skeleton>
                        </div>
                      </Card>
                      <Card className="w-[268px] space-y-5 p-4" radius="lg">
                        <div className="space-y-3">
                          <Skeleton className="w-3/5 rounded-lg">
                            <div className="h-3 w-3/5 rounded-lgx" />
                          </Skeleton>
                          <Skeleton className="w-4/5 rounded-lg">
                            <div className="h-3 w-4/5 rounded-lgx" />
                          </Skeleton>
                          <Skeleton className="w-2/5 rounded-lg">
                            <div className="h-3 w-2/5 rounded-lg " />
                          </Skeleton>
                        </div>
                      </Card>
                      <Card className="w-[268px] space-y-5 p-4" radius="lg">
                        <div className="space-y-3">
                          <Skeleton className="w-3/5 rounded-lg">
                            <div className="h-3 w-3/5 rounded-lgx" />
                          </Skeleton>
                          <Skeleton className="w-4/5 rounded-lg">
                            <div className="h-3 w-4/5 rounded-lgx" />
                          </Skeleton>
                          <Skeleton className="w-2/5 rounded-lg">
                            <div className="h-3 w-2/5 rounded-lg " />
                          </Skeleton>
                        </div>
                      </Card>
                    </>
                  ) : (
                    <>
                      {projects.map((project: Project, index: number) => (
                        <div
                          key={index}
                          className="h-24 w-[268px] cursor-pointer hover:scale-[1.01] transition-all flex-shrink-0"
                          onClick={() => handleRouterToProject(project)}
                          onContextMenu={(e) => handleContextMenu(e, project)}
                        >
                          <Card className="h-full w-full p-3 space-y-0">
                            {" "}
                            {/* Đặt chiều cao và rộng cố định */}
                            <CardHeader className="flex space-y-0 p-0 flex-row items-center">
                              <BriefcaseIcon className="w-4 h-4 mx-2" />
                              <h4 className="truncate w-full block mt-0">
                                {project.name}
                              </h4>
                            </CardHeader>
                            <CardBody className="space-y-0 flex flex-col justify-between p-0">
                              {" "}
                              {/* Sử dụng flex để căn chỉnh nội dung */}
                              <p className="text-xs ml-2 py-1">
                                {project.doc_count} documents,{" "}
                                {project.conv_count} conversations
                              </p>
                              <div className="flex items-center text-xs text-gray-300">
                                <UserGroupIcon className="w-3 h-3 mx-1 ml-2" />
                                {formatDate(project.updated_at)}
                              </div>
                            </CardBody>
                          </Card>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            </Tab>
          </Tabs>
        </div>
      )}

      <div
        className={`bg-zinc-100 dark:bg-zinc-800 transition-opacity z-50 ${contextMenu.show ? "visible opacity-100" : "invisible opacity-0"} context-menu absolute rounded-lg shadow-lg border-zinc-50 w-48`}
        style={{ top: contextMenu.y, left: contextMenu.x }}
      >
        <ListboxWrapper>
          <Listbox aria-label="Actions">
            <ListboxItem
              key="rename"
              textValue="Pop Up"
              onClick={() => handleToggleRename()}
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
              onClick={() => handleToggleDelete()}
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
        isOpen={isOpenRename} 
        onOpenChange={handleToggleRename}
        classNames={{
          base: "dark:bg-zinc-900 bg-zinc-50",
          header: "border-b border-gray-200 dark:border-gray-700",
          body: "py-6",
          footer: "border-t border-gray-200 dark:border-gray-700"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-lg font-semibold">{t('EditProject')}</h2>
                <p className="text-sm text-gray-500 dark:text-gray-400">{t('EditProjectDescription')}</p>
              </ModalHeader>
              <ModalBody>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSaveChanges();
                  }}
                >
                  <div className="flex flex-col gap-4">
                    <div className="flex flex-col gap-1.5">
                      <label htmlFor="projectName" className="text-sm font-medium">{g('Name')}</label>
                      <Input
                        required
                        id="projectName"
                        placeholder={g('CreateProjectPlaceholder')}
                        value={selectedProject?.name || ""}
                        onChange={(e) =>
                          setSelectedProject((prev) =>
                            prev ? { ...prev, name: e.target.value } : null
                          )
                        }
                      />
                    </div>
                  </div>
                </form>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="bordered" onPress={onClose}>
                  {g('Cancel')}
                </Button>
                <Button color="primary" isLoading={isLoadingRename} onPress={handleSaveChanges}>
                  {g('Save')}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>

      <Modal 
      backdrop="blur"
      isOpen={isOpenDelete} 
        onOpenChange={handleToggleDelete}
        classNames={{
          base: "dark:bg-zinc-900 bg-zinc-50",
          header: "border-b border-gray-200 dark:border-gray-700",
          body: "py-6",
          footer: "border-t border-gray-200 dark:border-gray-700"
        }}
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex items-center gap-2">
                <ExclamationCircleIcon className="w-6 h-6 text-danger" />
                <h2 className="text-lg font-semibold">{t('DeleteProjectTitle')} {selectedProject?.name}?</h2>
              </ModalHeader>
              <ModalBody>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                  {t('DeleteProjectDescription')}
                </p>
              </ModalBody>
              <ModalFooter>
                <Button color="default" variant="bordered" onPress={onClose}>
                  {g('Cancel')}
                </Button>
                <Button color="danger" isLoading={isLoadingDelete} onPress={handleDeleteProject}>
                  {g('Delete')}
                </Button>
              </ModalFooter>
            </>
          )}
        </ModalContent>
      </Modal>
    </div>
  );
};

export default HomeMain;
