import type { ReactNode } from "react";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import styles from "./Popover.module.css";

export interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: "start" | "end";
  className?: string;
}

export function Popover({ trigger, children, align = "start", className }: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => setIsVisible(true));
      });
    } else {
      setIsVisible(false);
      const timeout = setTimeout(() => setShouldRender(false), 150);
      return () => clearTimeout(timeout);
    }
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;

    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
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

  return (
    <div ref={wrapperRef} className={clsx(styles.wrapper, className)}>
      <span onClick={() => setIsOpen((prev) => !prev)}>{trigger}</span>

      {shouldRender && (
        <div
          className={clsx(
            styles.content,
            align === "end" && styles.contentEnd,
            isVisible && styles.contentVisible,
          )}
          role="dialog"
        >
          {children}
        </div>
      )}
    </div>
  );
}
