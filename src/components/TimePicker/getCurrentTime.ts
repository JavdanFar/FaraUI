export interface TimeValue {
  hour: number;
  minute: number;
  second?: number;
}

export function getCurrentTime(): TimeValue {
  const now = new Date();
  return {
    hour: now.getHours(),
    minute: now.getMinutes(),
    second: now.getSeconds(),
  };
}
