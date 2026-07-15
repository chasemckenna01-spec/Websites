// Local-time calendar helpers. Day keys are YYYY-MM-DD built from local date
// parts (not toISOString, which would shift by the UTC offset near midnight).

export function dayKeyFromDate(d: Date): string {
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

export function todayDayKey(): string {
  return dayKeyFromDate(new Date());
}

export function addMonths(date: Date, amount: number): Date {
  const d = new Date(date);
  d.setDate(1);
  d.setMonth(d.getMonth() + amount);
  return d;
}

export function monthLabel(date: Date): string {
  return date.toLocaleDateString("en-US", { month: "long", year: "numeric" });
}

export type CalendarDay = {
  date: Date;
  dayKey: string;
  inCurrentMonth: boolean;
};

export function getMonthGrid(monthAnchor: Date): CalendarDay[] {
  const year = monthAnchor.getFullYear();
  const month = monthAnchor.getMonth();

  const firstOfMonth = new Date(year, month, 1);
  const startWeekday = firstOfMonth.getDay(); // 0 = Sunday
  const daysInMonth = new Date(year, month + 1, 0).getDate();

  const gridStart = new Date(year, month, 1 - startWeekday);
  const totalCells = Math.ceil((startWeekday + daysInMonth) / 7) * 7;

  const days: CalendarDay[] = [];
  for (let i = 0; i < totalCells; i++) {
    const date = new Date(gridStart);
    date.setDate(gridStart.getDate() + i);
    days.push({
      date,
      dayKey: dayKeyFromDate(date),
      inCurrentMonth: date.getMonth() === month,
    });
  }
  return days;
}

export function monthRangeKeys(monthAnchor: Date): { start: string; end: string } {
  const year = monthAnchor.getFullYear();
  const month = monthAnchor.getMonth();
  const start = new Date(year, month, 1);
  const end = new Date(year, month + 1, 0);
  return { start: dayKeyFromDate(start), end: dayKeyFromDate(end) };
}
