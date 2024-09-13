"use client";

import React, { useRef, useState, KeyboardEvent } from 'react';

import { Trash2 } from 'lucide-react';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
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
  const maxOptions = 5;
  const [isEditingQuestion, setIsEditingQuestion] = useState(false);
  const questionRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleQuestionBlur = () => {
    setIsEditingQuestion(false);
    if (questionRef.current) {
      onEdit({ ...content, question: questionRef.current.innerText });
    }
  };

  const handleOptionBlur = (index: number) => {
    if (optionRefs.current[index]) {
      const newOptions = [...content.options];
      newOptions[index] = optionRefs.current[index]!.innerText;
      onEdit({ ...content, options: newOptions });
    }
  };

  const handleKeyDown = (e: KeyboardEvent<HTMLDivElement>, isQuestion: boolean, index?: number) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (isQuestion) {
        questionRef.current?.blur();
      } else if (index !== undefined) {
        optionRefs.current[index]?.blur();
      }
    }
  };

  return (
    <Card className={`${tileStyles.card} ${isInitial ? 'bg-blue-500 text-white' : ''}`}>
      <CardHeader>
        <CardTitle>{isQuiz ? 'Quiz' : 'Survey'} Tile</CardTitle>
      </CardHeader>
      <CardContent>
        <div
          ref={questionRef}
          role="textbox"
          aria-multiline="false"
          tabIndex={0}
          contentEditable={true}
          onFocus={() => setIsEditingQuestion(true)}
          onBlur={handleQuestionBlur}
          onKeyDown={(e) => handleKeyDown(e, true)}
          className={`mb-4 p-2 cursor-text outline-none ${isEditingQuestion ? 'text-blue-600' : ''} ${isInitial ? 'text-white' : 'text-black'}`}
        >
          {content.question || 'Enter Question'}
        </div>
        <RadioGroup value={content.selectedOption || undefined}>
          {content.options?.slice(0, maxOptions).map((option, index) => (
            <div key={index} className="flex items-center space-x-2 mb-2">
              <RadioGroupItem value={option} id={`option-${index}`} />
              <div
                ref={(el) => {
                  optionRefs.current[index] = el;
                }}
                role="textbox"
                aria-multiline="false"
                tabIndex={0}
                contentEditable={true}
                onBlur={() => handleOptionBlur(index)}
                onKeyDown={(e) => handleKeyDown(e, false, index)}
                className="ml-2 flex-grow p-2 cursor-text outline-none"
              >
                {option}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  const newOptions = content.options.filter((_, i) => i !== index);
                  onEdit({ ...content, options: newOptions });
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </RadioGroup>
        {(content.options?.length || 0) < maxOptions && (
          <Button 
            onClick={() => onEdit({ ...content, options: [...(content.options || []), `Option ${(content.options || []).length + 1}`] })}
            className="mt-2"
          >
            Add Option
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SurveyQuizTile;