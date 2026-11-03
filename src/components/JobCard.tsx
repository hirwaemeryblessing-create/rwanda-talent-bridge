import { Link } from "@tanstack/react-router";
import { MapPin, Clock, Banknote, BadgeCheck, Building2 } from "lucide-react";
import { salaryRange } from "@/lib/rwanda";
import type { Tables } from "@/integrations/supabase/types";

export type JobWithInst = Tables<"jobs"> & { institution: { name: string; logo_url: string | null; verified: boolean } | null };
export const JOB_SELECT = "*, institution:institution_profiles(name, logo_url, verified)";

export function InstLogo({ url, className = "h-12 w-12" }: { url?: string | null; className?: string }) {
  return url ? <img src={url} alt="" className={`${className} rounded-xl border border-border bg-foreground object-contain p-1`} />
    : <div className={`${className} flex items-center justify-center rounded-xl bg-gradient-primary`}><Building2 className="h-5 w-5" /></div>;
}

export function JobCard({ job, extra }: { job: JobWithInst; extra?: React.ReactNode }) {
  const days = job.deadline ? Math.ceil((new Date(job.deadline).getTime() - Date.now()) / 864e5) : null;
  return (
    <Link to="/jobs/$id" params={{ id: job.id }} className="glass float-card block rounded-2xl p-5">
      <div className="flex gap-4">
        <InstLogo url={job.institution?.logo_url} />
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center gap-2">
            <h3 className="truncate text-lg font-semibold">{job.title}</h3>
            {job.employment_type && <span className="rounded-full bg-primary/20 px-2 py-0.5 text-xs text-primary-glow">{job.employment_type}</span>}
          </div>
          <p className="flex items-center gap-1 text-sm text-muted-foreground">
            {job.institution?.name}{job.institution?.verified && <BadgeCheck className="h-4 w-4 text-gold" />}
          </p>
          <div className="mt-3 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
            <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{job.location}</span>
            <span className="flex items-center gap-1"><Banknote className="h-3.5 w-3.5" />{salaryRange(job.salary_min, job.salary_max)}</span>
            {days != null && <span className={`flex items-center gap-1 ${days < 0 ? "text-destructive" : days <= 5 ? "text-gold" : ""}`}><Clock className="h-3.5 w-3.5" />{days < 0 ? "Closed" : `${days} day(s) left`}</span>}
          </div>
        </div>
        {extra}
      </div>
    </Link>
  );
}
