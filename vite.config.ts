import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { viteStaticCopy } from 'vite-plugin-static-copy';

// https://vite.dev/config/
export default defineConfig({
  // GitHub Pages用: リポジトリ名をベースパスに設定
  // 例: https://username.github.io/english-practice-react/
  base: process.env.VITE_BASE_PATH || '/',

  plugins: [
    react(),
    viteStaticCopy({
      targets: [
        {
          // ONNX RuntimeのWASMファイルをビルド成果物のルートにコピー
          src: 'node_modules/@huggingface/transformers/dist/*.wasm',
          dest: '.',
        },
      ],
    }),
  ],
  optimizeDeps: {
    // 【重要】Transformers.jsをViteの事前バンドルから除外
    exclude: ['@huggingface/transformers'],
  },
  server: {
    // ローカル開発用セキュリティヘッダー（SharedArrayBuffer有効化）
    headers: {
      'Cross-Origin-Opener-Policy': 'same-origin',
      'Cross-Origin-Embedder-Policy': 'require-corp',
    },
    // 環境変数でallowedHostsを設定可能にする（カンマ区切り）
    // 例: ALLOWED_HOSTS=example.loca.lt,other.ngrok.io pnpm dev
    allowedHosts: process.env.ALLOWED_HOSTS?.split(',').filter(Boolean) || [],
  },
});
