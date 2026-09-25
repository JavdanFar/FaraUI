export function nextActiveIndex(current: number, step: 1 | -1, length: number): number {
  if (length <= 0) return -1;
  const from = current < 0 ? (step === 1 ? -1 : 0) : current;
  return (from + step + length) % length;
}
