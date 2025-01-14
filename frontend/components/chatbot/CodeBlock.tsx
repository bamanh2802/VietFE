import React, { useCallback, useMemo } from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Card, 
  CardHeader, 
  CardBody, 
  Link, 
  Button, 
  Tooltip, 
  CardFooter, 
  Popover, 
  PopoverTrigger, 
  PopoverContent 
} from "@nextui-org/react";
import { useDispatch, useSelector } from 'react-redux';
import { setOutlineContent } from "@/src/store/outlineSlice";
import { RootState } from "@/src/store/store";
import { Document, ChunksState } from "@/src/types/types";
import { FileIcon } from "lucide-react";
import { ChevronDoubleRightIcon, ArrowUpOnSquareIcon } from "@heroicons/react/24/outline";
import {Table, TableHeader, TableColumn, TableBody, TableRow, TableCell} from "@nextui-org/react";
import { openDocumentViewer, closeDocumentViewer } from "@/src/store/uiSlice";
import { setDocument } from "@/src/store/documentViewSlice";


const MarkdownRenderer = React.memo(({ content, documents, chunksState, isDocument }: {
  content: string;
  documents: Document[];
  chunksState: ChunksState;
  isDocument: boolean
}) => {
  const dispatch = useDispatch();
  const isDocumentViewerOpen = useSelector((state: RootState) => state.ui.isDocumentViewerOpen)
  const toggleFileViewer = (documentId: string) => {
    if (isDocumentViewerOpen) {
      dispatch(closeDocumentViewer())
    } else {
      dispatch(openDocumentViewer())
    }
    dispatch(setDocument(fintDocumentById(documentId) as Document))
  }
  const openDocument = () => {

  }

  const parseStringToContentItems = useCallback((input: string) => {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed) && parsed.every(item => 
        typeof item === 'object' && 'title' in item && 'href' in item && 'body' in item
      )) {
        return parsed;
      }
    } catch (error) {
      return null;
    }
    return null;
  }, []);

  const extractMindMapContent = useCallback((input: string): string => {
    const mindMapRegex = /<mindmap>([\s\S]*?)<\/mindmap>/;
    const match = input.match(mindMapRegex);
    if (!match) return input;

    const mindMapContent = match[1].trim();
    const markdownRegex = /```markdown\s*([\s\S]*?)```/;
    const markdownMatch = mindMapContent.match(markdownRegex);
    
    return markdownMatch ? markdownMatch[1].trim() : mindMapContent;
  }, []);

  const hasMindMap = useCallback((input: string): boolean => {
    return /<mindmap>[\s\S]*?<\/mindmap>/.test(input);
  }, []);

  const findDocumentNameById = useCallback((fileId: string): string => {
    return documents?.find((doc) => doc.document_id === fileId)?.document_name || '';
  }, [documents]);

  const fintDocumentById = useCallback((fileId: string): Document | undefined => {
    return documents?.find((doc) => doc.document_id === fileId)
  }, [documents]);

  const Citation = React.memo(({ citation, index, documentName, chunk }: any) => {
    const convertISOToDate = (isoString: string) => {
      return new Date(isoString).toLocaleDateString();
    };

    return (
      <Popover placement="bottom">
        <Tooltip content={documentName}>
          <span className="w-fit">
            <PopoverTrigger>
              <button className="inline-flex items-center justify-center w-6 h-6 p-0 text-sm font-semibold rounded-full cursor-pointer mx-1 bg-slate-400 text-white dark:bg-zinc-700 dark:text-white hover:bg-slate-600 dark:hover:bg-zinc-600">
                {index + 1}
              </button>
            </PopoverTrigger>
          </span>
        </Tooltip>
        <PopoverContent className="w-80 p-0">
          <Card className="w-80 max-w-[320px]">
            {documentName && (
              <CardHeader className="flex justify-between pt-5 items-center">
                <div className="flex gap-3">
                  <FileIcon size={24} />
                  <div className="flex flex-col">
                    <p className="text-md">{documentName}</p>
                  </div>
                </div>
                {
                  !isDocument ? (
                    <button className="" onClick={() => toggleFileViewer(citation.fileId)}>
                      <ChevronDoubleRightIcon className="w-5 h-5"/>
                    </button>
                  ) : (
                    <button className="" onClick={openDocument}>
                      <ArrowUpOnSquareIcon className="w-5 h-5"/>
                    </button>
                  )
                }
              </CardHeader>
            )}
            <CardBody className="relative pb-0">
              <div className="max-h-[260px] overflow-y-auto">
                {chunk?.content && <p className="text-sm">{chunk.content}</p>}
              </div>
            </CardBody>
            <CardFooter className="justify-end pb-2 pt-1 px-4">
              {chunk?.created_at && (
                <span className="text-xs text-default-400">
                  {convertISOToDate(chunk.created_at)}
                </span>
              )}
            </CardFooter>
          </Card>
        </PopoverContent>
      </Popover>
    );
  });


  Citation.displayName = "Citation";

  const transformCite = useCallback((input: string) => {
    const citeRegex = /<cite>(.*?)<\/cite>/g;
    const parseCitation = (citeContent: string) => {
      const chunkMatch = citeContent.match(/<c>(chunk-[^<]+)<\/c>/);
      const fileMatch = citeContent.match(/<f>(doc-[^<]+)<\/f>/);
      return {
        chunkId: chunkMatch ? chunkMatch[1] : undefined,
        fileId: fileMatch ? fileMatch[1] : undefined,
      };
    };

    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    let index = 0;

    while ((match = citeRegex.exec(input)) !== null) {
      const beforeText = input.slice(lastIndex, match.index);
      const citation = parseCitation(match[1]);
      
      if (beforeText) {
        elements.push(beforeText);
      }

      if (citation.fileId) {
        const chunkData = chunksState[citation.fileId];
        const chunk = chunkData?.find(chunk => chunk.chunk_id === citation.chunkId);
        const documentName = findDocumentNameById(citation.fileId);

        elements.push(
          <Citation 
            key={`cite-${index}`}
            citation={citation}
            index={index}
            documentName={documentName}
            chunk={chunk}
          />
        );
        index += 1;
      }
      lastIndex = citeRegex.lastIndex;
    }

    if (lastIndex < input.length) {
      elements.push(input.slice(lastIndex));
    }

    return elements;
  }, [chunksState, findDocumentNameById]);
  


  const MarkdownComponent = useMemo(() => {
    const Component = ({ text }: { text: string }) => (
      <ReactMarkdown
        components={{
          p: ({ node, ...props }) => <span {...props} />,
          code({ node, inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || "");
            return !inline && match ? (
              <SyntaxHighlighter
                PreTag="div"
                language={match[1]}
                style={oneDark}
                {...props}
                customStyle={{
                  maxWidth: "95%",
                  overflowX: "auto",
                }}
                wrapLongLines={true}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
        }}
      >
        {text}
      </ReactMarkdown>
    );
  
    Component.displayName = "MarkdownComponent"; 
  
    return Component;
  }, []);
  
  

  const extractContentWithOrder = (markdown: string) => {
    const parts: { type: 'text' | 'table'; content: string }[] = [];
    const tableRegex = /(\|.*\|.*\n)+/g;
    let lastIndex = 0;
  
    markdown.replace(tableRegex, (match, _, offset) => {
      if (lastIndex < offset) {
        parts.push({ type: 'text', content: markdown.slice(lastIndex, offset).trim() });
      }
  
      parts.push({ type: 'table', content: match.trim() });
  
      lastIndex = offset + match.length;
      return match;
    });
  
    if (lastIndex < markdown.length) {
      parts.push({ type: 'text', content: markdown.slice(lastIndex).trim() });
    }
  
    return parts;
  };
  const containsTable = (markdown: string): boolean => {
    const tableRegex = /(\|.*\|.*\n)+/; // Regex để kiểm tra bảng
    return tableRegex.test(markdown);
  };

  const contentParts  = extractContentWithOrder(content);
  const isTable = containsTable(content)
  const contentItems = useMemo(() => parseStringToContentItems(content), [content, parseStringToContentItems]);
  const isMindMap = useMemo(() => hasMindMap(content), [content, hasMindMap]);
  const processedContent = useMemo(() => 
    isMindMap ? extractMindMapContent(content) : content
  , [content, isMindMap, extractMindMapContent]);

  if(contentParts && isTable) {
    return (
      <div className="markdown-content">
        {contentParts.map((part, index) =>
          part.type === 'table' ? (
            <Table
            key={index}
            aria-label="Example table with markdown content"
            className="w-full my-4"
          >
            <TableHeader>
              {part.content
                .split("\n")[0]
                .split("|")
                .slice(1, -1) 
                .map((header, idx) => (
                  <TableColumn key={idx}>
                    <MarkdownComponent text={header.trim()} />
                  </TableColumn>
                ))}
            </TableHeader>
            <TableBody>
              {part.content
                .split("\n")
                .slice(2) 
                .map((row, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {row
                      .split("|")
                      .slice(1, -1) 
                      .map((cell, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <MarkdownComponent text={cell.trim()} />
                        </TableCell>
                      ))}
                  </TableRow>
                ))}
            </TableBody>
          </Table>
          ) : (
            <div key={index} className="my-4">
              {part.content
                .split('\n')
                .map((line, idx) => (
                  <div key={idx} className="my-2">
                    <MarkdownComponent text={line}/>
                  </div>
                ))}
            </div>
          )
        )}
      </div>
    );
  }

  if (contentItems) {
    return (
      <div className="markdown-container space-y-4">
        {contentItems.map((item: any, index: number) => (
          <Card key={index} className="w-full z-0">
            <CardHeader className="flex gap-3">
              <div className="flex flex-col">
                <span className="text-md">{item.title}</span>
                <Link href={item.href} size="sm" isExternal>
                  {item.href}
                </Link>
              </div>
            </CardHeader>
            <CardBody>
              <MarkdownComponent text={item.body} />
            </CardBody>
          </Card>
        ))}
      </div>
    );
  }
  

  const processedCites = transformCite(processedContent)

  return (
    <div className="relative w-full">
      <div>{processedCites}</div>
      {isMindMap && (
        <div className="sticky bottom-4 right-4 float-right">
          <Button
            size="sm"
            onClick={() => dispatch(setOutlineContent(processedContent))}
          >
            Open Mind Map
          </Button>
        </div>
      )}
    </div>
  );
});

MarkdownRenderer.displayName = 'MarkdownRenderer';

export default MarkdownRenderer;