import { createFileRoute } from "@tanstack/react-router";
import { Empty, PageTitle } from "@/components/Kit";

export const Route = createFileRoute("/_authenticated/admin")({
  component: () => (<div><PageTitle title="Admin Console" /><Empty>This section is not built yet.</Empty></div>),
});
