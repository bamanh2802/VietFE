import React from "react";
import ReactMarkdown from "react-markdown";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { oneDark } from "react-syntax-highlighter/dist/esm/styles/prism";
import { Button } from "@nextui-org/react";

interface MarkdownRendererProps {
  content: string;
}

const MarkdownRenderer: React.FC<MarkdownRendererProps> = ({ content }) => {
  // Tách các <cite> ra khỏi nội dung và lưu trữ thông tin
  const transformCite = (input: string) => {
    const citeRegex = /<cite><f>(.*?)<\/f><c>(.*?)<\/c><\/cite>/g;

    const elements: React.ReactNode[] = [];
    let lastIndex = 0;
    let match;
    let index = 0;

    // Xử lý từng phần tử được match
    while ((match = citeRegex.exec(input)) !== null) {
      const beforeText = input.slice(lastIndex, match.index);
      const doc = match[1];
      const chunk = match[2];

      // Thêm nội dung trước thẻ <cite>
      if (beforeText) {
        elements.push(
          <span key={`text-${index}`} style={{ display: "inline" }}>
            {beforeText}
          </span>
        );
      }

      // Thêm nút button
      elements.push(
        <Button
          key={index++}
          radius="full"
          isIconOnly
          size="sm"
          className="inline-block mx-1 p-1 text-xs"
          onClick={() => alert(`Doc: ${doc}, Chunk: ${chunk}`)}
          style={{ display: "inline-block" }}
        >
          {index}
        </Button>
      );

      lastIndex = citeRegex.lastIndex;
    }

    // Thêm phần nội dung sau thẻ cuối cùng
    if (lastIndex < input.length) {
      elements.push(
        <span key={`text-end`} style={{ display: "inline" }}>
          {input.slice(lastIndex)}
        </span>
      );
    }

    return elements;
  };

  const processedContent = transformCite(content);

  return (
    <div
      className="markdown-container flex flex-wrap items-center"
      style={{ display: "inline-flex", flexWrap: "wrap", alignItems: "center" }}
    >
      {processedContent.map((part, idx) =>
        typeof part === "string" ? (
          <ReactMarkdown
            key={idx}
            components={{
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
                    {String(children).trimEnd()}
                  </SyntaxHighlighter>
                ) : (
                  <code className={className} {...props}>
                    {children}
                  </code>
                );
              },
            }}
          >
            {part}
          </ReactMarkdown>
        ) : (
          part
        )
      )}
    </div>
  );
};

export default MarkdownRenderer;