import { createFileRoute } from "@tanstack/react-router";
import { Empty, PageTitle } from "@/components/Kit";

export const Route = createFileRoute("/_authenticated/seeker/profile")({
  component: () => (<div><PageTitle title="My Profile & CV" /><Empty>This section is not built yet.</Empty></div>),
});
