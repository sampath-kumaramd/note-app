import React from 'react';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { CARD_TYPES, CardType, DetailsTileContent, FormTileContent, SurveyQuizTileContent, TextTileContent, TileContent } from '@/types/types';


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
  const renderContent = () => {
    switch (tile.type) {
      case CARD_TYPES.TEXT:
        const textContent = tile.content as TextTileContent;
        return (
          <CardContent>
            <Input 
              placeholder="Enter Title" 
              value={textContent.title || ''} 
              onChange={(e) => onEdit({ ...textContent, title: e.target.value })}
              className={`mb-4 text-black`}
            />
          </CardContent>
        );
      case CARD_TYPES.DETAILS:
        const detailsContent = tile.content as DetailsTileContent;
        return (
          <CardContent>
            <Input 
              placeholder="Enter Title" 
              value={detailsContent.title || ''} 
              onChange={(e) => onEdit({ ...detailsContent, title: e.target.value })}
              className="mb-4 text-black"
            />
            <Textarea 
              placeholder="Description..." 
              value={detailsContent.description || ''} 
              onChange={(e) => onEdit({ ...detailsContent, description: e.target.value })}
            />
          </CardContent>
        );
      case CARD_TYPES.SURVEY:
      case CARD_TYPES.QUIZ:
        const surveyQuizContent = tile.content as SurveyQuizTileContent;
        return (
          <CardContent>
            <Input 
              placeholder="Enter Question" 
              value={surveyQuizContent.question || ''} 
              onChange={(e) => onEdit({ ...surveyQuizContent, question: e.target.value })}
              className="mb-4 text-black"
            />
            <RadioGroup value={surveyQuizContent.selectedOption || undefined}>
              {surveyQuizContent.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...surveyQuizContent.options];
                      newOptions[index] = e.target.value;
                      onEdit({ ...surveyQuizContent, options: newOptions });
                    }}
                    className="ml-2"
                  />
                  <Button onClick={() => {
                    const newOptions = surveyQuizContent.options.filter((_, i) => i !== index);
                    onEdit({ ...surveyQuizContent, options: newOptions });
                  }}>
                    Remove
                  </Button>
                </div>
              ))}
            </RadioGroup>
            <Button onClick={() => onEdit({ ...surveyQuizContent, options: [...(surveyQuizContent.options || []), `Option ${(surveyQuizContent.options || []).length + 1}`] })}>
              Add Option
            </Button>
          </CardContent>
        );
      case CARD_TYPES.FORM:
        const formContent = tile.content as FormTileContent;
        return (
          <CardContent>
            <Input 
              placeholder="Form Title" 
              value={formContent.title || ''} 
              onChange={(e) => onEdit({ ...formContent, title: e.target.value })}
              className="mb-4 text-black"
            />
          </CardContent>
        );
      default:
        return null;
    }
  };

  return (
    <Card className={`w-full max-w-md ${isInitial ? 'bg-blue-500 text-white' : ''}`}>
      <CardHeader>
        <CardTitle>{tile.type.charAt(0).toUpperCase() + tile.type.slice(1)} Tile</CardTitle>
      </CardHeader>
      {renderContent()}
    </Card>
  );
};

export default CourseTileCard;