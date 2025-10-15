import express, { Application, Request, Response } from 'express';
import { ENV } from './config/env';
import { loadHolidays, getHolidays } from './utils/holidays';
import { calculateController } from './controllers/calculateController';

const app: Application = express();

// Middleware
app.use(express.json());

// Store server info
const serverInfo = {
  status: 'initializing',
  holidaysCount: 0,
  port: ENV.PORT,
  timezone: ENV.TIMEZONE,
  startTime: new Date().toISOString()
};

// Debug endpoint - Ver festivos cargados
app.get('/debug/holidays', (_req: Request, res: Response) => {
  const holidays = Array.from(getHolidays()).sort();
  res.json({
    count: holidays.length,
    holidays: holidays
  });
});

// Main endpoint - handles root with info or calculation
app.get(/.*/, (req: Request, res: Response) => {
  // If no query parameters, show server info
  if (Object.keys(req.query).length === 0) {
    return res.json({
      message: 'Working Days API - Colombia',
      status: serverInfo.status,
      info: {
        holidaysLoaded: serverInfo.holidaysCount,
        port: serverInfo.port,
        timezone: serverInfo.timezone,
        startTime: serverInfo.startTime,
        uptime: process.uptime() + ' seconds'
      },
      usage: {
        endpoint: 'GET /',
        parameters: {
          days: 'number (optional) - Business days to add',
          hours: 'number (optional) - Business hours to add',
          date: 'string (optional) - Start date in UTC ISO 8601 format with Z suffix'
        },
        examples: [
          '/?hours=1',
          '/?days=1&hours=4',
          '/?date=2025-10-17T22:00:00.000Z&hours=1'
        ]
      },
      docs: 'https://github.com/drawnick1214/pt_capta_workingdays'
    });
  }

  // If has query parameters, calculate working date
  return calculateController(req, res);
});

// Start server
async function startServer(): Promise<void> {
  try {
    // Load Colombian holidays before starting
    console.log('Loading Colombian holidays...');
    await loadHolidays();
    
    serverInfo.holidaysCount = getHolidays().size;
    serverInfo.status = 'ready';
    
    console.log(`✓ Loaded ${serverInfo.holidaysCount} Colombian holidays`);
    
    // Start Express server
    app.listen(ENV.PORT, () => {
      console.log(`✓ Server running on port ${ENV.PORT}`);
      console.log(`✓ Timezone: ${ENV.TIMEZONE}`);
      console.log(`✓ Ready to accept requests`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

startServer();