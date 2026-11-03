import { redirect } from "@tanstack/react-router";
import { getMyRoles, homeForRoles } from "@/lib/session";

/** Client-side route gate: users without the role are sent to their own dashboard. Data is still protected by database policies. */
export async function requireRole(role: "seeker" | "institution" | "admin") {
  const roles = await getMyRoles();
  if (!roles.includes(role)) throw redirect({ to: homeForRoles(roles) });
  return { roles };
}
