import express, { Application } from 'express';
import { ENV } from './config/env';
import { loadHolidays } from './utils/holidays';
import { calculateController } from './controllers/calculateController';
import { getHolidays } from './utils/holidays';

const app: Application = express();

// Middleware
app.use(express.json());

app.get('/debug/holidays', (_req, res) => {
  const holidays = Array.from(getHolidays()).sort();
  res.json({
    count: holidays.length,
    holidays: holidays
  });
});

// Ruta principal (root)
app.get('/', (_req, res) => {
  const holidays = Array.from(getHolidays());
  res.type('text/plain').send(
    `Loading Colombian holidays...\n` +
    `✓ Loaded ${holidays.length} Colombian holidays\n` +
    `✓ Server running on port ${ENV.PORT}\n` +
    `✓ Timezone: ${ENV.TIMEZONE}\n` +
    `✓ Ready to accept requests`
  );
});

// Routes - handle GET requests on any path
app.get(/.*/, calculateController);

// Start server
async function startServer(): Promise<void> {
  try {
    // Load Colombian holidays before starting
    console.log('Loading Colombian holidays...');
    await loadHolidays();
    
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