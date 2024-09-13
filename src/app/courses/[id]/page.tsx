"use client";

import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import CourseCarousel from '@/components/CourseCarousel';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useCourseStore } from '@/store/courseStore';
import { CourseData, Tile, TileContent, CARD_TYPES, CardType } from '@/types/types';

interface CourseCreatePageProps {
  params: { id: string };
}

export default function CourseCreatePage({ params }: CourseCreatePageProps) {
  const router = useRouter();
  const { id } = params;
  const { getCourse, updateCourse, removeCourse } = useCourseStore();
  const [course, setCourse] = useState<CourseData | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [lastAddedCardId, setLastAddedCardId] = useState<string | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [isWarningDialogOpen, setIsWarningDialogOpen] = useState(false);

  useEffect(() => {
    const fetchCourse = async () => {
      setIsLoading(true);
      try {
        const fetchedCourse = await getCourse(id);
        if (fetchedCourse) {
          setCourse(fetchedCourse);
        } else {
          console.error('Course not found');
        }
      } catch (error) {
        console.error('Error fetching course:', error);
      }
      setIsLoading(false);
    };

    fetchCourse();
  }, [id, getCourse]);

  const handleAddTile = async (type: CardType) => {
    if (course) {
      const newTile: Tile = {
        id: Date.now().toString(),
        type: type,
        content: getInitialContent(type)
      };
      const updatedCourse: CourseData = {
        ...course,
        tiles: [...course.tiles, newTile]
      };
      setCourse(updatedCourse);
      setLastAddedCardId(newTile.id);
      setTimeout(() => setLastAddedCardId(null), 3000);
      setCurrentIndex(Math.max(0, updatedCourse.tiles.length - 3));
      setUnsavedChanges(true);
    }
  };

  const getInitialContent = (type: CardType): TileContent => {
    switch (type) {
      case CARD_TYPES.TEXT:
        return { title: 'New Text Tile' };
      case CARD_TYPES.DETAILS:
        return { title: 'New Details Tile', description: '' };
      case CARD_TYPES.SURVEY:
      case CARD_TYPES.QUIZ:
        return { question: 'New Question', options: [], selectedOption: null };
      case CARD_TYPES.FORM:
        return { title: 'New Form Tile' };
      default:
        throw new Error(`Unsupported card type: ${type}`);
    }
  };

  const handleEditTile = (index: number, newContent: TileContent) => {
    if (course && course.tiles && index >= 0 && index < course.tiles.length) {
      const updatedTiles = course.tiles.map((tile, i) => 
        i === index ? { ...tile, content: newContent } : tile
      );
      setCourse({ ...course, tiles: updatedTiles });
      setUnsavedChanges(true);
    }
  };

  const handleDeleteTile = (index: number) => {
    if (course && course.tiles && index >= 0 && index < course.tiles.length) {
      const updatedTiles = course.tiles.filter((_, i) => i !== index);
      setCourse({ ...course, tiles: updatedTiles });
      setCurrentIndex(Math.max(0, Math.min(currentIndex, updatedTiles.length - 3)));
      setUnsavedChanges(true);
    }
  };

  const handleReorderTiles = (fromIndex: number, toIndex: number) => {
    if (course) {
      const updatedTiles = [...course.tiles];
      const [reorderedTile] = updatedTiles.splice(fromIndex, 1);
      updatedTiles.splice(toIndex, 0, reorderedTile);
      setCourse({ ...course, tiles: updatedTiles });
      setUnsavedChanges(true);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, (course?.tiles.length ?? 1) - 3));
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
  };

  const handleSave = async () => {
    if (course) {
      try {
        await updateCourse(id, course);
        setUnsavedChanges(false);
        router.push('/');
      } catch (error) {
        console.error('Error saving course:', error);
      }
    }
  };

  const handleGoBack = () => {
    if (unsavedChanges) {
      setIsWarningDialogOpen(true);
    } else {
      removeCourse(id);
      router.push('/');
    }
  };

  const handleConfirmGoBack = async () => {
    setIsWarningDialogOpen(false);
    try {
      await removeCourse(id);
      router.push('/');
    } catch (error) {
      console.error('Error removing course:', error);
    }
  };

  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!course) {
    return <div>Course not found</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">{course.name}</h1>
      <CourseCarousel
        tiles={course.tiles}
        currentIndex={currentIndex}
        onEdit={handleEditTile}
        onAddCard={handleAddTile}
        onNext={handleNext}
        onPrevious={handlePrevious}
        onDelete={handleDeleteTile}
        onReorder={handleReorderTiles}
        onSave={handleSave}
        onGoBack={handleGoBack}
        lastAddedCardId={lastAddedCardId}
      />

      <Dialog open={isWarningDialogOpen} onOpenChange={setIsWarningDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unsaved Changes</DialogTitle>
          </DialogHeader>
          <p>You have unsaved changes. Are you sure you want to go back? The course will be deleted.</p>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsWarningDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleConfirmGoBack} variant="destructive">
              Go Back and Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}