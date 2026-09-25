import type { Ref } from "react";

export function mergeRefs<T>(...refs: Array<Ref<T> | undefined>) {
  return (value: T | null) => {
    for (const ref of refs) {
      if (!ref) continue;
      if (typeof ref === "function") {
        ref(value);
      } else {
        ref.current = value;
      }
    }
  };
}
