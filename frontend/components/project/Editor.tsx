import type { BlockNoteEditor, PartialBlock } from "@blocknote/core";
import React, { useEffect, useState } from "react";
import { BlockNoteView, useCreateBlockNote } from "@blocknote/react";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/react/style.css";

interface EditorProps {
  onChange: (content: any) => void;
  initialContent?: string;
  editable?: boolean;
  docId?: string; 
}

const Editor: React.FC<EditorProps> = ({
  onChange,
  initialContent,
  editable,
  docId,
}) => {
  const [isDarkmode, setIsDarkmode] = useState<string | null>(
    localStorage.getItem("dark-mode"),
  );

  // Lắng nghe thay đổi dark mode từ localStorage
  useEffect(() => {
    const handleStorageChange = (event: StorageEvent) => {
      if (event.key === "dark-mode") {
        setIsDarkmode(event.newValue);
      }
    };

    // Thêm sự kiện listener cho storage
    window.addEventListener("storage", handleStorageChange);

    // Cleanup listener khi component unmount
    return () => {
      window.removeEventListener("storage", handleStorageChange);
    };
  }, []);

  const editor: BlockNoteEditor | null = useCreateBlockNote({
    initialContent: initialContent
      ? (JSON.parse(initialContent) as PartialBlock[])
      : undefined,
  });

  if (!editor) {
    return <div>Loading editor...</div>; 
  }

  return (
    <BlockNoteView
      editable={editable}
      editor={editor}
      theme={isDarkmode === "true" ? "dark" : "light"}
      onChange={() => {
        onChange(editor);
      }}
    />
  );
};

export default Editor;