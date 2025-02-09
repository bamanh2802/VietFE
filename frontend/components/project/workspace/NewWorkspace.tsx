'use client'

import React, { useState, useEffect, FC } from "react";
import { useRouter } from "next/navigation";
import { useDispatch } from "react-redux";
import {  Modal,  ModalContent,  ModalHeader,  ModalBody,  ModalFooter} from "@nextui-org/modal";
import { Listbox, ListboxItem } from "@nextui-org/listbox";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import {
  PlusIcon,
  DocumentTextIcon,
  PresentationChartBarIcon,
  LinkIcon,
  NewspaperIcon,
} from "@heroicons/react/24/outline";
import { useToast } from "@/hooks/use-toast";
import { Document } from "@/src/types/types";
import { createNewConversation } from "@/service/projectApi";
import { redirect } from 'next/navigation'
interface NewWorkspaceProps {
  onSelectConversation: (convId: string) => void;
  isOpen: boolean;
  onClose: () => void;
  documents: Document[];
  projectId: string;
  updateConversation: () => void;
  from: string;
}

const NewWorkspace: FC<NewWorkspaceProps> = ({
  onSelectConversation,
  from,
  updateConversation,
  projectId,
  isOpen,
  onClose,
  documents,
}) => {
  const router = useRouter();
  const { toast } = useToast()
  const dispatch = useDispatch();
  const [selectedKeys, setSelectedKeys] = React.useState(new Set([""]));
  const [conversationName, setConversationName] = useState<string>("");
  const [isDisable, setIsDisable] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const handleSelectionChange = (keys: any) => {
    setSelectedKeys(keys);
  };

  const handleCreateNewConversation = async () => {
    const selectedDocsArray = Array.from(selectedKeys).filter(key => key !== '');
  
    setIsLoading(true);
  
    try {
      const data = await createNewConversation(
        conversationName.trim(),
        projectId,
        selectedDocsArray
      );
  
      toast({
        title: "Conversation created successfully",
        description: "Redirecting to the new conversation...",
      });
  
      handleRouterWorkspace(data.data.conversation_id);
  
      setSelectedKeys(new Set());
      setConversationName("");
      onClose();
  
    } catch (e: any) {
      console.error("Error creating conversation:", e);
  
      toast({
        variant: "destructive",
        title: "Failed to create conversation",
        description: e?.response?.data?.message || e?.message || "Something went wrong.",
      });
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleRouterWorkspace = (conversationId: string) => {
    updateConversation();
    if (from === "project") {
      const url = `/project/${projectId}/conversation/${conversationId}`;
      window.open(url, "_blank");
    } else if (from === "conversation") {
      onSelectConversation(conversationId)
    }
  };

  useEffect(() => {
    if (documents !== undefined) {
      if (
        documents.length !== 0 &&
        Array.from(selectedKeys).length !== 0 &&
        conversationName !== ""
      ) {
        setIsDisable(false);
      } else {
        setIsDisable(true);
      }
    }
  }, [documents, conversationName, selectedKeys]);

  const selectedValue = React.useMemo(
    () =>
      Array.from(selectedKeys)
        .map((key) => {
          const doc = documents?.find((doc) => doc.document_id === key);
          return doc ? doc.document_name : "";
        })
        .join(", "),
    [selectedKeys, documents],
  );

  const getDocumentIcon = (type: string) => {
    switch (type) {
      case "pdf":
        return <DocumentTextIcon className="w-5 h-5 inline-block mr-1" />;
      case "pptx":
        return <PresentationChartBarIcon className="w-5 h-5 inline-block mr-1" />;
      case "url":
        return <LinkIcon className="w-5 h-5 inline-block mr-1" />;
      case "docx":
        return <NewspaperIcon className="w-5 h-5 inline-block mr-1" />;
      default:
        return null; 
    }
  };

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="2xl"
      scrollBehavior="inside"
    >
      <ModalContent>
        {(onClose) => (
          <>
            <ModalHeader className="flex flex-col gap-1">Select Files</ModalHeader>
            <ModalBody>
              <div className="mt-4">
                <span className="block text-sm font-medium">Conversation Name</span>
                <Input
                  className="mt-2"
                  placeholder="Enter conversation name"
                  value={conversationName}
                  onChange={(e) => setConversationName(e.target.value)}
                />
              </div>

              <div className="mt-4">
                <Listbox
                  aria-label="File selection"
                  selectionMode="multiple"
                  selectedKeys={selectedKeys}
                  onSelectionChange={handleSelectionChange}
                >
                  {documents?.map((doc) => (
                    <ListboxItem key={doc.document_id} textValue={doc.document_name}>
                      <div className="flex items-center">
                        {getDocumentIcon(doc.type)}
                        <span>{doc.document_name} ({doc.type})</span>
                      </div>
                    </ListboxItem>
                  ))}
                </Listbox>
              </div>

              <p className="text-small text-default-500 mt-2">
                Selected files: {selectedValue}
              </p>
            </ModalBody>
            <ModalFooter>
              <Button
                color="primary"
                isDisabled={isDisable}
                isLoading={isLoading}
                startContent={!isLoading && <PlusIcon className="w-5 h-5" />}
                onClick={handleCreateNewConversation}
              >
                Create
              </Button>
            </ModalFooter>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default NewWorkspace;

