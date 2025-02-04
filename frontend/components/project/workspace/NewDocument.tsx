import { FC, useState, useEffect, useRef, useMemo } from "react";
import { FileText, Link, Upload, X, Loader2, CheckCircle, Globe, Link2 } from 'lucide-react'
import {  Modal,  ModalContent,  ModalHeader,  ModalBody,  ModalFooter} from "@nextui-org/modal";
import { Button } from "@nextui-org/button";
import { Input } from "@nextui-org/input";
import {Progress} from "@nextui-org/progress";
import {Tabs, Tab} from "@nextui-org/tabs";
import {Card, CardBody} from "@nextui-org/card";
import {Chip} from "@nextui-org/chip";
import { Document } from "@/src/types/types";
import { uploadDocument, uploadUrlDocument } from "@/service/documentApi";
import checkmarkLoader from "@/public/svg/checkmarkLoader.json"
import dynamic from "next/dynamic";
import API_URL from "@/service/ApiUrl";

interface NewDocumentProps {
  isOpen: boolean;
  onClose: () => void;
  documents: Document[];
  projectId: string;
  updateDocument: () => void;
}
interface UploadProgressType {
  [key: string]: {
    progress: number;
    message: string;
  };
}

const NewDocument: FC<NewDocumentProps> = ({
  updateDocument,
  isOpen,
  onClose,
  documents,
  projectId,
}) => {
  const [limit, setLimit] = useState<number>(documents?.length);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const maxFiles = 5;
  const [isMaxFile, setIsMaxFile] = useState<boolean>(false);
  const [url, setUrl] = useState('')
  const Lottie = dynamic(() => import("lottie-react"), { ssr: false });
  const [uploadProgress, setUploadProgress] = useState<UploadProgressType>({});
  const [isConnected, setIsConnected] = useState(false);
  const [isTesting, setIsTesting] = useState(true);
  const wsRef = useRef<WebSocket | null>(null);
  const hasDataRef = useRef<boolean>(false);
  const timeoutRef = useRef<NodeJS.Timeout | null>(null);

  const progress = ((limit + selectedFiles.length) / maxFiles) * 100;
  const userId = localStorage.getItem("user_id")
  const ws_url = API_URL.replace(/^http(s?):/, (match) => match === 'https:' ? 'wss:' : 'ws:');

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;

    if (files) {
      const newFiles = [...selectedFiles, ...Array.from(files)];

      if (limit + newFiles.length > maxFiles) {
        setSelectedFiles(newFiles);
        setIsMaxFile(true);
      } else {
        setSelectedFiles(newFiles);
        setIsMaxFile(false);
      }
    }
  };

  const handleUrlUpload = async (url: string) => {
    try {
      await uploadUrlDocument(url, projectId as string)
    } catch (e) {
      console.log(e)
    }
    setIsLoading(false)
    setUrl('')
  }

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();

    const files = event.dataTransfer.files;

    if (files) {
      const newFiles = [...selectedFiles, ...Array.from(files)];

      if (limit + newFiles.length > maxFiles) {
        setSelectedFiles(newFiles);
        setIsMaxFile(true);
      } else {
        setSelectedFiles(newFiles);
        setIsMaxFile(false);
      }
    }
    setIsDragging(false);
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    event.stopPropagation();
    setIsDragging(false);
  };

  const handleRemoveFile = (index: number) => {
    const updatedFiles = [...selectedFiles];

    updatedFiles.splice(index, 1);
    setSelectedFiles(updatedFiles);
    if (updatedFiles.length + limit <= 5) {
      setIsMaxFile(false);
    }
  };
  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    handleUrlUpload(url)
  }

  const handleWebSocketMessage = (event: MessageEvent) => {
    console.log(uploadProgress)
    try {
      const data = JSON.parse(event.data);
      if (data) {
        hasDataRef.current = true;
        setUploadProgress(prev => ({
          ...prev,
          [data.filename]: {
            progress: data.progress * 100,
            message: data.msg
          }
        }));
  
        if (data.msg === "Done") {
          updateDocument(); 
        }
      }
    } catch (error) {
      console.error('Error parsing WebSocket data:', error);
    }

  };
  

  useEffect(() => {
    // Initial WebSocket test on component mount
    const testInitialConnection = () => {
      wsRef.current = new WebSocket(`${ws_url}/ws/notification/files-upload?user_id=${userId}`);

      timeoutRef.current = setTimeout(() => {
        if (!hasDataRef.current) {
          console.log('No data received in 10 seconds, closing connection');
          closeWebSocket();
        }
        setIsTesting(false);
      }, 60000);

      wsRef.current.onopen = () => {
        console.log('Initial WebSocket Connected');
        setIsConnected(true);
      };

      wsRef.current.onmessage = handleWebSocketMessage;

      wsRef.current.onclose = () => {
        setIsConnected(false);
        setTimeout(() => {
            setUploadProgress({}); 
        }, 10000)
        console.log('WebSocket connection closed');
      };

      wsRef.current.onerror = (error) => {
        console.error('WebSocket error:', error);
        closeWebSocket();
      };
    };

    testInitialConnection();

    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      closeWebSocket();
    };
  }, []);

  const closeWebSocket = () => {
    if (wsRef.current) {
      wsRef.current.close();
      wsRef.current = null;
      setIsConnected(false);
    }
  };

  const ensureWebSocketConnection = () => {
    if (isTesting && timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      setIsTesting(false);
    }

    if (!wsRef.current || wsRef.current.readyState !== WebSocket.OPEN) {
      wsRef.current = new WebSocket(`${ws_url}/ws/notification/files-upload?user_id=${userId}`);
      wsRef.current.onopen = () => {
        setIsConnected(true);
        console.log('Upload WebSocket Connected');
      };
      wsRef.current.onmessage = handleWebSocketMessage;
      wsRef.current.onclose = () => {
        setIsConnected(false);
        setTimeout(() => {
          setUploadProgress({}); 
      }, 10000)
        console.log('Upload WebSocket Disconnected');
      };
      wsRef.current.onerror = (error) => {
        console.error('Upload WebSocket error:', error);
      };
    }
    updateDocument();
  };

  const handleFileUpload = async () => {
    if (!selectedFiles.length) {
      return;
    }

    setIsLoading(true);
    setIsSuccess(false);

    try {
      ensureWebSocketConnection();

      const initialProgress: UploadProgressType = {};
      selectedFiles.forEach(file => {
        initialProgress[file.name] = {
          progress: 0,
          message: 'Waiting to start...'
        };
      });
      setUploadProgress(initialProgress);
      const data = await uploadDocument(projectId, selectedFiles);
      setLimit(limit + selectedFiles.length);
      setIsSuccess(true);
      setSelectedFiles([]);
      
    } catch (error) {
      console.error("Error during upload process:", error);
    }
      setIsLoading(false);
      setIsSuccess(false);
      onClose()
  };

  const ProgressTracker = ({ uploadProgress }: { uploadProgress: { [key: string]: { progress: number, message: string } } }) => {
    const progressCards = useMemo(() => {
      return Object.entries(uploadProgress).map(([filename, details]) => (
        <Card key={filename} className="w-96" aria-label="file progress">
          <CardBody className="px-4 py-2" aria-label="file progress">
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
              <span aria-label="file progress" className="text-base font-medium truncate w-full">{filename}</span>
              <Chip size="sm" variant="flat" color="primary" aria-label="file progress">
                {details.message}
              </Chip>
              <Chip className="ml-1" size="sm" variant="flat" color="success">
                {details.progress} %
              </Chip>
            </div>
            <Progress aria-label="file progress" className="max-w-md mt-2" size="sm" value={details.progress} />
          </CardBody>
        </Card>
      ));
    }, [uploadProgress]);
  
    return (
      <div className="space-y-2 fixed top-14 right-5">
        {progressCards}
      </div>
    );
  };


  return (
    <>
    <div className="w-full max-w-md mx-auto">
        <ProgressTracker uploadProgress={uploadProgress}/>
      </div>
      <Modal 
        isOpen={isOpen} 
        onClose={onClose}
        size="2xl"
        scrollBehavior="inside"
      >
        <ModalContent>
          {(onClose) => (
            <>
              <ModalHeader className="flex flex-col gap-1">
                <h2 className="text-2xl font-bold">Thêm nguồn</h2>
                <p className="text-sm text-zinc-500 dark:text-zinc-400">
                  Các nguồn cho phép VIET trả lời dựa trên những thông tin quan trọng nhất đối với bạn.
                </p>
              </ModalHeader>
              <ModalBody>
                <Tabs aria-label="Options">
                  <Tab key="file" title="Tải tệp lên">
                    <div
                      className={`border-2 border-dashed rounded-lg p-8 text-center transition-colors ${
                        isDragging ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-zinc-300 dark:border-zinc-700"
                      } relative overflow-hidden`}
                      onDragLeave={handleDragLeave}
                      onDragOver={handleDragOver}
                      onDrop={handleDrop}
                      aria-label="File upload area"
                    >
                      {isLoading ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm transition-opacity duration-300">
                          <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                        </div>
                      ) : isSuccess ? (
                        <div className="absolute inset-0 flex items-center justify-center bg-zinc-900/50 backdrop-blur-sm transition-opacity duration-300">
                          <Lottie
                            animationData={checkmarkLoader}
                            loop={0}
                            className="w-12 h-12"
                          />
                        </div>
                      ) : (
                        <>
                          <Upload className="mx-auto h-12 w-12 text-zinc-400" />
                          <p className="mt-2 text-sm font-medium text-zinc-600 dark:text-zinc-300">Tải nguồn lên</p>
                          <p className="mt-1 text-xs text-zinc-500 dark:text-zinc-400">
                            Kéo và thả hoặc chọn tệp để tải lên
                          </p>
                          <input
                            multiple
                            className="hidden"
                            id="file-upload"
                            type="file"
                            onChange={handleFileChange}
                            accept=".pdf,.txt,.doc,.docx"
                            aria-label="File input"
                          />
                          <label htmlFor="file-upload">
                            <Button 
                              onClick={() => document.getElementById("file-upload")?.click()}
                              className="mt-4"
                              aria-label="Choose files to upload"
                            >
                              Chọn tệp
                            </Button>
                          </label>
                        </>
                      )}
                    </div>

                    {selectedFiles.length > 0 && (
                      <div className="mt-4 space-y-2">
                        {selectedFiles.map((file, index) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-2 bg-zinc-100 dark:bg-zinc-800 rounded"
                            aria-label={`Selected file: ${file.name}`}
                          >
                            <span className="text-sm text-zinc-600 dark:text-zinc-300">{file.name}</span>
                            <Button
                              size="sm"
                              isIconOnly
                              variant="light"
                              onClick={() => handleRemoveFile(index)}
                              aria-label={`Remove file: ${file.name}`}
                            >
                              <X className="h-4 w-4 text-zinc-500" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    )}

                    <Button
                      className="w-full mt-4"
                      isDisabled={!selectedFiles.length || isMaxFile || isLoading}
                      onClick={handleFileUpload}
                      aria-label="Upload files button"
                    >
                      {isLoading ? "Đang tải lên..." : "Tải lên tệp"}
                    </Button>
                  </Tab>
                  <Tab key="url" title="Thêm URL">
                    <form onSubmit={handleUrlSubmit}>
                      <div className="flex items-center space-x-2">
                        <Input
                          type="url"
                          placeholder="Nhập URL của tài liệu"
                          value={url}
                          onChange={(e) => setUrl(e.target.value)}
                          className="flex-grow"
                          aria-label="Input document URL"
                        />
                        <Button type="submit" isDisabled={!url || isLoading} aria-label="Submit URL">
                          {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
                        </Button>
                      </div>
                    </form>
                  </Tab>
                </Tabs>

                {/* Document limit and supported formats */}
                <div className="mt-6 space-y-4">
                  <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Định dạng tài liệu được hỗ trợ</h3>
                  <div className="grid grid-cols-3 gap-4">
                    {[
                      { icon: FileText, label: "PDF" },
                      { icon: Link2, label: "URL" },
                      { icon: FileText, label: "DOCS" },
                    ].map((item, index) => (
                      <Card key={index} aria-label={`Supported format: ${item.label}`}>
                        <CardBody className="flex flex-col items-center justify-center p-4">
                          <item.icon className="h-8 w-8 text-zinc-500 dark:text-zinc-400 mb-2" />
                          <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">{item.label}</span>
                        </CardBody>
                      </Card>
                    ))}
                  </div>
                </div>

                {/* Document limit */}
                <div className="mt-6">
                  <div className="flex justify-between items-center mb-2">
                    <label htmlFor="document" className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                      Giới hạn tài liệu
                    </label>
                    <span className={`text-sm font-medium ${isMaxFile ? "text-red-500" : "text-zinc-500 dark:text-zinc-400"}`}>
                      {limit + selectedFiles.length}/{maxFiles}
                    </span>
                  </div>
                  <Progress value={progress} className="h-2 mb-5" aria-label="Progress bar for document limit" />
                </div>
              </ModalBody>
            </>
          )}
        </ModalContent>
      </Modal>


    </>
  );
};

export default NewDocument;

