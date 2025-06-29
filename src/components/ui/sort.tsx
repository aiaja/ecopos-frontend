import React, { useState } from "react";
import { ArrowUpDown } from "lucide-react";
import { getNestedValue } from "@/lib/utils";

type SortDirection = "asc" | "desc" | null;

interface SortButtonProps<T> {
  data: T[];
  sortKey?: keyof T | string;
  // valueGetter adalah fungsi yang menerima item dari data (T) dan mengembalikan nilai yang akan diurutkan
  valueGetter?: (item: T) => any;
  onSort: (sortedData: T[]) => void;
  label?: string;
}

export function SortButton<T>({ data, sortKey, valueGetter, onSort, label }: SortButtonProps<T>) {
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

    const sorted = [...data].sort((a, b) => {
      let aValue: any;
      let bValue: any;

      // Prioritaskan valueGetter jika ada
      if (valueGetter) {
        aValue = valueGetter(a);
        bValue = valueGetter(b);
      } else if (sortKey) { // Jika tidak ada valueGetter, gunakan sortKey biasa
        aValue = getNestedValue(a, String(sortKey));
        bValue = getNestedValue(b, String(sortKey));
      } else {
          // Jika tidak ada sortKey atau valueGetter, tidak bisa sort
          return 0;
      }

      const numericKeys = ["initial_price", "selling_price", "net_profit", "stock"];
      if (typeof aValue === 'string' && !isNaN(Number(aValue)) && typeof bValue === 'string' && !isNaN(Number(bValue))) {
        aValue = Number(aValue);
        bValue = Number(bValue);
      } else if (numericKeys.includes(String(sortKey))) { // Ini untuk sortKey biasa
          aValue = Number(aValue);
          bValue = Number(bValue);
      }


      if (aValue === bValue) return 0;

      if (typeof aValue === "string" && typeof bValue === "string") {
        if (newDirection === "asc") {
          return aValue.toLowerCase().localeCompare(bValue.toLowerCase());
        } else {
          return bValue.toLowerCase().localeCompare(aValue.toLowerCase());
        }
      }

      if (typeof aValue === "number" && typeof bValue === "number") {
        if (newDirection === "asc") {
          return aValue - bValue;
        } else {
          return bValue - aValue;
        }
      }

      // Fallback
      if (newDirection === "asc") {
        return aValue > bValue ? 1 : -1;
      } else {
        return aValue < bValue ? 1 : -1;
      }
    });

    onSort(sorted);
  };

  return (
    <button
      onClick={handleSort}
      className="px-2 py-1 rounded bg-transparent text-sm inline-flex items-center gap-1 cursor-pointer"
      aria-label={`Sort by ${label || String(sortKey)} in ${direction ?? "none"} order`}
      type="button"
    >
      <ArrowUpDown size={14} />
    </button>
  );
}