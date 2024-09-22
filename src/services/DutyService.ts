import { Client } from 'pg'; // Optional: if you want type checking for the client
import { Duty } from '../models/Duty';

export class DutyService {
  private client: Client;

  constructor(client: Client) {
    this.client = client; 
  }

  async getAll(): Promise<Duty[]> {
    try {
      const result = await this.client.query('SELECT * FROM duties');
      return result.rows;
    } catch (error) {
      console.error('Error fetching all duties:', error);
      throw new Error('Database error');
    }
  }

  async getById(id: number): Promise<Duty | null> {
    try {
      const result = await this.client.query('SELECT * FROM duties WHERE id = $1', [id]);
      return result.rows.length > 0 ? result.rows[0] : null;
    } catch (error) {
      console.error(`Error fetching duty with id ${id}:`, error);
      throw new Error('Database error');
    }
  }

  async create(title: string): Promise<void> {
    try {
      console.log(title)
      const result = await this.client.query('INSERT INTO duties (title, completed) VALUES ($1, $2) RETURNING id', [title, false]);
      return result.rows[0].id
    } catch (error) {
      console.error('Error creating duty:', error);
      throw new Error('Database error');
    }
  }

  async update(id: number, title: string, completed: boolean): Promise<void> {
    try {
      await this.client.query('UPDATE duties SET title = $1, completed = $2 WHERE id = $3', [title, completed, id]);
    } catch (error) {
      console.error(`Error updating duty with id ${id}:`, error);
      throw new Error('Database error');
    }
  }
  
  async delete(id: number): Promise<void> {
    try {
      await this.client.query('DELETE FROM duties WHERE id = $1', [id]);
    } catch (error) {
      console.error(`Error deleting duty with id ${id}:`, error);
      throw new Error('Database error');
    }
  }
}
