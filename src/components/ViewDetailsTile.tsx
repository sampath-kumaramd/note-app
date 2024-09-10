import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tileStyles } from '@/styles/tileStyles';
import { DetailsTileContent } from '@/types/types';

interface ViewDetailsTileProps {
  content: DetailsTileContent;
}

const ViewDetailsTile: React.FC<ViewDetailsTileProps> = ({ content }) => {
  return (
    <Card className={tileStyles.card}>
      <CardHeader>
        <CardTitle>Details Tile</CardTitle>
      </CardHeader>
      <CardContent>
        <h2 className="text-xl font-bold mb-2">{content.title || 'No title'}</h2>
        <p>{content.description || 'No description'}</p>
      </CardContent>
    </Card>
  );
};

export default ViewDetailsTile;