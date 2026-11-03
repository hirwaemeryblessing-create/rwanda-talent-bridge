import { createFileRoute } from "@tanstack/react-router";
import { Empty, PageTitle } from "@/components/Kit";

export const Route = createFileRoute("/_authenticated/settings")({
  component: () => (<div><PageTitle title="Account Settings" /><Empty>This section is not built yet.</Empty></div>),
});
