import { FC, useState } from "react";
import { FileText, Link, Upload, X, Loader2, CheckCircle, Globe, Link2 } from 'lucide-react'
import { Modal, ModalContent, ModalHeader, ModalBody, ModalFooter, Button, Input, Progress, Tabs, Tab, Card, CardBody } from "@nextui-org/react";
import { Document } from "@/src/types/types";
import { uploadDocument, uploadUrlDocument } from "@/service/documentApi";
import checkmarkLoader from "@/public/svg/checkmarkLoader.json"
import dynamic from "next/dynamic";

interface NewDocumentProps {
  isOpen: boolean;
  onClose: () => void;
  documents: Document[];
  projectId: string;
  updateDocument: () => void;
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
  const maxFiles = 5; // Set the max limit for file uploads
  const [isMaxFile, setIsMaxFile] = useState<boolean>(false);
  const [url, setUrl] = useState('')
  const Lottie = dynamic(() => import("lottie-react"), { ssr: false });

  // Calculate the progress based on the number of files selected
  const progress = ((limit + selectedFiles.length) / maxFiles) * 100;

  // Handle file selection from input
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
      const data = await uploadUrlDocument(url, projectId as string)
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

  const handleFileUpload = async () => {
    if (!selectedFiles.length) {
      return;
    }

    setIsLoading(true);
    setIsSuccess(false);

    try {
      const data = await uploadDocument(projectId, selectedFiles);

      console.log(data);
      setLimit(limit + selectedFiles.length);
      setSelectedFiles([]);
      setIsLoading(false);
      setIsSuccess(true);
      updateDocument();
      setTimeout(() => {
        setIsSuccess(false);
      }, 2000);
    } catch (error) {
      console.error("Error uploading file:", error);
      setIsLoading(false);
    }
  };

  const handleUrlSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    handleUrlUpload(url)
  }

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
                        />
                        <label htmlFor="file-upload">
                          <Button 
                            onClick={() => document.getElementById("file-upload")?.click()}
                            className="mt-4"
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
                        >
                          <span className="text-sm text-zinc-600 dark:text-zinc-300">{file.name}</span>
                          <Button
                            size="sm"
                            isIconOnly
                            variant="light"
                            onClick={() => handleRemoveFile(index)}
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
                      />
                      <Button type="submit" isDisabled={!url || isLoading}>
                        {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Globe className="h-4 w-4" />}
                      </Button>
                    </div>
                  </form>
                </Tab>
              </Tabs>

              <div className="mt-6 space-y-4">
                <h3 className="text-sm font-medium text-zinc-600 dark:text-zinc-300">Định dạng tài liệu được hỗ trợ</h3>
                <div className="grid grid-cols-3 gap-4">
                  {[
                    { icon: FileText, label: "PDF" },
                    { icon: Link2, label: "URL" },
                    { icon: FileText, label: "DOCS" },
                  ].map((item, index) => (
                    <Card key={index}>
                      <CardBody className="flex flex-col items-center justify-center p-4">
                        <item.icon className="h-8 w-8 text-zinc-500 dark:text-zinc-400 mb-2" />
                        <span className="text-xs font-medium text-zinc-600 dark:text-zinc-300">{item.label}</span>
                      </CardBody>
                    </Card>
                  ))}
                </div>
              </div>

              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <label className="text-sm font-medium text-zinc-600 dark:text-zinc-300">
                    Giới hạn tài liệu
                  </label>
                  <span className={`text-sm font-medium ${isMaxFile ? "text-red-500" : "text-zinc-500 dark:text-zinc-400"}`}>
                    {limit + selectedFiles.length}/{maxFiles}
                  </span>
                </div>
                <Progress value={progress} className="h-2 mb-5" />
              </div>
            </ModalBody>
          </>
        )}
      </ModalContent>
    </Modal>
  );
};

export default NewDocument;

