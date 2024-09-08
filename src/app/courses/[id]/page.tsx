"use client";
import React, { useEffect, useState } from 'react';

import { DialogContent } from '@radix-ui/react-dialog';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react'
import { useRouter } from 'next/navigation';

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Dialog, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Textarea } from "@/components/ui/textarea"
import { useCourseStore } from '@/store/courseStore';


// Define types for different tile contents
const CARD_TYPES = {
  TEXT: 'text',
  DETAILS: 'details',
  SURVEY: 'survey',
  QUIZ: 'quiz',
  FORM: 'form',
} as const;

type CardType = typeof CARD_TYPES[keyof typeof CARD_TYPES];

interface TextTileContent {
  title: string;
}

interface DetailsTileContent {
  title: string;
  description: string;
}

interface SurveyQuizTileContent {
  question: string;
  options: string[];
  selectedOption: string | null;
}

interface FormTileContent {
  title: string;
}

type TileContent = TextTileContent | DetailsTileContent | SurveyQuizTileContent | FormTileContent;

interface Tile {
  id: string;
  type: CardType;
  content: TileContent;
}

interface Course {
  id: string;
  name: string;
  tiles: Tile[];
}

interface CourseTileCardProps {
  tile: Tile;
  onEdit: (newContent: TileContent) => void;
  isInitial?: boolean;
}

const CourseTileCard: React.FC<CourseTileCardProps> = ({ tile, onEdit, isInitial = false }) => {
  const renderContent = () => {
    switch (tile.type) {
      case CARD_TYPES.TEXT:
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
      case CARD_TYPES.DETAILS:
        const detailsContent = tile.content as DetailsTileContent;
        return (
          <CardContent>
            <Input 
              placeholder="Enter Title" 
              value={detailsContent.title || ''} 
              onChange={(e) => onEdit({ ...detailsContent, title: e.target.value })}
              className="mb-4 text-black"
            />
            <Textarea 
              placeholder="Description..." 
              value={detailsContent.description || ''} 
              onChange={(e) => onEdit({ ...detailsContent, description: e.target.value })}
            />
          </CardContent>
        );
      case CARD_TYPES.SURVEY:
      case CARD_TYPES.QUIZ:
        const surveyQuizContent = tile.content as SurveyQuizTileContent;
        return (
          <CardContent>
            <Input 
              placeholder="Enter Question" 
              value={surveyQuizContent.question || ''} 
              onChange={(e) => onEdit({ ...surveyQuizContent, question: e.target.value })}
              className="mb-4 text-black"
            />
            <RadioGroup value={surveyQuizContent.selectedOption || undefined}>
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
      case CARD_TYPES.FORM:
        const formContent = tile.content as FormTileContent;
        return (
          <CardContent>
            <Input 
              placeholder="Form Title" 
              value={formContent.title || ''} 
              onChange={(e) => onEdit({ ...formContent, title: e.target.value })}
              className="mb-4 text-black"
            />
          </CardContent>
        );
      default:
        return null;
    }
  };

  return (
    <Card className={`w-full max-w-md ${isInitial ? 'bg-blue-500 text-white' : ''}`}>
      <CardHeader>
        <CardTitle>{tile.type.charAt(0).toUpperCase() + tile.type.slice(1)} Tile</CardTitle>
      </CardHeader>
      {renderContent()}
    </Card>
  );
};

interface AddCardDialogProps {
  onAddCard: (type: CardType) => void;
}

const AddCardDialog: React.FC<AddCardDialogProps> = ({ onAddCard }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button className="w-full max-w-md aspect-[3/4] flex items-center justify-center">
          <Plus className="h-12 w-12" />
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Card</DialogTitle>
        </DialogHeader>
        <div className="grid grid-cols-2 gap-4">
          {(Object.values(CARD_TYPES) as CardType[]).map((type) => (
            <Button key={type} onClick={() => onAddCard(type)}>
              {type.charAt(0).toUpperCase() + type.slice(1)}
            </Button>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

interface CourseCarouselProps {
  tiles: Tile[];
  currentIndex: number;
  onEdit: (index: number, newContent: TileContent) => void;
  onAddCard: (type: CardType) => void;
  onNext: () => void;
  onPrevious: () => void;
}

const CourseCarousel: React.FC<CourseCarouselProps> = ({ tiles, currentIndex, onEdit, onAddCard, onNext, onPrevious }) => {
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