import { createFileRoute, Link } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { Loader2, MailCheck } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { AuthLayout } from "@/components/AuthForms";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Field, MultiCheck, NativeSelect } from "@/components/Kit";
import { EDUCATION_LEVELS, JOB_LOCATIONS, LANGUAGES, PROVINCES, PROVINCE_NAMES, normalizeRwPhone, splitList } from "@/lib/rwanda";

export const Route = createFileRoute("/join/seeker")({
  head: () => ({
    meta: [
      { title: "Create a job seeker account — hiJOBS RWANDA" },
      { name: "description", content: "Register once and get matched automatically to jobs across Rwanda." },
      { property: "og:title", content: "Find a job — hiJOBS RWANDA" },
      { property: "og:description", content: "Register and get automatic job matches." },
    ],
  }),
  component: JoinSeeker,
});

const SECTORS = ["Accounting & Finance", "Agriculture", "Construction & Engineering", "Education", "Health", "Hospitality & Tourism", "ICT & Technology", "Law & Legal", "Logistics & Transport", "Manufacturing", "Marketing & Sales", "NGO & Development", "Public Administration", "Banking & Insurance", "Other"];

function JoinSeeker() {
  const [f, setF] = useState({
    full_name: "", email: "", password: "", confirm: "", phone: "", gender: "", date_of_birth: "",
    province: "", district: "", qualifications: "", education_level: "", field_of_study: "",
    experience_years: "0", experience_summary: "", skills: "", preferred_sector: "", preferred_location: "Any",
  });
  const [languages, setLanguages] = useState<string[]>(["Kinyarwanda"]);
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);
  const set = (k: keyof typeof f) => (v: string) => setF((s) => ({ ...s, [k]: v }));

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (f.password.length < 8) return toast.error("Password must be at least 8 characters.");
    if (f.password !== f.confirm) return toast.error("Passwords don't match.");
    const phone = normalizeRwPhone(f.phone);
    if (!phone) return toast.error("Enter a valid Rwandan phone number, e.g. 0788 123 456.");
    if (!f.district) return toast.error("Choose your district.");
    setBusy(true);
    const { error } = await supabase.auth.signUp({
      email: f.email.trim(), password: f.password,
      options: {
        emailRedirectTo: `${window.location.origin}/seeker/profile`,
        data: {
          account_type: "seeker", full_name: f.full_name.trim(), phone, gender: f.gender, date_of_birth: f.date_of_birth,
          province: f.province, district: f.district, qualifications: f.qualifications, education_level: f.education_level,
          field_of_study: f.field_of_study, experience_years: f.experience_years, experience_summary: f.experience_summary,
          skills: splitList(f.skills), languages, preferred_sector: f.preferred_sector, preferred_location: f.preferred_location,
        },
      },
    });
    setBusy(false);
    if (error) return toast.error(error.message);
    setDone(true);
  }

  if (done) return (
    <AuthLayout title="Check your email">
      <div className="flex flex-col items-center gap-4 text-center">
        <MailCheck className="h-14 w-14 text-primary-glow" />
        <p>We sent a verification link to <b>{f.email}</b>. After confirming, sign in and upload your CV and profile photo.</p>
        <Button asChild variant="hero"><Link to="/login/seeker">Go to sign in</Link></Button>
      </div>
    </AuthLayout>
  );

  return (
    <AuthLayout wide title="Create your job seeker account" sub="Your profile powers automatic job matching — the more accurate, the better your matches.">
      <form onSubmit={submit} className="grid gap-4 md:grid-cols-2">
        <Field label="Full name"><Input required value={f.full_name} onChange={(e) => set("full_name")(e.target.value)} /></Field>
        <Field label="Email address"><Input type="email" required value={f.email} onChange={(e) => set("email")(e.target.value)} /></Field>
        <Field label="Password"><Input type="password" required value={f.password} onChange={(e) => set("password")(e.target.value)} /></Field>
        <Field label="Confirm password"><Input type="password" required value={f.confirm} onChange={(e) => set("confirm")(e.target.value)} /></Field>
        <Field label="Phone number"><Input required placeholder="07XX XXX XXX" value={f.phone} onChange={(e) => set("phone")(e.target.value)} /></Field>
        <div className="grid grid-cols-2 gap-3">
          <Field label="Gender (optional)"><NativeSelect value={f.gender} onChange={set("gender")} placeholder="—" options={["Male", "Female"]} /></Field>
          <Field label="Date of birth (optional)"><Input type="date" value={f.date_of_birth} onChange={(e) => set("date_of_birth")(e.target.value)} /></Field>
        </div>
        <Field label="Province"><NativeSelect required value={f.province} onChange={(v) => setF((s) => ({ ...s, province: v, district: "" }))} placeholder="Select province" options={PROVINCE_NAMES} /></Field>
        <Field label="District"><NativeSelect required value={f.district} onChange={set("district")} placeholder="Select district" options={PROVINCES[f.province] ?? []} /></Field>
        <Field label="Education level"><NativeSelect required value={f.education_level} onChange={set("education_level")} placeholder="Select level" options={EDUCATION_LEVELS} /></Field>
        <Field label="Field of study"><Input required placeholder="e.g. Accounting" value={f.field_of_study} onChange={(e) => set("field_of_study")(e.target.value)} /></Field>
        <Field label="Professional qualifications" className="md:col-span-2"><Input placeholder="e.g. BSc Accounting (UR), CPA Level 1" value={f.qualifications} onChange={(e) => set("qualifications")(e.target.value)} /></Field>
        <Field label="Years of work experience"><Input type="number" min={0} max={60} value={f.experience_years} onChange={(e) => set("experience_years")(e.target.value)} /></Field>
        <Field label="Preferred employment sector"><NativeSelect value={f.preferred_sector} onChange={set("preferred_sector")} placeholder="Any" options={SECTORS} /></Field>
        <Field label="Work experience summary" className="md:col-span-2"><Textarea rows={3} value={f.experience_summary} onChange={(e) => set("experience_summary")(e.target.value)} /></Field>
        <Field label="Professional skills" hint="Separate with commas — e.g. Excel, Financial reporting, Bookkeeping" className="md:col-span-2">
          <Input value={f.skills} onChange={(e) => set("skills")(e.target.value)} />
        </Field>
        <Field label="Languages spoken" className="md:col-span-2"><MultiCheck options={LANGUAGES} value={languages} onChange={setLanguages} /></Field>
        <Field label="Preferred job location"><NativeSelect value={f.preferred_location} onChange={set("preferred_location")} options={JOB_LOCATIONS} /></Field>
        <div className="flex items-end text-xs text-muted-foreground">CV and profile photo are uploaded securely after you verify your email.</div>
        <Button type="submit" variant="hero" size="lg" disabled={busy} className="md:col-span-2">{busy && <Loader2 className="animate-spin" />} Create account</Button>
        <p className="text-center text-sm text-muted-foreground md:col-span-2">Already registered? <Link to="/login/seeker" className="text-primary-glow hover:underline">Sign in</Link></p>
      </form>
    </AuthLayout>
  );
}
