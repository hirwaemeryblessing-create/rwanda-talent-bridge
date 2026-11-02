export const PROVINCES: Record<string, string[]> = {
  "Kigali City": ["Gasabo", "Kicukiro", "Nyarugenge"],
  "Northern Province": ["Burera", "Gakenke", "Gicumbi", "Musanze", "Rulindo"],
  "Southern Province": ["Gisagara", "Huye", "Kamonyi", "Muhanga", "Nyamagabe", "Nyanza", "Nyaruguru", "Ruhango"],
  "Eastern Province": ["Bugesera", "Gatsibo", "Kayonza", "Kirehe", "Ngoma", "Nyagatare", "Rwamagana"],
  "Western Province": ["Karongi", "Ngororero", "Nyabihu", "Nyamasheke", "Rubavu", "Rusizi", "Rutsiro"],
};
export const PROVINCE_NAMES = Object.keys(PROVINCES);
export const DISTRICTS = Object.values(PROVINCES).flat().sort();
export const JOB_LOCATIONS = ["Any", "Remote", "Kigali", ...DISTRICTS, "International"];

export const EDUCATION_LEVELS = [
  { value: "primary", label: "Primary" },
  { value: "secondary", label: "Secondary (A2)" },
  { value: "certificate", label: "Certificate" },
  { value: "diploma", label: "Diploma (A1)" },
  { value: "bachelor", label: "Bachelor's degree (A0)" },
  { value: "master", label: "Master's degree" },
  { value: "phd", label: "PhD / Doctorate" },
];
export const eduLabel = (v?: string | null) => EDUCATION_LEVELS.find((e) => e.value === v)?.label ?? "Any";

export const LANGUAGES = ["Kinyarwanda", "English", "French", "Kiswahili", "Other"];
export const EMPLOYMENT_TYPES = ["Full-time", "Part-time", "Contract", "Internship", "Temporary", "Volunteer", "Consultancy"];
export const INSTITUTION_TYPES = ["Private company", "Government institution", "NGO", "International organization", "Public company", "School / University", "Hospital / Clinic", "Startup", "Other"];

export function formatRWF(n?: number | null) {
  if (n == null) return "";
  return `${new Intl.NumberFormat("en-US").format(n)} RWF`;
}
export function salaryRange(min?: number | null, max?: number | null) {
  if (min == null && max == null) return "Negotiable";
  if (min != null && max != null) return `${formatRWF(min)} – ${formatRWF(max)}`;
  return formatRWF(min ?? max);
}

/** Rwandan mobile numbers: 07[2,3,8,9]XXXXXXX, optionally prefixed with +250 / 250. */
export function normalizeRwPhone(input: string): string | null {
  const digits = input.replace(/[^\d]/g, "");
  let local = digits;
  if (local.startsWith("250")) local = local.slice(3);
  if (local.startsWith("0")) local = local.slice(1);
  if (!/^7[2389]\d{7}$/.test(local)) return null;
  return `+250${local}`;
}
export function displayRwPhone(p?: string | null) {
  if (!p) return "";
  const n = normalizeRwPhone(p);
  if (!n) return p;
  return `+250 ${n.slice(4, 7)} ${n.slice(7, 10)} ${n.slice(10)}`;
}

export const splitList = (s: string) =>
  s.split(",").map((x) => x.trim()).filter(Boolean);
