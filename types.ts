export enum Difficulty {
  NHAN_BIET = 'Nhận biết',
  THONG_HIEU = 'Thông hiểu',
  VAN_DUNG = 'Vận dụng',
  VAN_DUNG_CAO = 'Vận dụng cao'
}

export enum QuestionType {
  MULTIPLE_CHOICE = 'Trắc nghiệm 4 lựa chọn',
  TRUE_FALSE = 'Trắc nghiệm đúng/sai',
  FILL_BLANK = 'Trắc nghiệm điền khuyết',
  SHORT_ANSWER = 'Câu trả lời ngắn',
  ESSAY = 'Tự luận'
}

export interface Standard {
  id: string;
  description: string;
}

export interface Lesson {
  id: string;
  title: string;
  standards: Standard[];
}

export interface Chapter {
  id: string;
  title: string;
  lessons: Lesson[];
}

export interface Question {
  id: string;
  type: QuestionType;
  content: string;
  options?: string[]; // Dùng cho Trắc nghiệm 4 lựa chọn
  trueFalseStatements?: { statement: string; isTrue: boolean }[]; // Dùng cho Đúng/Sai
  correctAnswer?: string;
  explanation: string;
  difficulty: Difficulty;
  lessonTitle: string;
}

export interface QuestionConfig {
  id: string;
  lessonId: string;
  lessonTitle: string;
  type: QuestionType;
  difficulty: Difficulty;
  count: number;
  standards: string[];
  // Advanced options per config
  useRealWorldContext?: boolean;
  referenceImageBase64?: string;
  referenceImageMimeType?: string;
  imageUrl?: string; // For UI preview only
}

export interface GenerationParams {
  chapterTitle: string;
  configs: QuestionConfig[];
}

export interface LessonMatrix {
  lessonTitle: string;
  nhanBiet: number;
  thongHieu: number;
  vanDung: number;
  vanDungCao: number;
  total: number;
}
