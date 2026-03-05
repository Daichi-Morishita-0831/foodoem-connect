import { createClient } from "../server";
import type { ProjectEvent } from "@/types";

/**
 * 案件タイムラインイベント取得
 */
export async function getProjectTimeline(
  projectId: string
): Promise<ProjectEvent[]> {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("project_events")
    .select("*, actor:users!actor_id(company_name)")
    .eq("project_id", projectId)
    .order("created_at", { ascending: true });

  if (error) {
    console.error("getProjectTimeline error:", error);
    return [];
  }

  return (data ?? []).map((event) => ({
    ...(event as unknown as ProjectEvent),
    actor: event.actor
      ? ({ company_name: (event.actor as unknown as { company_name: string }).company_name } as unknown as ProjectEvent["actor"])
      : undefined,
  }));
}
