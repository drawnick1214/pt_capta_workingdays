import { DateTime } from 'luxon';
import { adjustToWorkingTime, addWorkingDays, addWorkingHours } from '../utils/dateUtils';
import { nowInColombia, utcToColombia, colombiaToUTC } from '../utils/timezone';

export interface CalculateWorkingDateParams {
  days: number;
  hours: number;
  startDateUTC?: string;
}

export interface CalculateWorkingDateResult {
  resultDateUTC: string;
}

export function calculateWorkingDate(params: CalculateWorkingDateParams): CalculateWorkingDateResult {
  const { days, hours, startDateUTC } = params;
  
  // Determine start date in Colombia timezone
  let startDate: DateTime;
  
  if (startDateUTC) {
    startDate = utcToColombia(startDateUTC);
  } else {
    startDate = nowInColombia();
  }
  
  // Adjust to working time (backwards if needed)
  let resultDate = adjustToWorkingTime(startDate);
  
  // Add days first
  if (days > 0) {
    resultDate = addWorkingDays(resultDate, days);
  }
  
  // Then add hours
  if (hours > 0) {
    resultDate = addWorkingHours(resultDate, hours);
  }
  
  // Convert to UTC
  const resultDateUTC = colombiaToUTC(resultDate);
  
  return { resultDateUTC };
}