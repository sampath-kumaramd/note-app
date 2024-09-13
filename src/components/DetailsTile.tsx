"use client";
import React, { useRef, useState, KeyboardEvent } from 'react';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { tileStyles } from '@/styles/tileStyles';
import { DetailsTileContent } from '@/types/types';

interface DetailsTileProps {
  content: DetailsTileContent;
  onEdit: (newContent: DetailsTileContent) => void;
  isInitial?: boolean;
}

const DetailsTile: React.FC<DetailsTileProps> = ({ content, onEdit, isInitial = false }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const titleRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);

  const handleBlur = (field: 'title' | 'description') => {
    if (field === 'title') {
      setIsEditingTitle(false);
      if (titleRef.current) {
        onEdit({ ...content, title: titleRef.current.innerText });
      }
    } else {
      setIsEditingDescription(false);
      if (descriptionRef.current) {
        onEdit({ ...content, description: descriptionRef.current.innerText });
      }
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, field: 'title' | 'description') => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (field === 'title') {
        titleRef.current?.blur();
      } else {
        descriptionRef.current?.blur();
      }
    }
  };

  const handleFocus = (field: 'title' | 'description') => {
    if (field === 'title') {
      setIsEditingTitle(true);
    } else {
      setIsEditingDescription(true);
    }
  };

  return (
    <Card className={`${tileStyles.card} ${isInitial ? 'bg-blue-500 text-white' : ''}`}>
      <CardHeader>
        <CardTitle>Details Tile</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          ref={titleRef}
          role="textbox"
          aria-multiline="false"
          tabIndex={0}
          contentEditable={true}
          onFocus={() => handleFocus('title')}
          onBlur={() => handleBlur('title')}
          onKeyDown={(e) => handleKeyDown(e, 'title')}
          className={`mb-4 p-2 cursor-text outline-none ${isEditingTitle ? 'text-gray-600' : ''} ${isInitial ? 'text-white' : 'text-black'}`}
        >
          {content.title || 'Enter Title'}
        </div>
        <div
          ref={descriptionRef}
          role="textbox"
          aria-multiline="true"
          tabIndex={0}
          contentEditable={true}
          onFocus={() => handleFocus('description')}
          onBlur={() => handleBlur('description')}
          onKeyDown={(e) => handleKeyDown(e, 'description')}
          className={`p-2 min-h-[100px] cursor-text outline-none ${isEditingDescription ? 'text-gray-600' : ''} ${isInitial ? 'text-white' : 'text-black'}`}
        >
          {content.description || 'Enter Description'}
        </div>
      </CardContent>
    </Card>
  );
};

export default DetailsTile;