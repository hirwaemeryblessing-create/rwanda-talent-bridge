import { createFileRoute } from "@tanstack/react-router";
import { Empty, PageTitle } from "@/components/Kit";

export const Route = createFileRoute("/_authenticated/employer/matches")({
  component: () => (<div><PageTitle title="Matched Candidates" /><Empty>This section is not built yet.</Empty></div>),
});
