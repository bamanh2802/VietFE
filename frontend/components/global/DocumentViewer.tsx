import { useEffect, useState } from "react";
import { Tabs, Tab } from "@nextui-org/tabs";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Document, Chunk } from "@/src/types/types";
import { getChunkDocument } from "@/service/documentApi";
import PDFViewer from "@/components/global/PDFViewer";
import { getDocumentUrl } from "@/service/documentApi";
import { DocumentSkeleton } from "../project/document/DocumentSkeleton";

interface DocumentProps {
  document: Document;
  isOpen: boolean;
  onClose: () => void;
}

const DocumentViewer: React.FC<DocumentProps> = ({
  document,
  isOpen,
  onClose,
}) => {
  const [selectedTab, setSelectedTab] = useState<string>("raw");
  const [url, setUrl] = useState<string>('')
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetUrlDocument = async () => {
    try {
      const data = await getDocumentUrl(document?.document_id)
      setUrl(data.data)
    } catch (e){
      console.log(e)
    }
  }

  const handleGetChunkDocument = async () => {
    if (!document?.document_id) return; 
    setLoading(true); 
    setError(null); 

    try {
      const data = await getChunkDocument(document.document_id);
      setChunks(data.data);
    } catch (e) {
      console.error(e);
      setError("Failed to load document chunks."); 
    } finally {
      setLoading(false); 
    }
  };

  useEffect(() => {
    if(document && document?.document_id) {
      handleGetChunkDocument();
      handleGetUrlDocument()
    }
  }, [document?.document_id]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="block w-5/6 max-w-6xl h-5/6 p-4 dark:bg-zinc-900 bg-zinc-50">
        <DialogHeader>
          <DialogTitle>{document?.document_name || "Document Viewer"}</DialogTitle>
        </DialogHeader>

        {loading && <p>Loading...</p>} {/* Thông báo tải */}
        {error && <p className="text-red-500">{error}</p>} {/* Thông báo lỗi */}

        <Tabs
          aria-label="Document Tabs"
          className="mt-4"
          selectedKey={selectedTab}
          variant="underlined"
          onSelectionChange={(key) => setSelectedTab(key as string)}
        >
          <Tab key="raw" title="Raw">
            <div className="p-4 h-full">
              <div className="border-none h-full">
              {
                  document?.type === 'pdf' && url !== '' &&  (
                    <PDFViewer fileUrl={url} fileType="pdf" isDocument={false}/> 

                  )
                }
                {
                  document?.type === 'doc' || document?.type === 'docx' && url !== '' && (
                    <PDFViewer fileUrl={url} fileType="docx" isDocument={false}/> 

                  )
                }
                {
                  (!!document || url === '') && (
                    <DocumentSkeleton />
                  )
                }
              </div>
            </div>
          </Tab>
          <Tab key="chunks" title="Chunks" className="h-full">
            <div className="p-4 h-[90%] overflow-auto">
              <h3 className="text-lg font-semibold">Document Chunks</h3>
              {chunks.length > 0 ? (
                <ul>
                  {chunks.map((chunk: Chunk, index: number) => (
                    <li key={index} className="mb-2">
                      <span className="font-bold">Chunk {index + 1}: </span>
                      {chunk.content}
                    </li>
                  ))}
                </ul>
              ) : (
                <p>No chunks available</p>
              )}
            </div>
          </Tab>
          <Tab key="image" title="Image">
            <div className="p-4">
              <h3 className="text-lg font-semibold">Document Image</h3>
            
            </div>
          </Tab>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewer;
