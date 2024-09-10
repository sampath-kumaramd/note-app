import React from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react'

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
}

const CourseCarousel: React.FC<CourseCarouselProps> = ({ 
  tiles, 
  currentIndex, 
  onEdit, 
  onAddCard, 
  onNext, 
  onPrevious 
}) => {
  const visibleTiles = tiles.slice(currentIndex, currentIndex + 2);

  const handleEdit = (tileIndex: number, newContent: TileContent) => {
    console.log('Editing tile at index:', tileIndex, 'New content:', newContent);
    onEdit(tileIndex, newContent);
  };

  return (
    <div className="relative w-full max-w-[calc(3*16rem+2rem)] mx-auto">
      <div className="flex items-center space-x-4 overflow-x-auto p-4">
        {visibleTiles.map((tile, index) => (
          <CourseTileCard
            key={tile.id}
            tile={tile}
            onEdit={(newContent) => handleEdit(currentIndex + index, newContent)}
            isInitial={currentIndex + index === 0}
          />
        ))}
        {visibleTiles.length < 2 && (
          <div className="w-64 h-96 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center">
            <span className="text-gray-400">Empty Tile</span>
          </div>
        )}
        <AddTilePopover onAddCard={onAddCard} />
      </div>
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 flex space-x-4 mt-4">
        <Button variant="outline" onClick={onPrevious} disabled={currentIndex === 0}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <Button variant="outline" onClick={onNext} disabled={currentIndex >= tiles.length - 2}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
};

export default CourseCarousel;