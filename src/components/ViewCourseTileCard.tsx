import React from 'react';

import { CARD_TYPES, CardType, DetailsTileContent, FormTileContent, SurveyQuizTileContent, TextTileContent, TileContent } from '@/types/types';

import ViewDetailsTile from './ViewDetailsTile';
import ViewFormTile from './ViewFormTile';
import ViewSurveyQuizTile from './ViewSurveyQuizTile';
import ViewTextTile from './ViewTextTile';


interface ViewCourseTileCardProps {
  tile: {
    id: string;
    type: CardType;
    content: TileContent;
  };
}

const ViewCourseTileCard: React.FC<ViewCourseTileCardProps> = ({ tile }) => {
  switch (tile.type) {
    case CARD_TYPES.TEXT:
      return <ViewTextTile content={tile.content as TextTileContent} />;
    case CARD_TYPES.DETAILS:
      return <ViewDetailsTile content={tile.content as DetailsTileContent} />;
    case CARD_TYPES.SURVEY:
      return <ViewSurveyQuizTile content={tile.content as SurveyQuizTileContent} isQuiz={false} />;
    case CARD_TYPES.QUIZ:
      return <ViewSurveyQuizTile content={tile.content as SurveyQuizTileContent} isQuiz={true} />;
    case CARD_TYPES.FORM:
      return <ViewFormTile content={tile.content as FormTileContent} />;
    default:
      return null;
  }
};

export default ViewCourseTileCard;