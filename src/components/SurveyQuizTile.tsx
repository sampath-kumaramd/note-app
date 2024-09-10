"use client";

import React from 'react';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { tileStyles } from '@/styles/tileStyles';
import { SurveyQuizTileContent } from '@/types/types';

interface SurveyQuizTileProps {
  content: SurveyQuizTileContent;
  onEdit: (newContent: SurveyQuizTileContent) => void;
  isInitial?: boolean;
  isQuiz?: boolean;
}

const SurveyQuizTile: React.FC<SurveyQuizTileProps> = ({ content, onEdit, isInitial = false, isQuiz = false }) => {
  return (
    <Card className={`${tileStyles.card}  ${isInitial ? 'bg-blue-500 text-white' : ''}`}>
      <CardHeader>
        <CardTitle>{isQuiz ? 'Quiz' : 'Survey'} Tile</CardTitle>
      </CardHeader>
      <CardContent>
        <Input 
          placeholder="Enter Question" 
          value={content.question || ''} 
          onChange={(e) => onEdit({ ...content, question: e.target.value })}
          className="mb-4 text-black"
        />
        <RadioGroup value={content.selectedOption || undefined}>
          {content.options?.map((option, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <Input
                value={option}
                onChange={(e) => {
                  const newOptions = [...content.options];
                  newOptions[index] = e.target.value;
                  onEdit({ ...content, options: newOptions });
                }}
                className="ml-2"
              />
              <Button onClick={() => {
                const newOptions = content.options.filter((_, i) => i !== index);
                onEdit({ ...content, options: newOptions });
              }}>
                Remove
              </Button>
            </div>
          ))}
        </RadioGroup>
        <Button onClick={() => onEdit({ ...content, options: [...(content.options || []), `Option ${(content.options || []).length + 1}`] })}>
          Add Option
        </Button>
      </CardContent>
    </Card>
  );
};

export default SurveyQuizTile;