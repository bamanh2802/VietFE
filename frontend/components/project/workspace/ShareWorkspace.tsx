'use client'
import { CopyIcon } from "@radix-ui/react-icons";
import { FC, useEffect, useState } from "react";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import {Spinner} from "@nextui-org/spinner";
import {  Modal,  ModalContent,  ModalHeader,  ModalBody,  ModalFooter} from "@nextui-org/modal";
import { getSharedNoteId } from "@/service/noteApi";
import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";

interface ShareWorkspaceProps {
  isOpen: boolean;
  onClose: () => void;
  type: string;
  id: string
}

const ShareWorkspace: FC<ShareWorkspaceProps> = ({ isOpen, onClose, type, id }) => {
  const user = useSelector((state: RootState) => state.user);
  const [url, setUrl] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
  };

  const handleGetSharedId = async () => {
    setIsLoading(true);
    try {
      const data = await getSharedNoteId(id, user.user_id);
      const baseUrl = window.location.origin; 
      setUrl(`${baseUrl}/share/${data.data}`);
    } catch (e) {
      console.log(e);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (type === 'note' && user.user_id !== '' && id !== undefined) {
      handleGetSharedId();
    }
  }, [type, id, user]);

  return (
    <Modal 
      isOpen={isOpen} 
      onClose={onClose}
      size="md"
      classNames={{
        body: "py-6",
      }}
    >
      <ModalContent>
        <ModalHeader className="flex flex-col gap-1">
          <h2 className="text-lg font-semibold">Share link</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Anyone who has this link will be able to view this.
          </p>
        </ModalHeader>
        <ModalBody>
          {isLoading ? (
            <div className="flex justify-center items-center h-20">
              <Spinner color="default" size="lg" />
            </div>
          ) : (
            <div className="flex items-center space-x-2">
              <div className="grid flex-1 gap-2">
                <label className="sr-only" htmlFor="link">
                  Link
                </label>
                <Input
                  readOnly
                  value={url}
                  id="link"
                />
              </div>
              <Button 
                isIconOnly
                color="primary" 
                aria-label="Copy"
                onClick={handleCopy}
              >
                <CopyIcon className="h-4 w-4" />
              </Button>
            </div>
          )}
        </ModalBody>
        <ModalFooter>
          <Button color="danger" variant="light" onPress={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ShareWorkspace;

