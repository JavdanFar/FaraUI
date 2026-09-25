export interface TooltipPosition {
  shift: number;
  placement: "top" | "bottom";
}

export function tooltipPosition(
  anchor: { left: number; top: number; width: number },
  tooltip: { width: number; height: number },
  viewportWidth: number,
  gap: number,
): TooltipPosition {
  const center = anchor.left + anchor.width / 2;
  const over = center + tooltip.width / 2 - (viewportWidth - gap);
  const under = gap - (center - tooltip.width / 2);

  return {
    shift: over > 0 ? -over : under > 0 ? under : 0,
    placement: anchor.top < tooltip.height + gap ? "bottom" : "top",
  };
}
