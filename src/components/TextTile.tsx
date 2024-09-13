import React, { useRef, useState, KeyboardEvent, useEffect } from 'react';

import { Card, CardContent } from "@/components/ui/card"
import { tileStyles } from '@/styles/tileStyles';
import { TextTileContent } from '@/types/types';

import Toolbar from './Toolbar';

interface TextTileProps {
  content: TextTileContent;
  onEdit: (newContent: TextTileContent) => void;
  isInitial?: boolean;
}

const TextTile: React.FC<TextTileProps> = ({ content, onEdit, isInitial = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.innerHTML = content.title || 'Add a title for your course';
    }
  }, [content.title]);

  const handleFocus = () => {
    setIsEditing(true);
    if (titleRef.current && titleRef.current.textContent === 'Add a title for your course') {
      titleRef.current.textContent = '';
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (titleRef.current) {
      const newTitle = titleRef.current.innerHTML;
      if (newTitle.trim() === '') {
        titleRef.current.textContent = 'Add a title for your course';
      } else {
        onEdit({ ...content, title: newTitle });
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      titleRef.current?.blur();
    }
  };

  const applyFormatting = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (titleRef.current) {
      onEdit({ ...content, title: titleRef.current.innerHTML });
    }
  };

  const applyAlign = (align: 'left' | 'center' | 'right') => {
    if (titleRef.current) {
      titleRef.current.style.textAlign = align;
      onEdit({ ...content, title: titleRef.current.innerHTML });
    }
  };

  const applyVerticalAlign = (align: 'top' | 'middle' | 'bottom') => {
    if (titleRef.current) {
      titleRef.current.style.justifyContent = align === 'top' ? 'flex-start' : align === 'middle' ? 'center' : 'flex-end';
      onEdit({ ...content, title: titleRef.current.innerHTML });
    }
  };

  return (
    <Card className={`${tileStyles.card} ${isInitial ? 'bg-blue-500 text-white' : ''}`}>
      <CardContent className="flex flex-col items-center justify-between h-full">
        <div
          ref={titleRef}
          role="textbox"
          aria-multiline="true"
          tabIndex={0}
          contentEditable={true}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`w-full h-full p-4 cursor-text outline-none ${
            isEditing ? 'text-blue-600' : ''
          } ${isInitial ? 'text-white' : 'text-black'} ${
            !content.title && !isEditing ? 'text-gray-400' : ''
          }`}
          style={{
            minHeight: '200px',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center'
          }}
        />
        <Toolbar
          onBold={() => applyFormatting('bold')}
          onItalic={() => applyFormatting('italic')}
          onAlign={applyAlign}
          onVerticalAlign={applyVerticalAlign}
          onFontSize={(size) => applyFormatting('fontSize', size)}
        />
      </CardContent>
    </Card>
  );
};

export default TextTile;