import { createFileRoute, Outlet } from "@tanstack/react-router";
import { AppShell } from "@/components/AppShell";
import { requireRole } from "@/lib/guards";

export const Route = createFileRoute("/_authenticated/employer")({
  beforeLoad: () => requireRole("institution"),
  component: () => <AppShell><Outlet /></AppShell>,
});
