export function ChevronIcon({ direction }: { direction: "previous" | "next" }) {
  // RTL calendar: "previous" points right, "next" points left
  const points = direction === "previous" ? "9 18 15 12 9 6" : "15 18 9 12 15 6";

  return (
    <svg
      width="16"
      height="16"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <polyline points={points} />
    </svg>
  );
}
