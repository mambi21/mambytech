/** Formats "YYYY-MM" as "Mar 2024", "YYYY" as "2024", and "present" as "Present". Other text is returned unchanged. */
export function formatMonth(value: string): string {
  if (value === "present") return "Present";
  const month = /^(\d{4})-(\d{2})$/.exec(value);
  if (month) {
    return new Date(Date.UTC(Number(month[1]), Number(month[2]) - 1, 1)).toLocaleDateString("en-US", {
      month: "short",
      year: "numeric",
      timeZone: "UTC",
    });
  }
  return value;
}

/** Formats "YYYY-MM-DD" as "Oct 4, 2026". */
export function formatDate(value: string): string {
  return new Date(`${value}T00:00:00Z`).toLocaleDateString("en-US", { dateStyle: "medium", timeZone: "UTC" });
}
