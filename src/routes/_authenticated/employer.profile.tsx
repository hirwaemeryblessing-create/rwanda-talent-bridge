import { createFileRoute } from "@tanstack/react-router";
import { Empty, PageTitle } from "@/components/Kit";

export const Route = createFileRoute("/_authenticated/employer/profile")({
  component: () => (<div><PageTitle title="Institution Profile" /><Empty>This section is not built yet.</Empty></div>),
});
