"use client"
import { useState } from 'react';

import { useRouter } from 'next/navigation';


import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useCourseStore } from '@/store/courseStore';


export default function Home() {
  const [courseName, setCourseName] = useState('');
  const addCourse = useCourseStore((state) => state.addCourse);
  const router = useRouter();

  const handleCreateCourse = () => {
    if (courseName.trim()) {
      const courseId = addCourse(courseName.trim());
      router.push(`/courses/${courseId}`);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Course Creator</h1>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Create New Course</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Create New Course</DialogTitle>
          </DialogHeader>
          <Input
            value={courseName}
            onChange={(e) => setCourseName(e.target.value)}
            placeholder="Enter course name"
          />
          <Button onClick={handleCreateCourse}>Create</Button>
        </DialogContent>
      </Dialog>
    </div>
  );
}