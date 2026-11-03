import { createFileRoute } from "@tanstack/react-router";
import { Empty, PageTitle } from "@/components/Kit";

export const Route = createFileRoute("/_authenticated/employer/")({
  component: () => (<div><PageTitle title="Recruitment Analytics" /><Empty>This section is not built yet.</Empty></div>),
});
