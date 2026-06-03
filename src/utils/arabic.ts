const DAY_NAMES: Record<number, string> = {
  0: "الأحد",
  1: "الإثنين",
  2: "الثلاثاء",
  3: "الأربعاء",
  4: "الخميس",
  5: "الجمعة",
  6: "السبت",
};

function formatTime(hour: number, minute: number): string {
  const period = hour < 12 ? "صباحاً" : "مساءً";
  const h12 = hour === 0 ? 12 : hour > 12 ? hour - 12 : hour;
  return minute === 0
    ? `${h12} ${period}`
    : `${h12}:${String(minute).padStart(2, "0")} ${period}`;
}

export function formatSchedule(
  nextWorkingDay: number,
  startTime: string | null,
  endTime: string | null,
  isOpen: boolean,
): string {
  if (!startTime || !endTime) return "";

  const [sh, sm] = startTime.split(":").map(Number);
  const [eh, em] = endTime.split(":").map(Number);
  const range = `من ${formatTime(sh, sm)} - ${formatTime(eh, em)}`;

  if (isOpen) return range;

  const today = new Date().getUTCDay();
  const diff = (nextWorkingDay - today + 7) % 7;
  return `${diff === 1 ? "غداً" : DAY_NAMES[nextWorkingDay]}: ${range}`;
}
