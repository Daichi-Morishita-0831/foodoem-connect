import { NextResponse } from "next/server";
import { getCurrentUser } from "@/lib/supabase/auth";
import { createClient } from "@/lib/supabase/server";
import { suggestMissingSpecs } from "@/lib/ai/suggest-specs";

export async function POST(request: Request) {
  const currentUser = await getCurrentUser();
  if (!currentUser) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { specId } = await request.json();
  if (!specId) {
    return NextResponse.json(
      { error: "Spec ID is required" },
      { status: 400 }
    );
  }

  const supabase = await createClient();
  const { data: spec } = await supabase
    .from("recipe_specs")
    .select("*")
    .eq("id", specId)
    .single();

  if (!spec) {
    return NextResponse.json({ error: "Spec not found" }, { status: 404 });
  }

  const suggestions = await suggestMissingSpecs(spec);
  return NextResponse.json({ suggestions });
}
