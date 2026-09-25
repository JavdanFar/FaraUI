import type { HTMLAttributes, ReactNode, Ref } from "react";
import { useRef, useState } from "react";
import clsx from "clsx";
import styles from "./Tooltip.module.css";
import { tooltipPosition } from "../../utils/tooltipPosition";

const VIEWPORT_GAP = 8;

export interface TooltipProps extends Omit<HTMLAttributes<HTMLSpanElement>, "content"> {
  content: ReactNode;
  children: ReactNode;
  ref?: Ref<HTMLSpanElement>;
}

export function Tooltip({
  content,
  children,
  className,
  ref,
  style,
  onMouseEnter,
  onMouseLeave,
  ...rest
}: TooltipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [shift, setShift] = useState(0);
  const [placement, setPlacement] = useState<"top" | "bottom">("top");
  const tooltipRef = useRef<HTMLSpanElement>(null);

  function show(wrapper: HTMLElement) {
    const tooltip = tooltipRef.current;
    if (tooltip) {
      const next = tooltipPosition(
        wrapper.getBoundingClientRect(),
        { width: tooltip.offsetWidth, height: tooltip.offsetHeight },
        window.innerWidth,
        VIEWPORT_GAP,
      );
      setShift(next.shift);
      setPlacement(next.placement);
    }
    setIsVisible(true);
  }

  return (
    <span
      {...rest}
      ref={ref}
      className={clsx(styles.wrapper, className)}
      data-fara-tooltip-wrapper
      onMouseEnter={(event) => {
        show(event.currentTarget);
        onMouseEnter?.(event);
      }}
      onMouseLeave={(event) => {
        setIsVisible(false);
        onMouseLeave?.(event);
      }}
    >
      {children}
      <span
        ref={tooltipRef}
        className={clsx(styles.tooltip, isVisible && styles.visible)}
        style={{ ...style, marginLeft: shift }}
        data-fara-tooltip
        data-open={isVisible || undefined}
        data-placement={placement}
        role="tooltip"
      >
        {content}
        <span
          className={styles.arrow}
          data-fara-tooltip-arrow
          style={{ marginLeft: -shift }}
        />
      </span>
    </span>
  );
}
