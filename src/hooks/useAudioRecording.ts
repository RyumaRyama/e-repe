import { useState, useRef } from 'react';

/**
 * 音声録音を管理するカスタムフック
 *
 * 機能：
 * - マイクから音声を録音
 * - 録音の開始・停止
 * - 録音した音声をBlobとして返す
 */
export function useAudioRecording() {
  // 録音中かどうか
  const [isRecording, setIsRecording] = useState(false);
  // 録音した音声のURL（再生用）
  const [userAudioUrl, setUserAudioUrl] = useState<string>('');

  // MediaRecorderのインスタンス（録音を制御）
  const mediaRecorderRef = useRef<MediaRecorder | null>(null);
  // 録音した音声データを保存する配列
  const audioChunksRef = useRef<Blob[]>([]);

  /**
   * 録音を開始する
   * @param onRecordingComplete - 録音完了時に呼ばれるコールバック関数
   */
  const startRecording = async (onRecordingComplete: (audioBlob: Blob) => void) => {
    try {
      // マイクへのアクセスを要求
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });

      // ブラウザがサポートしているmimeTypeを検出（iOS Safari対応）
      let mimeType = 'audio/webm';
      if (MediaRecorder.isTypeSupported('audio/webm')) {
        mimeType = 'audio/webm';
      } else if (MediaRecorder.isTypeSupported('audio/mp4')) {
        mimeType = 'audio/mp4';
      } else if (MediaRecorder.isTypeSupported('audio/wav')) {
        mimeType = 'audio/wav';
      }

      const mediaRecorder = new MediaRecorder(stream, { mimeType });
      mediaRecorderRef.current = mediaRecorder;
      audioChunksRef.current = [];

      // 録音データが利用可能になったら配列に追加
      mediaRecorder.ondataavailable = (event) => {
        audioChunksRef.current.push(event.data);
      };

      // 録音が停止したら、音声データを処理
      mediaRecorder.onstop = async () => {
        // 録音したデータをBlobにまとめる
        const audioBlob = new Blob(audioChunksRef.current, { type: mimeType });
        // 再生用のURLを作成
        const audioUrl = URL.createObjectURL(audioBlob);
        setUserAudioUrl(audioUrl);
        // 音声認識処理を呼び出す
        onRecordingComplete(audioBlob);
      };

      mediaRecorder.start();
      setIsRecording(true);
    } catch (err) {
      console.error('Microphone access error:', err);
      alert('マイクへのアクセスが許可されていません');
    }
  };

  /**
   * 録音を停止する
   */
  const stopRecording = () => {
    if (mediaRecorderRef.current && mediaRecorderRef.current.state === 'recording') {
      mediaRecorderRef.current.stop();
      // マイクのストリームを停止
      mediaRecorderRef.current.stream.getTracks().forEach((track) => track.stop());
      setIsRecording(false);
    }
  };

  /**
   * 録音データをリセット
   */
  const resetAudio = () => {
    setUserAudioUrl('');
  };

  return {
    isRecording,
    userAudioUrl,
    startRecording,
    stopRecording,
    resetAudio,
  };
}
