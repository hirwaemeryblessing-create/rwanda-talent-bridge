import { createFileRoute } from "@tanstack/react-router";
import { Empty, PageTitle } from "@/components/Kit";

export const Route = createFileRoute("/_authenticated/employer/jobs")({
  component: () => (<div><PageTitle title="Manage Posted Jobs" /><Empty>This section is not built yet.</Empty></div>),
});
