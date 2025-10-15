import { DateTime } from 'luxon';
import { WORKING_HOURS } from '../config/env';
import { isHoliday } from './holidays';

export function isWorkingDay(date: DateTime): boolean {
  const weekday = date.weekday;
  if (weekday === 6 || weekday === 7) return false;
  
  const dateStr = date.toISODate();
  return dateStr ? !isHoliday(dateStr) : false;
}

export function isWithinWorkingHours(date: DateTime): boolean {
  const hour = date.hour;
  const minute = date.minute;
  
  if (hour < WORKING_HOURS.start || hour >= WORKING_HOURS.end) return false;
  if (hour === WORKING_HOURS.lunchStart && minute >= 0) return false;
  if (hour === WORKING_HOURS.lunchEnd - 1 && minute > 0) return false;
  
  return true;
}

export function adjustToWorkingTime(date: DateTime): DateTime {
  let adjusted = date;
  
  // If weekend or holiday, move back to previous working day at 5 PM
  while (!isWorkingDay(adjusted)) {
    adjusted = adjusted.minus({ days: 1 }).set({ 
      hour: WORKING_HOURS.end, 
      minute: 0, 
      second: 0, 
      millisecond: 0 
    });
  }
  
  // Adjust time if outside working hours
  const hour = adjusted.hour;
  // const minute = adjusted.minute;
  
  if (hour >= WORKING_HOURS.end) {
    // After 5 PM, move to same day 5 PM
    adjusted = adjusted.set({ 
      hour: WORKING_HOURS.end, 
      minute: 0, 
      second: 0, 
      millisecond: 0 
    });
  } else if (hour < WORKING_HOURS.start) {
    // Before 8 AM, move to previous day 5 PM
    adjusted = adjusted.minus({ days: 1 }).set({ 
      hour: WORKING_HOURS.end, 
      minute: 0, 
      second: 0, 
      millisecond: 0 
    });
    while (!isWorkingDay(adjusted)) {
      adjusted = adjusted.minus({ days: 1 }).set({ 
        hour: WORKING_HOURS.end, 
        minute: 0, 
        second: 0, 
        millisecond: 0 
      });
    }
  } else if (hour >= WORKING_HOURS.lunchStart && hour < WORKING_HOURS.lunchEnd) {
    // During lunch, move back to 12 PM
    adjusted = adjusted.set({ 
      hour: WORKING_HOURS.lunchStart, 
      minute: 0, 
      second: 0, 
      millisecond: 0 
    });
  }
  
  return adjusted;
}

export function addWorkingDays(startDate: DateTime, daysToAdd: number): DateTime {
  let current = startDate;
  let daysAdded = 0;
  
  while (daysAdded < daysToAdd) {
    current = current.plus({ days: 1 });
    
    if (isWorkingDay(current)) {
      daysAdded++;
    }
  }
  
  return current;
}

export function addWorkingHours(startDate: DateTime, hoursToAdd: number): DateTime {
  let current = startDate;
  let remainingMinutes = hoursToAdd * 60;
  
  while (remainingMinutes > 0) {
    // Ensure we're on a working day
    while (!isWorkingDay(current)) {
      current = current.plus({ days: 1 }).set({ 
        hour: WORKING_HOURS.start, 
        minute: 0, 
        second: 0, 
        millisecond: 0 
      });
    }
    
    const hour = current.hour;
    const minute = current.minute;
    
    // Before working hours, jump to start
    if (hour < WORKING_HOURS.start) {
      current = current.set({ 
        hour: WORKING_HOURS.start, 
        minute: 0, 
        second: 0, 
        millisecond: 0 
      });
      continue;
    }
    
    // After working hours, jump to next day
    if (hour >= WORKING_HOURS.end) {
      current = current.plus({ days: 1 }).set({ 
        hour: WORKING_HOURS.start, 
        minute: 0, 
        second: 0, 
        millisecond: 0 
      });
      continue;
    }
    
    // Handle lunch time
    if (hour >= WORKING_HOURS.lunchStart && hour < WORKING_HOURS.lunchEnd) {
      current = current.set({ 
        hour: WORKING_HOURS.lunchEnd, 
        minute: 0, 
        second: 0, 
        millisecond: 0 
      });
      continue;
    }
    
    // Calculate minutes until lunch or end of day
    let minutesUntilBreak: number;
    
    if (hour < WORKING_HOURS.lunchStart) {
      minutesUntilBreak = (WORKING_HOURS.lunchStart - hour) * 60 - minute;
    } else {
      minutesUntilBreak = (WORKING_HOURS.end - hour) * 60 - minute;
    }
    
    if (remainingMinutes <= minutesUntilBreak) {
      current = current.plus({ minutes: remainingMinutes });
      remainingMinutes = 0;
    } else {
      current = current.plus({ minutes: minutesUntilBreak });
      remainingMinutes -= minutesUntilBreak;
      
      // Move past lunch or to next day
      if (hour < WORKING_HOURS.lunchStart) {
        current = current.set({ 
          hour: WORKING_HOURS.lunchEnd, 
          minute: 0, 
          second: 0, 
          millisecond: 0 
        });
      } else {
        current = current.plus({ days: 1 }).set({ 
          hour: WORKING_HOURS.start, 
          minute: 0, 
          second: 0, 
          millisecond: 0 
        });
      }
    }
  }
  
  return current;
}