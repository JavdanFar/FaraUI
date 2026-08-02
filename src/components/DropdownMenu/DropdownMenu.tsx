import type { ReactNode } from "react";
import { useState, useRef, useEffect } from "react";
import clsx from "clsx";
import styles from "./DropdownMenu.module.css";

export interface DropdownMenuProps {
  trigger: ReactNode;
  children: ReactNode;
}

export function DropdownMenu({ trigger, children }: DropdownMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const wrapperRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={wrapperRef} className={styles.wrapper}>
      <span onClick={() => setIsOpen((prev) => !prev)}>{trigger}</span>

      {isOpen && (
        <div className={styles.menu} role="menu" onClick={() => setIsOpen(false)}>
          {children}
        </div>
      )}
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
