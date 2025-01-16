import React from "react";
import {Divider} from "@nextui-org/divider";
import {Image} from "@nextui-org/image";
import {Card, CardHeader, CardBody, CardFooter} from "@nextui-org/card";
import {
  DocumentTextIcon,
  ChatBubbleLeftRightIcon,
  PlusIcon,
} from "@heroicons/react/24/outline";
import {Tooltip} from "@nextui-org/tooltip";
import {Skeleton} from "@nextui-org/skeleton";
import {Avatar} from "@nextui-org/avatar";

import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";
import { createNewNote } from "@/service/noteApi";
import { useToast } from "@/hooks/use-toast";

import { Document, ImageType, Conversation, Note } from "@/src/types/types";

interface WorkSpaceProps {
  documents: Document[];
  images: ImageType[];
  conversations: Conversation[];
  notes: Note[];
  projectId: string;
  openNewDocument: () => void;
  onOpenDialog: () => void;
  setSelectedNote: (note: string) => void;
  updatedNotes: () => void;
}
const WorkSpace: React.FC<WorkSpaceProps> = ({
  updatedNotes,
  setSelectedNote,
  onOpenDialog,
  openNewDocument,
  projectId,
  documents,
  images,
  conversations,
  notes,
}) => {
  const { toast } = useToast();
  const handleRouterWorkspace = (conversationId: string) => {
    const url = `/project/${projectId}/conversation/${conversationId}`;

    window.open(url, "_blank");
  };
  const handleRouterToDocument = (document: Document) => {
    const url = `/project/${document.project_id}/document/${document.document_id}`;

    window.open(url, "_blank");
  };

  const handleOpenWorkspace = (conv: Conversation) => {
    handleRouterWorkspace(conv.conversation_id);
  };

  function convertDate(dateString: string): string {
    const date = new Date(dateString);
    const now = new Date();
    const diffInMs = now.getTime() - date.getTime();
    const diffInSeconds = Math.floor(diffInMs / 1000);
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    const diffInHours = Math.floor(diffInMinutes / 60);
    const diffInDays = Math.floor(diffInHours / 24);
    const diffInWeeks = Math.floor(diffInDays / 7);

    // Nếu dưới 1 tuần
    if (diffInDays < 7) {
      return `${diffInDays}d ago`;
    }
    setSelectedNote;
    // Nếu dưới 1 tháng
    if (diffInWeeks < 4) {
      return `${diffInWeeks}w ago`;
    }

    // Nếu trên 1 tháng, format là "Ngày Tháng" (VD: 1 Feb, 23 May)
    const options: Intl.DateTimeFormatOptions = {
      day: "numeric",
      month: "short",
    };

    return date.toLocaleDateString("en-US", options);
  }

  const handleCreateNewNote = async () => {
    try {
      const data = await createNewNote(projectId);

      setSelectedNote(data.data.note_id);
      updatedNotes();
      toast({
        title: "New note created successfully",
        description: "Waiting for data loading",
      });
    } catch (e) {
      console.log(e);
    }
  };

  return (
    <div
      className="overflow-auto flex justify-center bg-zinc-100 dark:bg-zinc-800 w-full"
      style={{ height: "calc(100vh - 56px)" }}
    >
      <div className="w-full flex flex-col items-center px-12">
        {/* WorkSpace */}
        <div className="w-full flex-col max-w-4xl  mt-8">
          <span className="text-start opacity-85 py-4 block">Conversation</span>
          <div className="">
            {conversations === undefined ? (
              <>
                <div className="max-w-[300px] w-full flex items-center gap-3">
                  <div>
                    <Skeleton className="flex rounded-full w-12 h-12" />
                  </div>
                  <div className="w-full flex flex-col gap-2">
                    <Skeleton className="h-3 w-3/5 rounded-lg" />
                    <Skeleton className="h-3 w-4/5 rounded-lg" />
                  </div>
                </div>
              </>
            ) : (
              <>
                <Carousel>
                  <CarouselContent className="">
                    <CarouselItem
                      key="plus"
                      className="cursor-pointer basis-1/5 hover:scale-[1.01] transition-all"
                      onClick={onOpenDialog}
                    >
                      <Tooltip content="Add new Conversation">
                        <Card className="shadow-none bg-opacity-0 w-full h-[125px] flex justify-center items-center">
                          <PlusIcon className="w-h-16 h-16" />
                        </Card>
                      </Tooltip>
                    </CarouselItem>
                    {conversations.map((conv, index) => (
                      <CarouselItem
                        key={index}
                        className="basis-1/4 shadow-none"
                        onClick={() => handleOpenWorkspace(conv)}
                      >
                        <Card className="shadow-none hover:scale-[1.01] cursor-pointer">
                          <CardHeader className="flex gap-3 items-center">
                            <Image
                              alt="nextui logo"
                              className="flex-shrink-0"
                              height={40}
                              radius="sm"
                              src="https://icons.veryicon.com/png/o/education-technology/ballicons/workspace-1.png"
                              width={40}
                            />
                            <div className="flex flex-col">
                              <p className="text-md truncate max-w-[130px]">
                                {conv.conversation_name}
                              </p>
                              <p className="text-small text-default-500">
                                {convertDate(conv.created_at)}
                              </p>
                            </div>
                          </CardHeader>

                          <Divider />
                          <CardFooter className="flex flex-col items-start">
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
                      </CarouselItem>
                    ))}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </>
            )}
          </div>
        </div>

        <div className="w-full flex-col max-w-4xl mt-8">
          <span className="text-start opacity-85 py-4 block">Documents</span>
          <div className="">
            {documents === undefined ? (
              <div className=" w-full flex flex-col items-center gap-3">
                <Skeleton className="h-12 w-full rounded-lg" />
                <Skeleton className="h-12 w-full rounded-lg" />
              </div>
            ) : (
              <>
                <Carousel>
                  <CarouselContent>
                    <CarouselItem
                      key="plus"
                      className="cursor-pointer shadow-none basis-1/5 hover:scale-[1.01] transition-all"
                      onClick={openNewDocument}
                    >
                      <Tooltip content="Add new Document">
                        <Card className="shadow-none bg-opacity-0 w-[180px] h-[120px] flex justify-center items-center">
                          <PlusIcon className="w-h-16 h-16" />
                        </Card>
                      </Tooltip>
                    </CarouselItem>
                    {documents.map((doc, index) => {
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
                        <CarouselItem
                          key={index}
                          className="cursor-pointer shadow-none basis-1/5 hover:scale-[1.01] transition-all"
                          onClick={() => handleRouterToDocument(doc)}
                        >
                          <Card className="shadow-none max-w-[180px]">
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
                                <h4 className="text-md">{doc.document_name}</h4>
                              </div>
                              <div className="flex justify-center">
                                <p className="text-xs opacity-80 pl-2 text-center">
                                  {convertDate(doc.created_at)}
                                </p>
                              </div>
                            </CardHeader>
                          </Card>
                        </CarouselItem>
                      );
                    })}
                  </CarouselContent>
                  <CarouselPrevious />
                  <CarouselNext />
                </Carousel>
              </>
            )}
          </div>
        </div>

        {/* Notes */}
        <div className="w-full flex-col max-w-4xl mt-8">
          <span className="text-start opacity-85 py-4 block">Notes</span>
          <div className="">
            <Carousel>
              <CarouselContent>
                <CarouselItem
                  key="plus"
                  className="cursor-pointer shadow-none basis-1/5 hover:scale-[1.01] transition-all"
                  onClick={handleCreateNewNote}
                >
                  <Tooltip content="Add new Note">
                    <Card className="shadow-none bg-opacity-0 max-w-[180px] h-[113px] flex justify-center items-center">
                      <PlusIcon className="w-h-16 h-16" />
                    </Card>
                  </Tooltip>
                </CarouselItem>
                {notes &&
                  notes.map((note, index) => (
                    <CarouselItem
                      key={index}
                      className="cursor-pointer basis-1/5 hover:scale-[1.01] transition-all"
                      onClick={() => setSelectedNote(note.note_id)}
                    >
                      <div className="dark:bg-zinc-700 bg-zinc-200 rounded-lg flex-shrink-0">
                        <div className="flex items-center justify-center h-12 bg-zinc-100 dark:bg-zinc-800 rounded-t-lg relative opacity-80">
                          <i className="ri-booklet-line absolute left-4 top-8 text-3xl" />
                        </div>
                        <div className="mt-2 p-4">
                          <h2 className=" truncate">{note.title}</h2>
                          <div className="flex items-center mt-1">
                            <Avatar
                              className="w-4 h-4 text-tiny"
                              name="admin"
                            />
                            <span className="ml-2 text-xs">
                              {convertDate(note.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </CarouselItem>
                  ))}
              </CarouselContent>
              <CarouselPrevious />
              <CarouselNext />
            </Carousel>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkSpace;
