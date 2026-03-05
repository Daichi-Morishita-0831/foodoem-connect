/**
 * HTMLタグを除去
 */
export function sanitizeHtml(input: string): string {
  return input.replace(/<[^>]*>/g, "");
}

/**
 * ユーザー入力をサニタイズ（トリム + 長さ制限 + HTMLタグ除去）
 */
export function sanitizeInput(input: string, maxLength = 10000): string {
  return sanitizeHtml(input).trim().slice(0, maxLength);
}
