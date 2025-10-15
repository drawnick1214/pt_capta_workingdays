import { DateTime } from 'luxon';
import { ENV } from '../config/env';

export function nowInColombia(): DateTime {
  return DateTime.now().setZone(ENV.TIMEZONE);
}

export function utcToColombia(utcDate: string): DateTime {
  const parsed = DateTime.fromISO(utcDate, { zone: 'utc' });
  if (!parsed.isValid) {
    throw new Error('Invalid UTC date format');
  }
  return parsed.setZone(ENV.TIMEZONE);
}

export function colombiaToUTC(colombiaDate: DateTime): string {
  const utcDate = colombiaDate.toUTC();
  const isoString = utcDate.toISO({ suppressMilliseconds: false });
  
  if (!isoString) {
    throw new Error('Failed to format date to UTC');
  }
  
  return isoString;
}