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
      <CardContent className="flex flex-col h-full">
        <div
          className="text-2xl font-bold mb-2"
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent:  'center',
            textAlign: 'center',
            minHeight: '50px'
          }}
          dangerouslySetInnerHTML={{ __html: content.title || 'No title' }}
        />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'flex-start',
            textAlign:  'left',
            minHeight: '100px'
          }}
          dangerouslySetInnerHTML={{ __html: content.description || 'No description' }}
        />
      </CardContent>
    </Card>
  );
};

export default ViewDetailsTile;