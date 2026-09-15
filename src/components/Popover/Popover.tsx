import type { ReactNode } from "react";
import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import styles from "./Popover.module.css";
import { AnchoredPopup } from "../AnchoredPopup";

const EXIT_ANIMATION_MS = 150;

export interface PopoverProps {
  trigger: ReactNode;
  children: ReactNode;
  align?: "start" | "end";
  className?: string;
}

export function Popover({ trigger, children, align = "start", className }: PopoverProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);

  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  function openPopover() {
    window.clearTimeout(closeTimer.current);
    if (!shouldRender) setShouldRender(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsVisible(true));
    });
  }

  function closePopover() {
    if (!shouldRender) return;
    setIsOpen(false);
    setIsVisible(false);
    closeTimer.current = window.setTimeout(() => setShouldRender(false), EXIT_ANIMATION_MS);
  }

  function togglePopover() {
    if (isOpen) closePopover();
    else {
      setIsOpen(true);
      openPopover();
    }
  }

  return (
    <div data-fara-popover className={clsx(styles.wrapper, className)}>
      <span ref={triggerRef} data-fara-popover-trigger onClick={togglePopover}>
        {trigger}
      </span>

      <AnchoredPopup
        open={shouldRender}
        anchorRef={triggerRef}
        onClose={closePopover}
        className={clsx(styles.content, isVisible && styles.contentVisible)}
        align={align}
        dataFara="popover-content"
      >
        <div role="dialog">{children}</div>
      </AnchoredPopup>
    </div>
  );
}
