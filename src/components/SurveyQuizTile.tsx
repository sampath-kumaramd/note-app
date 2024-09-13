"use client";

import React, { useRef, useState, KeyboardEvent } from 'react';

import { Trash2, Plus } from 'lucide-react';

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
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
  const [editingOptionIndex, setEditingOptionIndex] = useState<number | null>(null);
  const questionRef = useRef<HTMLDivElement>(null);
  const optionRefs = useRef<(HTMLDivElement | null)[]>([]);

  const handleQuestionFocus = () => {
    setIsEditingQuestion(true);
    if (questionRef.current && questionRef.current.textContent === `Add a question for your ${isQuiz ? 'quiz' : 'survey'}`) {
      questionRef.current.textContent = '';
    }
  };

  const handleQuestionBlur = () => {
    setIsEditingQuestion(false);
    if (questionRef.current) {
      const newQuestion = questionRef.current.textContent || '';
      if (newQuestion.trim() === '') {
        questionRef.current.textContent = `Add a question for your ${isQuiz ? 'quiz' : 'survey'}`;
      } else {
        onEdit({ ...content, question: newQuestion });
      }
    }
  };

  const handleOptionFocus = (index: number) => {
    setEditingOptionIndex(index);
    if (optionRefs.current[index] && optionRefs.current[index]!.textContent === `Option ${index + 1}`) {
      optionRefs.current[index]!.textContent = '';
    }
  };

  const handleOptionBlur = (index: number) => {
    setEditingOptionIndex(null);
    if (optionRefs.current[index]) {
      const newOptionText = optionRefs.current[index]!.textContent || '';
      const newOptions = [...content.options];
      if (newOptionText.trim() === '') {
        newOptions[index] = `Option ${index + 1}`;
        optionRefs.current[index]!.textContent = `Option ${index + 1}`;
      } else {
        newOptions[index] = newOptionText;
      }
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
      <CardContent className="flex flex-col items-center justify-center h-full p-6">
        <div
          ref={questionRef}
          role="textbox"
          aria-multiline="false"
          tabIndex={0}
          contentEditable={true}
          onFocus={handleQuestionFocus}
          onBlur={handleQuestionBlur}
          onKeyDown={(e) => handleKeyDown(e, true)}
          className={`text-center text-2xl font-semibold mb-4 p-2 cursor-text outline-none ${
            isEditingQuestion ? 'text-blue-600' : ''
          } ${isInitial ? 'text-white' : 'text-black'} ${
            !content.question && !isEditingQuestion ? 'text-gray-400' : ''
          }`}
        >
          {content.question || `Add a question for your ${isQuiz ? 'quiz' : 'survey'}`}
        </div>
        
        <RadioGroup value={content.selectedOption || undefined} className="w-full max-w-md">
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
                onFocus={() => handleOptionFocus(index)}
                onBlur={() => handleOptionBlur(index)}
                onKeyDown={(e) => handleKeyDown(e, false, index)}
                className={`flex-grow p-2 cursor-text outline-none ${
                  editingOptionIndex === index ? 'text-blue-600' : ''
                } ${!option && editingOptionIndex !== index ? 'text-gray-400' : ''}`}
              >
                {option || `Option ${index + 1}`}
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
            className="mt-4 w-full max-w-md"
            variant="outline"
          >
            <Plus className="h-4 w-4 mr-2" /> Add Option
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default SurveyQuizTile;