import React from 'react';

import { Plus, Type, AlignLeft, FileText, Link, Video } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { CARD_TYPES, CardType } from '@/types/types';

interface AddTilePopoverProps {
  onAddCard: (type: CardType) => void;
}

const AddTilePopover: React.FC<AddTilePopoverProps> = ({ onAddCard }) => {

  const tileTypes = [
    { type: CARD_TYPES.TEXT, icon: Type, label: 'Title' },
    { type: CARD_TYPES.DETAILS, icon: AlignLeft, label: 'Content' },
    { type: CARD_TYPES.QUIZ, icon: FileText, label: 'Quiz' },
    { type: CARD_TYPES.SURVEY, icon: Link, label: 'Survey' },
    { type: CARD_TYPES.FORM, icon: Video, label: 'Video' },
  
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="w-64 h-96 flex flex-col items-center justify-center">
          <Plus className="h-12 w-12 mb-2" />
          <span>Add Tile</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-48">
        <div className="grid grid-cols-2 gap-2">
          {tileTypes.map(({ type, icon: Icon, label }) => (
            <Button
              key={type}
              onClick={() => onAddCard(type)}
              className="flex flex-col items-center justify-center p-2"
              variant="ghost"
            >
              <Icon className="h-6 w-6 mb-1" />
              <span className="text-xs">{label}</span>
            </Button>
          ))}
        </div>
      </PopoverContent>
    </Popover>
  );
};

export default AddTilePopover;