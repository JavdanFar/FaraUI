import type { RejectedFile } from "./types";

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

export function isImageFileName(name: string): boolean {
  return /\.(png|jpe?g|gif|webp|svg|avif|bmp)$/i.test(name);
}

export function matchesAccept(file: File, accept?: string): boolean {
  if (!accept) return true;

  const patterns = accept
    .split(",")
    .map((p) => p.trim())
    .filter(Boolean);
  if (patterns.length === 0) return true;

  return patterns.some((pattern) => {
    if (pattern.startsWith(".")) {
      return file.name.toLowerCase().endsWith(pattern.toLowerCase());
    }
    if (pattern.endsWith("/*")) {
      const prefix = pattern.slice(0, -1);
      return file.type.startsWith(prefix);
    }
    return file.type === pattern;
  });
}

interface ValidateOptions {
  accept?: string;
  maxSize?: number;
  maxFiles?: number;
  currentCount: number;
  validate?: (file: File) => string | null;
}

export function validateFiles(
  files: File[],
  options: ValidateOptions,
): { accepted: File[]; rejected: RejectedFile[] } {
  const accepted: File[] = [];
  const rejected: RejectedFile[] = [];
  let remainingSlots =
    options.maxFiles !== undefined
      ? Math.max(0, options.maxFiles - options.currentCount)
      : Infinity;

  for (const file of files) {
    if (options.accept && !matchesAccept(file, options.accept)) {
      rejected.push({
        name: file.name,
        reason: "type",
        message: `نوع فایل «${file.name}» مجاز نیست`,
      });
      continue;
    }

    if (options.maxSize !== undefined && file.size > options.maxSize) {
      rejected.push({
        name: file.name,
        reason: "size",
        message: `حجم «${file.name}» بیشتر از ${formatFileSize(options.maxSize)} است`,
      });
      continue;
    }

    if (options.validate) {
      const customError = options.validate(file);
      if (customError) {
        rejected.push({ name: file.name, reason: "type", message: customError });
        continue;
      }
    }

    if (remainingSlots <= 0) {
      rejected.push({
        name: file.name,
        reason: "count",
        message: `حداکثر تعداد فایل مجاز رسیده است`,
      });
      continue;
    }

    accepted.push(file);
    remainingSlots -= 1;
  }

  return { accepted, rejected };
}
