import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatRelativeTime(date: Date) {
  const now = new Date();
  const diff = now.getTime() - new Date(date).getTime();
  const years = Math.floor(diff / (1000 * 60 * 60 * 24 * 365));
  const months = Math.floor(diff / (1000 * 60 * 60 * 24 * 30));
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor(diff / (1000 * 60 * 60));
  const minutes = Math.floor(diff / (1000 * 60));
  const seconds = Math.floor(diff / 1000);

  if (years == 1) return `${years} year ago`;
  if (years > 1) return `${years} years ago`;
  if (months == 1) return `${months} month ago`;
  if (months > 1) return `${months} months ago`;
  if (days == 1) return `${days} day ago`;
  if (days > 1) return `${days} days ago`;
  if (hours == 1) return `${hours} hour ago`;
  if (hours > 1) return `${hours} hours ago`;
  if (minutes == 1) return `${minutes} minute ago`;
  if (minutes > 1) return `${minutes} minutes ago`;
  if (seconds > 15) return `${seconds} seconds ago`;
  return "just now";
}
