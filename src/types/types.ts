export const CARD_TYPES = {
  TEXT: 'text',
  DETAILS: 'details',
  SURVEY: 'survey',
  QUIZ: 'quiz',
  FORM: 'form',
} as const;

export type CardType = (typeof CARD_TYPES)[keyof typeof CARD_TYPES];

export interface TextTileContent {
  title: string;
}

export interface DetailsTileContent {
  title: string;
  description: string;
}

export interface SurveyQuizTileContent {
  question: string;
  options: string[];
  selectedOption: string | null;
}

export interface FormTileContent {
  title: string;
}

export type TileContent =
  | TextTileContent
  | DetailsTileContent
  | SurveyQuizTileContent
  | FormTileContent;

export interface Tile {
  id: string;
  type: CardType;
  content: TileContent;
}

export interface CourseData {
  name: string;
  tiles: Tile[];
}

export interface Course {
  _id: string;
  data: CourseData;
  __v: number;
}
