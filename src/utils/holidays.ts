import axios from 'axios';
import { ENV } from '../config/env';

let colombianHolidays: Set<string> = new Set();

export async function loadHolidays(): Promise<void> {
  try {
    const response = await axios.get<string[]>(ENV.HOLIDAYS_URL);
    const holidays: string[] = response.data;
    colombianHolidays = new Set(holidays.map(d => d.substring(0, 10)));
    console.log(`✓ Loaded ${colombianHolidays.size} Colombian holidays`);
  } catch (error) {
    console.error('Error loading holidays:', error);
    throw new Error('Failed to load holidays data');
  }
}

export function isHoliday(dateStr: string): boolean {
  return colombianHolidays.has(dateStr);
}

export function getHolidays(): Set<string> {
  return colombianHolidays;
}