import type { InputHTMLAttributes, KeyboardEvent, Ref } from "react";
import { useMemo, useRef, useState } from "react";
import clsx from "clsx";
import styles from "./DateRangePicker.module.css";
import { mergeRefs } from "../../utils/mergeRefs";
import { AnchoredPopup } from "../AnchoredPopup";
import {
  getJalaliMonthLength,
  getJalaliWeekday,
  getTodayJalali,
  isSameJalaliDate,
  jalaliToGregorian,
  gregorianToJalali,
  formatJalali,
  PERSIAN_MONTHS,
  PERSIAN_WEEKDAYS,
  type JalaliDate,
} from "../DatePicker/jalali";
import {
  MAX_CALENDAR_YEAR,
  MIN_CALENDAR_YEAR,
  compareJalali,
  compareYearMonth,
  type YearMonth,
} from "../DatePicker/calendarBounds";
import { ChevronIcon } from "../DatePicker/ChevronIcon";

const FRIDAY_WEEKDAY_INDEX = 6;

export interface DateRangeValue {
  start: JalaliDate;
  end: JalaliDate;
  startGregorian?: Date;
  endGregorian?: Date;
}

export interface DateRangePickerProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange"> {
  value?: DateRangeValue | null;
  defaultValue?: DateRangeValue | null;
  onChange?: (value: DateRangeValue) => void;
  minDate?: Date | JalaliDate;
  maxDate?: Date | JalaliDate;
  disabledDates?: (date: Date) => boolean;
  includeGregorian?: boolean;
  inputClassName?: string;
  ref?: Ref<HTMLInputElement>;
}

function isJalaliDateInput(input: Date | JalaliDate): input is JalaliDate {
  return !(input instanceof Date);
}

function toJalali(input: Date | JalaliDate): JalaliDate {
  return isJalaliDateInput(input) ? input : gregorianToJalali(input);
}

function addMonths(year: number, month: number, delta: number): YearMonth {
  const total = year * 12 + (month - 1) + delta;
  const y = Math.floor(total / 12);
  const m = (total % 12) + 1;
  return { year: y, month: m };
}

function buildValue(start: JalaliDate, end: JalaliDate, includeGregorian: boolean): DateRangeValue {
  const result: DateRangeValue = { start, end };
  if (includeGregorian) {
    result.startGregorian = jalaliToGregorian(start);
    result.endGregorian = jalaliToGregorian(end);
  }
  return result;
}

export function DateRangePicker({
  value,
  defaultValue = null,
  onChange,
  minDate,
  maxDate,
  disabledDates,
  includeGregorian = true,
  placeholder = "انتخاب بازهی تاریخ",
  disabled = false,
  className,
  inputClassName,
  ref,
  onKeyDown,
  ...rest
}: DateRangePickerProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<DateRangeValue | null>(defaultValue);
  const currentValue = isControlled ? (value ?? null) : internalValue;

  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const assignInputRef = useMemo(() => mergeRefs(inputRef, ref), [inputRef, ref]);
  const today = getTodayJalali();

  const [viewYear, setViewYear] = useState(currentValue?.start.year ?? today.year);
  const [viewMonth, setViewMonth] = useState(currentValue?.start.month ?? today.month);

  const [draftStart, setDraftStart] = useState<JalaliDate | null>(currentValue?.start ?? null);
  const [draftEnd, setDraftEnd] = useState<JalaliDate | null>(currentValue?.end ?? null);
  const [hoverDate, setHoverDate] = useState<JalaliDate | null>(null);

  const minJalali = minDate ? toJalali(minDate) : null;
  const maxJalali = maxDate ? toJalali(maxDate) : null;
  const minYearMonth: YearMonth = minJalali
    ? { year: minJalali.year, month: minJalali.month }
    : { year: MIN_CALENDAR_YEAR, month: 1 };
  const maxYearMonth: YearMonth = maxJalali
    ? { year: maxJalali.year, month: maxJalali.month }
    : { year: MAX_CALENDAR_YEAR, month: 12 };

  function isDateDisabled(cellDate: JalaliDate): boolean {
    if (minJalali && compareJalali(cellDate, minJalali) < 0) return true;
    if (maxJalali && compareJalali(cellDate, maxJalali) > 0) return true;
    if (disabledDates && disabledDates(jalaliToGregorian(cellDate))) return true;
    return false;
  }

  function openPicker() {
    if (disabled) return;
    setViewYear(currentValue?.start.year ?? today.year);
    setViewMonth(currentValue?.start.month ?? today.month);
    setDraftStart(currentValue?.start ?? null);
    setDraftEnd(currentValue?.end ?? null);
    setHoverDate(null);
    setIsOpen(true);
  }

  const canGoPrev = compareYearMonth({ year: viewYear, month: viewMonth }, minYearMonth) > 0;
  const nextMonthYM = addMonths(viewYear, viewMonth, 1);
  const canGoNext = compareYearMonth(nextMonthYM, maxYearMonth) < 0;

  function goToPreviousMonth() {
    if (!canGoPrev) return;
    const ym = addMonths(viewYear, viewMonth, -1);
    setViewYear(ym.year);
    setViewMonth(ym.month);
  }

  function goToNextMonth() {
    if (!canGoNext) return;
    const ym = addMonths(viewYear, viewMonth, 1);
    setViewYear(ym.year);
    setViewMonth(ym.month);
  }

  function handleDayClick(cellDate: JalaliDate) {
    if (isDateDisabled(cellDate)) return;

    if (!draftStart || (draftStart && draftEnd)) {
      setDraftStart(cellDate);
      setDraftEnd(null);
      setHoverDate(null);
      return;
    }

    let start = draftStart;
    let end = cellDate;
    if (compareJalali(end, start) < 0) {
      start = cellDate;
      end = draftStart;
    }

    setDraftStart(start);
    setDraftEnd(end);
    setHoverDate(null);
  }

  function handleGoToToday() {
    setViewYear(today.year);
    setViewMonth(today.month);
    if (isDateDisabled(today)) return;
    setDraftStart(today);
    setDraftEnd(null);
    setHoverDate(null);
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
      event.preventDefault();
      openPicker();
    }
    onKeyDown?.(event);
  }

  function handleConfirm() {
    if (!draftStart) return;
    const end = draftEnd ?? draftStart;
    const next = buildValue(draftStart, end, includeGregorian);
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
    setIsOpen(false);
  }

  function isInPreviewRange(cellDate: JalaliDate): boolean {
    if (!draftStart || draftEnd || !hoverDate) return false;
    const lo = compareJalali(hoverDate, draftStart) < 0 ? hoverDate : draftStart;
    const hi = compareJalali(hoverDate, draftStart) < 0 ? draftStart : hoverDate;
    return compareJalali(cellDate, lo) > 0 && compareJalali(cellDate, hi) < 0;
  }

  function isInCommittedRange(cellDate: JalaliDate): boolean {
    if (!draftStart || !draftEnd) return false;
    return compareJalali(cellDate, draftStart) > 0 && compareJalali(cellDate, draftEnd) < 0;
  }

  function renderMonth(y: number, m: number) {
    const monthLength = getJalaliMonthLength(y, m);
    const firstWeekday = getJalaliWeekday({ year: y, month: m, day: 1 });
    const emptyCells = Array.from({ length: firstWeekday });
    const dayCells = Array.from({ length: monthLength }, (_, i) => i + 1);

    return (
      <div className={styles.monthColumn} key={`${y}-${m}`} data-fara-date-range-picker-month-column>
        <div className={styles.monthTitle} data-fara-date-range-picker-month-title>
          {PERSIAN_MONTHS[m - 1]} {y}
        </div>
        <div className={styles.daysGrid} data-fara-date-range-picker-days-grid>
          {PERSIAN_WEEKDAYS.map((day, index) => (
            <div
              key={day}
              data-fara-date-range-picker-weekday
              className={clsx(
                styles.weekday,
                index === FRIDAY_WEEKDAY_INDEX && styles.weekdayFriday,
              )}
            >
              {day}
            </div>
          ))}

          {emptyCells.map((_, i) => (
            <span key={`empty-${i}`} className={clsx(styles.dayCell, styles.dayCellEmpty)} />
          ))}

          {dayCells.map((day) => {
            const cellDate: JalaliDate = { year: y, month: m, day };
            const isStart = isSameJalaliDate(draftStart, cellDate);
            const isEnd = isSameJalaliDate(draftEnd, cellDate);
            const isToday = isSameJalaliDate(today, cellDate);
            const isFriday = getJalaliWeekday(cellDate) === FRIDAY_WEEKDAY_INDEX;
            const cellDisabled = isDateDisabled(cellDate);
            const inRange = isInCommittedRange(cellDate) || isInPreviewRange(cellDate);

            const variantClass =
              isStart || isEnd
                ? styles.dayCellRangeEdge
                : inRange
                  ? styles.dayCellInRange
                  : isFriday
                    ? styles.dayCellFriday
                    : isToday
                      ? styles.dayCellToday
                      : undefined;

            return (
              <button
                key={day}
                type="button"
                data-fara-date-range-picker-day-cell
                data-selected={isStart || isEnd || undefined}
                data-in-range={inRange || undefined}
                data-today={isToday || undefined}
                className={clsx(styles.dayCell, variantClass)}
                disabled={cellDisabled}
                onClick={() => handleDayClick(cellDate)}
                onMouseEnter={() => setHoverDate(cellDate)}
              >
                {day}
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  const nextMonth = addMonths(viewYear, viewMonth, 1);

  const displayValue = currentValue
    ? `${formatJalali(currentValue.start)} - ${formatJalali(currentValue.end)}`
    : "";

  return (
    <div
      ref={wrapperRef}
      data-fara-date-range-picker
      className={clsx(styles.wrapper, className)}
      dir="rtl"
    >
      <input
        {...rest}
        ref={assignInputRef}
        readOnly
        data-fara-date-range-picker-input
        className={clsx(styles.input, inputClassName)}
        placeholder={placeholder}
        disabled={disabled}
        value={displayValue}
        onClick={openPicker}
        onKeyDown={handleInputKeyDown}
      />

      <AnchoredPopup
        open={isOpen}
        anchorRef={inputRef}
        onClose={() => setIsOpen(false)}
        className={styles.panel}
        gap={4}
        dataFara="date-range-picker-panel"
      >
        <div onMouseLeave={() => setHoverDate(null)}>
          <div className={styles.header} data-fara-date-range-picker-header>
            <button
              type="button"
              className={styles.navButton}
              data-fara-date-range-picker-nav-button
              data-direction="previous"
              onClick={goToPreviousMonth}
              disabled={!canGoPrev}
              aria-label="ماه قبل"
              title="ماه قبل"
            >
              <ChevronIcon direction="previous" />
            </button>

            <button
              type="button"
              className={styles.navButton}
              data-fara-date-range-picker-nav-button
              data-direction="next"
              onClick={goToNextMonth}
              disabled={!canGoNext}
              aria-label="ماه بعد"
              title="ماه بعد"
            >
              <ChevronIcon direction="next" />
            </button>
          </div>

          <div className={styles.monthsRow} data-fara-date-range-picker-months-row>
            {renderMonth(viewYear, viewMonth)}
            {renderMonth(nextMonth.year, nextMonth.month)}
          </div>

          <div className={styles.footer} data-fara-date-range-picker-footer>
            <button
              type="button"
              className={styles.footerButton}
              data-fara-date-range-picker-footer-button
              onClick={handleGoToToday}
            >
              برو به امروز
            </button>
            <button
              type="button"
              className={clsx(styles.footerButton, styles.footerButtonPrimary)}
              data-fara-date-range-picker-footer-button
              onClick={handleConfirm}
              disabled={!draftStart}
            >
              تأیید
            </button>
          </div>
        </div>
      </AnchoredPopup>
    </div>
  );
}
