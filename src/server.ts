import http, { IncomingMessage, ServerResponse } from 'http';
import { handleDuties } from './routes/duties';
import { requestLogger } from './middleware'; // Tu middleware
import { getClient } from './db';

/**
 * Check and create the duties table if it does not exist.
 */
async function checkAndCreateTable(dbClient: any) {
  const createTableQuery = `
    CREATE TABLE IF NOT EXISTS duties (
      id SERIAL PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      completed BOOLEAN NOT NULL DEFAULT false
    );
  `;

  try {
    await dbClient.query(createTableQuery);
    console.log('Duties table checked/created successfully.');
  } catch (error) {
    console.error('Error creating duties table:', error);
  }
}

/**
 * Main request handler to route requests based on URL.
 */
const requestHandler = async (req: IncomingMessage, res: ServerResponse, dbClient: any) => {
  const { url } = req;

  if (url?.startsWith('/duties')) {
    await handleDuties(req, res, dbClient);
  } else {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Not Found' }));
  }
};

/**
 * Create and start the server with the provided database client.
 */
export const createServer = (dbClient: any, port: number = 3000) => {
  return new Promise((resolve, reject) => {
    const server = http.createServer(requestLogger(async (req, res) => {
      await requestHandler(req, res, dbClient); // Paso el requestHandler dentro del requestLogger
    }));

    server.listen(port, async () => {
      try {
        console.log(`Server is running on http://localhost:${port}`);
        await checkAndCreateTable(dbClient);
        resolve(server);
      } catch (error) {
        reject(error);
      }
    });
  });
};


if (process.env.NODE_ENV !== 'test') {
  const client = getClient()
  createServer(client);
}

