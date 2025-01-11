import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Card, CardHeader, CardBody, Link, Button, Tooltip } from "@nextui-org/react";
import { useDispatch } from 'react-redux';
import { setOutlineContent } from "@/src/store/outlineSlice";

interface ContentItem {
  title: string;
  href: string;
  body: string;
}

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  const parseStringToContentItems = (input: string): ContentItem[] | null => {
    try {
      const parsed = JSON.parse(input);
      if (Array.isArray(parsed) && parsed.every(item => 
        typeof item === 'object' && 'title' in item && 'href' in item && 'body' in item
      )) {
        return parsed as ContentItem[];
      }
    } catch (error) {
      // Xử lý lỗi nếu cần
    }
    return null;
  };
  
  const dispatch = useDispatch();

  const extractMindMapContent = (input: string): string => {
    const mindMapRegex = /<mindmap>([\s\S]*?)<\/mindmap>/;
    const match = input.match(mindMapRegex);
    if (!match) return input;

    // Extract content inside mindmap tags
    const mindMapContent = match[1].trim();
    
    // Extract content inside markdown code blocks if present
    const markdownRegex = /```markdown\s*([\s\S]*?)```/;
    const markdownMatch = mindMapContent.match(markdownRegex);
    
    return markdownMatch ? markdownMatch[1].trim() : mindMapContent;
  };

  const hasMindMap = (input: string): boolean => {
    return /<mindmap>[\s\S]*?<\/mindmap>/.test(input);
  };

  const transformCite = (input: string): React.ReactNode[] => {
    const citeRegex = /<cite><f>(.*?)<\/f><c>(.*?)<\/c><\/cite>/g;

    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    let index = 0;

    while ((match = citeRegex.exec(input)) !== null) {
      const beforeText = input.slice(lastIndex, match.index);
      const doc = match[1];
      const chunk = match[2];

      // Thêm phần văn bản trước cite vào mảng elements
      if (beforeText) {
        elements.push(renderMarkdown(beforeText));
      }

      // Thêm phần tử thay thế cho cite
      elements.push(
        <Tooltip key={`cite-${index}`} content={`Doc: ${doc}, Chunk: ${chunk}`} placement="top">
          <span
            className="inline-flex items-center justify-center w-6 h-6 p-0 text-sm font-semibold rounded-full cursor-pointer mx-1 
              bg-slate-400 text-white 
              dark:bg-zinc-700 dark:text-white 
              hover:bg-slate-600 dark:hover:bg-zinc-600"
          >
            {index + 1}
          </span>
        </Tooltip>

      );

      index += 1;
      lastIndex = citeRegex.lastIndex;
    }

    // Thêm phần văn bản còn lại vào mảng elements
    if (lastIndex < input.length) {
      elements.push(renderMarkdown(input.slice(lastIndex)));
    }

    return elements;
  };

  const renderMarkdown = (text: string) => {
    return (
      <ReactMarkdown
        components={{
          // Override thẻ <p> thành <span>
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
  };

  const contentItems = parseStringToContentItems(content);
  const isMindMap = hasMindMap(content);
  const processedContent = isMindMap ? extractMindMapContent(content) : content;

  const handleUpdateOutline = () => {
    dispatch(setOutlineContent(processedContent));
  };

  if (contentItems) {
    return (
      <div className="markdown-container space-y-4">
        {contentItems.map((item, index) => (
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
              {renderMarkdown(item.body)}
            </CardBody>
          </Card>
        ))}
      </div>
    );
  } else {
    const processedCites = transformCite(processedContent);
    return (
      <div className="relative w-full">
        <div>
          {processedCites}
        </div>
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
  }
};

export default MarkdownRenderer;