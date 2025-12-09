import type { Question } from '../types';

interface QuestionCardProps {
  question: Question;  // 表示する問題
  onPlayAudio: () => void;  // お手本音声を再生する関数
  isSpeaking?: boolean;  // 音声再生中かどうか
}

/**
 * 問題を表示するコンポーネント
 *
 * 表示内容：
 * - 英語の文章
 * - 日本語訳
 * - お手本音声を聞くボタン
 */
export function QuestionCard({ question, onPlayAudio, isSpeaking = false }: QuestionCardProps) {
  return (
    <div className="text-center w-full">
      <div className="mb-4">
        <span className="text-[10px] font-black tracking-widest text-blue-400 uppercase bg-blue-50 px-3 py-1 rounded-full">
          Question
        </span>
      </div>
      <h2 className="text-3xl sm:text-4xl font-black text-gray-800 mb-4 leading-tight select-none">
        {question.english}
      </h2>
      <p className="text-gray-400 font-bold text-sm mb-6">
        {question.japanese}
      </p>
      <button
        onClick={onPlayAudio}
        className={`flex items-center gap-2 px-5 py-2.5 rounded-2xl font-bold text-sm transition-all mx-auto ${
          isSpeaking
            ? 'bg-blue-600 text-white playing-pulse-blue scale-105'
            : 'bg-blue-50 text-blue-500 hover:bg-blue-100'
        }`}
      >
        <span className="material-icons-round text-xl">
          {isSpeaking ? 'volume_up' : 'hearing'}
        </span>
        お手本を聞く
      </button>
    </div>
  );
}
