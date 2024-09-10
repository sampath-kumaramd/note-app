import React from 'react';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { tileStyles } from '@/styles/tileStyles';
import { SurveyQuizTileContent } from '@/types/types';

interface ViewSurveyQuizTileProps {
  content: SurveyQuizTileContent;
  isQuiz: boolean;
}

const ViewSurveyQuizTile: React.FC<ViewSurveyQuizTileProps> = ({ content, isQuiz }) => {
  return (
    <Card className={tileStyles.card}>
      <CardHeader>
        <CardTitle>{isQuiz ? 'Quiz' : 'Survey'} Tile</CardTitle>
      </CardHeader>
      <CardContent>
        <h2 className="text-xl font-bold mb-2">{content.question || 'No question'}</h2>
        <ul className="list-disc pl-5">
          {content.options?.map((option, index) => (
            <li key={index}>{option}</li>
          ))}
        </ul>
      </CardContent>
    </Card>
  );
};

export default ViewSurveyQuizTile;