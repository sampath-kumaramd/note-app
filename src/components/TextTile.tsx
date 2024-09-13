"use client"
import React, { useRef, useState, KeyboardEvent } from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { tileStyles } from '@/styles/tileStyles';
import { TextTileContent } from '@/types/types';

interface TextTileProps {
  content: TextTileContent;
  onEdit: (newContent: TextTileContent) => void;
  isInitial?: boolean;
}

const TextTile: React.FC<TextTileProps> = ({ content, onEdit,  isInitial = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);

  const handleBlur = () => {
    setIsEditing(false);
    if (titleRef.current) {
      onEdit({ ...content, title: titleRef.current.innerText });
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      titleRef.current?.blur();
    }
  };

  const handleFocus = () => {
    setIsEditing(true);
  };

  return (
    <Card className={`${tileStyles.card} ${isInitial ? 'bg-blue-500 text-white' : ''} relative`}>
      <CardHeader className={tileStyles.header}>
        <CardTitle>Text Tile</CardTitle>
      </CardHeader>
      <CardContent className={`${tileStyles.content} pb-12`}>
        <div
          ref={titleRef}
          role="textbox"
          aria-multiline="false"
          tabIndex={0}
          contentEditable={true}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`mb-4 p-2 cursor-text outline-none ${isEditing ? 'text-blue-600' : ''} ${isInitial ? 'text-white' : 'text-black'}`}
        >
          {content.title || 'Enter Title'}
        </div>
      </CardContent>
    </Card>
  );
};

export default TextTile;