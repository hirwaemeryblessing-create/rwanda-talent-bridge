import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Briefcase, Building2, Sparkles, BellRing, ShieldCheck, ArrowRight } from "lucide-react";
import { AnimatedLogo, LoadingScreen } from "@/components/Logo";
import { PublicHeader } from "@/components/PublicHeader";
import { useI18n } from "@/lib/i18n";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "hiJOBS RWANDA — Connecting Talent to Opportunity" },
      { name: "description", content: "Find jobs across Rwanda's 30 districts or recruit qualified talent. Eligible candidates are matched and notified automatically." },
      { property: "og:title", content: "hiJOBS RWANDA — Connecting Talent to Opportunity" },
      { property: "og:description", content: "Rwanda's smart recruitment platform with automatic job matching." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Welcome,
});

function Welcome() {
  const { t } = useI18n();
  const [splash, setSplash] = useState(true);
  useEffect(() => { const id = setTimeout(() => setSplash(false), 900); return () => clearTimeout(id); }, []);
  if (splash) return <LoadingScreen />;

  return (
    <div className="relative min-h-screen overflow-hidden">
      <div className="pointer-events-none absolute -left-32 top-24 h-96 w-96 rounded-full bg-primary/30 blur-3xl animate-orb" />
      <div className="pointer-events-none absolute -right-20 top-80 h-80 w-80 rounded-full bg-gold/15 blur-3xl animate-orb" />
      <PublicHeader />
      <main className="relative mx-auto max-w-6xl px-4 pb-20 pt-10 text-center">
        <AnimatedLogo className="max-w-xl" />
        <h1 className="mt-6 text-3xl font-extrabold md:text-5xl text-gradient animate-rise">{t("slogan")}</h1>
        <p className="mx-auto mt-4 max-w-2xl text-muted-foreground animate-rise">{t("heroSub")}</p>

        <div className="mx-auto mt-10 grid max-w-4xl gap-5 md:grid-cols-2 animate-rise">
          <ChoiceCard to="/join/seeker" icon={<Briefcase className="h-7 w-7" />} title={t("seekerCta")}
            sub="Create your profile once — get notified when a job fits you." accent="primary" />
          <ChoiceCard to="/join/institution" icon={<Building2 className="h-7 w-7" />} title={t("instCta")}
            sub="Publish vacancies and instantly reach every eligible candidate." accent="gold" />
        </div>
        <p className="mt-6 text-sm text-muted-foreground">
          Already registered? <Link to="/auth" className="font-semibold text-primary-glow hover:underline">{t("signin")}</Link>
          {" · "}<Link to="/jobs" className="font-semibold text-primary-glow hover:underline">{t("browse")}</Link>
        </p>

        <div className="mt-20 grid gap-5 text-left md:grid-cols-3">
          {[
            { i: <Sparkles />, h: "Smart matching", p: "Every new vacancy is compared with every registered profile — education, experience, skills, languages and location." },
            { i: <BellRing />, h: "Instant inbox alerts", p: "Eligible candidates receive a personal message and notification the moment a job is published." },
            { i: <ShieldCheck />, h: "Private & secure", p: "Verified institutions, protected CVs, and you choose whether employers can view your profile." },
          ].map((f) => (
            <div key={f.h} className="glass float-card rounded-2xl p-6">
              <div className="mb-4 inline-flex rounded-xl bg-gradient-primary p-3 text-primary-foreground shadow-glow">{f.i}</div>
              <h3 className="text-lg font-semibold">{f.h}</h3>
              <p className="mt-2 text-sm text-muted-foreground">{f.p}</p>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

function ChoiceCard({ to, icon, title, sub, accent }: { to: "/join/seeker" | "/join/institution"; icon: React.ReactNode; title: string; sub: string; accent: "primary" | "gold" }) {
  return (
    <Link to={to} className="group glass float-card relative overflow-hidden rounded-3xl p-7 text-left">
      <div className={`mb-5 inline-flex rounded-2xl p-4 shadow-glow ${accent === "gold" ? "bg-gradient-gold text-gold-foreground" : "bg-gradient-primary text-primary-foreground"}`}>{icon}</div>
      <div className="font-display text-lg font-bold tracking-wide">{title}</div>
      <p className="mt-2 text-sm text-muted-foreground">{sub}</p>
      <ArrowRight className="absolute bottom-7 right-7 h-5 w-5 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-foreground" />
    </Link>
  );
}
