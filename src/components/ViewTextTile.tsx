import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tileStyles } from '@/styles/tileStyles';
import { TextTileContent } from '@/types/types';

interface ViewTextTileProps {
  content: TextTileContent;
}

const ViewTextTile: React.FC<ViewTextTileProps> = ({ content }) => {
  return (
    <Card className={tileStyles.card}>
      <CardHeader className={tileStyles.header}>
        <CardTitle>Text Tile</CardTitle>
      </CardHeader>
      <CardContent className={tileStyles.content}>
        <h2 className="text-xl font-bold">{content.title || 'No title'}</h2>
      </CardContent>
    </Card>
  );
};

export default ViewTextTile;