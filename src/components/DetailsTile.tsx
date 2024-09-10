"use client";
import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { tileStyles } from '@/styles/tileStyles';
import { DetailsTileContent } from '@/types/types';

interface DetailsTileProps {
  content: DetailsTileContent;
  onEdit: (newContent: DetailsTileContent) => void;
  isInitial?: boolean;
}

const DetailsTile: React.FC<DetailsTileProps> = ({ content, onEdit, isInitial = false }) => {
  return (
    <Card className={`${tileStyles.card}  ${isInitial ? 'bg-blue-500 text-white' : ''}`}>
      <CardHeader>
        <CardTitle>Details Tile</CardTitle>
      </CardHeader>
      <CardContent>
        <Input 
          placeholder="Enter Title" 
          value={content.title || ''} 
          onChange={(e) => onEdit({ ...content, title: e.target.value })}
          className="mb-4 text-black"
        />
        <Textarea 
          placeholder="Description..." 
          value={content.description || ''} 
          onChange={(e) => onEdit({ ...content, description: e.target.value })}
        />
      </CardContent>
    </Card>
  );
};

export default DetailsTile;