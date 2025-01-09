import React, { useEffect, useState } from 'react';
import MarkdownRenderer from './CodeBlock';
import { useSelector } from 'react-redux';
import { RootState } from '@/src/store/store';


interface TypingMessageProps {
  message: string;
}

const TypingMessage: React.FC<TypingMessageProps> = ({ message }) => {
  const [displayedText, setDisplayedText] = useState<string>('');
  const [index, setIndex] = useState<number>(0);
  const conversation = useSelector(
    (state: RootState) =>
      state.chat.conversations
  );

  useEffect(() => {
    if (index < message.length) {
      const timeout = setTimeout(() => {
        setDisplayedText((prev) => prev + message[index]);
        setIndex((prevIndex) => prevIndex + 1);
      }, 10); 

      return () => clearTimeout(timeout);
    }
  }, [index, message]);

  useEffect(() => {
    if (message.length > displayedText.length) {
      setIndex(displayedText.length); 
    }
  }, [message, displayedText]);

  return  <MarkdownRenderer content={displayedText}/>

};

export default TypingMessage;
