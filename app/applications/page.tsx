import { getAllApplications } from "@/lib/queries/applications";
import { ApplicationsKanban } from "@/components/applications/applications-kanban";
import { requireAuthenticatedUser } from "@/lib/session";

export const dynamic = "force-dynamic";

export default async function ApplicationsPage() {
  const user = await requireAuthenticatedUser();
  const applications = await getAllApplications(user.id);

  return (
    <div className="mx-auto max-w-7xl space-y-6 px-6 py-8">
      <div>
        <h1 className="text-2xl font-semibold tracking-tight">Applications</h1>
        <p className="mt-1 text-sm text-muted-foreground">{applications.length} applications tracked.</p>
      </div>
      <ApplicationsKanban applications={applications} />
    </div>
  );
}
