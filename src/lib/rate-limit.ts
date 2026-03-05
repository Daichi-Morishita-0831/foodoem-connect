const requests = new Map<string, number[]>();

/**
 * インメモリ スライディングウィンドウ レートリミッター
 * Vercel serverless環境ではインスタンス単位で動作
 */
export function rateLimit(
  key: string,
  limit: number,
  windowMs: number
): boolean {
  const now = Date.now();
  const windowStart = now - windowMs;

  const timestamps = requests.get(key) ?? [];
  const recent = timestamps.filter((t) => t > windowStart);

  if (recent.length >= limit) {
    return false; // rate limited
  }

  recent.push(now);
  requests.set(key, recent);

  // メモリリーク防止: 古いキーを定期的にクリーンアップ
  if (requests.size > 10000) {
    for (const [k, v] of requests) {
      const filtered = v.filter((t) => t > windowStart);
      if (filtered.length === 0) {
        requests.delete(k);
      } else {
        requests.set(k, filtered);
      }
    }
  }

  return true; // allowed
}
