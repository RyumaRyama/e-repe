interface ResultDisplayProps {
  transcribedText: string;     // 認識されたテキスト
  userAudioUrl: string;         // ユーザーが録音した音声のURL
  isCorrect: boolean | null;    // 正解かどうか（null: 未判定）
}

/**
 * 発音の結果を表示するコンポーネント
 *
 * 表示内容：
 * - 認識されたテキスト
 * - ユーザーの録音音声プレイヤー
 * - 正解/不正解の判定結果
 */
export function ResultDisplay({ transcribedText, userAudioUrl, isCorrect }: ResultDisplayProps) {
  // テキストが無い場合は何も表示しない
  if (!transcribedText) return null;

  return (
    <div className="w-full min-h-[100px] flex flex-col items-center justify-center text-center transition-all duration-300 bg-gray-50 rounded-2xl p-5 border border-gray-100">
      {/* 正解/不正解アイコン */}
      {isCorrect !== null && (
        <div className="mb-2">
          {isCorrect ? (
            <span className="material-icons-round text-green-500 text-5xl">check_circle</span>
          ) : (
            <span className="material-icons-round text-orange-400 text-5xl">replay</span>
          )}
        </div>
      )}

      <p className="text-[10px] text-gray-400 font-bold uppercase tracking-wide mb-1">
        Your Speech
      </p>
      <p className="text-xl font-bold text-gray-800 mb-2">
        "{transcribedText}"
      </p>

      {/* 正解/不正解メッセージ */}
      {isCorrect !== null && (
        <p className={`text-sm font-bold mt-2 ${isCorrect ? 'text-green-500' : 'text-orange-400'}`}>
          {isCorrect ? 'Perfect!' : 'Try again!'}
        </p>
      )}

      {/* 録音した音声を再生できるプレイヤー */}
      {userAudioUrl && (
        <div className="mt-4 w-full">
          <audio controls src={userAudioUrl} className="w-full max-w-xs mx-auto" />
        </div>
      )}
    </div>
  );
}
