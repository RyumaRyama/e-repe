// 問題の型定義
export interface Question {
  english: string;   // 英語の文章
  japanese: string;  // 日本語訳
}

// レベルの型を先に定義
export type Level = 'beginner' | 'elementary' | 'intermediate' | 'advanced';

// 全レベルの問題データの型
export interface QuestionsData {
  beginner: Question[];      // 初心者レベル
  elementary: Question[];    // 小学生レベル
  intermediate: Question[];  // 中学生レベル
  advanced: Question[];      // 上級者レベル
}
