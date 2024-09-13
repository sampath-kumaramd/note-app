"use client";

import React, { useRef, useState, KeyboardEvent } from 'react';

import { Card, CardContent } from "@/components/ui/card"
import { tileStyles } from '@/styles/tileStyles';
import { FormTileContent } from '@/types/types';

interface FormTileProps {
  content: FormTileContent;
  onEdit: (newContent: FormTileContent) => void;
  isInitial?: boolean;
}

const FormTile: React.FC<FormTileProps> = ({ content, onEdit, isInitial = false }) => {
  const [isEditing, setIsEditing] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);

  const handleFocus = () => {
    setIsEditing(true);
    if (titleRef.current && titleRef.current.textContent === 'Add a title for your form') {
      titleRef.current.textContent = '';
    }
  };

  const handleBlur = () => {
    setIsEditing(false);
    if (titleRef.current) {
      const newTitle = titleRef.current.textContent || '';
      if (newTitle.trim() === '') {
        titleRef.current.textContent = 'Add a title for your form';
      } else {
        onEdit({ ...content, title: newTitle });
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      titleRef.current?.blur();
    }
  };

  return (
    <Card className={`${tileStyles.card} ${isInitial ? 'bg-blue-500 text-white' : ''}`}>
      <CardContent className="flex items-center justify-center h-full">
        <div
          ref={titleRef}
          role="textbox"
          aria-multiline="false"
          tabIndex={0}
          contentEditable={true}
          onFocus={handleFocus}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`text-center text-2xl font-semibold p-4 cursor-text outline-none ${
            isEditing ? 'text-blue-600' : ''
          } ${isInitial ? 'text-white' : 'text-black'} ${
            !content.title && !isEditing ? 'text-gray-400' : ''
          }`}
        >
          {content.title || 'Add a title for your form'}
        </div>
      </CardContent>
    </Card>
  );
};

export default FormTile;