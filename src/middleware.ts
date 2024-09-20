import { IncomingMessage, ServerResponse } from 'http';
import { v4 as uuidv4 } from 'uuid';

/**
 * Middleware to assign a unique ID to each request and log the start and end.
 * It also captures exceptions and prevents the API from breaking.
 */
export const requestLogger = (handler: (req: IncomingMessage, res: ServerResponse) => Promise<void>) => {
  return async (req: IncomingMessage, res: ServerResponse) => {
    const requestId = uuidv4();
    console.log(`[${requestId}] Starting request: ${req.method} ${req.url}`);

    try {
      await handler(req, res);
    } catch (error) {
      console.error(`[${requestId}] Ocurrió un error: ${error}`);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Internal Server Error' }));
    } finally {
      console.log(`[${requestId}] Finishing request: ${req.method} ${req.url}`);
    }
  };
};
