export function nearestInList(value: number, list: number[]): number {
  if (list.length === 0) return value;
  return list.reduce((best, item) =>
    Math.abs(item - value) < Math.abs(best - value) ? item : best,
  );
}
