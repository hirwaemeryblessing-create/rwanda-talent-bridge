import { Link } from "@tanstack/react-router";
import { Logo } from "@/components/Logo";
import { Button } from "@/components/ui/button";
import { useI18n, type Lang } from "@/lib/i18n";
import { useSession } from "@/lib/session";

export function LangSwitch() {
  const { lang, setLang } = useI18n();
  return (
    <div className="flex rounded-lg border border-border p-0.5 text-xs">
      {(["en", "rw", "fr"] as Lang[]).map((l) => (
        <button key={l} onClick={() => setLang(l)}
          className={`rounded-md px-2 py-1 font-semibold uppercase ${lang === l ? "bg-primary text-primary-foreground" : "text-muted-foreground"}`}>
          {l}
        </button>
      ))}
    </div>
  );
}

export function PublicHeader() {
  const { t } = useI18n();
  const { user } = useSession();
  return (
    <header className="sticky top-0 z-30 border-b border-border/50 bg-background/40 backdrop-blur-xl">
      <div className="mx-auto flex h-16 max-w-7xl items-center justify-between gap-4 px-4">
        <Link to="/"><Logo className="h-10" /></Link>
        <nav className="flex items-center gap-2">
          <Link to="/jobs" className="hidden px-3 text-sm text-muted-foreground hover:text-foreground sm:block">{t("browse")}</Link>
          <LangSwitch />
          {user ? (
            <Button asChild variant="hero" size="sm"><Link to="/dashboard">{t("dashboard")}</Link></Button>
          ) : (
            <Button asChild variant="glass" size="sm"><Link to="/auth">{t("signin")}</Link></Button>
          )}
        </nav>
      </div>
    </header>
  );
}
