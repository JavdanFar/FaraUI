import type { CSSProperties, ReactNode, RefObject } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import styles from "./AnchoredPopup.module.css";

export interface AnchoredPopupProps {
  open: boolean;
  anchorRef: RefObject<HTMLElement | null>;
  onClose: () => void;
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
  dir?: "rtl" | "ltr";
  gap?: number;
  align?: "start" | "end";
  matchAnchorWidth?: boolean;
  viewportPadding?: number;
  dataFara?: string;
}

interface Position {
  top: number;
  left: number;
  width?: number;
}

export function AnchoredPopup({
  open,
  anchorRef,
  onClose,
  children,
  className,
  style,
  dir = "rtl",
  gap = 4,
  align = "start",
  matchAnchorWidth = false,
  viewportPadding = 8,
  dataFara,
}: AnchoredPopupProps) {
  const popupRef = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState<Position | null>(null);

  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  });

  useLayoutEffect(() => {
    if (!open) return;

    function update() {
      const anchor = anchorRef.current;
      const popup = popupRef.current;
      if (!anchor || !popup) return;

      const rect = anchor.getBoundingClientRect();
      const popupWidth = matchAnchorWidth ? rect.width : popup.offsetWidth;
      const popupHeight = popup.offsetHeight;
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;

      let top = rect.bottom + gap;
      if (top + popupHeight > viewportHeight - viewportPadding) {
        const topAbove = rect.top - popupHeight - gap;
        if (topAbove >= viewportPadding) {
          top = topAbove;
        } else {
          top = Math.max(viewportPadding, viewportHeight - viewportPadding - popupHeight);
        }
      }

      let left =
        align === "start"
          ? dir === "rtl"
            ? rect.right - popupWidth
            : rect.left
          : dir === "rtl"
            ? rect.left
            : rect.right - popupWidth;

      left = Math.max(
        viewportPadding,
        Math.min(left, viewportWidth - viewportPadding - popupWidth),
      );

      setPosition({
        top,
        left,
        width: matchAnchorWidth ? rect.width : undefined,
      });
    }

    update();

    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    return () => {
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [open, anchorRef, dir, align, gap, matchAnchorWidth, viewportPadding, children]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      const target = event.target as Node;
      if (popupRef.current?.contains(target)) return;
      if (anchorRef.current?.contains(target)) return;
      onCloseRef.current();
    }

    function handleKeyDown(event: KeyboardEvent) {
      if (event.key === "Escape") onCloseRef.current();
    }

    document.addEventListener("mousedown", handlePointerDown);
    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, [open, anchorRef]);

  if (!open) return null;

  const faraAttrs = dataFara ? { [`data-fara-${dataFara}`]: "" } : undefined;

  return createPortal(
    <div
      ref={popupRef}
      dir={dir}
      {...faraAttrs}
      className={clsx(styles.popup, className)}
      style={{
        ...style,
        ...position,
        visibility: position ? "visible" : "hidden",
      }}
    >
      {children}
    </div>,
    document.body,
  );
}
