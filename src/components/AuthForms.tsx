import { Link, useNavigate } from "@tanstack/react-router";
import { useState, type ReactNode } from "react";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/Kit";
import { Logo } from "@/components/Logo";
import { LangSwitch } from "@/components/PublicHeader";
import { getMyRoles, homeForRoles } from "@/lib/session";

export function AuthLayout({ children, title, sub, wide }: { children: ReactNode; title: string; sub?: string; wide?: boolean }) {
  return (
    <div className="min-h-screen px-4 py-8">
      <div className="mx-auto flex max-w-5xl items-center justify-between">
        <Link to="/"><Logo className="h-11" /></Link>
        <LangSwitch />
      </div>
      <div className={`mx-auto mt-8 ${wide ? "max-w-3xl" : "max-w-md"}`}>
        <div className="glass rounded-3xl p-6 md:p-8 animate-rise">
          <h1 className="text-2xl font-bold">{title}</h1>
          {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}
          <div className="mt-6">{children}</div>
        </div>
      </div>
    </div>
  );
}

export function LoginForm({ portal }: { portal?: "seeker" | "institution" }) {
  const nav = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    const { error } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
    if (error) { setBusy(false); toast.error(error.message.includes("confirmed") ? "Please verify your email first — check your inbox." : error.message); return; }
    const roles = await getMyRoles();
    if (portal && !roles.includes(portal) && !roles.includes("admin")) {
      await supabase.auth.signOut();
      setBusy(false);
      toast.error(portal === "seeker" ? "This is an institution account. Use the institution sign-in." : "This is a job seeker account. Use the job seeker sign-in.");
      return;
    }
    nav({ to: homeForRoles(roles), replace: true });
  }

  return (
    <form onSubmit={submit} className="space-y-4">
      <Field label={portal === "institution" ? "Institutional email" : "Email"}>
        <Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} autoComplete="email" />
      </Field>
      <Field label="Password">
        <Input type="password" required value={password} onChange={(e) => setPassword(e.target.value)} autoComplete="current-password" />
      </Field>
      <div className="text-right text-sm"><Link to="/forgot-password" className="text-primary-glow hover:underline">Forgot password?</Link></div>
      <Button type="submit" variant="hero" size="lg" className="w-full" disabled={busy}>
        {busy && <Loader2 className="animate-spin" />} Sign in
      </Button>
    </form>
  );
}
