import { useEffect, useState } from "react";
import { Tabs, Tab } from "@nextui-org/react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
const Viewer = dynamic(() => import('@react-pdf-viewer/core').then(mod => mod.Viewer), { ssr: false });
const Worker = dynamic(() => import('@react-pdf-viewer/core').then(mod => mod.Worker), { ssr: false });
import "@react-pdf-viewer/core/lib/styles/index.css";
import { defaultLayoutPlugin } from "@react-pdf-viewer/default-layout";
import "@react-pdf-viewer/default-layout/lib/styles/index.css";
import { Document, Chunk } from "@/src/types/types";
import { getChunkDocument } from "@/service/documentApi";

import dynamic from 'next/dynamic';interface DocumentProps {
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
  const defaultLayoutPluginInstance = defaultLayoutPlugin();
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const handleGetChunkDocument = async () => {
    if (!document?.document_id) return; // Kiểm tra document_id
    setLoading(true); // Bắt đầu tải dữ liệu
    setError(null); // Reset lỗi

    try {
      const data = await getChunkDocument(document.document_id);
      setChunks(data.data);
    } catch (e) {
      console.error(e);
      setError("Failed to load document chunks."); // Thông báo lỗi
    } finally {
      setLoading(false); // Kết thúc tải dữ liệu
    }
  };

  useEffect(() => {
    handleGetChunkDocument();
  }, [document?.document_id]); // Gọi hàm khi document_id thay đổi

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
              <h3 className="text-lg font-semibold">Raw PDF Content</h3>
              <div className="border border-gray-300 h-full">
                <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                  <Viewer fileUrl={document?.document_path} />
                </Worker>
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
