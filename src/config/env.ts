import { WorkingHours } from '../types/types';

export const ENV = {
  PORT: process.env.PORT || 3000,
  TIMEZONE: 'America/Bogota',
  HOLIDAYS_URL: 'https://content.capta.co/Recruitment/WorkingDays.json'
} as const;

export const WORKING_HOURS: WorkingHours = {
  start: 8,
  lunchStart: 12,
  lunchEnd: 13,
  end: 17
} as const;