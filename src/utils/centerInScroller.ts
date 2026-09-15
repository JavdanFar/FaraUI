import type { RefObject } from "react";

export function centerInScroller(
  scrollerRef: RefObject<HTMLElement | null>,
  selector: string,
  behavior: ScrollBehavior = "auto",
) {
  const list = scrollerRef.current;
  const item = list?.querySelector<HTMLElement>(selector);
  if (!list || !item) return;

  const listRect = list.getBoundingClientRect();
  const itemRect = item.getBoundingClientRect();
  const delta = itemRect.top + itemRect.height / 2 - (listRect.top + listRect.height / 2);
  list.scrollTo({ top: list.scrollTop + delta, behavior });
}
