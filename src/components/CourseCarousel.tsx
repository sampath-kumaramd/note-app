import React, { useState, KeyboardEvent } from 'react';

import { ChevronLeft, ChevronRight, Save, ArrowLeft } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Tile } from '@/store/courseStore';
import { CardType, TileContent } from '@/types/types';

import AddTilePopover from './AddTilePopover';
import CourseTileCard from './CourseTileCard';

interface CourseCarouselProps {
  tiles: Tile[];
  currentIndex: number;
  onEdit: (index: number, newContent: TileContent) => void;
  onAddCard: (type: CardType) => void;
  onNext: () => void;
  onPrevious: () => void;
  onDelete: (index: number) => void;
  onReorder: (fromIndex: number, toIndex: number) => void;
  onSave: () => void;
  onGoBack: () => void;
  lastAddedCardId: string | null;
}

const CourseCarousel: React.FC<CourseCarouselProps> = ({ 
  tiles, 
  currentIndex, 
  onEdit, 
  onAddCard, 
  onNext, 
  onPrevious,
  onDelete,
  onReorder,
  onSave,
  onGoBack,
  lastAddedCardId
}) => {
  const visibleTiles = tiles.slice(currentIndex, currentIndex + 3);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);

  const handleEdit = (tileIndex: number, newContent: TileContent) => {
    onEdit(currentIndex + tileIndex, newContent);
  };

  const handleCardInteraction = (tileId: string) => {
    setSelectedCardId(tileId);
    setTimeout(() => setSelectedCardId(null), 3000);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLDivElement>, tileId: string) => {
    if (event.key === 'Enter' || event.key === ' ') {
      handleCardInteraction(tileId);
    }
  };

  const handleReorder = (fromIndex: number, toIndex: number) => {
    onReorder(currentIndex + fromIndex, toIndex);
  };

  return (
    <div className="relative w-full mx-auto ">
      <div className="flex items-center justify-center space-x-4 p-4">
        {tiles.length > 3 && (
          <Button variant="ghost" onClick={onPrevious} disabled={currentIndex === 0} className="absolute left-0 top-1/2 transform -translate-y-1/2">
            <ChevronLeft className="h-8 w-8" />
          </Button>
        )}
        {visibleTiles.map((tile, index) => (
          <div 
            key={tile.id} 
            className={`relative ${tile.id === lastAddedCardId ? 'highlight-new-card' : ''} ${tile.id === selectedCardId ? 'highlight-selected-card' : ''}`}
            onClick={() => handleCardInteraction(tile.id)}
            onKeyDown={(e) => handleKeyDown(e, tile.id)}
            role="button"
            tabIndex={0}
            aria-pressed={selectedCardId === tile.id}
          >
            <CourseTileCard
              tile={tile}
              onEdit={(newContent) => handleEdit(index, newContent)}
              onReorder={(toIndex) => handleReorder(index, toIndex)}
              totalTiles={tiles.length}
              currentIndex={currentIndex + index}
            />
          </div>
        ))}
        <AddTilePopover onAddCard={onAddCard} />
        {tiles.length > 3 && (
          <Button variant="ghost" onClick={onNext} disabled={currentIndex >= tiles.length - 3} className="absolute right-0 top-1/2 transform -translate-y-1/2">
            <ChevronRight className="h-8 w-8" />
          </Button>
        )}
      </div>
      <div className="flex justify-between mt-4">
        <Button onClick={onGoBack} className="flex items-center">
          <ArrowLeft className="mr-2 h-4 w-4" /> Go Back
        </Button>
        <Button onClick={onSave} className="flex items-center">
          <Save className="mr-2 h-4 w-4" /> Save Course
        </Button>
      </div>
    </div>
  );
};

export default CourseCarousel;