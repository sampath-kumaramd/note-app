"use client"
import { useState } from 'react';

import { Plus } from 'lucide-react';
import { useRouter } from 'next/navigation';

import PreviewModal from '@/components/PreviewModal';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCourseStore } from '@/store/courseStore';
import { Course } from '@/types/types';

const MainPage: React.FC = () => {
  const router = useRouter();
  const courses = useCourseStore((state) => state.courses);
  const addCourse = useCourseStore((state) => state.addCourse);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');

  const handleCreateCourse = () => {
    setIsCreateDialogOpen(true);
  };

  const handleConfirmCreate = () => {
    if (newCourseName.trim()) {
      const newCourseId = addCourse(newCourseName.trim());
      setIsCreateDialogOpen(false);
      setNewCourseName('');
      router.push(`/courses/${newCourseId}`);
    }
  };

  const handleCardClick = (course: Course) => {
    setSelectedCourse(course);
    setIsPreviewOpen(true);
  };

  return (
    <div className="container mx-auto p-4">
      <div className='flex justify-between mb-4'>
        <h1 className="text-2xl font-bold">My Courses</h1>
        <Button onClick={handleCreateCourse}>
          <Plus className="h-6 w-6 mr-2" />
          Create New Course
        </Button>
      </div>
          
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {courses.map((course) => (
          <Card 
            key={course.id} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleCardClick(course)}
          >
            <CardHeader>
              <CardTitle>{course.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{course.tiles.length} tiles</p>
              <Button 
                className="mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/courses/${course.id}`);
                }}
              >
                Edit Course
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>

      <PreviewModal 
        course={selectedCourse} 
        isOpen={isPreviewOpen} 
        onClose={() => setIsPreviewOpen(false)}
      />

      <Dialog open={isCreateDialogOpen} onOpenChange={setIsCreateDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Course</DialogTitle>
          </DialogHeader>
          <Input
            placeholder="Enter course name"
            value={newCourseName}
            onChange={(e) => setNewCourseName(e.target.value)}
          />
          <DialogFooter>
            <Button onClick={handleConfirmCreate}>Create</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default MainPage;