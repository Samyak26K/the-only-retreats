import { format } from "date-fns";

export function formatDate(
  date: Date | string | number,
  pattern = "PPP",
): string {
  return format(new Date(date), pattern);
}
