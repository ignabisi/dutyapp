import { IncomingMessage, ServerResponse } from 'http';
import { DutyService } from '../services/DutyService';

/**
 * Handle GET requests to retrieve all duties.
 * @param dutyService - The service handling duty operations.
 * @param res - The server response object to send back the results.
 * @returns {void} Responds with a JSON array of duties or an error message.
 * 
 * - URL: `/duties`
 * - Method: GET
 * - Response:
 *    - 200: Success, returns the list of duties in JSON format.
 *    - 500: Internal Server Error, returns an error message in JSON format.
 */
const getDuties = async (dutyService: DutyService, res: ServerResponse) => {
  try {
    const duties = await dutyService.getAll();
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(duties || []));
  } catch (error) {
    console.error('Error fetching duties:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
};

/**
 * Handle POST requests to create a new duty.
 * @param req - The incoming request containing the duty details in the body.
 * @param dutyService - The service handling duty creation.
 * @param res - The server response object to send back the results.
 * @returns {void} Responds with the created duty ID or an error message.
 * 
 * - URL: `/duties`
 * - Method: POST
 * - Body Parameters: 
 *    - title: string - The title of the duty to create.
 * - Response:
 *    - 201: Created, returns the new duty ID in JSON format.
 *    - 500: Bad Request, returns an error message in JSON format if invalid data is provided.
 */
const createDuty = async (req: IncomingMessage, dutyService: DutyService, res: ServerResponse) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', async () => {
    try {
      const { title } = JSON.parse(body);
      const newDutyId = await dutyService.create(title);
      res.writeHead(201, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ id: newDutyId }));
    } catch (error) {
      console.error('Error creating duty:', error);
      res.writeHead(500, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Bad Request' }));
    }
  });
};

/**
 * Handle PUT requests to update an existing duty by ID.
 * @param req - The incoming request containing updated duty data in the body.
 * @param dutyService - The service handling duty updates.
 * @param id - The ID of the duty to update.
 * @param res - The server response object to send back the results.
 * @returns {void} Responds with a success message or an error message.
 * 
 * - URL: `/duties/:id`
 * - Method: PUT
 * - Body Parameters:
 *    - title: string - The updated title of the duty.
 *    - completed: boolean - Whether the duty is completed.
 * - Response:
 *    - 200: Success, duty is updated.
 *    - 400: Bad Request, returns an error message if invalid data is provided.
 */
const updateDuty = async (req: IncomingMessage, dutyService: DutyService, id: number, res: ServerResponse) => {
  let body = '';
  req.on('data', chunk => {
    body += chunk.toString();
  });
  req.on('end', async () => {
    try {
      const { title, completed } = JSON.parse(body);
      await dutyService.update(id, title, completed);
      res.writeHead(200);
      res.end();
    } catch (error) {
      console.error('Error updating duty:', error);
      res.writeHead(400, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Bad Request' }));
    }
  });
};

/**
 * Handle DELETE requests to remove a duty by ID.
 * @param dutyService - The service handling duty deletion.
 * @param id - The ID of the duty to delete.
 * @param res - The server response object to send back the results.
 * @returns {void} Responds with a success message or an error message.
 * 
 * - URL: `/duties/:id`
 * - Method: DELETE
 * - Response:
 *    - 204: No Content, duty is successfully deleted.
 *    - 500: Internal Server Error, returns an error message if deletion fails.
 */
const deleteDuty = async (dutyService: DutyService, id: number, res: ServerResponse) => {
  try {
    await dutyService.delete(id);
    res.writeHead(204);
    res.end();
  } catch (error) {
    console.error('Error deleting duty:', error);
    res.writeHead(500, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Internal Server Error' }));
  }
};

/**
 * Main request handler for duties.
 * @param req - The incoming HTTP request.
 * @param res - The server response object to send back the results.
 * @param dbClient - The database client used by the DutyService.
 * @returns {void} Routes requests based on method and URL path, handling different CRUD operations for duties.
 */
export const handleDuties = async (req: IncomingMessage, res: ServerResponse, dbClient: any) => {
  const dutyService = new DutyService(dbClient); // Instantiate DutyService with the passed DB client
  const { method, url } = req;
  const parsedUrl = new URL(url || '', `http://${req.headers.host}`);
  const path = parsedUrl.pathname;
  const id = path.split('/')[2]; // Extract ID if present

  switch (method) {
    case 'GET':
      if (path === '/duties') {
        await getDuties(dutyService, res);
      } else if (path.startsWith('/duties/') && id) {
        const duty = await dutyService.getById(parseInt(id, 10));
        if (duty) {
          res.writeHead(200, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify(duty));
        } else {
          res.writeHead(404, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ error: 'Duty not found' }));
        }
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
      }
      break;
    case 'POST':
      if (path === '/duties') {
        await createDuty(req, dutyService, res);
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
      }
      break;
    case 'PUT':
      if (path.startsWith('/duties/') && id) {
        await updateDuty(req, dutyService, parseInt(id, 10), res);
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
      }
      break;
    case 'DELETE':
      if (path.startsWith('/duties/') && id) {
        await deleteDuty(dutyService, parseInt(id, 10), res);
      } else {
        res.writeHead(404, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ error: 'Not Found' }));
      }
      break;
    default:
      res.writeHead(405, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Method Not Allowed' }));
      break;
  }
};
