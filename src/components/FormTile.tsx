"use client";

import React, { useRef, useState, KeyboardEvent } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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

  return (
    <Card className={`${tileStyles.card} ${isInitial ? 'bg-blue-500 text-white' : ''}`}>
      <CardHeader>
        <CardTitle>Form Tile</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          ref={titleRef}
          role="textbox"
          aria-multiline="false"
          tabIndex={0}
          contentEditable={true}
          onFocus={() => setIsEditing(true)}
          onBlur={handleBlur}
          onKeyDown={handleKeyDown}
          className={`mb-4 p-2 cursor-text outline-none ${isEditing ? 'text-blue-600' : ''} ${isInitial ? 'text-white' : 'text-black'}`}
        >
          {content.title || 'Enter Form Title'}
        </div>
      </CardContent>
    </Card>
  );
};

export default FormTile;