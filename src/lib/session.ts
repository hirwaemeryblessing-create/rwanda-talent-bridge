import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import type { Session } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

export function useSession() {
  const [session, setSession] = useState<Session | null>(null);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setSession(data.session); setReady(true); });
    const { data } = supabase.auth.onAuthStateChange((_e, s) => setSession(s));
    return () => data.subscription.unsubscribe();
  }, []);
  return { session, user: session?.user ?? null, ready };
}

export async function getMyRoles(): Promise<string[]> {
  const { data: u } = await supabase.auth.getUser();
  if (!u.user) return [];
  const { data } = await supabase.from("user_roles").select("role").eq("user_id", u.user.id);
  return (data ?? []).map((r) => r.role);
}

export function homeForRoles(roles: string[]) {
  if (roles.includes("admin")) return "/admin" as const;
  if (roles.includes("institution")) return "/employer" as const;
  return "/seeker" as const;
}

export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: async () => {
      const { data: u } = await supabase.auth.getUser();
      if (!u.user) return null;
      const [{ data: profile }, roles] = await Promise.all([
        supabase.from("profiles").select("*").eq("id", u.user.id).maybeSingle(),
        getMyRoles(),
      ]);
      return { id: u.user.id, email: u.user.email ?? "", profile, roles };
    },
  });
}

export function useUnreadCounts(userId?: string) {
  const q = useQuery({
    queryKey: ["unread", userId],
    enabled: !!userId,
    queryFn: async () => {
      const [m, n] = await Promise.all([
        supabase.from("messages").select("id", { count: "exact", head: true }).eq("recipient_id", userId!).eq("read", false),
        supabase.from("notifications").select("id", { count: "exact", head: true }).eq("user_id", userId!).eq("read", false),
      ]);
      return { messages: m.count ?? 0, notifications: n.count ?? 0 };
    },
  });
  useEffect(() => {
    if (!userId) return;
    const ch = supabase
      .channel(`unread-${userId}-${Math.random().toString(36).slice(2)}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "messages", filter: `recipient_id=eq.${userId}` }, () => q.refetch())
      .on("postgres_changes", { event: "*", schema: "public", table: "notifications", filter: `user_id=eq.${userId}` }, () => q.refetch())
      .subscribe();
    return () => { supabase.removeChannel(ch); };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);
  return q.data ?? { messages: 0, notifications: 0 };
}

export async function uploadFile(bucket: "documents" | "avatars", userId: string, file: File, sub = "") {
  const ext = file.name.split(".").pop() || "bin";
  const path = `${userId}/${sub ? sub + "/" : ""}${Date.now()}-${Math.random().toString(36).slice(2, 7)}.${ext}`;
  const { error } = await supabase.storage.from(bucket).upload(path, file, { upsert: true });
  if (error) throw error;
  return path;
}

export async function uploadImage(userId: string, file: File) {
  const path = await uploadFile("avatars", userId, file);
  const { data, error } = await supabase.storage.from("avatars").createSignedUrl(path, 60 * 60 * 24 * 365 * 10);
  if (error) throw error;
  return data.signedUrl;
}

export async function openDocument(path: string) {
  const { data, error } = await supabase.storage.from("documents").createSignedUrl(path, 300);
  if (error) throw error;
  window.open(data.signedUrl, "_blank", "noopener");
}
