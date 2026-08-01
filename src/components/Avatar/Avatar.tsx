import type { HTMLAttributes, Ref } from "react";
import { useState } from "react";
import clsx from "clsx";
import styles from "./Avatar.module.css";

export interface AvatarProps extends HTMLAttributes<HTMLDivElement> {
  src?: string;
  alt?: string;
  fallback?: string;
  size?: "sm" | "md" | "lg";
  ref?: Ref<HTMLDivElement>;
}

export function Avatar({
  src,
  alt = "",
  fallback,
  size = "md",
  className,
  ref,
  ...rest
}: AvatarProps) {
  const [imageError, setImageError] = useState(false);

  const showImage = src && !imageError;

  return (
    <div ref={ref} className={clsx(styles.avatar, styles[size], className)} {...rest}>
      {showImage ? (
        <img src={src} alt={alt} className={styles.image} onError={() => setImageError(true)} />
      ) : (
        fallback
      )}
    </div>
  );
}
