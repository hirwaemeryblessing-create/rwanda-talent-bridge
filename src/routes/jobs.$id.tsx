import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { BadgeCheck, Bookmark, BookmarkCheck, Flag, Loader2, MapPin, MessageSquare, Sparkles, Banknote, Clock, GraduationCap, Briefcase } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PublicHeader } from "@/components/PublicHeader";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Field, GlassCard, StatusPill } from "@/components/Kit";
import { InstLogo, JOB_SELECT, type JobWithInst } from "@/components/JobCard";
import { eduLabel, salaryRange } from "@/lib/rwanda";
import { useMe, uploadFile } from "@/lib/session";

export const Route = createFileRoute("/jobs/$id")({
  head: () => ({
    meta: [
      { title: "Job details — hiJOBS RWANDA" },
      { name: "description", content: "View the job description, requirements and apply on hiJOBS RWANDA." },
      { property: "og:title", content: "Job opportunity — hiJOBS RWANDA" },
      { property: "og:description", content: "View requirements and apply." },
    ],
  }),
  component: JobDetail,
});

function JobDetail() {
  const { id } = Route.useParams();
  const { data: me } = useMe();
  const qc = useQueryClient();
  const nav = useNavigate();
  const isSeeker = me?.roles.includes("seeker");
  const [applyOpen, setApplyOpen] = useState(false);

  const { data: job, isLoading } = useQuery({
    queryKey: ["job", id],
    queryFn: async () => {
      const { data } = await supabase.from("jobs").select(JOB_SELECT).eq("id", id).maybeSingle();
      return data as unknown as JobWithInst | null;
    },
  });
  const { data: mine } = useQuery({
    queryKey: ["job-mine", id, me?.id],
    enabled: !!isSeeker,
    queryFn: async () => {
      const [a, s, m] = await Promise.all([
        supabase.from("applications").select("id,status").eq("job_id", id).eq("seeker_id", me!.id).maybeSingle(),
        supabase.from("saved_jobs").select("id").eq("job_id", id).eq("seeker_id", me!.id).maybeSingle(),
        supabase.from("matches").select("id").eq("job_id", id).eq("seeker_id", me!.id).maybeSingle(),
      ]);
      return { app: a.data, saved: !!s.data, matched: !!m.data };
    },
  });

  async function toggleSave() {
    if (!me) { nav({ to: "/login/seeker" }); return; }
    if (mine?.saved) await supabase.from("saved_jobs").delete().eq("job_id", id).eq("seeker_id", me.id);
    else await supabase.from("saved_jobs").insert({ job_id: id, seeker_id: me.id });
    qc.invalidateQueries({ queryKey: ["job-mine", id] });
  }
  async function messageEmployer(): Promise<unknown> {
    if (!me || !job) return;
    const { data: existing } = await supabase.from("conversations").select("id").eq("seeker_id", me.id).eq("institution_id", job.institution_id).maybeSingle();
    let cid = existing?.id;
    if (!cid) {
      const { data, error } = await supabase.from("conversations").insert({ seeker_id: me.id, institution_id: job.institution_id }).select("id").single();
      if (error) return toast.error(error.message);
      cid = data.id;
    }
    nav({ to: "/messages", search: { c: cid } });
  }
  async function report() {
    if (!me) { nav({ to: "/auth" }); return; }
    const reason = window.prompt("Why are you reporting this job?");
    if (!reason?.trim()) return;
    const { error } = await supabase.from("reports").insert({ reporter_id: me.id, target_type: "job", target_id: id, reason: reason.trim().slice(0, 1000) });
    if (error) toast.error(error.message); else toast.success("Thanks — an administrator will review this job.");
  }

  if (isLoading) return <div className="min-h-screen"><PublicHeader /><p className="p-10 text-center text-muted-foreground">Loading…</p></div>;
  if (!job) return <div className="min-h-screen"><PublicHeader /><p className="p-10 text-center">This job is not available.</p></div>;
  const closed = job.deadline ? new Date(job.deadline) < new Date(new Date().toDateString()) : false;

  return (
    <div className="min-h-screen">
      <PublicHeader />
      <main className="mx-auto grid max-w-6xl gap-6 px-4 py-8 lg:grid-cols-[1fr_320px]">
        <div className="space-y-6">
          <GlassCard>
            <div className="flex gap-4">
              <InstLogo url={job.institution?.logo_url} className="h-16 w-16" />
              <div>
                <h1 className="text-2xl font-bold md:text-3xl">{job.title}</h1>
                <p className="mt-1 flex items-center gap-1 text-muted-foreground">{job.institution?.name}{job.institution?.verified && <BadgeCheck className="h-4 w-4 text-gold" />}</p>
                {job.reference && <p className="text-xs text-muted-foreground">Ref: {job.reference}</p>}
              </div>
            </div>
            {mine?.matched && <div className="mt-4 flex items-center gap-2 rounded-xl bg-gold/15 p-3 text-sm text-gold"><Sparkles className="h-4 w-4" />Your profile meets this job's mandatory requirements.</div>}
            <div className="mt-5 grid grid-cols-2 gap-3 text-sm md:grid-cols-4">
              <Info icon={<MapPin />} label="Location" value={job.location} />
              <Info icon={<Banknote />} label="Salary" value={salaryRange(job.salary_min, job.salary_max)} />
              <Info icon={<GraduationCap />} label="Education" value={eduLabel(job.education_level)} />
              <Info icon={<Briefcase />} label="Experience" value={`${job.min_experience}+ yrs`} />
            </div>
          </GlassCard>
          <GlassCard>
            <h2 className="mb-3 text-lg font-semibold">Job description</h2>
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-muted-foreground">{job.description}</p>
          </GlassCard>
          <GlassCard className="space-y-4 text-sm">
            <h2 className="text-lg font-semibold">Requirements</h2>
            <Req label="Mandatory skills" items={job.skills_required} />
            <Req label="Preferred skills" items={job.skills_preferred} />
            <Req label="Languages" items={job.languages} />
            <Req label="Fields of study" items={job.fields_of_study} />
            {job.qualifications && <P label="Academic qualifications" v={job.qualifications} />}
            {job.certifications && <P label="Certifications" v={job.certifications} />}
            {job.gender_requirement !== "Any" && <P label="Gender requirement" v={job.gender_requirement} />}
            {job.additional_requirements && <P label="Additional eligibility" v={job.additional_requirements} />}
            {job.required_documents && <P label="Required documents" v={job.required_documents} />}
            {job.instructions && <P label="How to apply" v={job.instructions} />}
          </GlassCard>
        </div>
        <aside className="space-y-4">
          <GlassCard className="space-y-3">
            <div className="flex items-center gap-2 text-sm text-muted-foreground"><Clock className="h-4 w-4" />Deadline: {job.deadline ?? "Open"}</div>
            <div className="text-sm text-muted-foreground">{job.positions} position(s) · {job.employment_type}</div>
            {mine?.app ? (
              <div className="flex items-center justify-between rounded-xl bg-secondary p-3 text-sm">Applied <StatusPill status={mine.app.status} /></div>
            ) : isSeeker ? (
              <Button variant="hero" size="lg" className="w-full" disabled={closed} onClick={() => setApplyOpen(true)}>{closed ? "Applications closed" : "Apply Now"}</Button>
            ) : !me ? (
              <Button asChild variant="hero" size="lg" className="w-full"><Link to="/login/seeker">Sign in to apply</Link></Button>
            ) : null}
            {isSeeker && (
              <div className="grid grid-cols-2 gap-2">
                <Button variant="glass" onClick={toggleSave}>{mine?.saved ? <BookmarkCheck /> : <Bookmark />}{mine?.saved ? "Saved" : "Save"}</Button>
                <Button variant="glass" onClick={messageEmployer}><MessageSquare />Message</Button>
              </div>
            )}
            <button onClick={report} className="flex w-full items-center justify-center gap-1 pt-2 text-xs text-muted-foreground hover:text-destructive"><Flag className="h-3 w-3" />Report this job</button>
          </GlassCard>
        </aside>
      </main>
      {isSeeker && me && <ApplyDialog open={applyOpen} onOpenChange={setApplyOpen} jobId={id} userId={me.id} onDone={() => qc.invalidateQueries({ queryKey: ["job-mine", id] })} />}
    </div>
  );
}

function Info({ icon, label, value }: { icon: React.ReactNode; label: string; value: string }) {
  return <div className="rounded-xl bg-secondary/60 p-3 [&_svg]:h-4 [&_svg]:w-4"><div className="flex items-center gap-1 text-xs text-muted-foreground">{icon}{label}</div><div className="mt-1 font-semibold">{value}</div></div>;
}
function Req({ label, items }: { label: string; items: string[] }) {
  if (!items.length) return null;
  return <div><div className="mb-1.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div><div className="flex flex-wrap gap-2">{items.map((s) => <span key={s} className="rounded-full border border-border px-3 py-1 text-xs">{s}</span>)}</div></div>;
}
function P({ label, v }: { label: string; v: string }) {
  return <div><div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</div><p className="mt-1 whitespace-pre-wrap text-muted-foreground">{v}</p></div>;
}

function ApplyDialog({ open, onOpenChange, jobId, userId, onDone }: { open: boolean; onOpenChange: (o: boolean) => void; jobId: string; userId: string; onDone: () => void }) {
  const [cover, setCover] = useState("");
  const [answers, setAnswers] = useState("");
  const [cv, setCv] = useState<File | null>(null);
  const [certs, setCerts] = useState<FileList | null>(null);
  const [busy, setBusy] = useState(false);
  const { data: profileCv } = useQuery({ queryKey: ["my-cv", userId], queryFn: async () => (await supabase.from("seeker_profiles").select("cv_path").eq("user_id", userId).maybeSingle()).data?.cv_path ?? null });

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setBusy(true);
    try {
      const cv_path = cv ? await uploadFile("documents", userId, cv, "applications") : profileCv;
      if (!cv_path) throw new Error("Please attach a CV (or upload one to your profile).");
      const document_paths: string[] = [];
      for (const f of Array.from(certs ?? [])) document_paths.push(await uploadFile("documents", userId, f, "applications"));
      const { error } = await supabase.from("applications").insert({ job_id: jobId, seeker_id: userId, cover_letter: cover, answers, cv_path, document_paths });
      if (error) throw error;
      toast.success("Application submitted!");
      onOpenChange(false);
      onDone();
    } catch (err) {
      toast.error((err as Error).message);
    } finally { setBusy(false); }
  }
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="glass max-w-lg">
        <DialogHeader><DialogTitle>Apply for this job</DialogTitle></DialogHeader>
        <form onSubmit={submit} className="space-y-4">
          <Field label="CV / resume" hint={profileCv ? "Your profile CV will be used unless you attach another." : "No CV on your profile yet — attach one."}>
            <input type="file" accept=".pdf,.doc,.docx" onChange={(e) => setCv(e.target.files?.[0] ?? null)} className="text-sm" />
          </Field>
          <Field label="Academic certificates (optional)"><input type="file" multiple accept=".pdf,.jpg,.jpeg,.png" onChange={(e) => setCerts(e.target.files)} className="text-sm" /></Field>
          <Field label="Cover letter"><Textarea rows={5} required value={cover} onChange={(e) => setCover(e.target.value)} /></Field>
          <Field label="Answers to employer questions (optional)"><Textarea rows={3} value={answers} onChange={(e) => setAnswers(e.target.value)} /></Field>
          <Button variant="hero" className="w-full" disabled={busy}>{busy && <Loader2 className="animate-spin" />}Submit application</Button>
        </form>
      </DialogContent>
    </Dialog>
  );
}
