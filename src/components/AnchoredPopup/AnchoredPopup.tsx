import { useIsClient } from "../../hooks/useIsClient";
import type { CSSProperties, ReactNode, RefObject } from "react";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import { createPortal } from "react-dom";
import clsx from "clsx";
import styles from "./AnchoredPopup.module.css";
import { registerOverlay } from "../../utils/overlayStack";

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

    let frame: number | null = null;

    function update() {
      frame = null;
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

      const width = matchAnchorWidth ? rect.width : undefined;
      setPosition((prev) =>
        prev && prev.top === top && prev.left === left && prev.width === width
          ? prev
          : { top, left, width },
      );
    }

    function scheduleUpdate() {
      if (frame !== null) return;
      frame = requestAnimationFrame(update);
    }

    update();

    window.addEventListener("scroll", scheduleUpdate, { capture: true, passive: true });
    window.addEventListener("resize", scheduleUpdate);
    return () => {
      if (frame !== null) cancelAnimationFrame(frame);
      window.removeEventListener("scroll", scheduleUpdate, { capture: true });
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [open, anchorRef, dir, align, gap, matchAnchorWidth, viewportPadding, children]);

  useEffect(() => {
    if (!open) return;

    function handlePointerDown(event: MouseEvent) {
      const path = event.composedPath();
      const popup = popupRef.current;
      const anchor = anchorRef.current;
      if (popup && path.includes(popup)) return;
      if (anchor && path.includes(anchor)) return;
      onCloseRef.current();
    }

    const unregisterOverlay = registerOverlay(() => {
      if (popupRef.current?.contains(document.activeElement)) {
        anchorRef.current?.focus();
      }

      onCloseRef.current();
    });

    document.addEventListener("mousedown", handlePointerDown);
    return () => {
      document.removeEventListener("mousedown", handlePointerDown);
      unregisterOverlay();
    };
  }, [open, anchorRef]);

  const isClient = useIsClient();
  if (!isClient || !open) return null;

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
