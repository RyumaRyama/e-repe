/**
 * 2つのテキストを比較して、同じ内容かどうかを判定する
 * 大文字小文字、記号、余分なスペースは無視する
 *
 * @param original - 元の文章（正解の文章）
 * @param transcribed - 音声認識で取得した文章
 * @returns 内容が一致すればtrue、違えばfalse
 */
export function compareTexts(original: string, transcribed: string): boolean {
  // テキストを正規化する関数
  const normalize = (text: string) => {
    return text
      .toLowerCase()           // 小文字に統一
      .replace(/[^\w\s]/g, '') // 記号を削除
      .replace(/\s+/g, ' ')    // 複数のスペースを1つに
      .trim();                 // 前後の空白を削除
  };

  return normalize(original) === normalize(transcribed);
}
