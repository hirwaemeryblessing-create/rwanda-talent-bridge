import { createFileRoute } from "@tanstack/react-router";
import { Empty, PageTitle } from "@/components/Kit";

export const Route = createFileRoute("/_authenticated/employer/post")({
  component: () => (<div><PageTitle title="Post a Job" /><Empty>This section is not built yet.</Empty></div>),
});
