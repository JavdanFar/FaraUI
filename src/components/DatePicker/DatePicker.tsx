import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import styles from "./DatePicker.module.css";
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

const FRIDAY_WEEKDAY_INDEX = 6;

export interface DatePickerValue {
  gregorian: Date;
  jalali: JalaliDate;
}

export interface DatePickerProps {
  value?: DatePickerValue | null;
  defaultValue?: DatePickerValue | null;
  onChange?: (value: DatePickerValue) => void;
  minDate?: Date | JalaliDate;
  maxDate?: Date | JalaliDate;
  disabledDates?: (date: Date) => boolean;
  placeholder?: string;
  disabled?: boolean;
  showTodayButton?: boolean;
  showTime?: boolean;
  className?: string;
  inputClassName?: string;
  mode?: "calendar" | "scroll";
}

type CalendarView = "days" | "months" | "years";
type YearMonth = { year: number; month: number };

const MIN_YEAR = 1300;
const MAX_YEAR = 1500;
const ITEM_HEIGHT = 40;

const YEAR_OPTIONS = Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => MIN_YEAR + i);

function isJalaliDateInput(input: Date | JalaliDate): input is JalaliDate {
  return !(input instanceof Date);
}

function toJalali(input: Date | JalaliDate): JalaliDate {
  return isJalaliDateInput(input) ? input : gregorianToJalali(input);
}

function compareJalali(a: JalaliDate, b: JalaliDate): number {
  if (a.year !== b.year) return a.year - b.year;
  if (a.month !== b.month) return a.month - b.month;
  return a.day - b.day;
}

function compareYearMonth(a: YearMonth, b: YearMonth): number {
  if (a.year !== b.year) return a.year - b.year;
  return a.month - b.month;
}

function buildValue(date: JalaliDate, time: { hour: number; minute: number }): DatePickerValue {
  const gregorian = jalaliToGregorian(date);
  gregorian.setHours(time.hour, time.minute, 0, 0);
  return { gregorian, jalali: date };
}

export function DatePicker({
  value,
  defaultValue = null,
  onChange,
  minDate,
  maxDate,
  disabledDates,
  placeholder = "انتخاب تاریخ",
  disabled = false,
  showTodayButton = true,
  showTime = false,
  className,
  inputClassName,
  mode = "calendar",
}: DatePickerProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<DatePickerValue | null>(defaultValue);
  const currentValue = isControlled ? (value ?? null) : internalValue;

  function commit(next: DatePickerValue) {
    if (!isControlled) setInternalValue(next);
    onChange?.(next);
  }

  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<CalendarView>("days");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const yearsGridRef = useRef<HTMLDivElement>(null);
  const today = getTodayJalali();
  const jalaliValue = currentValue?.jalali ?? null;

  const minJalali = minDate ? toJalali(minDate) : null;
  const maxJalali = maxDate ? toJalali(maxDate) : null;
  const minYearMonth: YearMonth = minJalali
    ? { year: minJalali.year, month: minJalali.month }
    : { year: MIN_YEAR, month: 1 };
  const maxYearMonth: YearMonth = maxJalali
    ? { year: maxJalali.year, month: maxJalali.month }
    : { year: MAX_YEAR, month: 12 };

  function isDateDisabled(cellDate: JalaliDate): boolean {
    if (minJalali && compareJalali(cellDate, minJalali) < 0) return true;
    if (maxJalali && compareJalali(cellDate, maxJalali) > 0) return true;
    if (disabledDates && disabledDates(jalaliToGregorian(cellDate))) return true;
    return false;
  }

  const [viewYear, setViewYear] = useState(jalaliValue?.year ?? today.year);
  const [viewMonth, setViewMonth] = useState(jalaliValue?.month ?? today.month);

  const [draft, setDraft] = useState<JalaliDate>(jalaliValue ?? today);
  const [draftTime, setDraftTime] = useState(() => ({
    hour: currentValue?.gregorian.getHours() ?? 0,
    minute: currentValue?.gregorian.getMinutes() ?? 0,
  }));

  const dayColumnRef = useRef<HTMLDivElement>(null);
  const monthColumnRef = useRef<HTMLDivElement>(null);
  const yearColumnRef = useRef<HTMLDivElement>(null);
  const hourColumnRef = useRef<HTMLDivElement>(null);
  const minuteColumnRef = useRef<HTMLDivElement>(null);
  const hourListRef = useRef<HTMLUListElement>(null);
  const minuteListRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const path = event.composedPath();
      if (wrapperRef.current && !path.includes(wrapperRef.current)) {
        setIsOpen(false);
        setView("days");
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setIsOpen(false);
        setView("days");
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [isOpen]);

  function openPicker() {
    if (disabled) return;
    setViewYear(jalaliValue?.year ?? today.year);
    setViewMonth(jalaliValue?.month ?? today.month);
    setDraft(jalaliValue ?? today);
    setDraftTime({
      hour: currentValue?.gregorian.getHours() ?? 0,
      minute: currentValue?.gregorian.getMinutes() ?? 0,
    });
    setView("days");
    setIsOpen(true);
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
    commit(buildValue(picked, { hour: 0, minute: 0 }));
    setIsOpen(false);
    setView("days");
  }

  function handleMonthSelect(month: number) {
    setViewMonth(month);
    setView("days");
  }

  // Selecting a year goes straight to the day view — the month was already
  // set (either from the previous view or the currently open month), so
  // there's no need to make the user pick it again.
  function handleYearSelect(year: number) {
    setViewYear(year);
    setView("days");
  }

  function handleTodayClick() {
    if (isDateDisabled(today)) return;
    if (showTime) {
      setDraft(today);
      setViewYear(today.year);
      setViewMonth(today.month);
      return;
    }
    commit(buildValue(today, { hour: 0, minute: 0 }));
    setViewYear(today.year);
    setViewMonth(today.month);
    setIsOpen(false);
    setView("days");
  }

  function handleConfirmCalendarTime() {
    commit(buildValue(draft, draftTime));
    setIsOpen(false);
    setView("days");
  }

  const monthLength = getJalaliMonthLength(viewYear, viewMonth);
  const firstWeekday = getJalaliWeekday({ year: viewYear, month: viewMonth, day: 1 });
  const emptyCells = Array.from({ length: firstWeekday });
  const dayCells = Array.from({ length: monthLength }, (_, i) => i + 1);

  useEffect(() => {
    if (view !== "years" || !yearsGridRef.current) return;
    const activeButton = yearsGridRef.current.querySelector(`[data-year="${viewYear}"]`);
    activeButton?.scrollIntoView({ block: "center" });
  }, [view, viewYear]);

  useEffect(() => {
    if (!showTime || mode !== "calendar" || !isOpen) return;
    hourListRef.current
      ?.querySelector(`[data-value="${draftTime.hour}"]`)
      ?.scrollIntoView({ block: "center" });
    minuteListRef.current
      ?.querySelector(`[data-value="${draftTime.minute}"]`)
      ?.scrollIntoView({ block: "center" });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [showTime, mode, isOpen]);

  // ---- Scroll mode ----

  const yearOptions = YEAR_OPTIONS.filter(
    (year) => year >= minYearMonth.year && year <= maxYearMonth.year,
  );

  const monthOptionIndices = Array.from({ length: 12 }, (_, i) => i + 1).filter((month) => {
    if (draft.year === minYearMonth.year && month < minYearMonth.month) return false;
    if (draft.year === maxYearMonth.year && month > maxYearMonth.month) return false;
    return true;
  });

  const draftMonthLength = getJalaliMonthLength(draft.year, draft.month);
  const dayOptions = Array.from({ length: draftMonthLength }, (_, i) => i + 1).filter((day) => {
    if (
      minJalali &&
      draft.year === minJalali.year &&
      draft.month === minJalali.month &&
      day < minJalali.day
    )
      return false;
    if (
      maxJalali &&
      draft.year === maxJalali.year &&
      draft.month === maxJalali.month &&
      day > maxJalali.day
    )
      return false;
    return true;
  });

  useEffect(() => {
    if (mode !== "scroll" || !isOpen) return;

    dayColumnRef.current
      ?.querySelector(`[data-value="${draft.day}"]`)
      ?.scrollIntoView({ block: "center" });
    monthColumnRef.current
      ?.querySelector(`[data-value="${draft.month}"]`)
      ?.scrollIntoView({ block: "center" });
    yearColumnRef.current
      ?.querySelector(`[data-value="${draft.year}"]`)
      ?.scrollIntoView({ block: "center" });
    if (showTime) {
      hourColumnRef.current
        ?.querySelector(`[data-value="${draftTime.hour}"]`)
        ?.scrollIntoView({ block: "center" });
      minuteColumnRef.current
        ?.querySelector(`[data-value="${draftTime.minute}"]`)
        ?.scrollIntoView({ block: "center" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, isOpen]);

  function handleColumnScroll(optionsLength: number, applyIndex: (index: number) => void) {
    return (event: React.UIEvent<HTMLDivElement>) => {
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
    columnRef.current
      ?.querySelector(`[data-value="${value}"]`)
      ?.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  function handleConfirmScroll() {
    const maxDay = getJalaliMonthLength(draft.year, draft.month);
    const picked = { ...draft, day: Math.min(draft.day, maxDay) };
    commit(buildValue(picked, showTime ? draftTime : { hour: 0, minute: 0 }));
    setIsOpen(false);
  }

  return (
    <div ref={wrapperRef} className={clsx(styles.wrapper, className)} dir="rtl">
      <input
        readOnly
        className={clsx(styles.input, inputClassName)}
        placeholder={placeholder}
        disabled={disabled}
        value={
          jalaliValue
            ? showTime
              ? `${formatJalali(jalaliValue)} - ${String(currentValue!.gregorian.getHours()).padStart(2, "0")}:${String(currentValue!.gregorian.getMinutes()).padStart(2, "0")}`
              : formatJalali(jalaliValue)
            : ""
        }
        onClick={openPicker}
      />

      {isOpen && mode === "calendar" && (
        <div className={clsx(styles.panel, showTime && styles.panelWithTime)}>
          {view === "days" && (
            <>
              <div className={styles.panelPadding}>
                <div className={showTime ? styles.calendarWithTimeRow : undefined}>
                  {showTime && (
                    <div className={styles.timeColumn}>
                      <div className={styles.timeSelectRow}>
                        <div>
                          <p className={styles.columnLabel}>ساعت</p>
                          <ul className={styles.timeList} aria-label="ساعت" ref={hourListRef}>
                            {Array.from({ length: 24 }, (_, h) => (
                              <li
                                key={h}
                                data-value={h}
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
                          <p className={styles.columnLabel}>دقیقه</p>
                          <ul className={styles.timeList} aria-label="دقیقه" ref={minuteListRef}>
                            {Array.from({ length: 60 }, (_, m) => (
                              <li
                                key={m}
                                data-value={m}
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
                    <div className={styles.header}>
                      <button
                        type="button"
                        className={styles.navButton}
                        onClick={goToNextMonth}
                        disabled={!canGoNext}
                        aria-label="ماه بعد"
                      >
                        بعدی
                      </button>

                      <div className={styles.monthYearGroup}>
                        <button
                          type="button"
                          className={styles.monthYearButton}
                          onClick={() => setView("months")}
                        >
                          {PERSIAN_MONTHS[viewMonth - 1]}
                        </button>
                        <button
                          type="button"
                          className={styles.monthYearButton}
                          onClick={() => setView("years")}
                        >
                          {viewYear}
                        </button>
                      </div>

                      <button
                        type="button"
                        className={styles.navButton}
                        onClick={goToPreviousMonth}
                        disabled={!canGoPrev}
                        aria-label="ماه قبل"
                      >
                        قبلی
                      </button>
                    </div>

                    <div className={styles.daysGrid}>
                      {PERSIAN_WEEKDAYS.map((day, index) => (
                        <div
                          key={day}
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
                  <div className={styles.footer}>
                    {showTodayButton && (
                      <button
                        type="button"
                        className={styles.footerButton}
                        onClick={handleTodayClick}
                      >
                        امروز
                      </button>
                    )}
                    {showTime && (
                      <button
                        type="button"
                        className={styles.footerButton}
                        onClick={handleConfirmCalendarTime}
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
                <div className={styles.monthsGrid}>
                  {PERSIAN_MONTHS.map((month, index) => (
                    <button
                      key={month}
                      type="button"
                      className={clsx(
                        styles.monthCell,
                        index + 1 === viewMonth && styles.monthCellActive,
                      )}
                      onClick={() => handleMonthSelect(index + 1)}
                    >
                      {month}
                    </button>
                  ))}
                </div>
              </div>
            </>
          )}

          {view === "years" && (
            <div className={styles.yearsGridWrapper} ref={yearsGridRef}>
              <div className={styles.yearsGrid}>
                {YEAR_OPTIONS.map((year) => (
                  <button
                    key={year}
                    type="button"
                    data-year={year}
                    className={clsx(styles.yearCell, year === viewYear && styles.yearCellActive)}
                    onClick={() => handleYearSelect(year)}
                  >
                    {year}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {isOpen && mode === "scroll" && (
        <div className={styles.panel}>
          <div className={styles.scrollHeader}>
            <span className={styles.columnLabel}>سال</span>
            <span className={styles.columnLabel}>ماه</span>
            <span className={styles.columnLabel}>روز</span>
            <span className={styles.columnLabel}>ساعت</span>
            <span className={styles.columnLabel}>دقیقه</span>
          </div>

          <div className={styles.scrollWrapper}>
            <div className={styles.scrollGuideTop} />
            <div className={styles.scrollGuideBottom} />

            <div className={styles.scrollContainer}>
              <div
                ref={yearColumnRef}
                className={styles.scrollColumn}
                onScroll={handleColumnScroll(yearOptions.length, (index) =>
                  setDraft((d) => ({ ...d, year: yearOptions[index] })),
                )}
              >
                <div className={styles.scrollPadding} />
                {yearOptions.map((year) => (
                  <div
                    key={year}
                    data-value={year}
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
                onScroll={handleColumnScroll(monthOptionIndices.length, (index) =>
                  setDraft((d) => ({ ...d, month: monthOptionIndices[index] })),
                )}
              >
                <div className={styles.scrollPadding} />
                {monthOptionIndices.map((month) => (
                  <div
                    key={month}
                    data-value={month}
                    className={clsx(
                      styles.scrollItem,
                      month === draft.month && styles.scrollItemActive,
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
                onScroll={handleColumnScroll(dayOptions.length, (index) =>
                  setDraft((d) => ({ ...d, day: dayOptions[index] })),
                )}
              >
                <div className={styles.scrollPadding} />
                {dayOptions.map((day) => (
                  <div
                    key={day}
                    data-value={day}
                    className={clsx(
                      styles.scrollItem,
                      day === draft.day && styles.scrollItemActive,
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
                    onScroll={handleColumnScroll(24, (index) =>
                      setDraftTime((t) => ({ ...t, hour: index })),
                    )}
                  >
                    <div className={styles.scrollPadding} />
                    {Array.from({ length: 24 }, (_, h) => (
                      <div
                        key={h}
                        data-value={h}
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
                    onScroll={handleColumnScroll(60, (index) =>
                      setDraftTime((t) => ({ ...t, minute: index })),
                    )}
                  >
                    <div className={styles.scrollPadding} />
                    {Array.from({ length: 60 }, (_, m) => (
                      <div
                        key={m}
                        data-value={m}
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

          <div className={styles.scrollConfirm}>
            <button type="button" className={styles.footerButton} onClick={handleConfirmScroll}>
              تایید
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
