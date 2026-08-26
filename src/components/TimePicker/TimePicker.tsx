import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import styles from "./TimePicker.module.css";

export interface TimeValue {
  hour: number;
  minute: number;
  second?: number;
}

export interface TimePickerProps {
  value: TimeValue | null;
  onChange: (value: TimeValue) => void;
  showSeconds?: boolean;
  format?: "24h" | "12h";
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  inputClassName?: string;
}

const ITEM_HEIGHT = 40;
const HOURS_24 = Array.from({ length: 24 }, (_, i) => i);
const HOURS_12 = Array.from({ length: 12 }, (_, i) => i + 1);
const MINUTES_SECONDS = Array.from({ length: 60 }, (_, i) => i);
const PERIODS: Array<{ value: "AM" | "PM"; label: string }> = [
  { value: "AM", label: "ق.ظ" },
  { value: "PM", label: "ب.ظ" },
];

function pad(n: number): string {
  return String(n).padStart(2, "0");
}

function formatTimeValue(value: TimeValue, format: "24h" | "12h", showSeconds: boolean): string {
  const secondsPart = showSeconds && value.second !== undefined ? `:${pad(value.second)}` : "";

  if (format === "24h") {
    return `${pad(value.hour)}:${pad(value.minute)}${secondsPart}`;
  }

  const period = value.hour < 12 ? "ق.ظ" : "ب.ظ";
  const hour12 = value.hour % 12 === 0 ? 12 : value.hour % 12;
  return `${pad(hour12)}:${pad(value.minute)}${secondsPart} ${period}`;
}

function to24Hour(hour12: number, period: "AM" | "PM"): number {
  if (period === "AM") return hour12 === 12 ? 0 : hour12;
  return hour12 === 12 ? 12 : hour12 + 12;
}

export function getCurrentTime(): TimeValue {
  const now = new Date();
  return {
    hour: now.getHours(),
    minute: now.getMinutes(),
    second: now.getSeconds(),
  };
}

export function TimePicker({
  value,
  onChange,
  showSeconds = false,
  format = "24h",
  placeholder = "انتخاب زمان",
  disabled = false,
  className,
  inputClassName,
}: TimePickerProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const defaultValue: TimeValue = getCurrentTime();
  const [draft, setDraft] = useState<TimeValue>(value ?? defaultValue);

  const hourColumnRef = useRef<HTMLDivElement>(null);
  const minuteColumnRef = useRef<HTMLDivElement>(null);
  const secondColumnRef = useRef<HTMLDivElement>(null);
  const periodColumnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      const path = event.composedPath();
      if (wrapperRef.current && !path.includes(wrapperRef.current)) {
        setIsOpen(false);
      }
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") setIsOpen(false);
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
    setDraft(value ?? defaultValue);
    setIsOpen(true);
  }

  const displayHour12 = draft.hour % 12 === 0 ? 12 : draft.hour % 12;
  const displayPeriod: "AM" | "PM" = draft.hour < 12 ? "AM" : "PM";

  useEffect(() => {
    if (!isOpen) return;

    const hourDisplayValue = format === "24h" ? draft.hour : displayHour12;
    hourColumnRef.current
      ?.querySelector(`[data-value="${hourDisplayValue}"]`)
      ?.scrollIntoView({ block: "center" });
    minuteColumnRef.current
      ?.querySelector(`[data-value="${draft.minute}"]`)
      ?.scrollIntoView({ block: "center" });
    if (showSeconds) {
      secondColumnRef.current
        ?.querySelector(`[data-value="${draft.second ?? 0}"]`)
        ?.scrollIntoView({ block: "center" });
    }
    if (format === "12h") {
      periodColumnRef.current
        ?.querySelector(`[data-value="${displayPeriod}"]`)
        ?.scrollIntoView({ block: "center" });
    }
  }, [isOpen]);

  function handleColumnScroll(
    columnRef: React.RefObject<HTMLDivElement | null>,
    optionsLength: number,
    applyIndex: (index: number) => void,
  ) {
    return () => {
      const el = columnRef.current;
      if (!el) return;
      const rawIndex = Math.round(el.scrollTop / ITEM_HEIGHT);
      applyIndex(Math.max(0, Math.min(optionsLength - 1, rawIndex)));
    };
  }

  function handleItemClick(
    columnRef: React.RefObject<HTMLDivElement | null>,
    itemValue: number | string,
    applyValue: () => void,
  ) {
    applyValue();
    columnRef.current
      ?.querySelector(`[data-value="${itemValue}"]`)
      ?.scrollIntoView({ block: "center", behavior: "smooth" });
  }

  function setHourFrom24(hour24: number) {
    setDraft((d) => ({ ...d, hour: hour24 }));
  }

  function setHourFrom12(hour12: number) {
    setDraft((d) => ({ ...d, hour: to24Hour(hour12, displayPeriod) }));
  }

  function setPeriod(period: "AM" | "PM") {
    setDraft((d) => ({ ...d, hour: to24Hour(displayHour12, period) }));
  }

  function handleConfirm() {
    onChange(draft);
    setIsOpen(false);
  }

  const hourOptions = format === "24h" ? HOURS_24 : HOURS_12;

  return (
    <div ref={wrapperRef} className={clsx(styles.wrapper, className)} dir="rtl">
      <input
        readOnly
        className={clsx(styles.input, inputClassName)}
        placeholder={placeholder}
        disabled={disabled}
        value={value ? formatTimeValue(value, format, showSeconds) : ""}
        onClick={openPicker}
      />

      {isOpen && (
        <div className={styles.panel}>
          <div className={styles.scrollWrapper}>
            <div className={styles.scrollGuideTop} />
            <div className={styles.scrollGuideBottom} />

            <div className={styles.scrollContainer}>
              {/* Hour column */}
              <div
                ref={hourColumnRef}
                className={styles.scrollColumn}
                onScroll={handleColumnScroll(hourColumnRef, hourOptions.length, (index) => {
                  const selected = hourOptions[index];
                  if (format === "24h") setHourFrom24(selected);
                  else setHourFrom12(selected);
                })}
              >
                <div className={styles.scrollPadding} />
                {hourOptions.map((h) => {
                  const isActive = format === "24h" ? h === draft.hour : h === displayHour12;
                  return (
                    <div
                      key={h}
                      data-value={h}
                      className={clsx(styles.scrollItem, isActive && styles.scrollItemActive)}
                      onClick={() =>
                        handleItemClick(hourColumnRef, h, () =>
                          format === "24h" ? setHourFrom24(h) : setHourFrom12(h),
                        )
                      }
                    >
                      {pad(h)}
                    </div>
                  );
                })}
                <div className={styles.scrollPadding} />
              </div>

              <div className={styles.separator}>:</div>

              {/* Minute column */}
              <div
                ref={minuteColumnRef}
                className={styles.scrollColumn}
                onScroll={handleColumnScroll(minuteColumnRef, MINUTES_SECONDS.length, (index) =>
                  setDraft((d) => ({ ...d, minute: index })),
                )}
              >
                <div className={styles.scrollPadding} />
                {MINUTES_SECONDS.map((m) => (
                  <div
                    key={m}
                    data-value={m}
                    className={clsx(
                      styles.scrollItem,
                      m === draft.minute && styles.scrollItemActive,
                    )}
                    onClick={() =>
                      handleItemClick(minuteColumnRef, m, () =>
                        setDraft((d) => ({ ...d, minute: m })),
                      )
                    }
                  >
                    {pad(m)}
                  </div>
                ))}
                <div className={styles.scrollPadding} />
              </div>

              {/* Second column (optional) */}
              {showSeconds && (
                <>
                  <div className={styles.separator}>:</div>
                  <div
                    ref={secondColumnRef}
                    className={styles.scrollColumn}
                    onScroll={handleColumnScroll(secondColumnRef, MINUTES_SECONDS.length, (index) =>
                      setDraft((d) => ({ ...d, second: index })),
                    )}
                  >
                    <div className={styles.scrollPadding} />
                    {MINUTES_SECONDS.map((s) => (
                      <div
                        key={s}
                        data-value={s}
                        className={clsx(
                          styles.scrollItem,
                          s === (draft.second ?? 0) && styles.scrollItemActive,
                        )}
                        onClick={() =>
                          handleItemClick(secondColumnRef, s, () =>
                            setDraft((d) => ({ ...d, second: s })),
                          )
                        }
                      >
                        {pad(s)}
                      </div>
                    ))}
                    <div className={styles.scrollPadding} />
                  </div>
                </>
              )}

              {/* AM/PM column (only for 12h format) */}
              {format === "12h" && (
                <div
                  ref={periodColumnRef}
                  className={styles.scrollColumn}
                  onScroll={handleColumnScroll(periodColumnRef, PERIODS.length, (index) =>
                    setPeriod(PERIODS[index].value),
                  )}
                >
                  <div className={styles.scrollPadding} />
                  {PERIODS.map((p) => (
                    <div
                      key={p.value}
                      data-value={p.value}
                      className={clsx(
                        styles.scrollItem,
                        p.value === displayPeriod && styles.scrollItemActive,
                      )}
                      onClick={() =>
                        handleItemClick(periodColumnRef, p.value, () => setPeriod(p.value))
                      }
                    >
                      {p.label}
                    </div>
                  ))}
                  <div className={styles.scrollPadding} />
                </div>
              )}
            </div>
          </div>

          <div className={styles.confirmRow}>
            <button type="button" className={styles.confirmButton} onClick={handleConfirm}>
              تایید
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
