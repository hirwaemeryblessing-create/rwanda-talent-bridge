import logo from "@/assets/hijobs-logo.png";
import icon from "@/assets/hijobs-icon.png";
import { cn } from "@/lib/utils";

export function Logo({ className, compact = false }: { className?: string; compact?: boolean }) {
  if (compact) return <img src={icon} alt="hiJOBS RWANDA" width={40} height={40} className={cn("h-10 w-10 object-contain", className)} />;
  return <img src={logo} alt="hiJOBS RWANDA" width={1280} height={768} className={cn("h-12 w-auto object-contain", className)} />;
}

/** Animated 3D floating logo with light sweep, for the opening/loading screens. */
export function AnimatedLogo({ className }: { className?: string }) {
  return (
    <div className={cn("relative mx-auto animate-logo", className)}>
      <div className="absolute inset-x-10 bottom-0 h-8 rounded-full bg-primary/40 blur-2xl" />
      <div className="relative overflow-hidden rounded-3xl">
        <img src={logo} alt="hiJOBS RWANDA" width={1280} height={768} className="relative w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)]" />
        <span className="pointer-events-none absolute inset-y-0 left-0 w-1/3 bg-gradient-to-r from-transparent via-foreground/25 to-transparent animate-shine" />
      </div>
    </div>
  );
}

export function LoadingScreen() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-6">
      <img src={icon} alt="" width={96} height={96} className="h-24 w-24 animate-logo" />
      <div className="h-1 w-40 overflow-hidden rounded-full bg-muted">
        <div className="h-full w-1/3 bg-gradient-primary animate-shine" />
      </div>
    </div>
  );
}
