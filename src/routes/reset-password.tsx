import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthLayout } from "@/components/AuthForms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/Kit";

export const Route = createFileRoute("/reset-password")({
  head: () => ({
    meta: [
      { title: "Set new password — hiJOBS RWANDA" },
      { name: "description", content: "Choose a new password for your account." },
      { property: "og:title", content: "Set new password — hiJOBS RWANDA" },
      { property: "og:description", content: "Choose a new password." },
    ],
  }),
  component: Reset,
});

function Reset() {
  const nav = useNavigate();
  const [pw, setPw] = useState("");
  const [pw2, setPw2] = useState("");
  async function submit(e: React.FormEvent): Promise<void> {
    e.preventDefault();
    if (pw.length < 8) { toast.error("Use at least 8 characters."); return; }
    if (pw !== pw2) { toast.error("Passwords don't match."); return; }
    const { error } = await supabase.auth.updateUser({ password: pw });
    if (error) { toast.error(error.message); return; }
    toast.success("Password updated.");
    nav({ to: "/dashboard" });
  }
  return (
    <AuthLayout title="Set a new password">
      <form onSubmit={submit} className="space-y-4">
        <Field label="New password"><Input type="password" value={pw} onChange={(e) => setPw(e.target.value)} required /></Field>
        <Field label="Confirm password"><Input type="password" value={pw2} onChange={(e) => setPw2(e.target.value)} required /></Field>
        <Button variant="hero" className="w-full" type="submit">Update password</Button>
      </form>
    </AuthLayout>
  );
}
