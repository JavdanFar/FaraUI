import type { ReactNode } from "react";
import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import styles from "./DropdownMenu.module.css";
import { AnchoredPopup } from "../AnchoredPopup";

const EXIT_ANIMATION_MS = 150;

export interface DropdownMenuProps {
  trigger: ReactNode;
  children: ReactNode;
}

export function DropdownMenu({ trigger, children }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const triggerRef = useRef<HTMLSpanElement>(null);

  const [shouldRender, setShouldRender] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const closeTimer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(closeTimer.current), []);

  function openMenu() {
    window.clearTimeout(closeTimer.current);
    if (!shouldRender) setShouldRender(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => setIsVisible(true));
    });
  }

  function closeMenu() {
    if (!shouldRender) return;
    setIsVisible(false);
    closeTimer.current = window.setTimeout(() => setShouldRender(false), EXIT_ANIMATION_MS);
  }

  function toggleMenu() {
    if (isOpen) closeMenu();
    else {
      setIsOpen(true);
      openMenu();
    }
  }

  return (
    <div className={styles.wrapper}>
      <span ref={triggerRef} onClick={toggleMenu}>
        {trigger}
      </span>

      <AnchoredPopup
        open={shouldRender}
        anchorRef={triggerRef}
        onClose={closeMenu}
        className={clsx(styles.menu, isVisible && styles.menuVisible)}
        align="end"
      >
        <div
          role="menu"
          onClick={closeMenu}
        >
          {children}
        </div>
      </AnchoredPopup>
    </div>
  );
}

export interface DropdownMenuItemProps {
  children: ReactNode;
  onClick?: () => void;
  disabled?: boolean;
  danger?: boolean;
}

export function DropdownMenuItem({ children, onClick, disabled, danger }: DropdownMenuItemProps) {
  return (
    <button
      type="button"
      role="menuitem"
      disabled={disabled}
      onClick={onClick}
      className={clsx(styles.item, danger && styles.itemDanger)}
    >
      {children}
    </button>
  );
}
