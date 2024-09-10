import React from 'react';

import { AlignLeft, ChevronLeft, ChevronRight, Trash2, Type } from 'lucide-react'

import { Button } from "@/components/ui/button"
import { Tile } from '@/store/courseStore';
import { tileStyles } from '@/styles/tileStyles';
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
  lastAddedCardId
}) => {
  const visibleTiles = tiles.slice(currentIndex, currentIndex + 3);

  const handleEdit = (tileIndex: number, newContent: TileContent) => {
    console.log('Editing tile at index:', tileIndex, 'New content:', newContent);
    onEdit(tileIndex, newContent);
  };

  return (
    <div className="relative w-full mx-auto">
      <div className="flex items-center justify-center space-x-4 p-4">
        {tiles.length > 3 && (
          <Button variant="ghost" onClick={onPrevious} disabled={currentIndex === 0} className="absolute left-0 top-1/2 transform -translate-y-1/2">
            <ChevronLeft className="h-8 w-8" />
          </Button>
        )}
        {visibleTiles.map((tile, index) => (
          <div 
            key={tile.id} 
            className={`relative ${tile.id === lastAddedCardId ? 'highlight-new-card' : ''}`}
          >
            <CourseTileCard
              tile={tile}
              onEdit={(newContent) => handleEdit(currentIndex + index, newContent)}
              isInitial={currentIndex + index === 0}
            />
            {index === 1 && (
              <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-2">
                <Button variant="outline" onClick={onPrevious} disabled={currentIndex === 0}>
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button variant="outline" onClick={onNext} disabled={currentIndex >= tiles.length - 3}>
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            )}
            <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 flex space-x-2 bg-white p-1 rounded-md shadow-md">
              <Button variant="ghost" size="sm"><Type className="h-4 w-4" /></Button>
              <Button variant="ghost" size="sm"><AlignLeft className="h-4 w-4" /></Button>
              <Button variant="ghost" size="sm">Image</Button>
              <Button variant="ghost" size="sm" onClick={() => onDelete(currentIndex + index)}><Trash2 className="h-4 w-4" /></Button>
            </div>
          </div>
        ))}
        <AddTilePopover onAddCard={onAddCard} />
        {tiles.length > 3 && (
          <Button variant="ghost" onClick={onNext} disabled={currentIndex >= tiles.length - 3} className="absolute right-0 top-1/2 transform -translate-y-1/2">
            <ChevronRight className="h-8 w-8" />
          </Button>
        )}
      </div>
    </div>
  );
};

export default CourseCarousel;