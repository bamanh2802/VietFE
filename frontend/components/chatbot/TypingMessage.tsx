import React, { useEffect, useState, useCallback } from 'react';
import MarkdownRenderer from './CodeBlock';
import { Document, ChunksState } from "@/src/types/types";

interface TypingMessageProps {
  message: string;
  documents: Document[];
  chunksState: ChunksState;
  isDocument: boolean
}


const TypingMessage = React.memo(({ message, documents, chunksState, isDocument }: TypingMessageProps) => {
  const [displayedText, setDisplayedText] = useState('');
  const animateText = useCallback(() => {
    if (displayedText.length < message.length) {
      const timeout = setTimeout(() => {
        setDisplayedText(message.slice(0, displayedText.length + 1));
      }, 1);

      return () => clearTimeout(timeout);
    }
  }, [message, displayedText]);

  useEffect(() => {
    animateText();
  }, [animateText]);

  // Reset displayedText when message changes completely
  useEffect(() => {
    if (!message.startsWith(displayedText)) {
      setDisplayedText('');
    }
  }, [message, displayedText]);

  return <MarkdownRenderer content={displayedText} documents={documents} chunksState={chunksState} isDocument={isDocument}/>;
});

TypingMessage.displayName = 'TypingMessage';

export default TypingMessage;