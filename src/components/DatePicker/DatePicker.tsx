import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import styles from "./DatePicker.module.css";
import {
  getJalaliMonthLength,
  getJalaliWeekday,
  getTodayJalali,
  isSameJalaliDate,
  formatJalali,
  PERSIAN_MONTHS,
  PERSIAN_WEEKDAYS,
  type JalaliDate,
} from "./jalali";

export interface DatePickerProps {
  value: JalaliDate | null;
  onChange: (date: JalaliDate) => void;
  placeholder?: string;
  disabled?: boolean;
  showTodayButton?: boolean;
  className?: string;
  mode?: "calendar" | "scroll";
}

type CalendarView = "days" | "months" | "years";

const MIN_YEAR = 1300;
const MAX_YEAR = 1500;
const ITEM_HEIGHT = 40;

const YEAR_OPTIONS = Array.from({ length: MAX_YEAR - MIN_YEAR + 1 }, (_, i) => MIN_YEAR + i);

export function DatePicker({
  value,
  onChange,
  placeholder = "انتخاب تاریخ",
  disabled = false,
  showTodayButton = true,
  className,
  mode = "calendar",
}: DatePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState<CalendarView>("days");
  const wrapperRef = useRef<HTMLDivElement>(null);
  const yearsGridRef = useRef<HTMLDivElement>(null);
  const today = getTodayJalali();

  const [viewYear, setViewYear] = useState(value?.year ?? today.year);
  const [viewMonth, setViewMonth] = useState(value?.month ?? today.month);

  const [draft, setDraft] = useState<JalaliDate>(value ?? today);

  const dayColumnRef = useRef<HTMLDivElement>(null);
  const monthColumnRef = useRef<HTMLDivElement>(null);
  const yearColumnRef = useRef<HTMLDivElement>(null);

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
    setViewYear(value?.year ?? today.year);
    setViewMonth(value?.month ?? today.month);
    setDraft(value ?? today);
    setView("days");
    setIsOpen(true);
  }

  // ---- Calendar mode ----

  function goToPreviousMonth() {
    if (viewMonth === 1) {
      setViewMonth(12);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  }

  function goToNextMonth() {
    if (viewMonth === 12) {
      setViewMonth(1);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  }

  function handleDayClick(day: number) {
    onChange({ year: viewYear, month: viewMonth, day });
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
    onChange(today);
    setViewYear(today.year);
    setViewMonth(today.month);
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

  // ---- Scroll mode ----

  const draftMonthLength = getJalaliMonthLength(draft.year, draft.month);
  const dayOptions = Array.from({ length: draftMonthLength }, (_, i) => i + 1);

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
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, isOpen]);

  function handleColumnScroll(
    columnRef: React.RefObject<HTMLDivElement | null>,
    optionsLength: number,
    applyIndex: (index: number) => void,
  ) {
    return () => {
      const el = columnRef.current;
      if (!el) return;
      const rawIndex = Math.round(el.scrollTop / ITEM_HEIGHT);
      const clampedIndex = Math.max(0, Math.min(optionsLength - 1, rawIndex));
      applyIndex(clampedIndex);
    };
  }

  // Clicking any item (not just scrolling to it) selects it and smoothly
  // centers it — useful when scrolling far is inconvenient
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
    onChange({ ...draft, day: Math.min(draft.day, maxDay) });
    setIsOpen(false);
  }

  return (
    <div ref={wrapperRef} className={clsx(styles.wrapper, className)} dir="rtl">
      <input
        readOnly
        className={styles.input}
        placeholder={placeholder}
        disabled={disabled}
        value={value ? formatJalali(value) : ""}
        onClick={openPicker}
      />

      {isOpen && mode === "calendar" && (
        <div className={styles.panel}>
          {view === "days" && (
            <>
              <div className={styles.panelPadding}>
                <div className={styles.header}>
                  <button
                    type="button"
                    className={styles.navButton}
                    onClick={goToNextMonth}
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
                    aria-label="ماه قبل"
                  >
                    قبلی
                  </button>
                </div>

                <div className={styles.daysGrid}>
                  {PERSIAN_WEEKDAYS.map((day) => (
                    <div key={day} className={styles.weekday}>
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
                    const isSelected = isSameJalaliDate(value, cellDate);
                    const isToday = isSameJalaliDate(today, cellDate);

                    return (
                      <button
                        key={day}
                        type="button"
                        className={clsx(
                          styles.dayCell,
                          isToday && !isSelected && styles.dayCellToday,
                          isSelected && styles.dayCellSelected,
                        )}
                        onClick={() => handleDayClick(day)}
                      >
                        {day}
                      </button>
                    );
                  })}
                </div>

                {showTodayButton && (
                  <div className={styles.footer}>
                    <button
                      type="button"
                      className={styles.footerButton}
                      onClick={handleTodayClick}
                    >
                      امروز
                    </button>
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
          <div className={styles.scrollWrapper}>
            <div className={styles.scrollGuideTop} />
            <div className={styles.scrollGuideBottom} />

            <div className={styles.scrollContainer}>
              <div
                ref={dayColumnRef}
                className={styles.scrollColumn}
                onScroll={handleColumnScroll(dayColumnRef, dayOptions.length, (index) =>
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

              <div
                ref={monthColumnRef}
                className={styles.scrollColumn}
                onScroll={handleColumnScroll(monthColumnRef, PERSIAN_MONTHS.length, (index) =>
                  setDraft((d) => ({ ...d, month: index + 1 })),
                )}
              >
                <div className={styles.scrollPadding} />
                {PERSIAN_MONTHS.map((month, index) => (
                  <div
                    key={month}
                    data-value={index + 1}
                    className={clsx(
                      styles.scrollItem,
                      index + 1 === draft.month && styles.scrollItemActive,
                    )}
                    onClick={() =>
                      handleItemClick(monthColumnRef, index + 1, () =>
                        setDraft((d) => ({ ...d, month: index + 1 })),
                      )
                    }
                  >
                    {month}
                  </div>
                ))}
                <div className={styles.scrollPadding} />
              </div>

              <div
                ref={yearColumnRef}
                className={styles.scrollColumn}
                onScroll={handleColumnScroll(yearColumnRef, YEAR_OPTIONS.length, (index) =>
                  setDraft((d) => ({ ...d, year: YEAR_OPTIONS[index] })),
                )}
              >
                <div className={styles.scrollPadding} />
                {YEAR_OPTIONS.map((year) => (
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
