import { createFileRoute } from "@tanstack/react-router";
import { Empty, PageTitle } from "@/components/Kit";

export const Route = createFileRoute("/_authenticated/seeker/")({
  component: () => (<div><PageTitle title="Overview" /><Empty>This section is not built yet.</Empty></div>),
});
