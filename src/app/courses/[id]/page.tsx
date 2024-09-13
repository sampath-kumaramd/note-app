"use client";

import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import CourseCarousel from '@/components/CourseCarousel';
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { useCourseStore, Tile } from '@/store/courseStore';
import { Course, TileContent } from '@/types/types';

interface CourseCreatePageProps {
  params: { id: string };
}

export default function CourseCreatePage({ params }: CourseCreatePageProps) {
  const router = useRouter();
  const { id } = params;
  const getCourse = useCourseStore((state) => state.getCourse);
  const updateCourse = useCourseStore((state) => state.updateCourse);
  const removeCourse = useCourseStore((state) => state.removeCourse);
  const [course, setCourse] = useState<Course | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [lastAddedCardId, setLastAddedCardId] = useState<string | null>(null);
  const [unsavedChanges, setUnsavedChanges] = useState(false);
  const [isWarningDialogOpen, setIsWarningDialogOpen] = useState(false);

  useEffect(() => {
    const fetchCourse = () => {
      let fetchedCourse = getCourse(id);
      if (!fetchedCourse) {
        fetchedCourse = {
          id,
          name: 'New Course',
          tiles: [{
            id: '1',
            type: 'text',
            content: { title: 'Welcome to your new course!' }
          }]
        };
        setUnsavedChanges(true);
      } else if (fetchedCourse.tiles.length === 0) {
        const newTile: Tile = {
          id: '1',
          type: 'text',
          content: { title: 'Welcome to your course!' }
        };
        fetchedCourse.tiles.push(newTile);
        setUnsavedChanges(true);
      }
      setCourse(fetchedCourse);
      setIsLoading(false);
    };

    fetchCourse();
  }, [id, getCourse]);

  const handleAddTile = (type: Tile['type']) => {
    if (course) {
      const newTile: Tile = {
        id: Date.now().toString(),
        type: type,
        content: {} as TileContent
      };
      const updatedCourse: Course = {
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

  const handleSave = () => {
    if (course) {
      updateCourse(course.id, course);
      setUnsavedChanges(false);
      router.push('/'); // Navigate to home page after saving
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

  const handleConfirmGoBack = () => {
    setIsWarningDialogOpen(false);
    removeCourse(id);
    router.push('/');
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
            <Button onClick={handleConfirmGoBack} variant={"destructive"}>
              Go Back and Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}