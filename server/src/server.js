import { assertConfig, config } from './config/env.js';
import { db } from './config/database.js';
import { app } from './app.js';

assertConfig();

const server = app.listen(config.port, () => {
  console.log(`CampusPulse API running on http://localhost:${config.port}`);
});

function shutdown() {
  server.close(() => {
    db.close();
    process.exit(0);
  });
}

process.on('SIGINT', shutdown);
process.on('SIGTERM', shutdown);
