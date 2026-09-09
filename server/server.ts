import http from 'http';
import app from './src/app';
import { config } from './src/config/env';
import { initSocketServer } from './src/socket';

const PORT = config.port || 5000;

const httpServer = http.createServer(app);
initSocketServer(httpServer);

httpServer.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(`  DHR Backend Service is running`);
  console.log(`  Port: http://localhost:${PORT}`);
  console.log(`  Health check: http://localhost:${PORT}/api/health`);
  console.log(`  Realtime Socket.IO: Active`);
  console.log(`  Environment: ${config.nodeEnv}`);
  console.log(`=========================================`);
});
