import type { InputHTMLAttributes, KeyboardEvent, Ref } from "react";
import { useEffect, useMemo, useRef, useState } from "react";
import clsx from "clsx";
import styles from "./TimePicker.module.css";
import { useSnapScroll } from "../../hooks/useSnapScroll";
import { centerInScroller } from "../../utils/centerInScroller";
import { mergeRefs } from "../../utils/mergeRefs";
import { AnchoredPopup } from "../AnchoredPopup";
import { getCurrentTime } from "./getCurrentTime";
import type { TimeValue } from "./getCurrentTime";

export interface TimePickerProps extends Omit<
  InputHTMLAttributes<HTMLInputElement>,
  "value" | "defaultValue" | "onChange"
> {
  value?: TimeValue | null;
  defaultValue?: TimeValue | null;
  onChange?: (value: TimeValue) => void;
  showSeconds?: boolean;
  format?: "24h" | "12h";
  defaultTime?: "current" | "zero";
  inputClassName?: string;
  ref?: Ref<HTMLInputElement>;
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

export function TimePicker({
  value,
  defaultValue = null,
  onChange,
  showSeconds = false,
  format = "24h",
  defaultTime = "current",
  placeholder = "انتخاب زمان",
  disabled = false,
  className,
  inputClassName,
  ref,
  onKeyDown,
  ...rest
}: TimePickerProps) {
  const isControlled = value !== undefined;
  const [internalValue, setInternalValue] = useState<TimeValue | null>(defaultValue);
  const currentValue = isControlled ? (value ?? null) : internalValue;

  function fallbackTime(): TimeValue {
    return defaultTime === "zero" ? { hour: 0, minute: 0, second: 0 } : getCurrentTime();
  }

  const [draft, setDraft] = useState<TimeValue>(() => currentValue ?? fallbackTime());
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const assignInputRef = useMemo(() => mergeRefs(inputRef, ref), [inputRef, ref]);

  const hourColumnRef = useRef<HTMLDivElement>(null);
  const minuteColumnRef = useRef<HTMLDivElement>(null);
  const secondColumnRef = useRef<HTMLDivElement>(null);
  const periodColumnRef = useRef<HTMLDivElement>(null);

  function closePicker() {
    setIsOpen(false);
  }

  function openPicker() {
    if (disabled) return;
    setDraft(currentValue ?? fallbackTime());
    setIsOpen(true);
  }

  function handleInputKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter" || event.key === " " || event.key === "ArrowDown") {
      event.preventDefault();
      openPicker();
    }
    onKeyDown?.(event);
  }

  const displayHour12 = draft.hour % 12 === 0 ? 12 : draft.hour % 12;
  const displayPeriod: "AM" | "PM" = draft.hour < 12 ? "AM" : "PM";

  const draftRef = useRef(draft);
  useEffect(() => {
    draftRef.current = draft;
  });

  useEffect(() => {
    if (!isOpen) return;

    const current = draftRef.current;
    const currentHour12 = current.hour % 12 === 0 ? 12 : current.hour % 12;
    const currentPeriod: "AM" | "PM" = current.hour < 12 ? "AM" : "PM";

    const hourDisplayValue = format === "24h" ? current.hour : currentHour12;
    centerInScroller(hourColumnRef, `[data-value="${hourDisplayValue}"]`, "instant");
    centerInScroller(minuteColumnRef, `[data-value="${current.minute}"]`, "instant");
    if (showSeconds) {
      centerInScroller(secondColumnRef, `[data-value="${current.second ?? 0}"]`, "instant");
    }
    if (format === "12h") {
      centerInScroller(periodColumnRef, `[data-value="${currentPeriod}"]`, "instant");
    }
  }, [isOpen, format, showSeconds]);

  function handleColumnScroll(optionsLength: number, applyIndex: (index: number) => void) {
    return (event: React.UIEvent<HTMLDivElement>) => {
      const el = event.currentTarget;
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
    centerInScroller(columnRef, `[data-value="${itemValue}"]`, "smooth");
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
    if (!isControlled) setInternalValue(draft);
    onChange?.(draft);
    setIsOpen(false);
  }

  const hourOptions = format === "24h" ? HOURS_24 : HOURS_12;

  useSnapScroll(hourColumnRef, {
    itemHeight: ITEM_HEIGHT,
    itemCount: hourOptions.length,
    enabled: isOpen,
    onIndexChange: (index) => {
      const selected = hourOptions[index];
      if (format === "24h") setHourFrom24(selected);
      else setHourFrom12(selected);
    },
  });
  useSnapScroll(minuteColumnRef, {
    itemHeight: ITEM_HEIGHT,
    itemCount: MINUTES_SECONDS.length,
    enabled: isOpen,
    onIndexChange: (index) => setDraft((d) => ({ ...d, minute: index })),
  });
  useSnapScroll(secondColumnRef, {
    itemHeight: ITEM_HEIGHT,
    itemCount: MINUTES_SECONDS.length,
    enabled: isOpen && showSeconds,
    onIndexChange: (index) => setDraft((d) => ({ ...d, second: index })),
  });
  useSnapScroll(periodColumnRef, {
    itemHeight: ITEM_HEIGHT,
    itemCount: PERIODS.length,
    enabled: isOpen && format === "12h",
    onIndexChange: (index) => setPeriod(PERIODS[index].value),
  });

  return (
    <div
      ref={wrapperRef}
      data-fara-time-picker
      className={clsx(styles.wrapper, className)}
      dir="rtl"
    >
      <input
        {...rest}
        ref={assignInputRef}
        readOnly
        data-fara-time-picker-input
        className={clsx(styles.input, inputClassName)}
        placeholder={placeholder}
        disabled={disabled}
        value={currentValue ? formatTimeValue(currentValue, format, showSeconds) : ""}
        onClick={openPicker}
        onKeyDown={handleInputKeyDown}
      />

      <AnchoredPopup
        open={isOpen}
        anchorRef={inputRef}
        onClose={closePicker}
        className={styles.panel}
        gap={4}
        dataFara="time-picker-panel"
      >
        <div className={styles.scrollHeader} data-fara-time-picker-header>
          <span className={styles.columnLabel} data-fara-time-picker-column-label>
            ساعت
          </span>
          <span className={styles.separator}>:</span>
          <span className={styles.columnLabel} data-fara-time-picker-column-label>
            دقیقه
          </span>
          {showSeconds && (
            <>
              <span className={styles.separator}>:</span>
              <span className={styles.columnLabel} data-fara-time-picker-column-label>
                ثانیه
              </span>
            </>
          )}
          {format === "12h" && (
            <span className={styles.columnLabel} data-fara-time-picker-column-label></span>
          )}
        </div>
        <div className={styles.scrollWrapper}>
          <div className={styles.scrollGuideTop} />
          <div className={styles.scrollGuideBottom} />

          <div className={styles.scrollContainer} data-fara-time-picker-scroll-container>
            {/* Hour column */}
            <div
              ref={hourColumnRef}
              className={styles.scrollColumn}
              data-fara-time-picker-column
              data-column="hour"
              onScroll={handleColumnScroll(hourOptions.length, (index) => {
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
                    data-fara-time-picker-item
                    data-selected={isActive || undefined}
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

            <div className={styles.separator} data-fara-time-picker-separator>
              :
            </div>

            {/* Minute column */}
            <div
              ref={minuteColumnRef}
              className={styles.scrollColumn}
              data-fara-time-picker-column
              data-column="minute"
              onScroll={handleColumnScroll(MINUTES_SECONDS.length, (index) =>
                setDraft((d) => ({ ...d, minute: index })),
              )}
            >
              <div className={styles.scrollPadding} />
              {MINUTES_SECONDS.map((m) => (
                <div
                  key={m}
                  data-value={m}
                  data-fara-time-picker-item
                  data-selected={m === draft.minute || undefined}
                  className={clsx(styles.scrollItem, m === draft.minute && styles.scrollItemActive)}
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
                <div className={styles.separator} data-fara-time-picker-separator>
                  :
                </div>
                <div
                  ref={secondColumnRef}
                  className={styles.scrollColumn}
                  data-fara-time-picker-column
                  data-column="second"
                  onScroll={handleColumnScroll(MINUTES_SECONDS.length, (index) =>
                    setDraft((d) => ({ ...d, second: index })),
                  )}
                >
                  <div className={styles.scrollPadding} />
                  {MINUTES_SECONDS.map((s) => (
                    <div
                      key={s}
                      data-value={s}
                      data-fara-time-picker-item
                      data-selected={s === (draft.second ?? 0) || undefined}
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
                data-fara-time-picker-column
                data-column="period"
                onScroll={handleColumnScroll(PERIODS.length, (index) =>
                  setPeriod(PERIODS[index].value),
                )}
              >
                <div className={styles.scrollPadding} />
                {PERIODS.map((p) => (
                  <div
                    key={p.value}
                    data-value={p.value}
                    data-fara-time-picker-item
                    data-selected={p.value === displayPeriod || undefined}
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

        <div className={styles.confirmRow} data-fara-time-picker-confirm-row>
          <button
            type="button"
            className={styles.confirmButton}
            data-fara-time-picker-confirm-button
            onClick={handleConfirm}
          >
            تایید
          </button>
        </div>
      </AnchoredPopup>
    </div>
  );
}
