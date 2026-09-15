import { useEffect, useRef } from "react";

interface SnapScrollOptions {
  itemHeight: number;
  itemCount: number;
  enabled: boolean;
  onIndexChange?: (index: number) => void;
}

export function useSnapScroll<T extends HTMLElement>(
  ref: React.RefObject<T | null>,
  { itemHeight, itemCount, enabled, onIndexChange }: SnapScrollOptions,
) {
  const onIndexChangeRef = useRef(onIndexChange);

  useEffect(() => {
    onIndexChangeRef.current = onIndexChange;
  });

  useEffect(() => {
    const el: HTMLElement | null = ref.current;
    if (!enabled || !el || itemCount <= 1) return;

    let wheelAcc = 0;
    let lastWheelTime = 0;
    let targetIndex: number | null = null;
    let isDragging = false;
    let dragMoved = false;
    let startY = 0;
    let startScrollTop = 0;

    const clampIndex = (i: number) => Math.max(0, Math.min(itemCount - 1, i));
    const indexFromScroll = () => clampIndex(Math.round(el.scrollTop / itemHeight));

    const scrollToIndex = (index: number, behavior: ScrollBehavior) => {
      el.scrollTo({ top: index * itemHeight, behavior });
    };

    const handleWheel = (e: WheelEvent) => {
      e.preventDefault();

      const now = performance.now();
      if (now - lastWheelTime > 200) {
        wheelAcc = 0;
        targetIndex = null;
      }
      lastWheelTime = now;

      const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;

      let steps = 0;
      if (Math.abs(delta) >= 50) {
        steps = delta > 0 ? 1 : -1;
      } else {
        wheelAcc += delta;
        if (Math.abs(wheelAcc) >= 40) {
          steps = wheelAcc > 0 ? 1 : -1;
          wheelAcc = 0;
        }
      }

      if (steps === 0) return;
      const current = targetIndex ?? indexFromScroll();
      const next = clampIndex(current + steps);
      if (next === current) return;
      targetIndex = next;
      scrollToIndex(next, "smooth");
      onIndexChangeRef.current?.(next);
    };

    const handlePointerDown = (e: PointerEvent) => {
      if (e.pointerType === "touch" || e.button !== 0) return;
      isDragging = true;
      dragMoved = false;
      startY = e.clientY;
      startScrollTop = el.scrollTop;
      targetIndex = null;
      wheelAcc = 0;
      window.addEventListener("pointermove", handlePointerMove);
      window.addEventListener("pointerup", handlePointerUp);
      window.addEventListener("pointercancel", handlePointerUp);
    };

    const handlePointerMove = (e: PointerEvent) => {
      if (!isDragging) return;
      const dy = e.clientY - startY;
      if (!dragMoved && Math.abs(dy) > 3) {
        dragMoved = true;
        el.style.scrollBehavior = "auto";
        el.dataset.dragging = "true";
        el.setPointerCapture(e.pointerId);
      }
      if (!dragMoved) return;
      el.scrollTop = startScrollTop - dy;
    };

    const handlePointerUp = () => {
      if (!isDragging) return;
      isDragging = false;
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);

      if (!dragMoved) {
        return;
      }

      el.style.scrollBehavior = "";
      delete el.dataset.dragging;

      const index = indexFromScroll();
      targetIndex = index;
      scrollToIndex(index, "smooth");
      onIndexChangeRef.current?.(index);
    };

    const handleClickCapture = (e: MouseEvent) => {
      if (!dragMoved) return;
      e.stopPropagation();
      e.preventDefault();
      dragMoved = false;
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    el.addEventListener("pointerdown", handlePointerDown);
    el.addEventListener("click", handleClickCapture, true);

    return () => {
      el.removeEventListener("wheel", handleWheel);
      el.removeEventListener("pointerdown", handlePointerDown);
      el.removeEventListener("click", handleClickCapture, true);
      window.removeEventListener("pointermove", handlePointerMove);
      window.removeEventListener("pointerup", handlePointerUp);
      window.removeEventListener("pointercancel", handlePointerUp);
    };
  }, [ref, itemHeight, itemCount, enabled]);
}
