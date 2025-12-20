/**
 * Helper script to create the quina_results table in PostgreSQL
 * 
 * Usage:
 *   Set DATABASE_URL environment variable, then run:
 *   node create-table.js
 * 
 * Or use Railway's SQL editor to run create-table.sql
 */

const { Pool } = require('pg');

if (!process.env.DATABASE_URL) {
    console.error('❌ Error: DATABASE_URL environment variable not set');
    console.log('\nSet it like this:');
    console.log('  export DATABASE_URL="postgresql://user:password@host:port/database"');
    console.log('\nOr on Railway, DATABASE_URL is automatically provided');
    process.exit(1);
}

const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('railway') ? { rejectUnauthorized: false } : false
});

async function createTable() {
    try {
        console.log('Creating quina_results table...\n');
        
        // Create table
        await pool.query(`
            CREATE TABLE IF NOT EXISTS quina_results (
                id SERIAL PRIMARY KEY,
                draw_number INTEGER UNIQUE NOT NULL,
                date TEXT NOT NULL,
                numbers TEXT NOT NULL,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            )
        `);
        
        console.log('✅ Table "quina_results" created successfully!');
        
        // Create index
        await pool.query(`
            CREATE INDEX IF NOT EXISTS idx_draw_number ON quina_results(draw_number DESC)
        `);
        
        console.log('✅ Index created');
        
        // Show table structure
        const result = await pool.query(`
            SELECT column_name, data_type, is_nullable
            FROM information_schema.columns 
            WHERE table_name = 'quina_results'
            ORDER BY ordinal_position
        `);
        
        console.log('\nTable structure:');
        result.rows.forEach(col => {
            console.log(`  - ${col.column_name}: ${col.data_type} ${col.is_nullable === 'NO' ? '(required)' : ''}`);
        });
        
        // Insert sample data
        const sampleData = [
            { draw_number: 6907, date: '19th December 2025', numbers: JSON.stringify([23, 41, 46, 58, 66]) },
            { draw_number: 6906, date: '18th December 2025', numbers: JSON.stringify([5, 32, 51, 55, 56]) }
        ];
        
        for (const data of sampleData) {
            await pool.query(
                'INSERT INTO quina_results (draw_number, date, numbers) VALUES ($1, $2, $3) ON CONFLICT (draw_number) DO NOTHING',
                [data.draw_number, data.date, data.numbers]
            );
        }
        
        console.log('\n✅ Sample data inserted (if not already exists)');
        console.log('\nYour scraper program should insert data like this:');
        console.log('INSERT INTO quina_results (draw_number, date, numbers) VALUES (6908, \'20th December 2025\', \'[1, 2, 3, 4, 5]\');');
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        await pool.end();
    }
}

createTable();

