import { Request, Response } from 'express';
import { QueryParams, SuccessResponse, ErrorResponse } from '../types/types';
import { calculateWorkingDate } from '../services/workingDaysService';

export const calculateController = async (
  req: Request<{}, {}, {}, QueryParams>,
  res: Response<SuccessResponse | ErrorResponse>
): Promise<void> => {
  try {
    const { days, hours, date } = req.query;
    
    // Validate that at least one parameter is provided
    if (!days && !hours) {
      res.status(400).json({
        error: 'InvalidParameters',
        message: 'At least one of "days" or "hours" parameters is required'
      });
      return;
    }
    
    // Parse and validate days parameter
    const daysToAdd = days ? parseInt(days, 10) : 0;
    if (days && (isNaN(daysToAdd) || daysToAdd < 0)) {
      res.status(400).json({
        error: 'InvalidParameters',
        message: 'Parameter "days" must be a non-negative integer'
      });
      return;
    }
    
    // Parse and validate hours parameter
    const hoursToAdd = hours ? parseInt(hours, 10) : 0;
    if (hours && (isNaN(hoursToAdd) || hoursToAdd < 0)) {
      res.status(400).json({
        error: 'InvalidParameters',
        message: 'Parameter "hours" must be a non-negative integer'
      });
      return;
    }
    
    // Validate date format if provided
    if (date) {
      if (!date.endsWith('Z') || !date.includes('T')) {
        res.status(400).json({
          error: 'InvalidParameters',
          message: 'Parameter "date" must be in ISO 8601 format with Z suffix (e.g., 2025-04-10T15:00:00.000Z)'
        });
        return;
      }
    }
    
    // Calculate working date
    const result = calculateWorkingDate({
      days: daysToAdd,
      hours: hoursToAdd,
      ...(date && { startDateUTC: date })
    });
    
    // Return success response
    res.status(200).json({
      date: result.resultDateUTC
    });
    
  } catch (error) {
    console.error('Error in calculateController:', error);
    
    // Handle specific error types
    if (error instanceof Error) {
      if (error.message.includes('Invalid')) {
        res.status(400).json({
          error: 'InvalidParameters',
          message: error.message
        });
        return;
      }
    }
    
    // Generic server error
    res.status(500).json({
      error: 'InternalServerError',
      message: 'An error occurred processing your request'
    });
  }
}