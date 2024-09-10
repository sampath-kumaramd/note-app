import React from 'react';

import { CARD_TYPES, CardType, DetailsTileContent, FormTileContent, SurveyQuizTileContent, TextTileContent, TileContent } from '@/types/types';

import DetailsTile from './DetailsTile';
import FormTile from './FormTile';
import SurveyQuizTile from './SurveyQuizTile';
import TextTile from './TextTile';

interface CourseTileCardProps {
  tile: {
    id: string;
    type: CardType;
    content: TileContent;
  };
  onEdit: (newContent: TileContent) => void;
  isInitial?: boolean;
}

const CourseTileCard: React.FC<CourseTileCardProps> = ({ tile, onEdit, isInitial = false }) => {
  switch (tile.type) {
    case CARD_TYPES.TEXT:
      return (
        <TextTile 
          content={tile.content as TextTileContent} 
          onEdit={(newContent) => onEdit(newContent)} 
          isInitial={isInitial} 
        />
      );
    case CARD_TYPES.DETAILS:
      return (
        <DetailsTile 
          content={tile.content as DetailsTileContent} 
          onEdit={(newContent) => onEdit(newContent)} 
          isInitial={isInitial} 
        />
      );
    case CARD_TYPES.SURVEY:
      return (
        <SurveyQuizTile 
          content={tile.content as SurveyQuizTileContent} 
          onEdit={(newContent) => onEdit(newContent)} 
          isInitial={isInitial} 
          isQuiz={false} 
        />
      );
    case CARD_TYPES.QUIZ:
      return (
        <SurveyQuizTile 
          content={tile.content as SurveyQuizTileContent} 
          onEdit={(newContent) => onEdit(newContent)} 
          isInitial={isInitial} 
          isQuiz={true} 
        />
      );
    case CARD_TYPES.FORM:
      return (
        <FormTile 
          content={tile.content as FormTileContent} 
          onEdit={(newContent) => onEdit(newContent)} 
          isInitial={isInitial} 
        />
      );
    default:
      return null;
  }
};

export default CourseTileCard;