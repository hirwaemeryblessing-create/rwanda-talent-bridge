import { Link, useNavigate } from "@tanstack/react-router";
import { useQueryClient } from "@tanstack/react-query";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard, User, FileText, Search, Sparkles, Send, Bookmark, MessageSquare, Bell, CalendarClock,
  Settings, LogOut, PlusCircle, Briefcase, Users, BarChart3, ShieldCheck, Menu, X, Building2,
} from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Logo } from "@/components/Logo";
import { LangSwitch } from "@/components/PublicHeader";
import { useMe, useUnreadCounts } from "@/lib/session";
import { useI18n } from "@/lib/i18n";
import { cn } from "@/lib/utils";

type Item = { to: string; label: string; icon: ReactNode; badge?: "messages" | "notifications" };

const SEEKER: Item[] = [
  { to: "/seeker", label: "Overview", icon: <LayoutDashboard /> },
  { to: "/seeker/profile", label: "My Profile & CV", icon: <User /> },
  { to: "/jobs", label: "Available Jobs", icon: <Search /> },
  { to: "/seeker/recommended", label: "Recommended Jobs", icon: <Sparkles /> },
  { to: "/seeker/applications", label: "Job Applications", icon: <Send /> },
  { to: "/seeker/saved", label: "Saved Jobs", icon: <Bookmark /> },
  { to: "/messages", label: "My Messages", icon: <MessageSquare />, badge: "messages" },
  { to: "/notifications", label: "Notifications", icon: <Bell />, badge: "notifications" },
  { to: "/seeker/interviews", label: "Interview Invitations", icon: <CalendarClock /> },
  { to: "/settings", label: "Account Settings", icon: <Settings /> },
];
const EMPLOYER: Item[] = [
  { to: "/employer", label: "Recruitment Analytics", icon: <BarChart3 /> },
  { to: "/employer/profile", label: "Institution Profile", icon: <Building2 /> },
  { to: "/employer/post", label: "Post a Job", icon: <PlusCircle /> },
  { to: "/employer/jobs", label: "Manage Posted Jobs", icon: <Briefcase /> },
  { to: "/employer/applicants", label: "View Applicants", icon: <FileText /> },
  { to: "/employer/matches", label: "Matched Candidates", icon: <Users /> },
  { to: "/messages", label: "My Messages", icon: <MessageSquare />, badge: "messages" },
  { to: "/notifications", label: "Notifications", icon: <Bell />, badge: "notifications" },
  { to: "/employer/interviews", label: "Interview Management", icon: <CalendarClock /> },
  { to: "/settings", label: "Account Settings", icon: <Settings /> },
];
const ADMIN: Item[] = [
  { to: "/admin", label: "Admin Console", icon: <ShieldCheck /> },
  { to: "/jobs", label: "Published Jobs", icon: <Search /> },
  { to: "/notifications", label: "Notifications", icon: <Bell />, badge: "notifications" },
  { to: "/settings", label: "Account Settings", icon: <Settings /> },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { data: me } = useMe();
  const counts = useUnreadCounts(me?.id);
  const { t } = useI18n();
  const nav = useNavigate();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const roles = me?.roles ?? [];
  const items = roles.includes("admin") ? ADMIN : roles.includes("institution") ? EMPLOYER : SEEKER;

  async function logout() {
    await qc.cancelQueries();
    qc.clear();
    await supabase.auth.signOut();
    nav({ to: "/auth", replace: true });
  }

  const sidebar = (
    <nav className="flex flex-col gap-1">
      {items.map((it) => {
        const n = it.badge ? counts[it.badge] : 0;
        return (
          <Link key={it.to + it.label} to={it.to} onClick={() => setOpen(false)}
            activeOptions={{ exact: true }}
            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-sidebar-foreground/80 transition hover:bg-sidebar-accent hover:text-sidebar-foreground [&_svg]:h-4 [&_svg]:w-4"
            activeProps={{ className: "bg-sidebar-accent text-sidebar-foreground shadow-glow" }}>
            {it.icon}<span className="flex-1">{it.label}</span>
            {n > 0 && <span className="rounded-full bg-gold px-2 py-0.5 text-[10px] font-bold text-gold-foreground">{n}</span>}
          </Link>
        );
      })}
      <button onClick={logout} className="mt-2 flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-destructive hover:bg-destructive/10 [&_svg]:h-4 [&_svg]:w-4">
        <LogOut />{t("logout")}
      </button>
    </nav>
  );

  return (
    <div className="min-h-screen md:flex">
      <aside className="hidden w-72 shrink-0 border-r border-sidebar-border bg-sidebar p-4 backdrop-blur-xl md:block">
        <Link to="/" className="mb-6 block px-2"><Logo className="h-11" /></Link>
        {sidebar}
      </aside>
      {open && (
        <div className="fixed inset-0 z-40 bg-background/70 backdrop-blur md:hidden" onClick={() => setOpen(false)}>
          <aside className="h-full w-72 overflow-y-auto border-r border-sidebar-border bg-popover p-4" onClick={(e) => e.stopPropagation()}>
            <div className="mb-6 flex items-center justify-between"><Logo className="h-10" /><button onClick={() => setOpen(false)}><X /></button></div>
            {sidebar}
          </aside>
        </div>
      )}
      <div className="min-w-0 flex-1">
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between gap-3 border-b border-border/50 bg-background/40 px-4 backdrop-blur-xl">
          <div className="flex items-center gap-3">
            <button className="md:hidden" onClick={() => setOpen(true)} aria-label="Menu"><Menu /></button>
            <Logo compact className="md:hidden" />
            <span className="hidden text-sm text-muted-foreground sm:block">
              {me?.profile?.full_name || me?.email}
              {me?.profile?.status === "suspended" && <span className="ml-2 rounded bg-destructive/20 px-2 py-0.5 text-xs text-destructive">Suspended</span>}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <LangSwitch />
            <Link to="/messages" className="relative rounded-lg p-2 hover:bg-accent" aria-label="Messages">
              <MessageSquare className="h-5 w-5" />
              {counts.messages > 0 && <Dot n={counts.messages} />}
            </Link>
            <Link to="/notifications" className="relative rounded-lg p-2 hover:bg-accent" aria-label="Notifications">
              <Bell className="h-5 w-5" />
              {counts.notifications > 0 && <Dot n={counts.notifications} />}
            </Link>
            {me?.profile?.avatar_url ? (
              <img src={me.profile.avatar_url} alt="" className="h-9 w-9 rounded-full border border-border object-cover" />
            ) : <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-primary text-sm font-bold">{(me?.profile?.full_name || "?")[0]}</div>}
          </div>
        </header>
        <main className={cn("mx-auto max-w-6xl p-4 md:p-8 animate-rise")}>{children}</main>
      </div>
    </div>
  );
}

function Dot({ n }: { n: number }) {
  return <span className="absolute -right-0.5 -top-0.5 min-w-4 rounded-full bg-gold px-1 text-center text-[10px] font-bold leading-4 text-gold-foreground">{n > 9 ? "9+" : n}</span>;
}
