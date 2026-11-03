import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, MailCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthLayout } from "@/components/AuthForms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, NativeSelect } from "@/components/Kit";
import { INSTITUTION_TYPES, PROVINCES, PROVINCE_NAMES, normalizeRwPhone } from "@/lib/rwanda";

export const Route = createFileRoute("/join/institution")({
  head: () => ({
    meta: [
      { title: "Register your institution — hiJOBS RWANDA" },
      { name: "description", content: "Publish vacancies and reach every eligible candidate in Rwanda automatically." },
      { property: "og:title", content: "Recruit with hiJOBS RWANDA" },
      { property: "og:description", content: "Register your institution and start recruiting." },
    ],
  }),
  component: JoinInstitution,
});

function JoinInstitution() {
  const [f, setF] = useState({
    institution_name: "", email: "", password: "", confirm: "", phone: "", institution_type: "", address: "",
    province: "", district: "", website: "", description: "", contact_name: "", contact_position: "",
  });
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k: keyof typeof f) => (v: string) => setF((s) => ({ ...s, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (f.password.length < 8) return toast.error("Password must be at least 8 characters.");
    if (f.password !== f.confirm) return toast.error("Passwords don't match.");
    const phone = normalizeRwPhone(f.phone);
    if (!phone) return toast.error("Enter a valid Rwandan phone number.");
    setBusy(true);
    const { confirm: _c, password, email, ...meta } = f;
    const { error } = await supabase.auth.signUp({
      email: email.trim(), password,
      options: { emailRedirectTo: `${window.location.origin}/employer/profile`, data: { ...meta, phone, account_type: "institution" } },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    setDone(true);
  }

  if (done) return (
    <AuthLayout title="Verify your institutional email">
      <div className="flex flex-col items-center gap-4 text-center">
        <MailCheck className="h-14 w-14 text-gold" />
        <p>We sent a verification link to <b>{f.email}</b>. After confirming, sign in and upload your institution logo.</p>
        <Button asChild variant="gold"><Link to="/login/institution">Go to sign in</Link></Button>
      </div>
    </AuthLayout>
  );

  return (
    <AuthLayout wide title="Register your institution" sub="Companies, NGOs, government institutions and all employers are welcome.">
      <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
        <Field label="Official institution name" className="md:col-span-2"><Input required value={f.institution_name} onChange={(e) => set("institution_name")(e.target.value)} /></Field>
        <Field label="Official institutional email"><Input type="email" required value={f.email} onChange={(e) => set("email")(e.target.value)} /></Field>
        <Field label="Phone number"><Input required placeholder="07XX XXX XXX" value={f.phone} onChange={(e) => set("phone")(e.target.value)} /></Field>
        <Field label="Password"><Input type="password" required value={f.password} onChange={(e) => set("password")(e.target.value)} /></Field>
        <Field label="Confirm password"><Input type="password" required value={f.confirm} onChange={(e) => set("confirm")(e.target.value)} /></Field>
        <Field label="Institution type"><NativeSelect required value={f.institution_type} onChange={set("institution_type")} placeholder="Select type" options={INSTITUTION_TYPES} /></Field>
        <Field label="Website (optional)"><Input type="url" placeholder="https://" value={f.website} onChange={(e) => set("website")(e.target.value)} /></Field>
        <Field label="Province"><NativeSelect required value={f.province} onChange={(v) => setF((s) => ({ ...s, province: v, district: "" }))} placeholder="Select province" options={PROVINCE_NAMES} /></Field>
        <Field label="District"><NativeSelect required value={f.district} onChange={set("district")} placeholder="Select district" options={PROVINCES[f.province] ?? []} /></Field>
        <Field label="Physical address" className="md:col-span-2"><Input required placeholder="e.g. KG 7 Ave, Kigali Heights" value={f.address} onChange={(e) => set("address")(e.target.value)} /></Field>
        <Field label="Brief description" className="md:col-span-2"><Textarea required rows={3} value={f.description} onChange={(e) => set("description")(e.target.value)} /></Field>
        <Field label="Contact person's full name"><Input required value={f.contact_name} onChange={(e) => set("contact_name")(e.target.value)} /></Field>
        <Field label="Contact person's position"><Input required value={f.contact_position} onChange={(e) => set("contact_position")(e.target.value)} /></Field>
        <Button type="submit" variant="gold" size="lg" disabled={busy} className="md:col-span-2">{busy && <Loader2 className="animate-spin" />} Register institution</Button>
        <p className="text-center text-sm text-muted-foreground md:col-span-2">Already registered? <Link to="/login/institution" className="text-gold hover:underline">Sign in</Link></p>
      </form>
    </AuthLayout>
  );
}
