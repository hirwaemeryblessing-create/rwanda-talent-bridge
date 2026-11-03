import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { Search, SlidersHorizontal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { PublicHeader } from "@/components/PublicHeader";
import { Input } from "@/components/ui/input";
import { Field, NativeSelect, Empty } from "@/components/Kit";
import { JobCard, JOB_SELECT, type JobWithInst } from "@/components/JobCard";
import { EDUCATION_LEVELS, EMPLOYMENT_TYPES, JOB_LOCATIONS } from "@/lib/rwanda";

export const Route = createFileRoute("/jobs/")({
  head: () => ({
    meta: [
      { title: "Jobs in Rwanda — hiJOBS RWANDA" },
      { name: "description", content: "Search jobs by title, industry, location, education, experience, salary and institution." },
      { property: "og:title", content: "Jobs in Rwanda — hiJOBS RWANDA" },
      { property: "og:description", content: "Search current vacancies across all 30 districts." },
    ],
  }),
  component: JobsPage,
});

const RANK: Record<string, number> = Object.fromEntries(EDUCATION_LEVELS.map((e, i) => [e.value, i + 1]));

function JobsPage() {
  const [q, setQ] = useState("");
  const [f, setF] = useState({ category: "", location: "", education: "", experience: "", type: "", salary: "", institution: "", deadline: "" });
  const set = (k: keyof typeof f) => (v: string) => setF((s) => ({ ...s, [k]: v }));

  const { data: jobs = [], isLoading } = useQuery({
    queryKey: ["jobs", "published"],
    queryFn: async () => {
      const { data, error } = await supabase.from("jobs").select(JOB_SELECT).eq("status", "published").order("created_at", { ascending: false }).limit(500);
      if (error) throw error;
      return data as unknown as JobWithInst[];
    },
  });
  const { data: cats = [] } = useQuery({ queryKey: ["categories"], queryFn: async () => (await supabase.from("categories").select("name").order("name")).data?.map((c) => c.name) ?? [] });

  const list = useMemo(() => jobs.filter((j) => {
    const s = q.toLowerCase();
    if (s && !(`${j.title} ${j.description} ${j.institution?.name} ${j.skills_required.join(" ")}`.toLowerCase().includes(s))) return false;
    if (f.category && j.category !== f.category) return false;
    if (f.location && j.location !== f.location) return false;
    if (f.education && (RANK[j.education_level ?? ""] ?? 0) > RANK[f.education]) return false;
    if (f.experience && j.min_experience > Number(f.experience)) return false;
    if (f.type && j.employment_type !== f.type) return false;
    if (f.salary && (j.salary_max ?? j.salary_min ?? 0) < Number(f.salary)) return false;
    if (f.institution && !j.institution?.name.toLowerCase().includes(f.institution.toLowerCase())) return false;
    if (f.deadline && j.deadline && j.deadline < f.deadline) return false;
    return true;
  }), [jobs, q, f]);

  return (
    <div className="min-h-screen">
      <PublicHeader />
      <main className="mx-auto max-w-7xl px-4 py-8">
        <h1 className="text-3xl font-bold md:text-4xl">Find your next opportunity</h1>
        <div className="glass mt-6 flex items-center gap-3 rounded-2xl p-2 pl-4">
          <Search className="h-5 w-5 text-muted-foreground" />
          <Input className="border-0 bg-transparent text-base shadow-none focus-visible:ring-0" placeholder="Job title, skill or institution…" value={q} onChange={(e) => setQ(e.target.value)} />
        </div>
        <div className="mt-6 grid gap-6 lg:grid-cols-[280px_1fr]">
          <aside className="glass h-fit space-y-4 rounded-2xl p-5">
            <div className="flex items-center gap-2 font-semibold"><SlidersHorizontal className="h-4 w-4" />Filters</div>
            <Field label="Industry"><NativeSelect value={f.category} onChange={set("category")} placeholder="All" options={cats} /></Field>
            <Field label="Location"><NativeSelect value={f.location} onChange={set("location")} placeholder="All" options={JOB_LOCATIONS} /></Field>
            <Field label="My education level"><NativeSelect value={f.education} onChange={set("education")} placeholder="Any" options={EDUCATION_LEVELS} /></Field>
            <Field label="My years of experience"><Input type="number" min={0} value={f.experience} onChange={(e) => set("experience")(e.target.value)} /></Field>
            <Field label="Employment type"><NativeSelect value={f.type} onChange={set("type")} placeholder="All" options={EMPLOYMENT_TYPES} /></Field>
            <Field label="Minimum salary (RWF)"><Input type="number" min={0} step={50000} value={f.salary} onChange={(e) => set("salary")(e.target.value)} /></Field>
            <Field label="Institution"><Input value={f.institution} onChange={(e) => set("institution")(e.target.value)} /></Field>
            <Field label="Deadline on/after"><Input type="date" value={f.deadline} onChange={(e) => set("deadline")(e.target.value)} /></Field>
          </aside>
          <section className="space-y-4">
            <p className="text-sm text-muted-foreground">{isLoading ? "Loading…" : `${list.length} job(s)`}</p>
            {!isLoading && list.length === 0 && <Empty>No jobs match these filters yet.</Empty>}
            {list.map((j) => <JobCard key={j.id} job={j} />)}
          </section>
        </div>
      </main>
    </div>
  );
}
