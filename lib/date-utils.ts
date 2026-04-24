import { format, parseISO } from 'date-fns';
import { toZonedTime, fromZonedTime } from 'date-fns-tz';

const TIMEZONE = 'Asia/Seoul';

// Get today's date in YYYY-MM-DD format for Seoul
export function getTodayDateString(): string {
  const now = new Date();
  const zonedDate = toZonedTime(now, TIMEZONE);
  return format(zonedDate, 'yyyy-MM-dd');
}

// Convert UTC Date to Seoul Date object
export function getSeoulDate(date: Date = new Date()): Date {
  return toZonedTime(date, TIMEZONE);
}

// Get ISO string strictly representing current time in Seoul
export function getSeoulISOString(): string {
  // Since ISO string is universally UTC, the best we can do is just use new Date().toISOString()
  // for created_at/updated_at. The timezone mostly matters for grouping tasks by day ('YYYY-MM-DD').
  return new Date().toISOString();
}
