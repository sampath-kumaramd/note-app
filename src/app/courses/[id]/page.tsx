"use client";

import React, { useEffect, useState } from 'react';

import { useRouter } from 'next/navigation';

import CourseCarousel from '@/components/CourseCarousel';
import { useCourseStore } from '@/store/courseStore';
import { CARD_TYPES, CardType, Course, TileContent } from '@/types/types';


interface CourseCreatePageProps {
  params: { id: string };
}

export default function CourseCreatePage({ params }: CourseCreatePageProps) {
  const router = useRouter();
  const { id } = params;
  const getCourse = useCourseStore((state) => state.getCourse);
  const addTile = useCourseStore((state) => state.addTile);
  const updateTile = useCourseStore((state) => state.updateTile);
  const [course, setCourse] = useState<Course | null>(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = () => {
      const fetchedCourse = getCourse(id);
      setCourse(fetchedCourse || { id, name: 'New Course', tiles: [{ id: '1', type: CARD_TYPES.TEXT, content: { title: '' } }] });
      setIsLoading(false);
    };

    fetchCourse();
  }, [id, getCourse]);

  const handleAddTile = (type: CardType) => {
    if (course) {
      addTile(course.id, type);
      const updatedCourse = getCourse(id);
      if (updatedCourse) {
        setCourse(updatedCourse);
        setCurrentIndex(updatedCourse.tiles.length - 1);
      }
    }
  };

  const handleEditTile = (index: number, newContent: TileContent) => {
    if (course && course.tiles && index >= 0 && index < course.tiles.length) {
      const tileId = course.tiles[index].id;
      updateTile(course.id, tileId, newContent);
      const updatedCourse = getCourse(id);
      if (updatedCourse) {
        setCourse(updatedCourse);
      }
    } else {
      console.error(`Unable to edit tile at index ${index}. Course or tile not found.`);
    }
  };

  const handleNext = () => {
    setCurrentIndex((prevIndex) => Math.min(prevIndex + 1, (course?.tiles.length ?? 1) - 1));
  };

  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => Math.max(prevIndex - 1, 0));
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
      />
    </div>
  );
}