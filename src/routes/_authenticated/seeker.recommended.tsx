import { createFileRoute } from "@tanstack/react-router";
import { Empty, PageTitle } from "@/components/Kit";

export const Route = createFileRoute("/_authenticated/seeker/recommended")({
  component: () => (<div><PageTitle title="Recommended Jobs" /><Empty>This section is not built yet.</Empty></div>),
});
