import { useState } from 'react';

/**
 * 英語の音声合成を管理するカスタムフック
 *
 * 機能：
 * - 英語のテキストを音声で読み上げる（お手本音声）
 */
export function useSpeechSynthesis() {
  const [isSpeaking, setIsSpeaking] = useState(false);

  /**
   * 英語のテキストを音声で読み上げる
   * @param text - 読み上げる英語のテキスト
   */
  const speak = (text: string, rate: number) => {
    if (!text) return;

    // 既存の音声を停止
    speechSynthesis.cancel();

    // 音声合成の設定
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'en-US';  // 英語（アメリカ）
    utterance.rate = rate;      // 再生速度

    // イベントリスナー
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);

    // 音声を再生
    speechSynthesis.speak(utterance);
  };

  return {
    speak,
    isSpeaking,
  };
}
