import { z } from 'zod';

// payment_locations.opening_hours_schedule, as citrineos-payment reads it
// (services/marketplace/opening_hours.py, normalize_schedule): per weekday a
// list of open intervals, "HH:MM" local to the site, "24:00" for midnight.
// A day that is missing or empty is closed; no schedule at all (null) means
// the host hasn't said and nobody is refused. The backend treats a document
// it can't read as "no schedule", so a typo here silently stops enforcing the
// host's hours -- which is why this is validated instead of stored as typed.
export const WEEKDAYS = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'] as const;

const MINUTES_IN_DAY = 24 * 60;

export function minutesOfDay(value: unknown): number | null {
  if (typeof value !== 'string') return null;
  const match = /^(\d{1,2}):(\d{2})$/.exec(value.trim());
  if (!match) return null;
  const hours = Number(match[1]);
  const mins = Number(match[2]);
  const total = hours * 60 + mins;
  if (mins > 59 || total > MINUTES_IN_DAY) return null;
  return total;
}

// Why a document isn't a schedule the backend can read, or null if it is.
// One message for the whole field: the form shows errors per field, and the
// host-facing question is "is this schedule right", not which array index.
export function scheduleProblem(value: unknown): string | null {
  if (typeof value === 'string') return 'Not valid JSON.';
  if (typeof value !== 'object' || value === null || Array.isArray(value)) {
    return 'A schedule is an object keyed by weekday.';
  }
  const days = Object.entries(value as Record<string, unknown>);
  if (days.length === 0) {
    return 'An empty schedule is not "closed every day"; leave the field empty for no schedule.';
  }
  for (const [day, intervals] of days) {
    if (!(WEEKDAYS as readonly string[]).includes(day)) return `Days are ${WEEKDAYS.join(', ')}.`;
    if (intervals == null) continue;
    if (!Array.isArray(intervals)) return `${day}: a list of intervals.`;
    for (const interval of intervals) {
      const s = minutesOfDay((interval as { start?: unknown } | null)?.start);
      const e = minutesOfDay((interval as { end?: unknown } | null)?.end);
      if (s == null || e == null || s >= e) {
        return `${day}: each interval is {"start": "HH:MM", "end": "HH:MM"} with start before end; "24:00" ends at midnight.`;
      }
    }
  }
  return null;
}

// A string is text that didn't parse as JSON (see JsonField in resource-form).
export const openingHoursScheduleSchema = z.unknown().superRefine((value, ctx) => {
  if (value == null) return;
  const problem = scheduleProblem(value);
  if (problem) ctx.addIssue({ code: 'custom', message: problem });
});

export function isTimeZone(name: string): boolean {
  try {
    new Intl.DateTimeFormat('en', { timeZone: name });
    return true;
  } catch {
    return false;
  }
}
