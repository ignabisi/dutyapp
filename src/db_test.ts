import { Pool } from 'pg';

const testPool = new Pool({
    host: 'localhost',
    database: 'test_dutydb',
    port: 5432,
    user: 'secret',
    password: 'secret',
});

export default testPool;