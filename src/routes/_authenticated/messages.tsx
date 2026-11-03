import { createFileRoute } from "@tanstack/react-router";
import { Empty, PageTitle } from "@/components/Kit";

export const Route = createFileRoute("/_authenticated/messages")({
  validateSearch: (s: Record<string, unknown>): { c?: string } => (typeof s.c === "string" ? { c: s.c } : {}),
  component: () => (<div><PageTitle title="My Messages" /><Empty>This section is not built yet.</Empty></div>),
});
