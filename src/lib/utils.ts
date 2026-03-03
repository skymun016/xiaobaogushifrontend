import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const DAY_NAMES = ['周日', '周一', '周二', '周三', '周四', '周五', '周六'];

/**
 * 为日期字符串添加周几显示
 * "2026-02-25 09:30:00" → "2026-02-25 09:30:00 周三"
 * "2026-02-25" → "2026-02-25 周三"
 */
export function formatDateWithDay(dateStr: string): string {
  if (!dateStr) return dateStr;
  const date = new Date(dateStr.replace(/-/g, '/'));
  if (isNaN(date.getTime())) return dateStr;
  return `${dateStr} ${DAY_NAMES[date.getDay()]}`;
}
