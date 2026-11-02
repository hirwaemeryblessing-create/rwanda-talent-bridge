import type { ReactNode } from "react";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";

export function Field({ label, children, hint, className }: { label: string; children: ReactNode; hint?: string; className?: string }) {
  return (
    <div className={cn("space-y-1.5", className)}>
      <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</Label>
      {children}
      {hint && <p className="text-xs text-muted-foreground">{hint}</p>}
    </div>
  );
}

export function NativeSelect({ value, onChange, options, placeholder, className, required }: {
  value: string; onChange: (v: string) => void; options: (string | { value: string; label: string })[];
  placeholder?: string; className?: string; required?: boolean;
}) {
  return (
    <select
      value={value}
      required={required}
      onChange={(e) => onChange(e.target.value)}
      className={cn("flex h-10 w-full rounded-lg border border-input bg-secondary/50 px-3 text-sm text-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring", className)}
    >
      {placeholder !== undefined && <option value="">{placeholder}</option>}
      {options.map((o) => {
        const v = typeof o === "string" ? o : o.value;
        const l = typeof o === "string" ? o : o.label;
        return <option key={v} value={v} className="bg-popover">{l}</option>;
      })}
    </select>
  );
}

export function MultiCheck({ options, value, onChange }: { options: string[]; value: string[]; onChange: (v: string[]) => void }) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((o) => {
        const on = value.includes(o);
        return (
          <button type="button" key={o}
            onClick={() => onChange(on ? value.filter((x) => x !== o) : [...value, o])}
            className={cn("rounded-full border px-3 py-1 text-xs font-medium transition", on ? "border-primary bg-primary/20 text-foreground" : "border-border text-muted-foreground hover:border-primary/50")}>
            {o}
          </button>
        );
      })}
    </div>
  );
}

export function GlassCard({ children, className }: { children: ReactNode; className?: string }) {
  return <div className={cn("glass rounded-2xl p-6", className)}>{children}</div>;
}

export function PageTitle({ title, sub, action }: { title: string; sub?: string; action?: ReactNode }) {
  return (
    <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
      <div>
        <h1 className="text-2xl font-bold md:text-3xl">{title}</h1>
        {sub && <p className="mt-1 text-sm text-muted-foreground">{sub}</p>}
      </div>
      {action}
    </div>
  );
}

export function Stat({ label, value, icon }: { label: string; value: ReactNode; icon?: ReactNode }) {
  return (
    <GlassCard className="float-card">
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">{label}</span>
        <span className="text-primary-glow">{icon}</span>
      </div>
      <div className="mt-3 font-display text-3xl font-bold">{value}</div>
    </GlassCard>
  );
}

export function Empty({ children }: { children: ReactNode }) {
  return <div className="rounded-2xl border border-dashed border-border p-10 text-center text-sm text-muted-foreground">{children}</div>;
}

const STATUS_STYLES: Record<string, string> = {
  submitted: "bg-secondary text-secondary-foreground",
  reviewing: "bg-primary/20 text-primary-glow",
  shortlisted: "bg-gold/20 text-gold",
  interview: "bg-primary/30 text-foreground",
  hired: "bg-success/20 text-success",
  rejected: "bg-destructive/20 text-destructive",
  published: "bg-success/20 text-success",
  closed: "bg-secondary text-muted-foreground",
  removed: "bg-destructive/20 text-destructive",
  scheduled: "bg-primary/20 text-primary-glow",
};
export function StatusPill({ status }: { status: string }) {
  return <span className={cn("rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize", STATUS_STYLES[status] ?? "bg-secondary")}>{status}</span>;
}
