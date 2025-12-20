/**
 * API Server - Reads Quina results from PostgreSQL database
 * 
 * SETUP:
 * 1. Railway will automatically provide DATABASE_URL environment variable
 * 2. Or set DATABASE_URL manually for local development
 * 3. Make sure your PostgreSQL table matches the expected structure
 */

const express = require('express');
const { Pool } = require('pg');
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS (so the static HTML can fetch from this API)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// ============================================================
// PostgreSQL Database Connection
// ============================================================
const pool = new Pool({
    connectionString: process.env.DATABASE_URL,
    ssl: process.env.DATABASE_URL?.includes('railway') ? { rejectUnauthorized: false } : false
});

// Test database connection
pool.on('connect', () => {
    console.log('Connected to PostgreSQL database');
});

pool.on('error', (err) => {
    console.error('Unexpected error on idle client', err);
});

// Fetch results from database
async function getResultsFromDatabase() {
    try {
        // Query to get latest and previous results
        // Adjust column names to match your table structure
        const query = `
            SELECT 
                draw_number AS "drawNumber",
                date,
                numbers
            FROM quina_results 
            ORDER BY draw_number DESC 
            LIMIT 11
        `;
        
        const result = await pool.query(query);
        
        if (result.rows.length === 0) {
            console.log('No results found in database');
            return [];
        }
        
        const results = result.rows.map(row => ({
            drawNumber: (row.drawNumber || row.draw_number || row.draw || 'N/A').toString(),
            date: row.date || row.draw_date || 'Unknown',
            numbers: parseNumbers(row.numbers || row.winning_numbers)
        }));
        
        return results;
    } catch (error) {
        // Try alternative column names if first query fails
        console.log('Trying alternative column names...', error.message);
        
        try {
            const altQuery = `
                SELECT *
                FROM quina_results 
                ORDER BY drawNumber DESC 
                LIMIT 11
            `;
            
            const result = await pool.query(altQuery);
            
            const results = result.rows.map(row => ({
                drawNumber: (row.drawNumber || row.draw_number || row.draw || row.id || 'N/A').toString(),
                date: row.date || row.draw_date || row.created_at || 'Unknown',
                numbers: parseNumbers(row.numbers || row.winning_numbers || row.nums)
            }));
            
            return results;
        } catch (altError) {
            throw new Error(`Database query failed: ${altError.message}. Make sure your table has columns: draw_number/drawNumber, date, numbers`);
        }
    }
}

// Helper function to parse numbers (handles JSON string, array, or comma-separated)
function parseNumbers(numData) {
    if (!numData) return [];
    
    if (Array.isArray(numData)) {
        return numData;
    }
    
    if (typeof numData === 'string') {
        // Try JSON parse first
        try {
            const parsed = JSON.parse(numData);
            if (Array.isArray(parsed)) return parsed;
        } catch (e) {
            // Not JSON, try comma-separated
            const nums = numData.split(',').map(n => parseInt(n.trim())).filter(n => !isNaN(n));
            if (nums.length > 0) return nums;
        }
    }
    
    return [];
}

// ============================================================
// API ENDPOINT - Returns JSON for the static HTML page
// ============================================================
app.get('/api/results', async (req, res) => {
    try {
        const results = await getResultsFromDatabase();
        
        res.json({
            latest: results[0] || null,
            previous: results.slice(1),
            lastUpdated: new Date().toISOString()
        });
    } catch (error) {
        console.error('Database error:', error);
        res.status(500).json({ 
            error: 'Failed to fetch results', 
            message: error.message 
        });
    }
});

// Health check endpoint
app.get('/health', async (req, res) => {
    try {
        await pool.query('SELECT 1');
        res.json({ status: 'ok', database: 'connected' });
    } catch (error) {
        res.status(500).json({ status: 'error', database: 'disconnected', error: error.message });
    }
});

// Serve static HTML file
app.use(express.static('.'));

app.listen(PORT, () => {
    console.log(`API Server running at http://localhost:${PORT}`);
    console.log(`API endpoint: http://localhost:${PORT}/api/results`);
    console.log(`Health check: http://localhost:${PORT}/health`);
    
    if (!process.env.DATABASE_URL) {
        console.warn('⚠️  WARNING: DATABASE_URL not set. Database connection may fail.');
    }
});

