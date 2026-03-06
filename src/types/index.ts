// ==========================================
// FoodOEM Connect - 型定義
// ==========================================

export type UserRole = "restaurant" | "oem" | "admin";

export type ProjectStatus =
  | "draft"
  | "submitted"
  | "matching"
  | "negotiation"
  | "contracted"
  | "production"
  | "completed"
  | "cancelled";

export type InquiryStatus = "pending" | "approved" | "rejected";

export type PreservationMethod = "refrigerated" | "frozen" | "room_temperature";

export type MenuCategory =
  | "side_dish"
  | "sauce"
  | "soup"
  | "dessert"
  | "frozen_meal"
  | "bento"
  | "other";

// アレルゲン特定原材料等28品目
export type Allergen =
  | "egg"
  | "milk"
  | "wheat"
  | "shrimp"
  | "crab"
  | "buckwheat"
  | "peanut"
  | "almond"
  | "abalone"
  | "squid"
  | "salmon_roe"
  | "orange"
  | "cashew"
  | "kiwi"
  | "beef"
  | "walnut"
  | "sesame"
  | "salmon"
  | "mackerel"
  | "soy"
  | "chicken"
  | "banana"
  | "pork"
  | "matsutake"
  | "peach"
  | "yam"
  | "apple"
  | "gelatin";

// ---------- Users ----------
export interface User {
  id: string;
  role: UserRole;
  company_name: string;
  representative_name: string | null;
  phone: string | null;
  address: string | null;
  is_active: boolean;
  email_notification_enabled: boolean;
  created_at: string;
  updated_at: string;
}

// ---------- OEM Profiles ----------
export interface OemProfile {
  id: string;
  user_id: string;
  specialties: string[];
  certifications: string[];
  min_lot_size: number;
  max_lot_size: number;
  production_area: string;
  delivery_areas: string[];
  facility_photos: string[];
  description: string;
  is_active: boolean;
}

// ---------- Projects ----------
export interface Project {
  id: string;
  restaurant_id: string;
  oem_id: string | null;
  title: string;
  status: ProjectStatus;
  created_at: string;
  updated_at: string;
}

// ---------- Recipe Specs ----------
export interface Ingredient {
  name: string;
  approximate_ratio?: string;
}

export interface ProcessStep {
  order: number;
  description: string;
  temperature?: string;
  duration?: string;
}

export interface RecipeSpec {
  id: string;
  project_id: string;
  version: number;
  raw_transcript: string | null;
  menu_name: string;
  menu_category: MenuCategory;
  main_ingredients: Ingredient[];
  seasoning_direction: string;
  target_unit_cost: number | null;
  target_selling_price: number | null;
  desired_lot_size: number | null;
  delivery_frequency: string | null;
  allergens: Allergen[];
  process_steps: ProcessStep[];
  preservation_method: PreservationMethod;
  shelf_life_days: number | null;
  packaging_type: string | null;
  required_certifications: string[];
  ai_confidence_score: number | null;
  created_at: string;
  updated_at: string;
}

// ---------- Match Results ----------
export interface MatchReason {
  category: string;
  description: string;
  is_match: boolean;
}

export interface MatchResult {
  id: string;
  project_id: string;
  oem_profile_id: string;
  match_score: number;
  match_reasons: MatchReason[];
  is_revealed: boolean;
  revealed_at: string | null;
  created_at: string;
  // 結合データ
  oem_profile?: OemProfile;
}

// ---------- Inquiries ----------
export interface Inquiry {
  id: string;
  match_result_id: string;
  restaurant_id: string;
  message: string;
  status: InquiryStatus;
  created_at: string;
}

// ---------- Messages ----------
export interface Message {
  id: string;
  project_id: string;
  sender_id: string;
  content: string;
  attachments: string[];
  created_at: string;
  // 結合データ
  sender?: User;
}

// ---------- Notifications ----------
export type NotificationType =
  | "inquiry_received"
  | "inquiry_responded"
  | "new_message"
  | "project_update";

export interface Notification {
  id: string;
  user_id: string;
  type: NotificationType;
  title: string;
  body: string | null;
  link: string | null;
  is_read: boolean;
  metadata: Record<string, unknown>;
  created_at: string;
}

// ---------- Reviews ----------
export interface Review {
  id: string;
  project_id: string;
  reviewer_id: string;
  reviewee_id: string;
  rating: number;
  comment: string | null;
  created_at: string;
}

// ---------- Project Events (タイムライン) ----------
export type ProjectEventType =
  | "status_change"
  | "inquiry_sent"
  | "inquiry_responded"
  | "message_sent"
  | "file_uploaded"
  | "review_submitted";

export interface ProjectEvent {
  id: string;
  project_id: string;
  event_type: ProjectEventType;
  old_value: string | null;
  new_value: string | null;
  actor_id: string | null;
  metadata: Record<string, unknown>;
  created_at: string;
  // 結合データ
  actor?: User;
}

// ---------- Subscriptions ----------
export type SubscriptionStatus =
  | "active"
  | "past_due"
  | "canceled"
  | "incomplete"
  | "trialing"
  | "unpaid";

export type PlanType = "free" | "premium" | "enterprise";

export interface Subscription {
  id: string;
  user_id: string;
  stripe_subscription_id: string;
  stripe_price_id: string;
  plan: PlanType;
  status: SubscriptionStatus;
  current_period_start: string;
  current_period_end: string;
  cancel_at_period_end: boolean;
  created_at: string;
  updated_at: string;
}

// ---------- Payment History ----------
export interface PaymentHistory {
  id: string;
  user_id: string;
  stripe_payment_intent_id: string;
  amount: number;
  currency: string;
  status: string;
  description: string | null;
  created_at: string;
}

// ---------- Inquiry with Details (OEM側用) ----------
export interface InquiryWithDetails {
  id: string;
  match_result_id: string;
  restaurant_id: string;
  message: string;
  status: InquiryStatus;
  created_at: string;
  // 結合データ
  restaurant?: User;
  project?: Project;
  recipe_spec?: RecipeSpec;
  match_result?: MatchResult;
}
