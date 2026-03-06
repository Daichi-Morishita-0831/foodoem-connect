import { describe, it, expect, beforeEach, vi } from "vitest";
import { rateLimit } from "@/lib/rate-limit";

describe("rateLimit", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  it("制限内のリクエストを許可する", () => {
    const key = "test-allow";
    expect(rateLimit(key, 3, 60000)).toBe(true);
    expect(rateLimit(key, 3, 60000)).toBe(true);
    expect(rateLimit(key, 3, 60000)).toBe(true);
  });

  it("制限を超えたリクエストを拒否する", () => {
    const key = "test-deny";
    rateLimit(key, 2, 60000);
    rateLimit(key, 2, 60000);
    expect(rateLimit(key, 2, 60000)).toBe(false);
  });

  it("ウィンドウ経過後にリクエストを再び許可する", () => {
    const key = "test-window";
    rateLimit(key, 1, 1000);
    expect(rateLimit(key, 1, 1000)).toBe(false);

    vi.advanceTimersByTime(1100);
    expect(rateLimit(key, 1, 1000)).toBe(true);
  });

  it("異なるキーは独立してカウントする", () => {
    rateLimit("key-a", 1, 60000);
    expect(rateLimit("key-a", 1, 60000)).toBe(false);
    expect(rateLimit("key-b", 1, 60000)).toBe(true);
  });
});
