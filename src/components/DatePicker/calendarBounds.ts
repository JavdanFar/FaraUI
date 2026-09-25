import { getJalaliMonthLength, isSupportedJalaliYear, type JalaliDate } from "./jalali";

export const MIN_CALENDAR_YEAR = 1300;
export const MAX_CALENDAR_YEAR = 1500;

export interface YearMonth {
  year: number;
  month: number;
}

export function compareJalali(a: JalaliDate, b: JalaliDate): number {
  if (a.year !== b.year) return a.year - b.year;
  if (a.month !== b.month) return a.month - b.month;
  return a.day - b.day;
}

export function compareYearMonth(a: YearMonth, b: YearMonth): number {
  if (a.year !== b.year) return a.year - b.year;
  return a.month - b.month;
}

function clampDay(date: JalaliDate): JalaliDate {
  const length = isSupportedJalaliYear(date.year)
    ? getJalaliMonthLength(date.year, date.month)
    : 31;
  return date.day > length ? { ...date, day: length } : date;
}

export function clampJalaliDate(
  date: JalaliDate,
  min: JalaliDate | null,
  max: JalaliDate | null,
): JalaliDate {
  const clamped = clampDay(date);
  if (min && compareJalali(clamped, min) < 0) return clampDay(min);
  if (max && compareJalali(clamped, max) > 0) return clampDay(max);
  return clamped;
}
