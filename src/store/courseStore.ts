import axios from 'axios';
import { create } from 'zustand';

import {
  Course,
  CourseData,
  Tile,
  TileContent,
  CARD_TYPES,
  CardType,
} from '@/types/types';

interface CourseStore {
  courses: Course[];
  addCourse: (name: string) => Promise<string>;
  getCourse: (id: string) => Promise<CourseData | undefined>;
  getAllCourses: () => Promise<void>;
  addTile: (courseId: string, tileType: CardType) => Promise<void>;
  updateTile: (
    courseId: string,
    tileId: string,
    newContent: TileContent
  ) => Promise<void>;
  deleteTile: (courseId: string, tileId: string) => Promise<void>;
  reorderTiles: (courseId: string, newTileOrder: Tile[]) => Promise<void>;
  updateCourse: (courseId: string, updatedCourse: CourseData) => Promise<void>;
  removeCourse: (courseId: string) => Promise<void>;
}

const API_URL = 'https://course-generator-omega.vercel.app/api/courses';

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

export const useCourseStore = create<CourseStore>()((set, get) => ({
  courses: [],

  addCourse: async (name: string) => {
    try {
      const response = await axios.post(API_URL, { name, tiles: [] });
      const newCourse: Course = response.data;
      set((state) => ({ courses: [...state.courses, newCourse] }));
      return newCourse._id;
    } catch (error) {
      console.error('Error adding course:', error);
      throw error;
    }
  },

  getCourse: async (id: string) => {
    try {
      const response = await axios.get(`${API_URL}/${id}`);
      return response.data.data;
    } catch (error) {
      console.error('Error getting course:', error);
      return undefined;
    }
  },

  getAllCourses: async () => {
    try {
      const response = await axios.get(API_URL);
      set({ courses: response.data });
    } catch (error) {
      console.error('Error getting all courses:', error);
    }
  },

  addTile: async (courseId: string, tileType: CardType) => {
    try {
      const course = await get().getCourse(courseId);
      if (course) {
        const newTile: Tile = {
          id: Date.now().toString(),
          type: tileType,
          content: getInitialContent(tileType),
        };
        const updatedCourse = {
          ...course,
          tiles: [...course.tiles, newTile],
        };
        await get().updateCourse(courseId, updatedCourse);
      }
    } catch (error) {
      console.error('Error adding tile:', error);
    }
  },

  updateTile: async (
    courseId: string,
    tileId: string,
    newContent: TileContent
  ) => {
    try {
      const course = await get().getCourse(courseId);
      if (course) {
        const updatedTiles = course.tiles.map((tile) =>
          tile.id === tileId ? { ...tile, content: newContent } : tile
        );
        const updatedCourse = { ...course, tiles: updatedTiles };
        await get().updateCourse(courseId, updatedCourse);
      }
    } catch (error) {
      console.error('Error updating tile:', error);
    }
  },

  deleteTile: async (courseId: string, tileId: string) => {
    try {
      const course = await get().getCourse(courseId);
      if (course) {
        const updatedTiles = course.tiles.filter((tile) => tile.id !== tileId);
        const updatedCourse = { ...course, tiles: updatedTiles };
        await get().updateCourse(courseId, updatedCourse);
      }
    } catch (error) {
      console.error('Error deleting tile:', error);
    }
  },

  reorderTiles: async (courseId: string, newTileOrder: Tile[]) => {
    try {
      const course = await get().getCourse(courseId);
      if (course) {
        const updatedCourse = { ...course, tiles: newTileOrder };
        await get().updateCourse(courseId, updatedCourse);
      }
    } catch (error) {
      console.error('Error reordering tiles:', error);
    }
  },

  updateCourse: async (courseId: string, updatedCourse: CourseData) => {
    try {
      const response = await axios.put(`${API_URL}/${courseId}`, updatedCourse);
      set((state) => ({
        courses: state.courses.map((course) =>
          course._id === courseId ? { ...course, data: response.data } : course
        ),
      }));
    } catch (error) {
      console.error('Error updating course:', error);
    }
  },

  removeCourse: async (courseId: string) => {
    try {
      await axios.delete(`${API_URL}/${courseId}`);
      set((state) => ({
        courses: state.courses.filter((course) => course._id !== courseId),
      }));
    } catch (error) {
      console.error('Error removing course:', error);
    }
  },
}));
