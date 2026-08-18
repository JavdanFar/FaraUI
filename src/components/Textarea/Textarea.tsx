import type { TextareaHTMLAttributes, Ref } from "react";
import { useEffect, useRef } from "react";
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
  ...rest
}: TextareaProps) {
  const internalRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!autoResize || !internalRef.current) return;

    const el = internalRef.current;
    el.style.height = "auto";
    el.style.height = `${el.scrollHeight}px`;
  }, [autoResize, value]);

  return (
    <textarea
      ref={(node) => {
        internalRef.current = node;
        if (typeof ref === "function") ref(node);
        else if (ref) ref.current = node;
      }}
      className={clsx(
        styles.textarea,
        error && styles.error,
        !resizable && styles.noResize,
        autoResize && styles.autoResize,
        className,
      )}
      value={value}
      onChange={onChange}
      {...rest}
    />
  );
}
