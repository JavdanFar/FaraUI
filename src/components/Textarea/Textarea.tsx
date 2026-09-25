import type { TextareaHTMLAttributes, Ref } from "react";
import { useCallback, useEffect, useRef } from "react";
import clsx from "clsx";
import styles from "./Textarea.module.css";

export interface TextareaProps extends TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
  resizable?: boolean;
  autoResize?: boolean;
  ref?: Ref<HTMLTextAreaElement>;
}

export function Textarea({
  error = false,
  resizable = true,
  autoResize = false,
  className,
  ref,
  value,
  onChange,
  onInput,
  ...rest
}: TextareaProps) {
  const internalRef = useRef<HTMLTextAreaElement>(null);

  const resize = useCallback(() => {
    const el = internalRef.current;
    if (!el) return;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight + (el.offsetHeight - el.clientHeight)}px`;
  }, []);

  useEffect(() => {
    const el = internalRef.current;
    if (!el) return;

    if (autoResize) resize();
    else el.style.height = "";
  }, [autoResize, value, resize]);

  return (
    <textarea
      ref={(node) => {
        internalRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      data-fara-textarea
      data-error={error || undefined}
      className={clsx(
        styles.textarea,
        error && styles.error,
        !resizable && styles.noResize,
        autoResize && styles.autoResize,
        className,
      )}
      value={value}
      onChange={onChange}
      onInput={(event) => {
        if (autoResize) resize();
        onInput?.(event);
      }}
      {...rest}
    />
  );
}
