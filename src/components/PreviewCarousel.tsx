import React, { useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { tileStyles } from '@/styles/tileStyles';
import { Tile } from '@/types/types';

import ViewCourseTileCard from './ViewCourseTileCard';

interface PreviewCarouselProps {
  tiles: Tile[];
}

const PreviewCarousel: React.FC<PreviewCarouselProps> = ({ tiles }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(0);

  const paginate = (newDirection: number) => {
    setDirection(newDirection);
    setCurrentIndex((prevIndex) => {
      let newIndex = prevIndex + newDirection;
      if (newIndex < 0) newIndex = tiles.length - 1;
      if (newIndex >= tiles.length) newIndex = 0;
      return newIndex;
    });
  };

  const variants = {
    enter: (direction: number) => {
      return {
        x: direction > 0 ? 1000 : -1000,
        opacity: 0,
        scale: 0.5,
      };
    },
    center: {
      zIndex: 1,
      x: 0,
      opacity: 1,
      scale: 1,
    },
    exit: (direction: number) => {
      return {
        zIndex: 0,
        x: direction < 0 ? 1000 : -1000,
        opacity: 0,
        scale: 0.5,
      };
    },
  };

  const swipeConfidenceThreshold = 10000;
  const swipePower = (offset: number, velocity: number) => {
    return Math.abs(offset) * velocity;
  };

  return (
    <div className="relative w-full h-[70vh] flex items-center justify-center overflow-hidden">
      <AnimatePresence initial={false} custom={direction}>
        <motion.div
          key={currentIndex}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{
            x: { type: "spring", stiffness: 300, damping: 30 },
            opacity: { duration: 0.2 },
          }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={1}
          onDragEnd={(e, { offset, velocity }) => {
            const swipe = swipePower(offset.x, velocity.x);

            if (swipe < -swipeConfidenceThreshold) {
              paginate(1);
            } else if (swipe > swipeConfidenceThreshold) {
              paginate(-1);
            }
          }}
          className={`${tileStyles.card} absolute cursor-grab active:cursor-grabbing`}
        >
          <ViewCourseTileCard tile={tiles[currentIndex]} />
        </motion.div>
      </AnimatePresence>
      <Button
        className="absolute left-4 z-10"
        onClick={() => paginate(-1)}
      >
        <ChevronLeft className="h-8 w-8" />
      </Button>
      <Button
        className="absolute right-4 z-10"
        onClick={() => paginate(1)}
      >
        <ChevronRight className="h-8 w-8" />
      </Button>
      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2">
        <p className="text-sm font-medium">
          Tile {currentIndex + 1} of {tiles.length}
        </p>
      </div>
    </div>
  );
};

export default PreviewCarousel;