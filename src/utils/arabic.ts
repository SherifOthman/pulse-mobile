const ARABIC_DAY_NAMES: Record<number, string> = {
  0: "الأحد",
  1: "الإثنين",
  2: "الثلاثاء",
  3: "الأربعاء",
  4: "الخميس",
  5: "الجمعة",
  6: "السبت",
};

export function getArabicDayName(dayOfWeek: number): string {
  return ARABIC_DAY_NAMES[dayOfWeek] ?? "";
}

export function formatTime(hour: number, minute: number): string {
  const period = hour < 12 ? "صباحاً" : "مساءً";
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return minute === 0
    ? `${h12} ${period}`
    : `${h12}:${String(minute).padStart(2, "0")} ${period}`;
}

function parseTime(timeStr: string): { hour: number; minute: number } | null {
  const parts = timeStr.split(":");
  if (parts.length < 2) return null;
  return { hour: parseInt(parts[0], 10), minute: parseInt(parts[1], 10) };
}

export function formatSchedule(
  isOpen: boolean,
  todayStart: string | null,
  todayEnd: string | null,
  nextDayOfWeek: number | null,
  nextStart: string | null,
  nextEnd: string | null,
): string {
  if (isOpen && todayStart && todayEnd) {
    const s = parseTime(todayStart);
    const e = parseTime(todayEnd);
    if (!s || !e) return "";
    return `من ${formatTime(s.hour, s.minute)} - ${formatTime(e.hour, e.minute)}`;
  }

  if (!isOpen && nextDayOfWeek != null && nextStart && nextEnd) {
    const s = parseTime(nextStart);
    const e = parseTime(nextEnd);
    if (!s || !e) return "";

    const today = new Date().getDay();
    const diff = (nextDayOfWeek - today + 7) % 7;
    const prefix = diff === 1 ? "غداً" : getArabicDayName(nextDayOfWeek);

    return `${prefix}: ${formatTime(s.hour, s.minute)} - ${formatTime(e.hour, e.minute)}`;
  }

  return "";
}
