import type { InputHTMLAttributes, KeyboardEvent, Ref } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import styles from "./DatePicker.module.css";
import { useSnapScroll } from "../../hooks/useSnapScroll";
import { centerInScroller } from "../../utils/centerInScroller";
import { mergeRefs } from "../../utils/mergeRefs";
import { nearestInList } from "../../utils/nearestInList";
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
} from "./jalali";
import {
  MAX_CALENDAR_YEAR,
  MIN_CALENDAR_YEAR,
  clampJalaliDate,
  compareJalali,
  compareYearMonth,
  type YearMonth,
} from "./calendarBounds";
import { ChevronIcon } from "./ChevronIcon";

const FRIDAY_WEEKDAY_INDEX = 6;
const ITEM_HEIGHT = 40;
const TIME_ITEM_HEIGHT = 32;

const MONTH_NUMBERS = Array.from({ length: 12 }, (_, i) => i + 1);
const YEAR_OPTIONS = Array.from(
  { length: MAX_CALENDAR_YEAR - MIN_CALENDAR_YEAR + 1 },
  (_, i) => MIN_CALENDAR_YEAR + i,
);

export interface DatePickerValue {
  jalali: JalaliDate;
  gregorian?: Date;
  time?: { hour: number; minute: number };
}

export interface DatePickerProps
  extends Omit<InputHTMLAttributes<HTMLInputElement>, "value" | "defaultValue" | "onChange"> {
  value?: DatePickerValue | null;
  defaultValue?: DatePickerValue | null;
  onChange?: (value: DatePickerValue) => void;
  minDate?: Date | JalaliDate;
  maxDate?: Date | JalaliDate;
  disabledDates?: (date: Date) => boolean;
  includeGregorian?: boolean;
  showTodayButton?: boolean;
  showTime?: boolean;
  defaultTime?: "current" | "zero";
  inputClassName?: string;
  mode?: "calendar" | "scroll";
  ref?: Ref<HTMLInputElement>;
}

type CalendarView = "days" | "months" | "years";

function isJalaliDateInput(input: Date | JalaliDate): input is JalaliDate {
  return !(input instanceof Date);
}

function toJalali(input: Date | JalaliDate): JalaliDate {
  return isJalaliDateInput(input) ? input : gregorianToJalali(input);
}

function deriveJalali(value: DatePickerValue | null | undefined): JalaliDate | null {
  if (!value) return null;
  if (value.jalali) return value.jalali;
  if (value.gregorian) return gregorianToJalali(value.gregorian);
  return null;
}

function deriveClockTime(value: DatePickerValue | null | undefined) {
  if (value?.time) {
    return value.time;
  }

  if (value?.gregorian) {
    return {
      hour: value.gregorian.getHours(),
      minute: value.gregorian.getMinutes(),
    };
  }

  return {
    hour: 0,
    minute: 0,
  };
}

function buildValue(
  date: JalaliDate,
  time: { hour: number; minute: number },
  include: { gregorian: boolean },
): DatePickerValue {
  const gregorian = jalaliToGregorian(date);
  gregorian.setHours(time.hour, time.minute, 0, 0);

  const result: DatePickerValue = { jalali: date, time };
  if (include.gregorian) result.gregorian = gregorian;
  return result;
}

export function DatePicker({
  value,
  defaultValue = null,
  onChange,
  minDate,
  maxDate,
  disabledDates,
  includeGregorian = true,
  showTodayButton = true,
  showTime = false,
  defaultTime = "current",
  placeholder = "انتخاب تاریخ",
  disabled = false,
  className,
  inputClassName,
  mode = "calendar",
  ref,
  onKeyDown,
  ...rest
}: DatePickerProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<DatePickerValue | null>(defaultValue);
  const currentValue = isControlled ? (value ?? null) : internalValue;
  const include = { gregorian: includeGregorian };

  function commit(jalali: JalaliDate, time: { hour: number; minute: number }) {
    const next = buildValue(jalali, time, include);
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  }

  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<CalendarView>("days");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const assignInputRef = useMemo(() => mergeRefs(inputRef, ref), [inputRef, ref]);
  const yearsGridRef = useRef<HTMLDivElement>(null);
  const today = getTodayJalali();
  const jalaliValue = deriveJalali(currentValue);

  const minJalali = minDate ? toJalali(minDate) : null;
  const maxJalali = maxDate ? toJalali(maxDate) : null;
  const minBound = minJalali ?? { year: MIN_CALENDAR_YEAR, month: 1, day: 1 };
  const maxBound = maxJalali ?? { year: MAX_CALENDAR_YEAR, month: 12, day: 30 };
  const minYearMonth: YearMonth = { year: minBound.year, month: minBound.month };
  const maxYearMonth: YearMonth = { year: maxBound.year, month: maxBound.month };

  function clampToBounds(date: JalaliDate): JalaliDate {
    return clampJalaliDate(date, minBound, maxBound);
  }

  function monthsForYear(year: number): number[] {
    return MONTH_NUMBERS.filter((month) => {
      if (year === minYearMonth.year && month < minYearMonth.month) return false;
      if (year === maxYearMonth.year && month > maxYearMonth.month) return false;
      return true;
    });
  }

  function daysForMonth(year: number, month: number): number[] {
    return Array.from({ length: getJalaliMonthLength(year, month) }, (_, i) => i + 1).filter(
      (day) => !isDateDisabled({ year, month, day }),
    );
  }

  function isDateDisabled(cellDate: JalaliDate): boolean {
    if (minJalali && compareJalali(cellDate, minJalali) < 0) return true;
    if (maxJalali && compareJalali(cellDate, maxJalali) > 0) return true;
    if (disabledDates && disabledDates(jalaliToGregorian(cellDate))) return true;
    return false;
  }

  const initialDate = clampToBounds(jalaliValue ?? today);
  const [viewYear, setViewYear] = useState(initialDate.year);
  const [viewMonth, setViewMonth] = useState(initialDate.month);

  const [draft, setDraft] = useState<JalaliDate>(initialDate);
  const [draftTime, setDraftTime] = useState(() => deriveClockTime(currentValue));

  const draftRef = useRef(draft);
  const draftTimeRef = useRef(draftTime);
  useEffect(() => {
    draftRef.current = draft;
    draftTimeRef.current = draftTime;
  });

  const dayColumnRef = useRef<HTMLDivElement>(null);
  const monthColumnRef = useRef<HTMLDivElement>(null);
  const yearColumnRef = useRef<HTMLDivElement>(null);
  const hourColumnRef = useRef<HTMLDivElement>(null);
  const minuteColumnRef = useRef<HTMLDivElement>(null);
  const hourListRef = useRef<HTMLUListElement>(null);
  const minuteListRef = useRef<HTMLUListElement>(null);

  function closePicker() {
    setIsOpen(false);
    setView("days");
  }

  function openPicker() {
    if (disabled) return;
    const next = clampToBounds(jalaliValue ?? today);
    setViewYear(next.year);
    setViewMonth(next.month);
    setDraft(next);
    setDraftTime(
      currentValue
        ? deriveClockTime(currentValue)
        : defaultTime === "zero"
          ? { hour: 0, minute: 0 }
          : { hour: new Date().getHours(), minute: new Date().getMinutes() },
    );
    setView("days");
    setIsOpen(true);
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
      event.preventDefault();
      openPicker();
    }
    onKeyDown?.(event);
  }

  // ---- Calendar mode ----

  const canGoPrev = compareYearMonth({ year: viewYear, month: viewMonth }, minYearMonth) > 0;
  const canGoNext = compareYearMonth({ year: viewYear, month: viewMonth }, maxYearMonth) < 0;

  function goToPreviousMonth() {
    if (!canGoPrev) return;
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function goToNextMonth() {
    if (!canGoNext) return;
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  function handleDayClick(day: number) {
    const picked: JalaliDate = { year: viewYear, month: viewMonth, day };
    if (isDateDisabled(picked)) return;
    if (showTime) {
      setDraft(picked);
      return;
    }
    commit(picked, { hour: 0, minute: 0 });
    setIsOpen(false);
    setView("days");
  }

  function handleMonthSelect(month: number) {
    setViewMonth(month);
    setView("days");
  }

  function handleYearSelect(year: number) {
    setViewYear(year);
    setViewMonth((month) => {
      if (year === minYearMonth.year && month < minYearMonth.month) return minYearMonth.month;
      if (year === maxYearMonth.year && month > maxYearMonth.month) return maxYearMonth.month;
      return month;
    });
    setView("days");
  }

  function handleTodayClick() {
    if (showTime) {
      setDraft(today);
      setViewYear(today.year);
      setViewMonth(today.month);
      return;
    }
    commit(today, { hour: 0, minute: 0 });
    setViewYear(today.year);
    setViewMonth(today.month);
    setIsOpen(false);
    setView("days");
  }

  function handleConfirmCalendarTime() {
    commit(draft, draftTime);
    setIsOpen(false);
    setView("days");
  }

  const monthLength = getJalaliMonthLength(viewYear, viewMonth);
  const firstWeekday = getJalaliWeekday({ year: viewYear, month: viewMonth, day: 1 });
  const emptyCells = Array.from({ length: firstWeekday });
  const dayCells = Array.from({ length: monthLength }, (_, i) => i + 1);

  const yearOptionsForGrid = YEAR_OPTIONS.filter(
    (year) => year >= minYearMonth.year && year <= maxYearMonth.year,
  );
  const isMonthOutOfRange = (month: number) => {
    if (viewYear === minYearMonth.year && month < minYearMonth.month) return true;
    if (viewYear === maxYearMonth.year && month > maxYearMonth.month) return true;
    return false;
  };

  useEffect(() => {
    if (view !== "years" || !yearsGridRef.current) return;
    centerInScroller(yearsGridRef, `[data-year="${viewYear}"]`);
  }, [view, viewYear]);

  useEffect(() => {
    if (!showTime || mode !== "calendar" || !isOpen) return;
    centerInScroller(hourListRef, `[data-value="${draftTimeRef.current.hour}"]`, "instant");
    centerInScroller(minuteListRef, `[data-value="${draftTimeRef.current.minute}"]`, "instant");
  }, [showTime, mode, isOpen]);

  useEffect(() => {
    if (!showTime || mode !== "calendar" || !isOpen) return;
    centerInScroller(hourListRef, `[data-value="${draftTime.hour}"]`, "smooth");
    centerInScroller(minuteListRef, `[data-value="${draftTime.minute}"]`, "smooth");
  }, [showTime, mode, isOpen, draftTime.hour, draftTime.minute]);

  // ---- Scroll mode ----

  const yearOptions = YEAR_OPTIONS.filter(
    (year) => year >= minYearMonth.year && year <= maxYearMonth.year,
  );

  const monthOptionIndices = monthsForYear(draft.year);
  const scrollMonth = nearestInList(draft.month, monthOptionIndices);
  const dayOptions = daysForMonth(draft.year, scrollMonth);
  const scrollDay = nearestInList(draft.day, dayOptions);
  const scrollDraft: JalaliDate = { year: draft.year, month: scrollMonth, day: scrollDay };

  const programmaticScrollRef = useRef(false);
  const scrollDraftRef = useRef(scrollDraft);
  useEffect(() => {
    scrollDraftRef.current = scrollDraft;
  });

  // ---- Wheel-stepped and draggable lists ----

  useSnapScroll(hourListRef, {
    itemHeight: TIME_ITEM_HEIGHT,
    itemCount: 24,
    enabled: isOpen && mode === "calendar" && view === "days" && showTime,
    onIndexChange: (index) => setDraftTime((t) => ({ ...t, hour: index })),
  });
  useSnapScroll(minuteListRef, {
    itemHeight: TIME_ITEM_HEIGHT,
    itemCount: 60,
    enabled: isOpen && mode === "calendar" && view === "days" && showTime,
    onIndexChange: (index) => setDraftTime((t) => ({ ...t, minute: index })),
  });

  useSnapScroll(yearColumnRef, {
    itemHeight: ITEM_HEIGHT,
    itemCount: yearOptions.length,
    enabled: isOpen && mode === "scroll",
    onIndexChange: (index) => setDraft((d) => ({ ...d, year: yearOptions[index] })),
  });
  useSnapScroll(monthColumnRef, {
    itemHeight: ITEM_HEIGHT,
    itemCount: monthOptionIndices.length,
    enabled: isOpen && mode === "scroll",
    onIndexChange: (index) => setDraft((d) => ({ ...d, month: monthOptionIndices[index] })),
  });
  useSnapScroll(dayColumnRef, {
    itemHeight: ITEM_HEIGHT,
    itemCount: dayOptions.length,
    enabled: isOpen && mode === "scroll",
    onIndexChange: (index) => setDraft((d) => ({ ...d, day: dayOptions[index] })),
  });
  useSnapScroll(hourColumnRef, {
    itemHeight: ITEM_HEIGHT,
    itemCount: 24,
    enabled: isOpen && mode === "scroll" && showTime,
    onIndexChange: (index) => setDraftTime((t) => ({ ...t, hour: index })),
  });
  useSnapScroll(minuteColumnRef, {
    itemHeight: ITEM_HEIGHT,
    itemCount: 60,
    enabled: isOpen && mode === "scroll" && showTime,
    onIndexChange: (index) => setDraftTime((t) => ({ ...t, minute: index })),
  });

  useEffect(() => {
    if (mode !== "scroll" || !isOpen) return;

    const current = scrollDraftRef.current;
    const currentTime = draftTimeRef.current;
    programmaticScrollRef.current = true;
    centerInScroller(dayColumnRef, `[data-value="${current.day}"]`, "instant");
    centerInScroller(monthColumnRef, `[data-value="${current.month}"]`, "instant");
    centerInScroller(yearColumnRef, `[data-value="${current.year}"]`, "instant");
    if (showTime) {
      centerInScroller(hourColumnRef, `[data-value="${currentTime.hour}"]`, "instant");
      centerInScroller(minuteColumnRef, `[data-value="${currentTime.minute}"]`, "instant");
    }
    const timer = window.setTimeout(() => {
      programmaticScrollRef.current = false;
    }, 400);
    return () => window.clearTimeout(timer);
  }, [mode, isOpen, showTime]);

  useEffect(() => {
    if (mode !== "scroll" || !isOpen || programmaticScrollRef.current) return;
    const current = draftRef.current;
    if (scrollMonth !== current.month) {
      centerInScroller(monthColumnRef, `[data-value="${scrollMonth}"]`);
    }
    if (scrollDay !== current.day || scrollMonth !== current.month) {
      centerInScroller(dayColumnRef, `[data-value="${scrollDay}"]`);
    }
  }, [mode, isOpen, scrollMonth, scrollDay]);

  function handleColumnScroll(optionsLength: number, applyIndex: (index: number) => void) {
    return (event: React.UIEvent<HTMLDivElement>) => {
      if (programmaticScrollRef.current) return;
      const el = event.currentTarget;
      const rawIndex = Math.round(el.scrollTop / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(optionsLength - 1, rawIndex));
      applyIndex(clampedIndex);
    };
  }

  function handleItemClick(
    columnRef: React.RefObject<HTMLDivElement | null>,
    value: number,
    applyValue: () => void,
  ) {
    applyValue();
    centerInScroller(columnRef, `[data-value="${value}"]`, "smooth");
  }

  function handleConfirmScroll() {
    commit(scrollDraft, showTime ? draftTime : { hour: 0, minute: 0 });
    setIsOpen(false);
  }

  return (
    <div ref={wrapperRef} data-fara-date-picker className={clsx(styles.wrapper, className)} dir="rtl">
      <input
        {...rest}
        ref={assignInputRef}
        readOnly
        data-fara-date-picker-input
        className={clsx(styles.input, inputClassName)}
        placeholder={placeholder}
        disabled={disabled}
        value={(() => {
          if (!jalaliValue) return "";
          if (!showTime) return formatJalali(jalaliValue);
          const { hour, minute } = deriveClockTime(currentValue);
          return `${formatJalali(jalaliValue)} - ${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
        })()}
        onClick={openPicker}
        onKeyDown={handleInputKeyDown}
      />

      <AnchoredPopup
        open={isOpen && mode === "calendar"}
        anchorRef={inputRef}
        onClose={closePicker}
        className={clsx(styles.panel, showTime && styles.panelWithTime)}
        gap={4}
        dataFara="date-picker-panel"
      >
        {view === "days" && (
            <>
              <div className={styles.panelPadding}>
                <div className={showTime ? styles.calendarWithTimeRow : undefined}>
                  {showTime && (
                    <div className={styles.timeColumn} data-fara-date-picker-time-column>
                      <div className={styles.timeSelectRow} data-fara-date-picker-time-row>
                        <div>
                          <p className={styles.columnLabel} data-fara-date-picker-column-label>ساعت</p>
                          <ul className={styles.timeList} aria-label="ساعت" ref={hourListRef} data-fara-date-picker-time-list>
                            {Array.from({ length: 24 }, (_, h) => (
                              <li
                                key={h}
                                data-value={h}
                                role="button"
                                data-fara-date-picker-time-item
                                data-selected={h === draftTime.hour || undefined}
                                className={clsx(
                                  styles.timeListItem,
                                  h === draftTime.hour && styles.timeListItemActive,
                                )}
                                onClick={() => setDraftTime((t) => ({ ...t, hour: h }))}
                              >
                                {String(h).padStart(2, "0")}
                              </li>
                            ))}
                          </ul>
                        </div>

                        <div>
                          <p className={styles.columnLabel} data-fara-date-picker-column-label>دقیقه</p>
                          <ul className={styles.timeList} aria-label="دقیقه" ref={minuteListRef} data-fara-date-picker-time-list>
                            {Array.from({ length: 60 }, (_, m) => (
                              <li
                                key={m}
                                data-value={m}
                                role="button"
                                data-fara-date-picker-time-item
                                data-selected={m === draftTime.minute || undefined}
                                className={clsx(
                                  styles.timeListItem,
                                  m === draftTime.minute && styles.timeListItemActive,
                                )}
                                onClick={() => setDraftTime((t) => ({ ...t, minute: m }))}
                              >
                                {String(m).padStart(2, "0")}
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>
                    </div>
                  )}
                  <div className={showTime ? styles.calendarColumn : undefined}>
                    <div className={styles.header} data-fara-date-picker-header>
                      <button
                        type="button"
                        className={styles.navButton}
                        data-fara-date-picker-nav-button
                        data-direction="previous"
                        onClick={goToPreviousMonth}
                        disabled={!canGoPrev}
                        aria-label="ماه قبل"
                        title="ماه قبل"
                      >
                        <ChevronIcon direction="previous" />
                      </button>

                      <div className={styles.monthYearGroup} data-fara-date-picker-month-year-group>
                        <button
                          type="button"
                          className={styles.monthYearButton}
                          data-fara-date-picker-month-button
                          onClick={() => setView("months")}
                        >
                          {PERSIAN_MONTHS[viewMonth - 1]}
                        </button>
                        <button
                          type="button"
                          className={styles.monthYearButton}
                          data-fara-date-picker-year-button
                          onClick={() => setView("years")}
                        >
                          {viewYear}
                        </button>
                      </div>

                      <button
                        type="button"
                        className={styles.navButton}
                        data-fara-date-picker-nav-button
                        data-direction="next"
                        onClick={goToNextMonth}
                        disabled={!canGoNext}
                        aria-label="ماه بعد"
                        title="ماه بعد"
                      >
                        <ChevronIcon direction="next" />
                      </button>
                    </div>

                    <div className={styles.daysGrid} data-fara-date-picker-days-grid>
                      {PERSIAN_WEEKDAYS.map((day, index) => (
                        <div
                          key={day}
                          data-fara-date-picker-weekday
                          className={clsx(
                            styles.weekday,
                            index === FRIDAY_WEEKDAY_INDEX && styles.weekdayFriday,
                          )}
                        >
                          {day}
                        </div>
                      ))}

                      {emptyCells.map((_, i) => (
                        <span
                          key={`empty-${i}`}
                          className={clsx(styles.dayCell, styles.dayCellEmpty)}
                        />
                      ))}

                      {dayCells.map((day) => {
                        const cellDate: JalaliDate = { year: viewYear, month: viewMonth, day };
                        const isSelected = isSameJalaliDate(
                          showTime ? draft : jalaliValue,
                          cellDate,
                        );
                        const isToday = isSameJalaliDate(today, cellDate);
                        const isFriday = getJalaliWeekday(cellDate) === FRIDAY_WEEKDAY_INDEX;
                        const cellDisabled = isDateDisabled(cellDate);

                        const variantClass = isSelected
                          ? styles.dayCellSelected
                          : isFriday
                            ? styles.dayCellFriday
                            : isToday
                              ? styles.dayCellToday
                              : undefined;

                        return (
                          <button
                            key={day}
                            type="button"
                            data-fara-date-picker-day-cell
                            data-selected={isSelected || undefined}
                            data-today={isToday || undefined}
                            className={clsx(styles.dayCell, variantClass)}
                            disabled={cellDisabled}
                            onClick={() => handleDayClick(day)}
                          >
                            {day}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                </div>

                {(showTodayButton || showTime) && (
                  <div className={styles.footer} data-fara-date-picker-footer>
                    {showTodayButton && (
                      <button
                        type="button"
                        className={styles.footerButton}
                        data-fara-date-picker-footer-button
                        onClick={handleTodayClick}
                        disabled={isDateDisabled(today)}
                      >
                        امروز
                      </button>
                    )}
                    {showTime && (
                      <button
                        type="button"
                        className={clsx(styles.footerButton, styles.footerButtonPrimary)}
                        data-fara-date-picker-footer-button
                        onClick={handleConfirmCalendarTime}
                        disabled={isDateDisabled(draft)}
                      >
                        تایید
                      </button>
                    )}
                  </div>
                )}
              </div>
            </>
          )}

          {view === "months" && (
            <>
              <div className={styles.panelPadding}>
                <div className={styles.monthsGrid} data-fara-date-picker-months-grid>
                  {PERSIAN_MONTHS.map((month, index) => {
                    const monthNumber = index + 1;
                    const isOutOfRange = isMonthOutOfRange(monthNumber);
                    return (
                      <button
                        key={month}
                        type="button"
                        disabled={isOutOfRange}
                        data-fara-date-picker-month-cell
                        data-selected={monthNumber === viewMonth || undefined}
                        className={clsx(
                          styles.monthCell,
                          monthNumber === viewMonth && styles.monthCellActive,
                        )}
                        onClick={() => handleMonthSelect(monthNumber)}
                      >
                        {month}
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {view === "years" && (
            <div className={styles.yearsGridWrapper} ref={yearsGridRef}>
              <div className={styles.yearsGrid} data-fara-date-picker-years-grid>
                {yearOptionsForGrid.map((year) => (
                  <button
                    key={year}
                    type="button"
                    data-year={year}
                    data-fara-date-picker-year-cell
                    data-selected={year === viewYear || undefined}
                    className={clsx(styles.yearCell, year === viewYear && styles.yearCellActive)}
                    onClick={() => handleYearSelect(year)}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          )}
      </AnchoredPopup>

      <AnchoredPopup
        open={isOpen && mode === "scroll"}
        anchorRef={inputRef}
        onClose={closePicker}
        className={styles.panel}
        gap={4}
        dataFara="date-picker-panel"
      >
          <div className={styles.scrollHeader} data-fara-date-picker-scroll-header>
            <span className={styles.columnLabel} data-fara-date-picker-column-label>سال</span>
            <span className={styles.columnLabel} data-fara-date-picker-column-label>ماه</span>
            <span className={styles.columnLabel} data-fara-date-picker-column-label>روز</span>
            {showTime && (
              <>
                <span className={styles.columnLabel} data-fara-date-picker-column-label>ساعت</span>
                <span className={styles.columnLabel} data-fara-date-picker-column-label>دقیقه</span>
              </>
            )}
          </div>

          <div className={styles.scrollWrapper}>
            <div className={styles.scrollGuideTop} />
            <div className={styles.scrollGuideBottom} />

            <div className={styles.scrollContainer} data-fara-date-picker-scroll-container>
              <div
                ref={yearColumnRef}
                className={styles.scrollColumn}
                data-fara-date-picker-scroll-column
                data-column="year"
                onScroll={handleColumnScroll(yearOptions.length, (index) =>
                  setDraft((d) => ({ ...d, year: yearOptions[index] })),
                )}
              >
                <div className={styles.scrollPadding} />
                {yearOptions.map((year) => (
                  <div
                    key={year}
                    data-value={year}
                    data-fara-date-picker-scroll-item
                    data-selected={year === draft.year || undefined}
                    className={clsx(
                      styles.scrollItem,
                      year === draft.year && styles.scrollItemActive,
                    )}
                    onClick={() =>
                      handleItemClick(yearColumnRef, year, () => setDraft((d) => ({ ...d, year })))
                    }
                  >
                    {year}
                  </div>
                ))}
                <div className={styles.scrollPadding} />
              </div>

              <div
                ref={monthColumnRef}
                className={styles.scrollColumn}
                data-fara-date-picker-scroll-column
                data-column="month"
                onScroll={handleColumnScroll(monthOptionIndices.length, (index) =>
                  setDraft((d) => ({ ...d, month: monthOptionIndices[index] })),
                )}
              >
                <div className={styles.scrollPadding} />
                {monthOptionIndices.map((month) => (
                  <div
                    key={month}
                    data-value={month}
                    data-fara-date-picker-scroll-item
                    data-selected={month === scrollMonth || undefined}
                    className={clsx(
                      styles.scrollItem,
                      month === scrollMonth && styles.scrollItemActive,
                    )}
                    onClick={() =>
                      handleItemClick(monthColumnRef, month, () =>
                        setDraft((d) => ({ ...d, month })),
                      )
                    }
                  >
                    {PERSIAN_MONTHS[month - 1]}
                  </div>
                ))}
                <div className={styles.scrollPadding} />
              </div>

              <div
                ref={dayColumnRef}
                className={styles.scrollColumn}
                data-fara-date-picker-scroll-column
                data-column="day"
                onScroll={handleColumnScroll(dayOptions.length, (index) =>
                  setDraft((d) => ({ ...d, day: dayOptions[index] })),
                )}
              >
                <div className={styles.scrollPadding} />
                {dayOptions.map((day) => (
                  <div
                    key={day}
                    data-value={day}
                    data-fara-date-picker-scroll-item
                    data-selected={day === scrollDay || undefined}
                    className={clsx(
                      styles.scrollItem,
                      day === scrollDay && styles.scrollItemActive,
                    )}
                    onClick={() =>
                      handleItemClick(dayColumnRef, day, () => setDraft((d) => ({ ...d, day })))
                    }
                  >
                    {day}
                  </div>
                ))}
                <div className={styles.scrollPadding} />
              </div>

              {showTime && (
                <>
                  <div
                    ref={hourColumnRef}
                    className={styles.scrollColumn}
                    data-fara-date-picker-scroll-column
                    data-column="hour"
                    onScroll={handleColumnScroll(24, (index) =>
                      setDraftTime((t) => ({ ...t, hour: index })),
                    )}
                  >
                    <div className={styles.scrollPadding} />
                    {Array.from({ length: 24 }, (_, h) => (
                      <div
                        key={h}
                        data-value={h}
                        data-fara-date-picker-scroll-item
                        data-selected={h === draftTime.hour || undefined}
                        className={clsx(
                          styles.scrollItem,
                          h === draftTime.hour && styles.scrollItemActive,
                        )}
                        onClick={() =>
                          handleItemClick(hourColumnRef, h, () =>
                            setDraftTime((t) => ({ ...t, hour: h })),
                          )
                        }
                      >
                        {String(h).padStart(2, "0")}
                      </div>
                    ))}
                    <div className={styles.scrollPadding} />
                  </div>

                  <div
                    ref={minuteColumnRef}
                    className={styles.scrollColumn}
                    data-fara-date-picker-scroll-column
                    data-column="minute"
                    onScroll={handleColumnScroll(60, (index) =>
                      setDraftTime((t) => ({ ...t, minute: index })),
                    )}
                  >
                    <div className={styles.scrollPadding} />
                    {Array.from({ length: 60 }, (_, m) => (
                      <div
                        key={m}
                        data-value={m}
                        data-fara-date-picker-scroll-item
                        data-selected={m === draftTime.minute || undefined}
                        className={clsx(
                          styles.scrollItem,
                          m === draftTime.minute && styles.scrollItemActive,
                        )}
                        onClick={() =>
                          handleItemClick(minuteColumnRef, m, () =>
                            setDraftTime((t) => ({ ...t, minute: m })),
                          )
                        }
                      >
                        {String(m).padStart(2, "0")}
                      </div>
                    ))}
                    <div className={styles.scrollPadding} />
                  </div>
                </>
              )}
            </div>
          </div>

          <div className={styles.scrollConfirm} data-fara-date-picker-confirm-row>
            <button
              type="button"
              className={clsx(styles.footerButton, styles.footerButtonPrimary)}
              data-fara-date-picker-confirm-button
              onClick={handleConfirmScroll}
              disabled={isDateDisabled(scrollDraft)}
            >
              تایید
            </button>
          </div>
      </AnchoredPopup>
    </div>
  );
}
