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
      <CardContent className={tileStyles.content}>
        {/* <h2 className="text-xl font-bold">{content.title || 'No title'}</h2>
         */}
        
        <div
          className="text-xl font-bold"
          style={{
            width: '100%',
            height: '100%',
            display: 'flex',
            flexDirection: 'column',
            justifyContent:  'center',
            textAlign:  'center',
            minHeight: '200px'
          }}
          dangerouslySetInnerHTML={{ __html: content.title || 'No title' }}
        />
      </CardContent>
    </Card>
  );
};

export default ViewTextTile;