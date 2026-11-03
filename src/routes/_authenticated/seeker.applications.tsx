import { createFileRoute } from "@tanstack/react-router";
import { Empty, PageTitle } from "@/components/Kit";

export const Route = createFileRoute("/_authenticated/seeker/applications")({
  component: () => (<div><PageTitle title="Job Applications" /><Empty>This section is not built yet.</Empty></div>),
});
