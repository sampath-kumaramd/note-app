import React, { useState } from 'react';

import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

import { Button } from "@/components/ui/button";
import { Tile } from '@/store/courseStore';
import { tileStyles } from '@/styles/tileStyles';


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
    <div className="relative w-full h-[500px] flex items-center justify-center overflow-hidden">
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
          <div className="w-full h-full p-6 bg-white rounded-lg shadow-lg">
            <h2 className="text-xl font-bold mb-4">{tiles[currentIndex].type} Tile</h2>
            <p>{JSON.stringify(tiles[currentIndex].content)}</p>
          </div>
        </motion.div>
      </AnimatePresence>
      <Button
        className="absolute left-4 z-10"
        onClick={() => paginate(-1)}
      >
        <ChevronLeft />
      </Button>
      <Button
        className="absolute right-4 z-10"
        onClick={() => paginate(1)}
      >
        <ChevronRight />
      </Button>
    </div>
  );
};

export default PreviewCarousel;