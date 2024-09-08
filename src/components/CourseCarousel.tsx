import React from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Tile } from '@/store/courseStore';
import { CardType, TileContent } from '@/types/types';

import AddCardDialog from './AddCardDialog';
import CourseTileCard from './CourseTileCard';



interface CourseCarouselProps {
  tiles: Tile[];
  currentIndex: number;
  onEdit: (index: number, newContent: TileContent) => void;
  onAddCard: (type: CardType) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const CourseCarousel: React.FC<CourseCarouselProps> = ({ 
  tiles, 
  currentIndex, 
  onEdit, 
  onAddCard, 
  onNext, 
  onPrevious 
}) => {
  const visibleTiles = tiles.slice(Math.max(0, currentIndex - 1), Math.min(tiles.length, currentIndex + 2));

  return (
    <div className="relative w-full max-w-[calc(3*16rem+2rem)] mx-auto">
      <div className="flex space-x-4 overflow-x-auto p-4">
        {visibleTiles.map((tile, index) => (
          <CourseTileCard
            key={tile.id}
            tile={tile}
            onEdit={(newContent) => onEdit(currentIndex + index - 1, newContent)}
            isInitial={index === 0 && currentIndex === 0}
          />
        ))}
        {tiles.length < 3 && <AddCardDialog onAddCard={onAddCard} />}
      </div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-4 mt-4">
        <Button variant="outline" onClick={onPrevious} disabled={currentIndex === 0}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={onNext} disabled={currentIndex === tiles.length - 1}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CourseCarousel;