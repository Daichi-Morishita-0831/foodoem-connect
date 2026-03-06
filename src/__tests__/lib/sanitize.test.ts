import { describe, it, expect } from "vitest";
import { sanitizeHtml, sanitizeInput } from "@/lib/sanitize";

describe("sanitizeHtml", () => {
  it("HTMLタグを除去する", () => {
    expect(sanitizeHtml("<p>Hello</p>")).toBe("Hello");
  });

  it("複数のタグを除去する", () => {
    expect(sanitizeHtml("<b>太字</b>と<i>斜体</i>")).toBe("太字と斜体");
  });

  it("scriptタグを除去する", () => {
    expect(sanitizeHtml('<script>alert("xss")</script>')).toBe(
      'alert("xss")'
    );
  });

  it("タグなしの文字列はそのまま返す", () => {
    expect(sanitizeHtml("普通のテキスト")).toBe("普通のテキスト");
  });

  it("空文字列を正しく処理する", () => {
    expect(sanitizeHtml("")).toBe("");
  });

  it("ネストされたタグを除去する", () => {
    expect(sanitizeHtml("<div><span>内容</span></div>")).toBe("内容");
  });
});

describe("sanitizeInput", () => {
  it("前後の空白をトリムする", () => {
    expect(sanitizeInput("  テスト  ")).toBe("テスト");
  });

  it("デフォルトの長さ制限（10000文字）を適用する", () => {
    const longStr = "あ".repeat(20000);
    expect(sanitizeInput(longStr).length).toBe(10000);
  });

  it("カスタムの長さ制限を適用する", () => {
    const str = "テスト文字列です";
    expect(sanitizeInput(str, 4)).toBe("テスト文");
  });

  it("HTMLタグを除去してからトリム・制限する", () => {
    expect(sanitizeInput("  <b>テスト</b>  ", 100)).toBe("テスト");
  });
});
