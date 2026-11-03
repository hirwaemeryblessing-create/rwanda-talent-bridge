import { createFileRoute } from "@tanstack/react-router";
import { Empty, PageTitle } from "@/components/Kit";

export const Route = createFileRoute("/_authenticated/employer/interviews")({
  component: () => (<div><PageTitle title="Interview Management" /><Empty>This section is not built yet.</Empty></div>),
});
