import { createFileRoute } from "@tanstack/react-router";
import { Empty, PageTitle } from "@/components/Kit";

export const Route = createFileRoute("/_authenticated/employer/applicants")({
  component: () => (<div><PageTitle title="View Applicants" /><Empty>This section is not built yet.</Empty></div>),
});
