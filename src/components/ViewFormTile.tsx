import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tileStyles } from '@/styles/tileStyles';
import { FormTileContent } from '@/types/types';

interface ViewFormTileProps {
  content: FormTileContent;
}

const ViewFormTile: React.FC<ViewFormTileProps> = ({ content }) => {
  return (
    <Card className={tileStyles.card}>
      <CardHeader>
        <CardTitle>Form Tile</CardTitle>
      </CardHeader>
      <CardContent>
        <h2 className="text-xl font-bold">{content.title || 'No title'}</h2>
      </CardContent>
    </Card>
  );
};

export default ViewFormTile;