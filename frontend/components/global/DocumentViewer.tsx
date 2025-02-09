"use client"

import { useEffect, useState, useCallback } from "react"
import { Tabs, Tab } from "@nextui-org/react"
import type { Document, Chunk } from "@/src/types/types"
import { getChunkDocument, getDocumentUrl } from "@/service/documentApi"
import PDFViewer from "@/components/global/PDFViewer"
import { DocumentSkeleton } from "../project/document/DocumentSkeleton"
import { X } from "lucide-react"

interface DocumentProps {
  document: Document
  isOpen: boolean
  onClose: () => void
}

const DocumentViewer: React.FC<DocumentProps> = ({ document, isOpen, onClose }) => {
  const [selectedTab, setSelectedTab] = useState<string>("raw")
  const [url, setUrl] = useState<string>("")
  const [chunks, setChunks] = useState<Chunk[]>([])
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const handleGetUrlDocument = useCallback(async () => {
    if (!document?.document_id) return
    try {
      const data = await getDocumentUrl(document.document_id)
      setUrl(data.data)
    } catch (e) {
      console.error("Error fetching document URL:", e)
      setError("Failed to load document URL.")
    }
  }, [document?.document_id])

  const handleGetChunkDocument = useCallback(async () => {
    if (!document?.document_id) return
    setLoading(true)
    setError(null)

    try {
      const data = await getChunkDocument(document.document_id)
      setChunks(data.data)
    } catch (e) {
      console.error("Error fetching document chunks:", e)
      setError("Failed to load document chunks.")
    } finally {
      setLoading(false)
    }
  }, [document?.document_id])

  useEffect(() => {
    if (isOpen && document?.document_id) {
      handleGetUrlDocument()
      handleGetChunkDocument()
    }

    // Cleanup function
    return () => {
      if (!isOpen) {
        setUrl("")
        setChunks([])
        setError(null)
        setSelectedTab("raw")
      }
    }
  }, [isOpen, document?.document_id, handleGetUrlDocument, handleGetChunkDocument])

  const renderContent = () => {
    switch (selectedTab) {
      case "raw":
        return (
          <div className="h-full">
            {url ? (
              document?.type === "pdf" ? (
                <PDFViewer fileUrl={url} fileType="pdf" isDocument={false} />
              ) : ["doc", "docx"].includes(document?.type || "") ? (
                <PDFViewer fileUrl={url} fileType="docx" isDocument={false} />
              ) : (
                <p className="text-center">Unsupported document type</p>
              )
            ) : (
              <DocumentSkeleton />
            )}
          </div>
        )
      case "chunks":
        return (
          <div className="h-full overflow-auto">
            <h3 className="text-lg font-semibold mb-4">Document Chunks</h3>
            {chunks.length > 0 ? (
              <ul className="space-y-4">
                {chunks.map((chunk: Chunk, index: number) => (
                  <li key={index} className="p-4 rounded-lg bg-gray-100 dark:bg-gray-800">
                    <span className="font-medium text-blue-600 dark:text-blue-400">Chunk {index + 1}</span>
                    <p className="mt-2">{chunk.content}</p>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-center text-gray-500">No chunks available for this document</p>
            )}
          </div>
        )
      case "image":
        return (
          <div className="h-full">
            <h3 className="text-lg font-semibold mb-4">Document Image</h3>
            <p className="text-center text-gray-500">Image preview not available</p>
          </div>
        )
      default:
        return null
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white dark:bg-gray-800 w-11/12 max-w-6xl h-5/6 rounded-lg shadow-xl overflow-hidden">
        <div className="flex flex-col h-full">
          <div className="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
            <h2 className="text-xl font-semibold">{document?.document_name || "Document Viewer"}</h2>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
            >
              <X size={24} />
            </button>
          </div>

          <div className="flex-grow overflow-hidden p-4">
            {loading && <p className="text-center">Loading...</p>}
            {error && <p className="text-center text-red-500">{error}</p>}

            <Tabs
              aria-label="Document viewing options"
              selectedKey={selectedTab}
              onSelectionChange={(key) => setSelectedTab(key as string)}
              variant="underlined"
              classNames={{
                tabList: "gap-6 w-full relative rounded-none p-0 border-b border-gray-200 dark:border-gray-700",
                cursor: "w-full bg-blue-500",
                tab: "max-w-fit px-0 h-12",
                tabContent: "group-data-[selected=true]:text-blue-500",
              }}
            >
              <Tab key="raw" title="Raw View" />
              <Tab key="chunks" title="Chunks View" />
              <Tab key="image" title="Image View" />
            </Tabs>

            <div className="mt-4 h-[calc(100%-3rem)] overflow-auto">{renderContent()}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DocumentViewer

