import { describe, it, expect } from "vitest";
import { cn, safeFormatDate, safeFormatDateTime } from "../utils";

describe("cn", () => {
  it("merges class names", () => {
    expect(cn("foo", "bar")).toBe("foo bar");
  });

  it("handles conditional classes", () => {
    const isHidden = false;
    expect(cn("base", isHidden && "hidden", "visible")).toBe("base visible");
  });

  it("merges tailwind classes correctly", () => {
    const result = cn("px-2 py-1", "px-4");
    // px-2 should be replaced by px-4, py-1 should remain
    expect(result).toContain("px-4");
    expect(result).toContain("py-1");
    expect(result).not.toContain("px-2");
  });

  it("handles empty inputs", () => {
    expect(cn()).toBe("");
  });
});

describe("safeFormatDate", () => {
  it("formats a valid date string", () => {
    const result = safeFormatDate("2024-01-15");
    expect(result).toBeTruthy();
    expect(result).not.toBe("\u2014");
  });

  it("returns fallback for null", () => {
    expect(safeFormatDate(null)).toBe("\u2014");
  });

  it("returns fallback for undefined", () => {
    expect(safeFormatDate(undefined)).toBe("\u2014");
  });

  it("returns fallback for invalid string", () => {
    expect(safeFormatDate("not-a-date")).toBe("\u2014");
  });

  it("returns custom fallback when provided", () => {
    expect(safeFormatDate(null, "N/A")).toBe("N/A");
  });
});

describe("safeFormatDateTime", () => {
  it("formats a valid datetime string", () => {
    const result = safeFormatDateTime("2024-01-15T10:30:00Z");
    expect(result).toBeTruthy();
    expect(result).not.toBe("\u2014");
  });

  it("returns fallback for null", () => {
    expect(safeFormatDateTime(null)).toBe("\u2014");
  });

  it("returns fallback for undefined", () => {
    expect(safeFormatDateTime(undefined)).toBe("\u2014");
  });

  it("returns fallback for invalid string", () => {
    expect(safeFormatDateTime("garbage")).toBe("\u2014");
  });

  it("returns custom fallback when provided", () => {
    expect(safeFormatDateTime(null, "N/A")).toBe("N/A");
  });
});
