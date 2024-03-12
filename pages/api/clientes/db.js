import { Pool } from 'pg';

const pool = new Pool({
    user: 'postgres',
    host: 'localhost',
    database: 'rota_crm_db',
    password: 'postgres',
    port: 5432,
    max: 20,
    idleTimeoutMillis: 30000, 
    connectionTimeoutMillis: 2000,
});

export default pool;