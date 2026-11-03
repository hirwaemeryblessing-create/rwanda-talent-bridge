import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { requireRole } from "@/lib/guards";

export const Route = createFileRoute("/_authenticated/seeker")({
  beforeLoad: () => requireRole("seeker"),
  component: () => <AppShell><Outlet /></AppShell>,
});
