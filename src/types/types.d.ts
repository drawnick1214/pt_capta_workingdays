export interface QueryParams {
  days?: string;
  hours?: string;
  date?: string;
}

export interface SuccessResponse {
  date: string;
}

export interface ErrorResponse {
  error: string;
  message: string;
}

export interface WorkingHours {
  start: number;
  lunchStart: number;
  lunchEnd: number;
  end: number;
}

export interface CalculateRequest {
  days: number;
  hours: number;
  startDate: Date;
}