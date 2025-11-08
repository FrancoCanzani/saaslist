interface EmptyGridCellProps {
  index: number;
  cellIndex: number;
  totalCells: number;
}

export default function EmptyGridCell({
  index,
  cellIndex,
  totalCells,
}: EmptyGridCellProps) {
  return (
    <div
      className={`relative overflow-hidden border-b
        lg:border-r
        ${cellIndex % 2 === 1 ? "lg:border-r-0" : ""}
        ${cellIndex >= totalCells - (totalCells % 2 || 2) ? "lg:border-b-0" : ""}
        ${cellIndex === totalCells - 1 ? "border-b-0" : ""}`}
    >
      <svg
        fill="none"
        className="absolute inset-0 h-full w-full stroke-gray-200 dark:stroke-gray-600"
      >
        <defs>
          <pattern
            id={`pattern-${index}`}
            width="10"
            height="10"
            x="0"
            y="0"
            patternUnits="userSpaceOnUse"
          >
            <path d="M-3 13 15-5M-5 5l18-18M-1 21 17 3" />
          </pattern>
        </defs>
        <rect
          width="100%"
          height="100%"
          fill={`url(#pattern-${index})`}
          stroke="none"
        />
      </svg>
    </div>
  );
}

