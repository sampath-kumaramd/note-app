"use client"
import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { tileStyles } from '@/styles/tileStyles';
import { TextTileContent } from '@/types/types';

interface TextTileProps {
  content: TextTileContent;
  onEdit: (newContent: TextTileContent) => void;
  isInitial?: boolean;
}

const TextTile: React.FC<TextTileProps> = ({ content, onEdit, isInitial = false }) => {
  return (
    <Card className={`${tileStyles.card} ${isInitial ? 'bg-blue-500 text-white' : ''}`}>
      <CardHeader className={tileStyles.header}>
        <CardTitle>Text Tile</CardTitle>
      </CardHeader>
      <CardContent className={tileStyles.content}>
        <Input 
          placeholder="Enter Title" 
          value={content.title || ''} 
          onChange={(e) => onEdit({ ...content, title: e.target.value })}
          className="mb-4 text-black"
        />
      </CardContent>
    </Card>
  );
};

export default TextTile;