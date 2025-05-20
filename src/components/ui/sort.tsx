import React, { useState } from "react";
import { ArrowUpDown } from "lucide-react";

type SortDirection = "asc" | "desc" | null;

interface SortButtonProps<T> {
  data: T[];
  sortKey: keyof T;
  onSort: (sortedData: T[]) => void;
  label?: string;
}

export function SortButton<T>({ data, sortKey, onSort, label }: SortButtonProps<T>) {
  const [direction, setDirection] = useState<SortDirection>(null);

  const handleSort = () => {
    let newDirection: SortDirection;
    if (direction === "asc") {
      newDirection = "desc";
    } else if (direction === "desc") {
      newDirection = null;
    } else {
      newDirection = "asc";
    }
    setDirection(newDirection);

    if (newDirection === null) {
      onSort(data);
      return;
    }

    const sortedData = [...data].sort((a, b) => {
      const aValue = a[sortKey];
      const bValue = b[sortKey];

      if (aValue === bValue) return 0;

      if (newDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    onSort(sortedData);
  };

  return (
    <button
      onClick={handleSort}
      className="px-2 py-1 rounded bg-transparent text-sm inline-flex items-center gap-1 cursor-pointer"
      aria-label={`Sort by ${String(sortKey)} in ${direction ?? "none"} order`}
      type="button"
    >
      <ArrowUpDown size={14} />
    </button>
  );
}
