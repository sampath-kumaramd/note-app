"use client";

import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { tileStyles } from '@/styles/tileStyles';
import { FormTileContent } from '@/types/types';

interface FormTileProps {
  content: FormTileContent;
  onEdit: (newContent: FormTileContent) => void;
  isInitial?: boolean;
}

const FormTile: React.FC<FormTileProps> = ({ content, onEdit, isInitial = false }) => {
  return (
    <Card className={`${tileStyles.card}  ${isInitial ? 'bg-blue-500 text-white' : ''}`}>
      <CardHeader>
        <CardTitle>Form Tile</CardTitle>
      </CardHeader>
      <CardContent>
        <Input 
          placeholder="Form Title" 
          value={content.title || ''} 
          onChange={(e) => onEdit({ ...content, title: e.target.value })}
          className="mb-4 text-black"
        />
      </CardContent>
    </Card>
  );
};

export default FormTile;