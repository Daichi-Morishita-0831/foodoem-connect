"use server";

import { createClient } from "../server";
import type { ProjectEventType } from "@/types";

/**
 * 案件イベントを記録
 */
export async function recordProjectEvent(
  projectId: string,
  eventType: ProjectEventType,
  actorId: string | null,
  oldValue?: string | null,
  newValue?: string | null,
  metadata?: Record<string, unknown>
): Promise<void> {
  try {
    const supabase = await createClient();

    await supabase.from("project_events").insert({
      project_id: projectId,
      event_type: eventType,
      actor_id: actorId,
      old_value: oldValue ?? null,
      new_value: newValue ?? null,
      metadata: metadata ?? {},
    });
  } catch (error) {
    console.error("recordProjectEvent error:", error);
  }
}
