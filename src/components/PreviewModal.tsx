import React from 'react';

import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Course } from '@/types/types';

import PreviewCarousel from './PreviewCarousel';

interface PreviewModalProps {
  course: Course | null;
  isOpen: boolean;
  onClose: () => void;
}

const PreviewModal: React.FC<PreviewModalProps> = ({ course, isOpen, onClose }) => {
  if (!course) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[90%] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{course.name} - Preview</DialogTitle>
        </DialogHeader>
        <PreviewCarousel tiles={course.tiles} />
      </DialogContent>
    </Dialog>
  );
};

export default PreviewModal;