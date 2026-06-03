export const DAY_NAMES: Record<number, string> = {
  0: "الأحد",
  1: "الإثنين",
  2: "الثلاثاء",
  3: "الأربعاء",
  4: "الخميس",
  5: "الجمعة",
  6: "السبت",
};

/** Formats a 24-hour "HH:mm" string to Arabic 12-hour with ص/م. */
export function formatTimeStr(time: string): string {
  const [h, m] = time.split(":").map(Number);
  const period = h < 12 ? "صباحاً" : "مساءً";
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return m === 0
    ? `${h12} ${period}`
    : `${h12}:${String(m).padStart(2, "0")} ${period}`;
}

export function formatSchedule(
  nextWorkingDay: number,
  startTime: string | null,
  endTime: string | null,
  isOpen: boolean,
): string {
  if (!startTime || !endTime) return "";

  const range = `من ${formatTimeStr(startTime)} - ${formatTimeStr(endTime)}`;

  if (isOpen) return range;

  const today = new Date().getUTCDay();
  const diff = (nextWorkingDay - today + 7) % 7;
  return `${diff === 1 ? "غداً" : DAY_NAMES[nextWorkingDay]}: ${range}`;
}

/** Returns the first non-title character of a doctor's name for Avatar fallback. */
export function nameInitial(name: string): string {
  return name.replace(/^د\.?\s*/i, "").charAt(0);
}
