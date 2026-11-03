import { createFileRoute } from "@tanstack/react-router";
import { Empty, PageTitle } from "@/components/Kit";

export const Route = createFileRoute("/_authenticated/seeker/saved")({
  component: () => (<div><PageTitle title="Saved Jobs" /><Empty>This section is not built yet.</Empty></div>),
});
