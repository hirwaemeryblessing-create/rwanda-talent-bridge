import { createFileRoute } from "@tanstack/react-router";
import { Empty, PageTitle } from "@/components/Kit";

export const Route = createFileRoute("/_authenticated/notifications")({
  component: () => (<div><PageTitle title="Notifications" /><Empty>This section is not built yet.</Empty></div>),
});
