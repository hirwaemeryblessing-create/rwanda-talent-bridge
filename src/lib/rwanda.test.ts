import { describe, expect, it } from "vitest";
import { DISTRICTS, PROVINCE_NAMES, formatRWF, normalizeRwPhone } from "./rwanda";

describe("Rwanda localization", () => {
  it("lists all 30 districts", () => expect(DISTRICTS).toHaveLength(30));
  it("lists Kigali and the 4 provinces", () => expect(PROVINCE_NAMES).toHaveLength(5));
  it("formats salaries in RWF", () => expect(formatRWF(350000)).toBe("350,000 RWF"));
  it("normalizes local mobile numbers to +250", () => expect(normalizeRwPhone("0788 123 456")).toBe("+250788123456"));
  it("accepts +250 numbers", () => expect(normalizeRwPhone("+250 722 123 456")).toBe("+250722123456"));
  it("rejects non-Rwandan numbers", () => expect(normalizeRwPhone("0612345678")).toBeNull());
});
