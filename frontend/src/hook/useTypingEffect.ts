import { useState, useEffect } from 'react';

export function useTypingEffect(words: string[], typingSpeed: number = 150, deletingSpeed: number = 100, pauseTime: number = 1000) {
  const [currentWordIndex, setCurrentWordIndex] = useState(0);
  const [currentText, setCurrentText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let timeout: NodeJS.Timeout;

    if (isDeleting) {
      if (currentText === '') {
        setIsDeleting(false);
        setCurrentWordIndex((prevIndex) => (prevIndex + 1) % words.length);
        return;
      }

      timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText.slice(0, -1));
      }, deletingSpeed);
    } else {
      if (currentText === words[currentWordIndex]) {
        timeout = setTimeout(() => setIsDeleting(true), pauseTime);
        return;
      }

      timeout = setTimeout(() => {
        setCurrentText((prevText) => words[currentWordIndex].slice(0, prevText.length + 1));
      }, typingSpeed);
    }

    return () => clearTimeout(timeout);
  }, [currentText, isDeleting, currentWordIndex, words, typingSpeed, deletingSpeed, pauseTime]);

  return currentText;
}

