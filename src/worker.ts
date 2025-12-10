// src/worker.ts
import { pipeline, env } from '@huggingface/transformers';

// ローカルファイルシステムへのアクセスを禁止（ブラウザ向け設定）
env.allowLocalModels = false;

// 型定義
interface ProgressData {
  status?: string;
  file?: string;
  progress?: number;
  loaded?: number;
  total?: number;
}

interface TranscriptionOutput {
  text: string;
  chunks?: Array<{
    text: string;
    timestamp: [number, number | null];
  }>;
}

type ProgressCallback = ((data: ProgressData) => void) | null;

// シングルトンパターンでモデルを保持
class MyTranscriptionPipeline {
  static task = 'automatic-speech-recognition' as const;
  static model = 'onnx-community/whisper-tiny.en'; // v3系の正しいモデル名
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  static instance: any = null;

  static async getInstance(progress_callback: ProgressCallback = null) {
    if (this.instance === null) {
      console.log('Initializing pipeline with model:', this.model);
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      this.instance = await pipeline(this.task, this.model, {
        progress_callback: progress_callback ?? undefined,
        quantized: true, // 量子化モデルを使用
      } as any);
      console.log('Pipeline initialized successfully');
    }
    return this.instance;
  }
}

// メインスレッドからのメッセージ受信
self.addEventListener('message', async (event) => {
  const { type, audio } = event.data;

  try {
    // モデルの準備
    const transcriber = await MyTranscriptionPipeline.getInstance((data: ProgressData) => {
      // モデルロードの進捗を通知
      self.postMessage({ status: 'loading', data });
    });

    // メッセージタイプに応じて処理を分岐
    if (type === 'preload') {
      // モデルの事前読み込みのみの場合
      self.postMessage({ status: 'ready' });
    } else if (type === 'transcribe') {
      // 音声認識を実行
      const output = (await transcriber(audio, {
        chunk_length_s: 30,
        stride_length_s: 5,
      })) as TranscriptionOutput;

      // 音声がない場合の処理
      if (output.text === ' [BLANK_AUDIO]') {
        output.text = '音声なし';
      }

      // 結果を送信
      self.postMessage({ status: 'complete', result: output });
    } else {
      // 不明なメッセージタイプ
      throw new Error(`Unknown message type: ${type}`);
    }
  } catch (err) {
    console.error('Worker error:', err);
    self.postMessage({ status: 'error', data: err });
  }
});
