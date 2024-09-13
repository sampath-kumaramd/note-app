"use client"
import { useState, useEffect } from 'react';

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
  const { courses, getAllCourses, addCourse } = useCourseStore();
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);
  const [newCourseName, setNewCourseName] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        setIsLoading(true);
        await getAllCourses();
        setError(null);
      } catch (err) {
        setError('Failed to fetch courses. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchCourses();
  }, [getAllCourses]);

  const handleCreateCourse = () => {
    setIsCreateDialogOpen(true);
  };

  const handleConfirmCreate = async () => {
    if (newCourseName.trim()) {
      try {
        const newCourseId = await addCourse(newCourseName.trim());
        setIsCreateDialogOpen(false);
        setNewCourseName('');
        router.push(`/courses/${newCourseId}`);
      } catch (err) {
        setError('Failed to create course. Please try again.');
      }
    }
  };

  const handleCardClick = (course: Course) => {
    setSelectedCourse(course);
    setIsPreviewOpen(true);
  };

  if (isLoading) {
    return <div className="container mx-auto p-4">Loading courses...</div>;
  }

  if (error) {
    return (
      <div className="container mx-auto p-4">
        <p className="text-red-500">{error}</p>
        <Button onClick={() => getAllCourses()}>Retry</Button>
      </div>
    );
  }

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
            key={course._id} 
            className="cursor-pointer hover:shadow-lg transition-shadow"
            onClick={() => handleCardClick(course)}
          >
            <CardHeader>
              <CardTitle>{course.data.name}</CardTitle>
            </CardHeader>
            <CardContent>
              <p>{course.data.tiles.length} tiles</p>
              <Button 
                className="mt-2"
                onClick={(e) => {
                  e.stopPropagation();
                  router.push(`/courses/${course._id}`);
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