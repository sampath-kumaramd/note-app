import React from 'react';

import { Plus } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { CARD_TYPES, CardType } from '@/types/types';


interface AddCardDialogProps {
  onAddCard: (type: CardType) => void;
}

const AddCardDialog: React.FC<AddCardDialogProps> = ({ onAddCard }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full max-w-md aspect-[3/4] flex items-center justify-center">
          <Plus className="h-12 w-12" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Card</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          {(Object.values(CARD_TYPES) as CardType[]).map((type) => (
            <Button key={type} onClick={() => onAddCard(type)}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default AddCardDialog;