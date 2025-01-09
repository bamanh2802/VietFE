"use client"
import React, { useState, useEffect } from 'react';
import { RiRobot2Line } from 'react-icons/ri';
import { 
  Tooltip, 
} from "@nextui-org/react";
import { 
  HeartIcon, 
  HandThumbDownIcon, 
  ClipboardIcon, 
  PencilSquareIcon,
  ChatBubbleLeftIcon
} from "@heroicons/react/24/outline";
import MarkdownRenderer from '@/components/chatbot/CodeBlock';
import { getChatHistory } from '@/service/projectApi';
import NavbarShare from './NavbarShare';
import { Button } from '@/components/ui/button';
import SignInForm from '@/components/global/SignInForm';
import AddProject from './AddProject';

// Types for chat message
interface ChatMessage {
  message_id: string;
  conversation_id: string;
  content: string;
  document_ids?: string;
  chunk_ids?: any[];
  created_at: string
}

interface ChatShareProps {
  chatId: string;
}

const ChatShare: React.FC<ChatShareProps> = ({ chatId }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isOpenProjectList, setIsOpenProjectList] = useState<boolean>(false)

  const handleToggleOpenProjectList = () => {
      setIsOpenProjectList(!isOpenProjectList)
  }
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    setIsAuthenticated(!!token);
  }, []);
  const [isOpenSignIn, setIsOpenSignIn] = useState<boolean>(false)
  const handleToggleSignIn = () => {
    setIsOpenSignIn(!isOpenSignIn)
}
  const handleGetChatHistory = async (id: string) => {
    try {
      const data = await getChatHistory(chatId)
      console.log(data)
      setMessages(data.data)
      setIsLoading(false);
    } catch (error) {
      console.error('Failed to fetch chat history:', error);
      setIsLoading(false);
    }
  };

  const handleContinueChat = () => {
    if (!isAuthenticated) {
      handleToggleSignIn()
    } else {
      handleToggleOpenProjectList()
    }
  }

  useEffect(() => {
    if(chatId !== undefined) {
        handleGetChatHistory(chatId);
    }
  }, [chatId]);

  // Placeholder functions (replace with actual implementations)
  const handleCopy = (content: string) => {
    navigator.clipboard.writeText(content);
  };

  const handleCreateNewNote = (content: string) => {
    // Implement note creation logic
    console.log('Create note with:', content);
  };

  if (isLoading) {
    return <div>Loading chat history...</div>;
  }

  return (
    <>
    <NavbarShare isChat={true} openSigIn={handleToggleSignIn} isLogin={isAuthenticated}/>
    <div className="p-4 flex flex-col relative justify-between overflow-auto bg-zinc-100 dark:bg-zinc-800 w-full">

      <div className='w-10/12 pr-16 pl-10 pb-10 max-w-3xl  mx-auto flex-grow flex flex-col'>

      {messages.map((msg) => (
        <div
          key={msg.message_id}
          className={`group flex ${msg.message_id.startsWith("umsg") ? "dark:bg-neutral-700 bg-neutral-50 w-fit ml-auto max-w-md" : "flex"} 
            mb-2 p-2 rounded-3xl mt-5 px-4`}
          id={`message-${msg.message_id}`}
        >
          {/* Server message avatar */}
          {msg.message_id.startsWith("bsmg") && (
            <div className="mr-2 flex items-center flex-shrink-0 self-start">
              <RiRobot2Line className="w-4 h-4" />
            </div>
          )}

          <div className={`flex flex-col ${msg.message_id.startsWith("bsmg") ? "ml-2 w-[96%]" : ""}`}>
            {msg.message_id.startsWith("bsmg") ? (
              <MarkdownRenderer content={msg.content} />
            ) : (
              <div>{msg.content}</div>
            )}

            {msg.message_id.startsWith("bsmg") && msg.content !== "" && (
              <div
                className="space-x-2 p-2"
                style={{ bottom: "-24px", left: "56px" }}
              >
                <Tooltip content="Like this message">
                  <Button
                    size="sm"
                  >
                    <HeartIcon className="w-5 h-5" />
                  </Button>
                </Tooltip>
                <Tooltip content="Feedback for bad message">
                  <Button
                    size="sm"
                  >
                    <HandThumbDownIcon className="w-5 h-5" />
                  </Button>
                </Tooltip>
                <Tooltip content="Copy">
                  <Button
                    size="sm"
                    onClick={() => handleCopy(msg.content)}
                  >
                    <ClipboardIcon className="w-5 h-5" />
                  </Button>
                </Tooltip>
                <Tooltip content="Pin to your note">
                  <Button
                    size="sm"
                    onClick={() => handleCreateNewNote(msg.content)}
                  >
                    <PencilSquareIcon className="w-5 h-5" />
                  </Button>
                </Tooltip>
              </div>
            )}
          </div>
        </div>
      ))}
      </div>
      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
            <Button
            onClick={handleContinueChat}
            >
                <ChatBubbleLeftIcon className="w-4 h-4 mr-2"/>
                Continue this chat
            </Button>
        </div>
    </div>
      <SignInForm isOpen={isOpenSignIn} closeForm={handleToggleSignIn}/>
      <AddProject isOpen={isOpenProjectList} onClose={handleToggleOpenProjectList}/>

      </>
  );
};

export default ChatShare;