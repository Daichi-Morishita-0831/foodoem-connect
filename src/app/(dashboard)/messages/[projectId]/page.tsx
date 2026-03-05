import { redirect } from "next/navigation";
import { getCurrentUser } from "@/lib/supabase/auth";
import { getProject } from "@/lib/supabase/queries/projects";
import { getProjectMessages } from "@/lib/supabase/queries/messages";
import { ChatView } from "@/components/messaging/chat-view";

export default async function ChatPage({
  params,
}: {
  params: Promise<{ projectId: string }>;
}) {
  const { projectId } = await params;
  const [currentUser, project, messages] = await Promise.all([
    getCurrentUser(),
    getProject(projectId),
    getProjectMessages(projectId),
  ]);

  if (!currentUser || !project) {
    redirect("/messages");
  }

  return (
    <ChatView
      projectId={projectId}
      projectTitle={project.title}
      currentUserId={currentUser.authUser.id}
      initialMessages={messages}
    />
  );
}
