import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "rw" | "fr";
const dict = {
  en: {
    slogan: "Connecting Talent to Opportunity.",
    seekerCta: "I AM LOOKING FOR A JOB",
    instCta: "I AM AN INSTITUTION OFFERING JOBS",
    browse: "Browse jobs",
    signin: "Sign in",
    dashboard: "Dashboard",
    messages: "My Messages",
    notifications: "Notifications",
    logout: "Logout",
    heroSub: "Rwanda's smart recruitment platform. Employers publish — eligible talent is notified instantly.",
  },
  rw: {
    slogan: "Duhuza Impano n'Amahirwe.",
    seekerCta: "NDASHAKA AKAZI",
    instCta: "NDI IKIGO GITANGA AKAZI",
    browse: "Reba imirimo",
    signin: "Injira",
    dashboard: "Ikibaho",
    messages: "Ubutumwa bwanjye",
    notifications: "Amatangazo",
    logout: "Sohoka",
    heroSub: "Urubuga rw'u Rwanda rwo gushaka abakozi. Ibigo bitangaza — abujuje ibisabwa bamenyeshwa ako kanya.",
  },
  fr: {
    slogan: "Connecter les talents aux opportunités.",
    seekerCta: "JE CHERCHE UN EMPLOI",
    instCta: "JE SUIS UNE INSTITUTION QUI RECRUTE",
    browse: "Voir les offres",
    signin: "Se connecter",
    dashboard: "Tableau de bord",
    messages: "Mes messages",
    notifications: "Notifications",
    logout: "Déconnexion",
    heroSub: "La plateforme de recrutement intelligente du Rwanda. Les employeurs publient — les talents éligibles sont notifiés instantanément.",
  },
} as const;
type Key = keyof (typeof dict)["en"];

const Ctx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: Key) => string }>({
  lang: "en", setLang: () => {}, t: (k) => dict.en[k],
});

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");
  useEffect(() => {
    const s = localStorage.getItem("hijobs-lang") as Lang | null;
    if (s && s in dict) setLangState(s);
  }, []);
  const setLang = (l: Lang) => { setLangState(l); localStorage.setItem("hijobs-lang", l); };
  return <Ctx.Provider value={{ lang, setLang, t: (k) => dict[lang][k] }}>{children}</Ctx.Provider>;
}
export const useI18n = () => useContext(Ctx);
