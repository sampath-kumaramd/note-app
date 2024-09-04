"use client";
import React, { useEffect, useState } from 'react';

import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { Tile, useCourseStore } from '@/store/courseStore';

// Define types for different tile contents
type TextTileContent = { title: string };
type DetailsTileContent = { title: string; description: string };
type SurveyQuizTileContent = { question: string; options: string[]; selectedOption: string | null };
type FormTileContent = { title: string }; // Add more form-specific fields as needed

// Union type for all possible tile contents
type TileContent = TextTileContent | DetailsTileContent | SurveyQuizTileContent | FormTileContent;

// Define the structure of a course
interface Course {
  id: string;
  name: string;
  tiles: Tile[];
}

interface CourseTileCardProps {
  tile: Tile;
  onEdit: (newContent: TileContent) => void;
}

const CourseTileCard: React.FC<CourseTileCardProps> = ({ tile, onEdit }) => {
  const renderContent = () => {
    switch (tile.type) {
      case 'text':
        return (
          <CardContent>
            <Input 
              placeholder="Enter Title" 
              value={(tile.content as TextTileContent).title || ''} 
              onChange={(e) => onEdit({ ...tile.content, title: e.target.value })}
              className="mb-4 text-black"
            />
          </CardContent>
        );
      case 'details':
        return (
          <CardContent>
            <Input 
              placeholder="Enter Title" 
              value={(tile.content as DetailsTileContent).title || ''} 
              onChange={(e) => onEdit({ ...tile.content, title: e.target.value })}
              className="mb-4 text-black"
            />
            <Textarea 
              placeholder="Description..." 
              value={(tile.content as DetailsTileContent).description || ''} 
              onChange={(e) => onEdit({ ...tile.content, description: e.target.value })}
            />
          </CardContent>
        );
      case 'survey':
      case 'quiz':
        const surveyQuizContent = tile.content as SurveyQuizTileContent;
        return (
          <CardContent>
            <Input 
              placeholder="Enter Question" 
              value={surveyQuizContent.question || ''} 
              onChange={(e) => onEdit({ ...surveyQuizContent, question: e.target.value })}
              className="mb-4 text-black"
            />
            <RadioGroup value={surveyQuizContent.selectedOption || undefined} onValueChange={(value) => onEdit({ ...surveyQuizContent, selectedOption: value })}>
              {surveyQuizContent.options?.map((option, index) => (
                <div key={index} className="flex items-center space-x-2 mb-2">
                  <RadioGroupItem value={option} id={`option-${index}`} />
                  <Input
                    value={option}
                    onChange={(e) => {
                      const newOptions = [...surveyQuizContent.options];
                      newOptions[index] = e.target.value;
                      onEdit({ ...surveyQuizContent, options: newOptions });
                    }}
                    className="ml-2"
                  />
                  <Button onClick={() => {
                    const newOptions = surveyQuizContent.options.filter((_, i) => i !== index);
                    onEdit({ ...surveyQuizContent, options: newOptions });
                  }}>
                    Remove
                  </Button>
                </div>
              ))}
            </RadioGroup>
            <Button onClick={() => onEdit({ ...surveyQuizContent, options: [...(surveyQuizContent.options || []), `Option ${(surveyQuizContent.options || []).length + 1}`] })}>
              Add Option
            </Button>
          </CardContent>
        );
      case 'form':
        return (
          <CardContent>
            <Input 
              placeholder="Form Title" 
              value={(tile.content as FormTileContent).title || ''} 
              onChange={(e) => onEdit({ ...tile.content, title: e.target.value })}
              className="mb-4 text-black"
            />
            {/* Add form-specific fields here */}
          </CardContent>
        );
      default:
        return null;
    }
  };

  return (
    <Card className={`w-full max-w-md ${tile.type === 'text' ? 'bg-blue-500 text-white' : ''}`}>
      <CardHeader>
        <CardTitle>{tile.type.charAt(0).toUpperCase() + tile.type.slice(1)} Tile</CardTitle>
      </CardHeader>
      {renderContent()}
    </Card>
  );
};

interface CourseCarouselProps {
  tiles: Tile[];
  currentIndex: number;
  onEdit: (index: number, newContent: TileContent) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const CourseCarousel: React.FC<CourseCarouselProps> = ({ tiles, currentIndex, onEdit, onNext, onPrevious }) => {
  return (
    <div className="relative w-full max-w-md mx-auto">
      {tiles.length > 0 ? (
        <CourseTileCard
          tile={tiles[currentIndex]}
          onEdit={(newContent) => onEdit(currentIndex, newContent)}
        />
      ) : (
        <div>No tiles yet. Add some tiles to get started!</div>
      )}
      <div className="absolute top-1/2 -left-12 -translate-y-1/2">
        <Button variant="outline" onClick={onPrevious} disabled={currentIndex === 0}>
          <ChevronLeft className="h-4 w-4" />
        </Button>
      </div>
      <div className="absolute top-1/2 -right-12 -translate-y-1/2">
        <Button variant="outline" onClick={onNext} disabled={currentIndex === tiles.length - 1}>
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
      <div className="text-center mt-4">
        {tiles.length > 0 ? `Tile ${currentIndex + 1} of ${tiles.length}` : 'No tiles'}
      </div>
    </div>
  );
};

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
      setCourse(fetchedCourse || null);
      setIsLoading(false);
    };

    fetchCourse();
  }, [id, getCourse]);

  const handleAddTile = (type: Tile['type']) => {
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
    if (course) {
      const tileId = course.tiles[index].id;
      updateTile(course.id, tileId, newContent);
      const updatedCourse = getCourse(id);
      if (updatedCourse) {
        setCourse(updatedCourse);
      }
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
        onNext={handleNext}
        onPrevious={handlePrevious}
      />
      <div className="mt-8 space-x-2 text-center">
        <Button onClick={() => handleAddTile('text')}>Add Text</Button>
        <Button onClick={() => handleAddTile('details')}>Add Details</Button>
        <Button onClick={() => handleAddTile('survey')}>Add Survey</Button>
        <Button onClick={() => handleAddTile('quiz')}>Add Quiz</Button>
        <Button onClick={() => handleAddTile('form')}>Add Form</Button>
      </div>
    </div>
  );
}