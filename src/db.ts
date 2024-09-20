import { Client } from 'pg';

let client: Client | null = null;

export const getClient = () => {
  if (!client) {
    const client = new Client({
      user: process.env.DB_USER || 'secret',
      host: process.env.DB_HOST || 'db',
      database: process.env.DB_NAME || 'dutydb',
      password: process.env.DB_PASSWORD || 'secret',
      port: parseInt(process.env.DB_PORT || '5432', 10),
    });

    client.connect().catch(err => console.error('Connection error', err.stack));
    return client;
  }
};
