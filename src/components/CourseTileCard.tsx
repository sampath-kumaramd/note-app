"use client"
import React from 'react';

import { Move } from 'lucide-react';

import { CARD_TYPES, CardType, DetailsTileContent, FormTileContent, SurveyQuizTileContent, TextTileContent, TileContent } from '@/types/types';

import DetailsTile from './DetailsTile';
import FormTile from './FormTile';
import SurveyQuizTile from './SurveyQuizTile';
import TextTile from './TextTile';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';

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
      <div className="absolute top-0 right-0 p-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Select onValueChange={(value) => onReorder(parseInt(value))}>
                <SelectTrigger className="w-12 h-10 p-0 px-1" >
                  <SelectValue placeholder={<Move className="h-4 w-4" />} />
                </SelectTrigger>
                <SelectContent>
                  {Array.from({ length: totalTiles }, (_, i) => (
                    <SelectItem key={i} value={i.toString()} disabled={i === currentIndex}>
                      {i === currentIndex ? 'Current' : `Move to ${i + 1}`}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </TooltipTrigger>
            <TooltipContent>
              <p>Reorder tile</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    </div>
  );
};

export default CourseTileCard;