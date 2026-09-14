import { useEffect, useRef } from "react";

/**
 * Wheel-and-drag behavior for snap-scrolling lists (wheel-picker style):
 *
 * - Mouse wheel moves exactly ONE item per wheel tick (trackpads accumulate
 *   small deltas until a full step is reached).
 * - The list can be dragged with the mouse; on release it snaps to the
 *   nearest item.
 *
 * The list must be laid out so that item `i` sits at the center when
 * `scrollTop === i * itemHeight` (half-height padding at both ends).
 *
 * While dragging, the element gets a `data-dragging` attribute so CSS can
 * switch the cursor, and a capture-phase click blocker suppresses the click
 * that the browser fires on the release target after a drag.
 */

interface SnapScrollOptions {
  /** Height of a single item in px */
  itemHeight: number;
  /** Number of items — used for clamping */
  itemCount: number;
  /** Attach only while the list is actually rendered */
  enabled: boolean;
  /** Called when wheel/drag settles on a new index */
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
    // Index the list is currently animating toward (null = resting)
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
      // A pause between gestures — reset the accumulated state
      if (now - lastWheelTime > 200) {
        wheelAcc = 0;
        targetIndex = null;
      }
      lastWheelTime = now;

      // Normalize Firefox line-mode deltas to pixels
      const delta = e.deltaMode === 1 ? e.deltaY * 16 : e.deltaY;

      let steps = 0;
      if (Math.abs(delta) >= 50) {
        // A discrete mouse-wheel tick — exactly one item
        steps = delta > 0 ? 1 : -1;
      } else {
        // Trackpad — accumulate until a full step is reached
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
      // Touch keeps native momentum scrolling — don't hijack it
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
        // Real drag started — capture the pointer so it keeps tracking
        // outside the list. Only now: a capture from the start would
        // retarget the click event and break tap-to-select.
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
        // A plain click — let the native click select the item
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
      // The pointer was dragged — this click is not a selection
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
