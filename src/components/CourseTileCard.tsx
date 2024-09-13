import React from 'react';

import { ChevronDown } from 'lucide-react';


import { CARD_TYPES, CardType, DetailsTileContent, FormTileContent, SurveyQuizTileContent, TextTileContent, TileContent } from '@/types/types';

import DetailsTile from './DetailsTile';
import FormTile from './FormTile';
import SurveyQuizTile from './SurveyQuizTile';
import TextTile from './TextTile';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';

interface CourseTileCardProps {
  tile: {
    id: string;
    type: CardType;
    content: TileContent;
  };
  onEdit: (newContent: TileContent) => void;
  onReorder: (toIndex: number) => void;
  totalTiles: number;
  currentIndex: number;
}

const CourseTileCard: React.FC<CourseTileCardProps> = ({ tile, onEdit, onReorder, totalTiles, currentIndex }) => {
  const renderTile = () => {
    switch (tile.type) {
      case CARD_TYPES.TEXT:
        return <TextTile content={tile.content as TextTileContent} onEdit={onEdit} />;
      case CARD_TYPES.DETAILS:
        return <DetailsTile content={tile.content as DetailsTileContent} onEdit={onEdit} />;
      case CARD_TYPES.SURVEY:
        return <SurveyQuizTile content={tile.content as SurveyQuizTileContent} onEdit={onEdit} isQuiz={false} />;
      case CARD_TYPES.QUIZ:
        return <SurveyQuizTile content={tile.content as SurveyQuizTileContent} onEdit={onEdit} isQuiz={true} />;
      case CARD_TYPES.FORM:
        return <FormTile content={tile.content as FormTileContent} onEdit={onEdit} />;
      default:
        return null;
    }
  };

  return (
    <div className="relative">
      {renderTile()}
      <div className="absolute bottom-0 left-0 right-0 flex justify-center space-x-2 p-2 bg-gray-100 rounded-b-lg">
        <Select onValueChange={(value) => onReorder(parseInt(value))}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Reorder" />
          </SelectTrigger>
          <SelectContent>
            {Array.from({ length: totalTiles }, (_, i) => (
              <SelectItem key={i} value={i.toString()} disabled={i === currentIndex}>
                {i === currentIndex ? 'Current Position' : `Move to position ${i + 1}`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
};

export default CourseTileCard;