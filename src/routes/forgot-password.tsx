import { createFileRoute } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";
import { AuthLayout } from "@/components/AuthForms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Field } from "@/components/Kit";

export const Route = createFileRoute("/forgot-password")({
  head: () => ({
    meta: [
      { title: "Reset password — hiJOBS RWANDA" },
      { name: "description", content: "Recover access to your hiJOBS RWANDA account." },
      { property: "og:title", content: "Reset password — hiJOBS RWANDA" },
      { property: "og:description", content: "Recover your account." },
    ],
  }),
  component: Forgot,
});

function Forgot() {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const { error } = await supabase.auth.resetPasswordForEmail(email.trim(), { redirectTo: `${window.location.origin}/reset-password` });
    if (error) { toast.error(error.message); return; }
    setSent(true);
  }
  return (
    <AuthLayout title="Forgot your password?" sub="We'll email you a secure reset link.">
      {sent ? <p className="text-sm">Check <b>{email}</b> for a reset link.</p> : (
        <form onSubmit={submit} className="space-y-4">
          <Field label="Email"><Input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} /></Field>
          <Button variant="hero" className="w-full" type="submit">Send reset link</Button>
        </form>
      )}
    </AuthLayout>
  );
}
