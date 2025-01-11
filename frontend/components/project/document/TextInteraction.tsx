"use client"
import { useState, useEffect, useRef } from "react";
import { Listbox, ListboxItem, Spinner } from "@nextui-org/react";
import {
  Square2StackIcon,
  QuestionMarkCircleIcon,
  ClipboardDocumentCheckIcon,
  ListBulletIcon,
  PaperClipIcon,
  LanguageIcon
} from "@heroicons/react/24/outline";
import { Tabs, Tab } from "@nextui-org/react";
import { useRouter } from "next/navigation";
import { Textarea } from "@nextui-org/react";
import "@cyntler/react-doc-viewer/dist/index.css";
import 'pdfjs-dist/build/pdf.worker.entry';
import { getChunkDocument, keywordSearchChunks, getDocumentById } from "@/service/documentApi";
import { Chunk } from "@/src/types/types";
import { ListboxWrapper } from "@/components/ListboxWrapper";
import PDFViewer from "@/components/global/PDFViewer";
import WebsiteViewer from "@/components/global/WebsiteViewer";
import { TranslationPopup } from "@/components/global/Translate";
import { getDocumentUrl } from "@/service/documentApi";
import { DocumentSkeleton } from "./DocumentSkeleton";
import { useTranslations } from 'next-intl';
interface DropdownPosition {
  x: number;
  y: number;
}

interface TextInteractionProps{
    params: { project_id: string, document_id: string };
    handleActionDocument: (option: string, selection: string) => void
}

const TextInteraction: React.FC<TextInteractionProps> = ({handleActionDocument, params}) => {
  const [selection, setSelection] = useState<string | null>(null);
  const [showPopup, setShowPopup] = useState(false)
  const [showDropdown, setShowDropdown] = useState<boolean>(false);
  const [dropdownPosition, setDropdownPosition] = useState<DropdownPosition>({
    x: 0,
    y: 0,
  });
  const textRef = useRef<HTMLDivElement | null>(null);
  const dropdownRef = useRef<HTMLDivElement | null>(null);
  const router = useRouter();
  const { project_id, document_id } = params

  const d = useTranslations('Document');
  const g = useTranslations('Global');
  const [chunks, setChunks] = useState<Chunk[]>([]);
  const [originalChunks, setOriginalChunks] = useState<Chunk[]>([]); // Store the initial full chunk data
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [isSearching, setIsSearching] = useState<boolean>(false);
  const [contentTranslate, setContentTranslate] = useState<string>('')
  const [type, setType] = useState<string>('')
  const [url, setUrl] = useState<string>('')
  const handleGetChunkDocument = async () => {
    try {
      const data = await getChunkDocument(document_id as string);
      const sortedChunks = data.data.sort(
        (a: any, b: any) => a.order_in_ref - b.order_in_ref,
      );

      setChunks(sortedChunks);
      setOriginalChunks(sortedChunks); // Store the original full chunk data
    } catch (e) {
      console.log(e);
    }
  };
  const handleGetUrlDocument = async () => {
    try {
      const data = await getDocumentUrl(document_id as string)
      setUrl(data.data)
    } catch (e){
      console.log(e)
    }
  }
  const handleGetDocumentById = async () => {
    try {
      const data = await getDocumentById(document_id as string) 
      setType(data.data.type)
    } catch (e) {
      console.log(e)
    }
  }
  useEffect(() => {
    if (document_id !== undefined) {
      handleGetChunkDocument();
      handleGetUrlDocument()
      handleGetDocumentById()
    }
  }, [document_id]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchTerm) {
        setIsSearching(true);
        try {
          const result = await keywordSearchChunks(
            document_id as string,
            searchTerm,
          );

          setChunks(result.data); 
        } catch (error) {
          console.error("Error fetching chunks:", error);
        } finally {
          setIsSearching(false);
        }
      } else {
        // If search term is empty, restore the original chunks
        setChunks(originalChunks);
      }
    }, 1000); // 1-second delay

    return () => clearTimeout(delayDebounceFn);
  }, [searchTerm, originalChunks]);

  useEffect(() => {
    const handleContextMenu = (event: MouseEvent) => {
      const selectedText = window.getSelection()?.toString();
      const range = window.getSelection()?.rangeCount
        ? window.getSelection()?.getRangeAt(0)
        : null;
      const selectionContainer = range?.commonAncestorContainer as Node;
      const isInTextRef = textRef.current?.contains(selectionContainer);

      if (
        selectedText &&
        range &&
        selectedText.trim().length > 0 &&
        isInTextRef &&
        event.button === 2
      ) {
        event.preventDefault();
        setSelection(selectedText);
        setContentTranslate(selectedText)
        setShowDropdown(true);
        const x = event.clientX;
        const y = event.clientY;

        setDropdownPosition({ x, y });
      } else {
        setSelection(null);
        setShowDropdown(false);
      }
    };

    document.addEventListener("contextmenu", handleContextMenu);

    return () => {
      document.removeEventListener("contextmenu", handleContextMenu);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowDropdown(false);
        setSelection(null);
        window.getSelection()?.removeAllRanges();
      }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleOptionClick = (option: string) => {
    handleActionDocument(option, selection as string)
    if(option === 'translate') {
      setShowPopup(true)

    }
    setShowDropdown(false);
    setSelection(null);
    window.getSelection()?.removeAllRanges();
  };

  return (
    <div className="h-full flex-1 bg-zinc-100 border-l-1 dark:bg-zinc-800">
      <Tabs aria-label="Raw" variant="underlined">
        <Tab key="raw" title={d('Raw')}>
          <div ref={textRef} className="p-4 rounded relative leading-relaxed">
          <div className="border-none h-[100%-100px]">
          {
            type === 'pdf' && url !== '' &&  (
              <PDFViewer fileUrl={url} fileType="pdf" isDocument={true}/> 

            )
          }
          {
            type === 'doc' || type === 'docx' && url !== '' && (
              <PDFViewer fileUrl={url} fileType="docx" isDocument={true}/> 

            )
          }
          {
            type === 'url' && url !== '' &&  (
          <WebsiteViewer websiteUrl={url}/> 

            )
          } 
          {
            (type === '' || url === '') && (
              <DocumentSkeleton />
            )
          }
          

          {/* <PDFViewer fileUrl="https://viet.mos.ap-southeast-2.sufybkt.com/viet/proj-e75a98e2-9118-4480-9da4-5ea884f374e3%5Capplsci-14-05873.pdf?response-content-disposition=attachment%3B%20filename%3D%22proj-e75a98e2-9118-4480-9da4-5ea884f374e3%5Capplsci-14-05873.pdf%22&X-Amz-Algorithm=AWS4-HMAC-SHA256&X-Amz-Credential=7LlOgEmWdDT_nDaLkN_sUfDL9M7UHVhbd_JSYjQ1%2F20241210%2Fap-southeast-1%2Fs3%2Faws4_request&X-Amz-Date=20241210T143628Z&X-Amz-Expires=3600&X-Amz-SignedHeaders=host&X-Amz-Signature=f72ad3bc78faac47da6161de8170dbec6f4a694939b8d56d062400c222b6d11a" fileType="pdf" />  */}
            </div>
          </div>
        </Tab>

        <Tab key="chunks" title={d('Chunks')}>
          <div className="p-4 h-[calc(100vh-128px)] overflow-hidden relative">
            <Textarea
              className="max-w-none border-1 rounded-xl absolute top-0 left-0 w-full z-10"
              label="Search Chunks"
              maxRows={3}
              minRows={1}
              placeholder="Enter your query..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />

            <div className="mt-16 h-[calc(100%-64px)] overflow-auto">
              <h3 className="text-lg font-semibold">Document Chunks</h3>
              {isSearching ? (
                <div className="flex items-center justify-center h-32">
                  <Spinner color="primary" size="lg" />
                </div>
              ) : chunks.length > 0 ? (
                <ul className="overflow-auto">
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
          </div>
        </Tab>
      </Tabs>

      {showDropdown && (
        <div
          ref={dropdownRef}
          className=" dark:bg-zinc-800 bg-zinc-200 shadow-md absolute z-50 opacity-100 transition-opacity duration-300 ease-out rounded-md "
          style={{ top: dropdownPosition.y, left: dropdownPosition.x }}
        >
          {selection ? (
            <ListboxWrapper>
              <Listbox
              className="p-0 "
                aria-label="Actions"
                onAction={(key) => handleOptionClick(key as string)}
              >
                <ListboxItem textValue="copy" key="copy">
                  <div className="flex items-center">
                    <Square2StackIcon className="pr-1 w-5 h-5" /> {g('Copy')}
                  </div>
                </ListboxItem>
                <ListboxItem textValue="copy" key="explain">
                  <div className="flex items-center">
                    <QuestionMarkCircleIcon className="pr-1 w-5 h-5" /> {g('Explain')}
                  </div>
                </ListboxItem>
                <ListboxItem textValue="copy" key="addNote">
                  <div className="flex items-center">
                    <ClipboardDocumentCheckIcon className="pr-1 w-5 h-5" />{g('AddToNote')} 
                  </div>
                </ListboxItem>
                <ListboxItem textValue="copy" key="quote">
                  <div className="flex items-center">
                    <PaperClipIcon className="pr-1 w-5 h-5" /> {g('Quote')}
                  </div>
                </ListboxItem>
                <ListboxItem textValue="copy" key="translate">
                  <div className="flex items-center">
                    <LanguageIcon className="pr-1 w-5 h-5" /> {g('Translate')} 
                  </div>
                </ListboxItem>
              </Listbox>
            </ListboxWrapper>
          ) : (
            <ListboxWrapper>
              <Listbox
                aria-label="Actions"
                onAction={() => handleOptionClick("Tóm tắt")}
              >
                <ListboxItem textValue="copy" key="summarize">Tóm tắt</ListboxItem>
              </Listbox>
            </ListboxWrapper>
          )}
        </div>
      )}
      {showPopup && (
        <TranslationPopup 
          text={contentTranslate as string} 
          onClose={() => setShowPopup(false)}
          onSaveNote={() => {}}
          position={dropdownPosition}
        />
      )}
    </div>
  );
};

export default TextInteraction;
