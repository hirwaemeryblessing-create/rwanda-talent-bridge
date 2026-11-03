import { createFileRoute, redirect } from "@tanstack/react-router";
import { getMyRoles, homeForRoles } from "@/lib/session";
import { LoadingScreen } from "@/components/Logo";

export const Route = createFileRoute("/_authenticated/dashboard")({
  head: () => ({ meta: [{ title: "Dashboard — hiJOBS RWANDA" }, { name: "description", content: "Your dashboard." }, { property: "og:title", content: "Dashboard — hiJOBS RWANDA" }, { property: "og:description", content: "Your dashboard." }] }),
  beforeLoad: async () => { throw redirect({ to: homeForRoles(await getMyRoles()) }); },
  component: LoadingScreen,
});
