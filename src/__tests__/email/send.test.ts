import { describe, it, expect, vi, beforeEach } from "vitest";

// Resend をモック
const mockSend = vi.fn().mockResolvedValue({ id: "email-123" });
vi.mock("@/lib/email/resend", () => ({
  resend: { emails: { send: mockSend } },
  FROM_EMAIL: "FoodOEM Connect <test@resend.dev>",
}));

// テンプレートをモック
vi.mock("@/lib/email/templates/inquiry-notification", () => ({
  renderInquiryNotification: vi.fn().mockReturnValue({
    subject: "新しい問い合わせ",
    html: "<p>問い合わせ内容</p>",
  }),
}));

vi.mock("@/lib/email/templates/inquiry-response", () => ({
  renderInquiryResponse: vi.fn().mockReturnValue({
    subject: "問い合わせ回答",
    html: "<p>回答内容</p>",
  }),
}));

vi.mock("@/lib/email/templates/new-message", () => ({
  renderNewMessage: vi.fn().mockReturnValue({
    subject: "新着メッセージ",
    html: "<p>メッセージ内容</p>",
  }),
}));

// Supabase をモック
const mockSupabase = {
  from: vi.fn().mockReturnThis(),
  select: vi.fn().mockReturnThis(),
  eq: vi.fn().mockReturnThis(),
  single: vi.fn().mockResolvedValue({
    data: { email_notification_enabled: true },
  }),
  auth: {
    admin: {
      getUserById: vi.fn().mockResolvedValue({
        data: { user: { email: "oem@example.com" } },
      }),
    },
  },
};

vi.mock("@/lib/supabase/server", () => ({
  createClient: vi.fn().mockResolvedValue(mockSupabase),
}));

describe("email/send", () => {
  beforeEach(() => {
    mockSend.mockClear();
    mockSupabase.single.mockResolvedValue({
      data: { email_notification_enabled: true },
    });
    mockSupabase.auth.admin.getUserById.mockResolvedValue({
      data: { user: { email: "oem@example.com" } },
    });
  });

  it("通知有効なユーザーにメールを送信する", async () => {
    const { sendInquiryEmail } = await import("@/lib/email/send");

    await sendInquiryEmail("user-1", {
      oemCompanyName: "テストOEM",
      restaurantName: "テストレストラン",
      projectTitle: "惣菜開発",
      message: "よろしくお願いします",
      inquiryId: "inq-1",
    });

    expect(mockSend).toHaveBeenCalledTimes(1);
    expect(mockSend).toHaveBeenCalledWith(
      expect.objectContaining({
        to: "oem@example.com",
        subject: "新しい問い合わせ",
      })
    );
  });

  it("通知無効なユーザーにはメールを送信しない", async () => {
    mockSupabase.single.mockResolvedValue({
      data: { email_notification_enabled: false },
    });

    const { sendInquiryEmail } = await import("@/lib/email/send");

    await sendInquiryEmail("user-disabled", {
      oemCompanyName: "テストOEM",
      restaurantName: "テストレストラン",
      projectTitle: "惣菜開発",
      message: "テスト",
      inquiryId: "inq-2",
    });

    expect(mockSend).not.toHaveBeenCalled();
  });

  it("メール送信エラーが発生しても例外をスローしない", async () => {
    mockSend.mockRejectedValue(new Error("Send failed"));

    const { sendInquiryEmail } = await import("@/lib/email/send");

    await expect(
      sendInquiryEmail("user-1", {
        oemCompanyName: "テストOEM",
        restaurantName: "テストレストラン",
        projectTitle: "惣菜開発",
        message: "テスト",
        inquiryId: "inq-3",
      })
    ).resolves.toBeUndefined();
  });
});
