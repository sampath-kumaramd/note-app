import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';

interface Course {
  id: string;
  name: string;
  tiles: Tile[];
}

export interface Tile {
  id: string;
  type: 'text' | 'details' | 'survey' | 'quiz' | 'form';
  content: any;
}

interface CourseStore {
  courses: Course[];
  addCourse: (name: string) => string;
  getCourse: (id: string) => Course | undefined;
  addTile: (courseId: string, tileType: Tile['type']) => void;
  updateTile: (courseId: string, tileId: string, newContent: any) => void;
}

export const useCourseStore = create<CourseStore>()(
  persist(
    (set, get) => ({
      courses: [],
      addCourse: (name: string) => {
        const id = Date.now().toString();
        set((state) => ({
          courses: [...state.courses, { id, name, tiles: [] }],
        }));
        return id;
      },
      getCourse: (id: string) => {
        return get().courses.find((course) => course.id === id);
      },
      addTile: (courseId: string, tileType: Tile['type']) => {
        set((state) => ({
          courses: state.courses.map((course) => {
            if (course.id === courseId) {
              return {
                ...course,
                tiles: [
                  ...course.tiles,
                  { id: Date.now().toString(), type: tileType, content: {} },
                ],
              };
            }
            return course;
          }),
        }));
      },
      updateTile: (courseId: string, tileId: string, newContent: any) => {
        set((state) => ({
          courses: state.courses.map((course) => {
            if (course.id === courseId) {
              return {
                ...course,
                tiles: course.tiles.map((tile) =>
                  tile.id === tileId ? { ...tile, content: newContent } : tile
                ),
              };
            }
            return course;
          }),
        }));
      },
    }),
    {
      name: 'course-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
