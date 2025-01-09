
'use client'
import React, {
  FC,
  useLayoutEffect,
  useEffect,
  useState,
  useRef,
  FormEvent,
  KeyboardEvent,
  MouseEvent,
} from "react";
import {
  Button,
  Textarea,
  Listbox,
  ListboxItem,
  Tooltip,
  Image,
  Skeleton
} from "@nextui-org/react";
import { ArrowRightIcon } from "@heroicons/react/24/outline";
import {
  ClipboardIcon,
  HeartIcon,
  HandThumbDownIcon,
  PencilSquareIcon,
  Square2StackIcon,
  QuestionMarkCircleIcon,
  ClipboardDocumentCheckIcon,
  FolderIcon,
  EllipsisHorizontalIcon,
  XMarkIcon,
  PaperClipIcon,
  LanguageIcon,
  ChevronLeftIcon,
  ChevronRightIcon
} from "@heroicons/react/24/outline";
import { TranslationPopup } from "@/components/global/Translate";
import { Card, CardBody, CardHeader } from "@nextui-org/react";


import { useRouter } from "next/navigation";
import { useDispatch, useSelector } from "react-redux";
import { v4 as uuidv4 } from "uuid";
import { RiRobot2Line } from "react-icons/ri";
import dynamic from "next/dynamic";

import { ListboxWrapper } from "@/components/ListboxWrapper";
import {
  addUserMessage,
  addServerMessage,
  updateServerMessage,
  finalizeServerMessage,
  addChatHistory
} from "@/src/store/chatSlice";
import { RootState } from "@/src/store/store";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import { useToast } from "@/hooks/use-toast";
import { getDocumentsByConversation } from "@/service/documentApi";
import { Chunk, Document, Message, MessageHistory } from "@/src/types/types";
import { createNewNote } from "@/service/noteApi";
import DocumentViewer from "@/components/global/DocumentViewer";
import BotLoading from "@/public/svg/activity.json";
import TypingMessage from "@/components/chatbot/TypingMessage";
import MarkdownRenderer from "@/components/chatbot/CodeBlock";
import { getChatHistory } from "@/service/apis";
import API_URL from "@/service/ApiUrl";
import { m } from "framer-motion";

interface ChatWindowProps {
  isDocument: boolean;
  conversation_id: string;
  project_id: string;
  content: string;
  option: string;
}
interface DropdownPosition {
  x: number;
  y: number;
}

const ChatWindow: FC<ChatWindowProps> = ({
  project_id,
  isDocument,
  conversation_id,
  content,
  option
}) => {
  const router = useRouter();
  const { toast } = useToast();
  const [input, setInput] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const socket = useRef<WebSocket | null>(null);
  const chatWindowRef = useRef<HTMLDivElement | null>(null);
  const [selectedText, setSelectedText] = useState<string | null>(null);
  const [contextMenu, setContextMenu] = useState<{
    x: number;
    y: number;
  } | null>(null);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({
    x: 0,
    y: 0,
  });
  const [isOpenSource, setIsOpenSource] = useState<boolean>(false);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isOpenDocument, setIsOpenDocument] = useState<boolean>(false);
  const [selectedDocument, setSelectedDocument] = useState<Document>();
  const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
  const [selectedMessage, setSelectedMessage] = useState<string>("");
  const [contentChat, setContentChat] = useState<string>('')
  const [optionChat, setOptionChat] = useState<string>('')
  const conversationExists = useSelector(
    (state: RootState) => !!state.chat.conversations[conversation_id]
  );
  const [showPopup, setShowPopup] = useState(false)
  const messageRefs = useRef<{ [key: string]: HTMLDivElement | null }>({});
  const [isMessage, setIsMessage] = useState<boolean>(true)

  const toggleMessage = () => setIsMessage(!isMessage)

  const scrollToMessage = (msgId: string) => {
    const messageElement = messageRefs.current[msgId];
    if (messageElement) {
      messageElement.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  };

  useEffect(() => {
    if(content !== undefined && option !== undefined) {
      if(option === 'quote') {  
        setContentChat(content)
        setOptionChat(option)
      } else if (option === 'explain') {
        handleExplainWord(content)
      }
    }
  },[content, option])
  const handleClearQuoted = () => {
    setContentChat('')
    setOptionChat('')
  }
  const handleQuoted = (content: string) => {
    setContextMenu(null);
    setOptionChat('quote')
    setContentChat(content)
  }
  const handleTranslate = (content: string) => {
    setShowPopup(true)
    setContextMenu(null);
  }

  const handleOpenDocument = (document: Document) => {
    setSelectedDocument(document);
    setIsOpenDocument(true);
  };
  const handleCloseDocument = () => setIsOpenDocument(false);
  const handleToggleSource = () => setIsOpenSource(!isOpenSource);

  const dispatch = useDispatch();
  const conversation = useSelector(
    (state: RootState) =>
      state.chat.conversations[conversation_id] || {
        messages: [],
        isLoading: false,
      },
  );

  const handleGetDocumentByConversation = async () => {
    try {
      const data = await getDocumentsByConversation(conversation_id);

      setDocuments(data.data);
    } catch (e) {
      console.log(e);
    }
  };
  const handleCreateNewNote = async (content: string) => {
    setContextMenu(null);
    toast({
      description: "Loading...",
    });
    try {
      const id = uuidv4();

      const formattedContent = [
        {
          id: id, 
          type: "paragraph",
          props: {
            textColor: "default",
            backgroundColor: "default",
            textAlignment: "left",
          },
          content: [
            {
              type: "text",
              text: content,
              styles: {},
            },
          ],
          children: [],
        },
      ];

      const jsonContent = JSON.stringify(formattedContent);
      const data = await createNewNote(
        project_id,
        "Viet Generate",
        content,
        [],
        jsonContent,
      );

      toast({
        title: "Create by Viet successfully",
        description:
          "Note has been saved in the project",
      });
    } catch (e) {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: "There was a problem with your request.",
      });
      console.log(e);
    }
  };
  
  const handleGetChatHistory = async () => {
    console.log(conversation_id)
    try {
      const data = await getChatHistory(conversation_id as string)
      console.log(data)
      dispatch(addChatHistory({ conversation_id, messages: data.data }));
    } catch (e) {
      console.log(e)
    }
  }

  function findDocumentNameById(document_id: string): string | undefined {
    const document = documents.find((doc) => doc.document_id === document_id);

    return document ? document.document_name : undefined;
  }
  function convertISOToDate(isoString: string) {
    const date = new Date(isoString);

    const day = date.getDate(); // Ngày
    const year = date.getFullYear(); // Năm

    const monthNames = [
      "January",
      "February",
      "March",
      "April",
      "May",
      "June",
      "July",
      "August",
      "September",
      "October",
      "November",
      "December",
    ];

    const month = monthNames[date.getMonth()]; // Tháng (0 - 11)

    return `${day} ${month} ${year}`;
  }

  useEffect(() => {
    setDocuments([])
    if (conversation_id === undefined) return;
  
    if (!conversationExists && !isDocument) {
      handleGetDocumentByConversation();
    }
  
    if (!conversationExists) {
      handleGetChatHistory();
    } 
  }, [conversation_id]);

  const convertApiUrlToWebSocketUrl = (
    apiUrl: string,
    conversationId: string,
  ): string => {
    const protocol = apiUrl.startsWith("https") ? "wss" : "ws"; // Sử dụng 'wss' nếu là 'https'

    const wsUrl =
      apiUrl.replace(/^https?/, protocol) +
      `/ws/conversations/${conversationId}/send-message`;

    return wsUrl;
  };

  useEffect(() => {
    if (conversation_id !== undefined) {
      socket.current = new WebSocket(
        convertApiUrlToWebSocketUrl(API_URL, conversation_id),
      );
      socket.current.onopen = () => {
      };

      socket.current.onmessage = (event: MessageEvent) => {
        const response = event.data;
        console.log(response)
        if (
          response !== "<END_OF_CONTEXT>" &&
          !response.includes("chunk_id") &&
          response !== "<END_OF_RESPONSE>" &&
          !response.includes("{\"context\":null}") &&
          !response.includes("{\"context\":[]}")
        ) {
        dispatch(
            updateServerMessage({ conversation_id, content: event.data }),
          );
        } else if (response.includes("chunk_id") ) {
          const chunk_ids = JSON.parse(response);
          const currentChunkIds = chunk_ids.context.map((chunk_id: string) =>
            JSON.parse(chunk_id),
          );

          dispatch(
            finalizeServerMessage({
              conversation_id,
              chunk_ids: currentChunkIds,
            }),
          );
          setTimeout(() => {
            setLoading(false);
          }, 1000);
        } else if (response.includes("{\"context\":null}") 
          && response.includes("{\"context\":[]}")
        ) {
          dispatch(
            finalizeServerMessage({
              conversation_id,
              chunk_ids: [],
            }),
          );
        } else {
          setLoading(false);
        }
      };

      socket.current.onclose = () => {
        console.log("Disconnected from WebSocket server");
      };

      return () => {
        if (socket.current) {
          socket.current.close();
          console.log("close");
        }
      };
    }
  }, [conversation_id, dispatch]);

  const sendMessage = (userMessage: string, e?: FormEvent<HTMLFormElement>) => {

    const chat_history = conversation.messages.map((message) => ({
      message_id: message.sender === 'User' ? `umsg-${message.id}` : `bmsg-${message.id}`,
      content: message.content,
      created_at: new Date().toISOString()
    }));
    console.log(chat_history)

    if (e) {
      e.preventDefault();
    }
    if(!socket.current ||
      socket.current.readyState !== WebSocket.OPEN) {
        console.log('hello')
      }
    if (
      !loading &&
      userMessage &&
      socket.current &&
      socket.current.readyState === WebSocket.OPEN
    ) {
      if (optionChat === 'quote') {
        const contentChatNoNewLine = contentChat.replace(/\n/g, '');
        const current_message = `> ${contentChatNoNewLine}\n${userMessage}`;
        const payload = JSON.stringify({ current_message, chat_history });
        console.log(payload)
        socket.current.send(payload);
        dispatch(addUserMessage({ conversation_id, content: current_message }));
        setInput("");
        dispatch(addServerMessage({ conversation_id, content: "" }));
        setLoading(true);
      } else {
        const current_message = userMessage
        const payload = JSON.stringify({ current_message, chat_history });
        console.log(payload)
        socket.current.send(payload);
        dispatch(addUserMessage({ conversation_id, content: userMessage }));
        setInput("");
        dispatch(addServerMessage({ conversation_id, content: "" }));
        setLoading(true);
      }
      handleClearQuoted()
    }
  };

  useLayoutEffect(() => {
    if (chatWindowRef.current) {
      chatWindowRef.current.scrollTop = chatWindowRef.current.scrollHeight;
    }
  }, [conversation.messages]);

  useEffect(() => {
    if (conversation.messages.length > 0) {
      const lastMessageElement = document.getElementById(
        `message-${conversation.messages[conversation.messages.length - 1].id}`,
      );

      if (lastMessageElement) {
        lastMessageElement.scrollIntoView({ behavior: "smooth" });
      }
    }
  }, [conversation.messages]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as Element;
  
      if (contextMenu && !target.closest(".context-menu")) {
        setContextMenu(null); 
      }
    };
  
    document.addEventListener("mousedown", handleClickOutside as unknown as EventListener);
  
    return () => {
      document.removeEventListener("mousedown", handleClickOutside as unknown as EventListener);
    };
  }, [contextMenu]);
  

  const handleExplainWord = async (input: string) => {
    const message = `Explain "${input}"`;

    sendMessage(message);

    setContextMenu(null);
  };
  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement> | React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input as string, e as unknown as FormEvent<HTMLFormElement>);
    }
  };

  const handleRightClick = (e: MouseEvent<HTMLDivElement>, msg: Message) => {
    e.preventDefault();
    setSelectedMessage(msg.content);
    const selected = window.getSelection()?.toString();

    if (selected) {
      setSelectedText(selected);
      setContextMenu({ x: e.pageX, y: e.pageY });
      setDropdownPosition({ x: e.pageX, y: e.pageY })
    }
  };

  const handleCopy = (text: string) => {
    if (text) {
      navigator.clipboard.writeText(text);
      setContextMenu(null);
    }
  };

  const handleOptionClick = (option: string) => {
    window.getSelection()?.removeAllRanges();
  };
  const renderMessage = (content: string) => {
    let parsedContent;
    try {
      parsedContent = JSON.parse(content);
    } catch (e) {
      parsedContent = null;
    }
  
    if (parsedContent && parsedContent.userMessage && Array.isArray(parsedContent.chatHistory)) {
      return (
        <div className="flex flex-col gap-1">
          <p className="text-sm ">{parsedContent.userMessage}</p>
          
        </div>
      );
    } else if (parsedContent && parsedContent.userMessageWithQuote && Array.isArray(parsedContent.chatHistory)) {
      const [quote, ...response] = parsedContent.userMessageWithQuote.split("\n");
      
      return (
        <div className="flex flex-col gap-1">
        <div className="flex items-center gap-2">
          <span className="text-muted-foreground">↳</span>
          <blockquote className="rounded dark:bg-zinc-800 px-3 py-1 italic text-xs bg-zinc-300 font-w">
            {quote.replace("> ", "")}
          </blockquote>
        </div>
        {response.length > 0 && (
          <p className="pl-6 text-sm text-muted-foreground">
            {response.join("\n")}
          </p>
        )}
      </div>
      );
    }
  
    if (content.startsWith("> ")) {
      const [quote, ...response] = content.split("\n");
      
      return (
        <div className="flex flex-col gap-1">
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">↳</span>
            <blockquote className="rounded dark:bg-zinc-800 px-3 py-1 italic text-xs bg-zinc-300 font-w">
              {quote.replace("> ", "")}
            </blockquote>
          </div>
          {response.length > 0 && (
            <p className="pl-6 text-sm text-muted-foreground">
              {response.join("\n")}
            </p>
          )}
        </div>
      );
    }
  
    // Regular message
    return <p className="text-sm">{content}</p>;
  };
  


  return (
    <div className="flex">
      <div
        className={`flex flex-col relative justify-between overflow-auto bg-zinc-100 dark:bg-zinc-800 w-full`}
        style={{
          height: `${isDocument ? "calc(100vh - 112px)" : "100vh"}`,
        }}
      >
        <div
          className={`flex flex-col ${isDocument ? "w-full px-7" : "w-10/12 pr-16 pl-10 pt-14 "} max-w-4xl  mx-auto flex-grow`}
        >
          {/* Chat window */}
          <div
            ref={chatWindowRef}
            className="w-full flex-1 relative overflow-auto"
          >
            {conversation.messages.map((msg, index) => (
              <div
                key={msg.id}
                className={` group flex  ${msg.sender === "User" ? "dark:bg-neutral-700 bg-neutral-50 w-fit ml-auto max-w-md" : "flex"} 
              mb-2 p-2 rounded-3xl mt-5 px-4 `}
                id={`message-${msg.id}`}
                ref={(el) => { messageRefs.current[msg.id] = el }}
                onContextMenu={(e) => handleRightClick(e, msg)}
              >
                {/* Avatar bot if Server */}
                {msg.sender === "Server" && msg.content === "" && msg.status === "streaming" &&(
                  <div className="animate-pulse mr-2 flex items-center flex-shrink-0 self-start ">
                    <Lottie
                      animationData={BotLoading}
                      className="dark:invert"
                      loop={true}
                    />
                    <span className=" text-xs">Viet is thinking ...</span>
                  </div>
                )}
                {msg.sender === "Server" && msg.content !== "" && (
                  <div className="mr-2 flex items-center flex-shrink-0 self-start ">
                    <Image
                      alt="Logo"
                      src="/favicon.ico"
                      width={18}
                      height={18}
                      className="mr-2 invert dark:invert-0"
                    />
                  </div>
                )}

                <div
                  className={`flex flex-col  ${msg.sender === "Server" ? "ml-2 w-[96%]" : ""}`}
                >
                  {msg.sender === "Server" && msg.status === "streaming" ? (
                    <TypingMessage message={msg.content} />
                  ) : msg.sender === "Server" ? (
                    <MarkdownRenderer content={msg.content} />
                  ) : (
                    <div>{renderMessage(msg.content as string)}</div>
                  )}

                  {Array.isArray(msg.chunk_ids) &&
                    msg.chunk_ids.length > 0 &&
                    msg.sender === "Server" && (
                      <div key={msg.id} className="flex flex-wrap mt-2 items-center">
                        <i className="text-sm">Learn more:</i>
                        {msg.chunk_ids.map((chunkId, index) => {
                          // Thêm index vào tham số
                          const documentName = findDocumentNameById(chunkId.document_id);

                          // Tạo key duy nhất bằng cách kết hợp chunkId.chunk_id và index
                          const uniqueKey = `${chunkId.chunk_id}-${index}`;

                          return (
                            <HoverCard key={uniqueKey}>
                              <HoverCardTrigger asChild>
                                <Button
                                  isIconOnly
                                  className="ml-3 p-1"
                                  size="sm"
                                  variant="shadow"
                                >
                                  {index + 1} 
                                </Button>
                              </HoverCardTrigger>
                              <HoverCardContent className="w-80 dark:bg-zinc-900 bg-zinc-50">
                                <div className="flex justify-between space-x-4">
                                  <div className="space-y-1">
                                    <h4 className="text-sm font-semibold">
                                      {documentName}
                                    </h4>
                                    <p className="text-sm">{chunkId.content}</p>
                                    <div className="flex items-center pt-2">
                                      <span className="text-xs text-muted-foreground">
                                        {convertISOToDate(chunkId.created_at)}
                                      </span>
                                    </div>
                                  </div>
                                </div>
                              </HoverCardContent>
                            </HoverCard>
                          );
                        })}
                      </div>
                    )}


                  {/* Display icons on hover */}
                  {msg.sender === "Server" && msg.content !== "" && (
                    <div
                      className="space-x-2 p-2"
                      style={{ bottom: "-24px", left: "56px" }}
                    >
                      <Tooltip content="Like this message">
                        <Button
                          isIconOnly
                          radius="full"
                          size="sm"
                          variant="light"
                        >
                          <HeartIcon className="w-5 h-5 " />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Feedback for bad message">
                        <Button
                          isIconOnly
                          radius="full"
                          size="sm"
                          variant="light"
                        >
                          <HandThumbDownIcon className="w-5 h-5 " />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Copy">
                        <Button
                          isIconOnly
                          radius="full"
                          size="sm"
                          variant="light"
                          onClick={() => handleCopy(msg.content)}
                        >
                          <ClipboardIcon className="w-5 h-5" />
                        </Button>
                      </Tooltip>
                      <Tooltip content="Pin to your note">
                        <Button
                          isIconOnly
                          radius="full"
                          size="sm"
                          variant="light"
                          onClick={() => handleCreateNewNote(msg.content)}
                        >
                          <PencilSquareIcon className="w-5 h-5 " />
                        </Button>
                      </Tooltip>
                    </div>
                  )}
                </div>
              </div>
            ))}

            {/* Context menu on right click */}
            {contextMenu && (
              <div
                className="z-50 fixed dark:bg-zinc-800 bg-zinc-200 rounded-md shadow-lg"
                style={{ top: contextMenu.y, left: contextMenu.x }}
              >
                <ListboxWrapper>
                  <Listbox
                  className="p-0"
                    aria-label="Actions"
                    onAction={(key) => handleOptionClick(key as string)}
                  >
                    <ListboxItem key="copy" textValue="copy">
                      <div
                        className="flex items-center"
                        onClick={() => handleCopy(selectedText as string)}
                      >
                        <Square2StackIcon className="pr-1 w-5 h-5" />
                        Sao chép
                      </div>
                    </ListboxItem>
                    <ListboxItem
                      key="explain"
                      textValue="explain"
                      onClick={() => handleExplainWord(selectedText as string)}
                    >
                      <div className="flex items-center">
                        <QuestionMarkCircleIcon className="pr-1 w-5 h-5" />
                        Giải thích
                      </div>
                    </ListboxItem>
                    <ListboxItem key="addNote" textValue="addNote">
                      <div
                        className="flex items-center"
                        onClick={() =>
                          handleCreateNewNote(selectedText as string)
                        }
                      >
                        <ClipboardDocumentCheckIcon className="pr-1 w-5 h-5" />
                        Thêm vào note
                      </div>
                    </ListboxItem>
                    <ListboxItem key="quote" textValue="quote">
                      <div
                        className="flex items-center"
                        onClick={() =>
                          handleQuoted(selectedText as string)
                        }
                      >
                        <PaperClipIcon className="pr-1 w-5 h-5" />
                        Quote
                      </div>
                    </ListboxItem>
                    <ListboxItem key="translate" textValue="translate">
                      <div
                        className="flex items-center"
                        onClick={() =>
                          handleTranslate(selectedText as string)
                        }
                      >
                        <LanguageIcon className="pr-1 w-5 h-5" />
                        Translate
                      </div>
                    </ListboxItem>
                  </Listbox>
                </ListboxWrapper>
              </div>
            )}
          </div>

          {/* Message input form */}
          <div className="pl-6 w-full bg-zinc-100 dark:bg-zinc-800 flex justify-center items-center flex-col mt-4 sticky bottom-0">
                {optionChat === 'quote' && contentChat && (
                  <div className="w-full max-w-2xl mb-2 px-4 py-2 bg-slate-100 border border-slate-300 rounded-xl shadow-md flex items-center gap-2">
                    <div className="text-slate-600 text-sm italic flex-1">
                      <span className="font-medium text-slate-800">Quoted:</span> {contentChat}
                    </div>
                    <button
                      onClick={handleClearQuoted} 
                      className="text-slate-400 hover:text-slate-600 transition"
                    >
                      <XMarkIcon className="w-4 h-4"/>
                    </button>
                  </div>
                )}

            <form
              className="max-w-2xl pr-2 flex w-full justify-center items-center rounded-3xl"
              onSubmit={(e) => sendMessage(input, e)}
            >
              <Textarea
                className="flex-1 p-1 rounded-full"
                minRows={1}
                placeholder="Type your message..."
                value={input}
                variant="faded"
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => handleKeyDown(e)}
              />
              <Button
                isIconOnly
                className="ml-2 text-white p-2 rounded-full bg-slate-400"
                type="submit"
              >
                <ArrowRightIcon />
              </Button>
            </form>
            <div className="text-xs opacity-75 my-2">
              Viet can make mistakes. Check important info.
            </div>
          </div>
        </div>

        {!isDocument && (
          <div className="fixed bottom-9 right-9 z-5">
            <Tooltip content="Document Pool!">
              <Button
                isIconOnly
                className="rounded-full"
                size="lg"
                onClick={() => handleToggleSource()}
              >
                <FolderIcon className="w-4 h-4" />
              </Button>
            </Tooltip>
          </div>
        )}
      </div>
      {
        isOpenSource && (
          <Card className="fixed bottom-8 right-4 w-60 max-h-[60vh] overflow-y-auto z-40 bg-zinc-50 dark:bg-zinc-900">
            <CardHeader className="pb-0 pt-2 px-4 flex items-center justify-between">
              <h4 className="dark:text-gray-400 text-gray-700">Documents</h4>
              <XMarkIcon 
              onClick={handleToggleSource}
              className="cursor-pointer w-4 h-4"/>
            </CardHeader>
            <CardBody className="overflow-visible py-2">
              <div className="space-y-1">
                {!documents || documents.length === 0 ? (
                  // Skeleton loading
                  Array.from({ length: 3 }).map((_, index) => (
                    <div key={index} className="flex items-center space-x-2 p-2">
                      <Skeleton className="w-40 h-4 rounded-lg" />
                      <Skeleton className="w-4 h-4 rounded-full" />
                    </div>
                  ))
                ) : (
                  documents.map((doc) => (
                    <div
                      key={doc.document_id}
                      className="p-2 transition-all group flex justify-between items-center space-x-2 text-sm cursor-pointer rounded-lg dark:text-gray-400 text-gray-700 dark:hover:bg-zinc-800 hover:bg-zinc-200"
                      onClick={() => handleOpenDocument(doc)}
                    >
                      <Tooltip content={doc.document_name}>
                        <span className="w-40 truncate">{doc.document_name}</span>
                      </Tooltip>
                      <div className="opacity-0 group-hover:opacity-100">
                        <EllipsisHorizontalIcon className="h-4 w-4 text-gray-400" />
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardBody>
          </Card>
        )
      }
       <div className="fixed right-0 bottom-0 h-[calc(100vh-64px)]">
        <div
          className={`absolute z-20 top-2 ${
            isMessage ? 'right-64' : 'right-2'
          } transition-all duration-300 ease-in-out`}
        >
          <Button
            isIconOnly
            onClick={toggleMessage}
            className="bg-gray-300 rounded-full shadow hover:bg-gray-400"
          >
            {!isMessage ? (
              <ChevronLeftIcon className="w-4 h-4"/>
            ) : (
              <ChevronRightIcon className="w-4 h-4"/>
            )}
          </Button>
        </div>

        <div
          className={`transition-all duration-300 ease-in-out ${
            isMessage ? 'w-64' : 'w-0'
          } bg-none h-full overflow-x-hidden overflow-y-auto`}
        >
          <div className="p-4 w-full">
            <div className="space-y-2 w-full">
              {conversation.messages
                .filter((msg) => msg.sender === 'User')
                .map((msg) => (
                  <div
                    key={msg.id}
                    className="p-1 text-xs cursor-pointer transition-all bg-gray-300 dark:bg-gray-600 rounded-xl shadow hover:bg-gray-400 dark:hover:bg-gray-500 w-full text-ellipsis truncate"
                    onClick={() => scrollToMessage(msg.id)}
                  >
                    {msg.content}
                  </div>
                ))}
            </div>
          </div>
        </div>

      </div>



      <DocumentViewer
        document={selectedDocument as Document}
        isOpen={isOpenDocument}
        onClose={handleCloseDocument}
      />
      {showPopup && (
        <TranslationPopup 
          text={selectedText as string} 
          onClose={() => setShowPopup(false)}
          onSaveNote={() => {}}
          position={dropdownPosition}
        />
      )}
    </div>
  );
};

export default ChatWindow;
