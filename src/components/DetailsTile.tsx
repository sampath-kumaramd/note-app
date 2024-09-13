"use client";
import React, { useRef, useState, KeyboardEvent, useEffect } from 'react';

import { Card, CardContent } from "@/components/ui/card"
import { tileStyles } from '@/styles/tileStyles';
import { DetailsTileContent } from '@/types/types';

import Toolbar from './Toolbar';

interface DetailsTileProps {
  content: DetailsTileContent;
  onEdit: (newContent: DetailsTileContent) => void;
  isInitial?: boolean;
}

const DetailsTile: React.FC<DetailsTileProps> = ({ content, onEdit, isInitial = false }) => {
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [isEditingDescription, setIsEditingDescription] = useState(false);
  const [activeElement, setActiveElement] = useState<'title' | 'description' | null>(null);
  const titleRef = useRef<HTMLDivElement>(null);
  const descriptionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (titleRef.current) {
      titleRef.current.innerHTML = content.title || 'Add a title for your course details';
    }
    if (descriptionRef.current) {
      descriptionRef.current.innerHTML = content.description || 'Add a description for your course';
    }
  }, [content.title, content.description]);

  const handleFocus = (field: 'title' | 'description') => {
    setActiveElement(field);
    if (field === 'title') {
      setIsEditingTitle(true);
      if (titleRef.current && titleRef.current.textContent === 'Add a title for your course details') {
        titleRef.current.textContent = '';
      }
    } else {
      setIsEditingDescription(true);
      if (descriptionRef.current && descriptionRef.current.textContent === 'Add a description for your course') {
        descriptionRef.current.textContent = '';
      }
    }
  };

  const handleBlur = (field: 'title' | 'description') => {
    setActiveElement(null);
    if (field === 'title') {
      setIsEditingTitle(false);
      if (titleRef.current) {
        const newTitle = titleRef.current.innerHTML;
        if (newTitle.trim() === '') {
          titleRef.current.textContent = 'Add a title for your course details';
        } else {
          onEdit({ ...content, title: newTitle });
        }
      }
    } else {
      setIsEditingDescription(false);
      if (descriptionRef.current) {
        const newDescription = descriptionRef.current.innerHTML;
        if (newDescription.trim() === '') {
          descriptionRef.current.textContent = 'Add a description for your course';
        } else {
          onEdit({ ...content, description: newDescription });
        }
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

  const applyFormatting = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (activeElement === 'title' && titleRef.current) {
      onEdit({ ...content, title: titleRef.current.innerHTML });
    } else if (activeElement === 'description' && descriptionRef.current) {
      onEdit({ ...content, description: descriptionRef.current.innerHTML });
    }
  };

  const applyAlign = (align: 'left' | 'center' | 'right') => {
    const activeRef = activeElement === 'title' ? titleRef : descriptionRef;
    if (activeRef.current) {
      activeRef.current.style.textAlign = align;
      if (activeElement === 'title') {
        onEdit({ ...content, title: titleRef.current!.innerHTML });
      } else if (activeElement === 'description') {
        onEdit({ ...content, description: descriptionRef.current!.innerHTML });
      }
    }
  };

  const applyVerticalAlign = (align: 'top' | 'middle' | 'bottom') => {
    const activeRef = activeElement === 'title' ? titleRef : descriptionRef;
    if (activeRef.current) {
      activeRef.current.style.justifyContent = align === 'top' ? 'flex-start' : align === 'middle' ? 'center' : 'flex-end';
      if (activeElement === 'title') {
        onEdit({ ...content, title: titleRef.current!.innerHTML });
      } else if (activeElement === 'description') {
        onEdit({ ...content, description: descriptionRef.current!.innerHTML });
      }
    }
  };

  return (
    <Card className={`${tileStyles.card} ${isInitial ? 'bg-blue-500 text-white' : ''}`}>
      <CardContent className="flex flex-col items-center justify-between h-full">
        <div className="w-full h-full flex flex-col justify-center">
          <div
            ref={titleRef}
            role="textbox"
            aria-multiline="false"
            tabIndex={0}
            contentEditable={true}
            onFocus={() => handleFocus('title')}
            onBlur={() => handleBlur('title')}
            onKeyDown={(e) => handleKeyDown(e, 'title')}
            className={`w-full text-2xl font-semibold mb-4 p-2 cursor-text outline-none ${
              isEditingTitle ? 'text-blue-600' : ''
            } ${isInitial ? 'text-white' : 'text-black'} ${
              !content.title && !isEditingTitle ? 'text-gray-400' : ''
            }`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minHeight: '50px'
            }}
          />
          <div
            ref={descriptionRef}
            role="textbox"
            aria-multiline="true"
            tabIndex={0}
            contentEditable={true}
            onFocus={() => handleFocus('description')}
            onBlur={() => handleBlur('description')}
            onKeyDown={(e) => handleKeyDown(e, 'description')}
            className={`w-full p-2 cursor-text outline-none ${
              isEditingDescription ? 'text-blue-600' : ''
            } ${isInitial ? 'text-white' : 'text-black'} ${
              !content.description && !isEditingDescription ? 'text-gray-400' : ''
            }`}
            style={{
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'center',
              minHeight: '100px'
            }}
          />
        </div>
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

export default DetailsTile;