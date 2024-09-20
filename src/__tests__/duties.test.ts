import { createServer } from '../server'; 
import testPool from '../db_test';
import request from 'supertest';

describe('handleDuties', () => {
  let server: any;

  beforeAll(async () => {
    server = await createServer(testPool, 3001); // Use testPool instead of testClient
  });
  
  afterAll(async () => {
    if (server && server.close) {
      await new Promise<void>((resolve, reject) => {
        server.close((err: any) => {
          if (err) return reject(err);
          resolve();
        });
      });
    }
    await testPool.end(); 
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  test('GET /duties returns all duties with status 200', async () => {
    const response = await request(server).get('/duties');
    
    expect(response.status).toBe(200);
    expect(response.body).toEqual(expect.any(Array)); // Assuming the response should be an array
  });

  test('POST /duties creates a new duty with status 201', async () => {
    const response = await request(server)
      .post('/duties')
      .send({ title: 'New Task' }); 
    
    expect(response.status).toBe(201);
  });

  test('POST /duties creates a new duty with status 500', async () => {
    const response = await request(server)
      .post('/duties')
      .send({ }); 
    
    expect(response.status).toBe(500);
  });

  test('POST, GET by ID, PUT, DELETE duties in one test', async () => {
    // 1. Create a new duty (POST)
    const createResponse = await request(server)
      .post('/duties')
      .send({ title: 'Test Duty' });
    
    expect(createResponse.status).toBe(201);

    const newDutyId = createResponse.body.id;
    
    // 2. Fetch the duty by ID (GET by ID)
    const getResponse = await request(server)
      .get(`/duties/${newDutyId}`);
    
    expect(getResponse.status).toBe(200);
    expect(getResponse.body).toMatchObject({
      id: newDutyId,
      title: 'Test Duty',
      completed: false,
    });

    // 3. Update the duty (PUT)
    const updateResponse = await request(server)
      .put(`/duties/${newDutyId}`)
      .send({ title: 'Updated Test Duty' });
    
    expect(updateResponse.status).toBe(200);

    // Verify the update
    const verifyUpdateResponse = await request(server)
      .get(`/duties/${newDutyId}`);
    
    expect(verifyUpdateResponse.status).toBe(200);
    expect(verifyUpdateResponse.body).toMatchObject({
      id: newDutyId,
      title: 'Updated Test Duty',
      completed: false,
    });

    // 4. Delete the duty (DELETE)
    const deleteResponse = await request(server)
      .delete(`/duties/${newDutyId}`);
    
    expect(deleteResponse.status).toBe(204);

    // Verify the deletion by attempting to get the duty
    const verifyDeleteResponse = await request(server)
      .get(`/duties/${newDutyId}`);
    
    expect(verifyDeleteResponse.status).toBe(404);
  });
    
});
