import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function getNestedValue(obj: any, path: string) {
  return path.split('.').reduce((o, k) => (o ? o[k] : undefined), obj);
}