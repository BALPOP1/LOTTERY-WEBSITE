/**
 * Simple API Server - Reads Quina results from your database
 * 
 * SETUP:
 * 1. Uncomment the database section that matches yours (SQLite, MySQL, PostgreSQL, or MongoDB)
 * 2. Update the connection settings
 * 3. Modify the query to match your table/collection structure
 * 4. Run: node api-server.js
 */

const express = require('express');
const app = express();
const PORT = process.env.PORT || 3000;

// Enable CORS (so the static HTML can fetch from this API)
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept');
    next();
});

// ============================================================
// SQLite Database Connection
// ============================================================
const sqlite3 = require('sqlite3').verbose();

// Path to your SQLite database file
// On Railway, use a Volume mount path like '/data/quina.db' for persistence
// Or use './quina.db' for local development
const DB_PATH = process.env.DB_PATH || './quina.db';

const db = new sqlite3.Database(DB_PATH, (err) => {
    if (err) {
        console.error('Failed to connect to database:', err.message);
    } else {
        console.log('Connected to SQLite database:', DB_PATH);
    }
});

// Fetch results from database
async function getResultsFromDatabase() {
    return new Promise((resolve, reject) => {
        // First check if table exists
        db.get(
            `SELECT name FROM sqlite_master WHERE type='table' AND name='quina_results'`,
            (err, table) => {
                if (err) {
                    reject(err);
                    return;
                }
                
                if (!table) {
                    console.warn('Table "quina_results" does not exist yet. Waiting for data...');
                    resolve([]); // Return empty array if table doesn't exist
                    return;
                }
                
                // Table exists, fetch data
                // Adjust column names to match your table structure
                // Common variations: drawNumber, draw_number, draw, number, etc.
                db.all(
                    `SELECT * FROM quina_results ORDER BY drawNumber DESC LIMIT 11`,
                    (err, rows) => {
                        if (err) {
                            // Try alternative column names
                            console.log('Trying alternative column names...');
                            db.all(
                                `SELECT * FROM quina_results ORDER BY draw_number DESC LIMIT 11`,
                                (err2, rows2) => {
                                    if (err2) {
                                        reject(new Error(`Database query failed. Make sure your table has columns: drawNumber/draw_number, date, numbers. Error: ${err2.message}`));
                                    } else {
                                        const results = rows2.map(row => ({
                                            drawNumber: (row.draw_number || row.drawNumber || row.draw || row.id || 'N/A').toString(),
                                            date: row.date || row.draw_date || row.created_at || 'Unknown',
                                            numbers: parseNumbers(row.numbers || row.winning_numbers || row.nums)
                                        }));
                                        resolve(results);
                                    }
                                }
                            );
                        } else {
                            if (rows.length === 0) {
                                console.log('Table exists but no data found.');
                                resolve([]);
                                return;
                            }
                            
                            const results = rows.map(row => ({
                                drawNumber: (row.drawNumber || row.draw_number || row.draw || row.id || 'N/A').toString(),
                                date: row.date || row.draw_date || row.created_at || 'Unknown',
                                numbers: parseNumbers(row.numbers || row.winning_numbers || row.nums)
                            }));
                            resolve(results);
                        }
                    }
                );
            }
        );
    });
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
        res.status(500).json({ error: 'Failed to fetch results', message: error.message });
    }
});

// Serve static HTML file (optional - you can host HTML separately)
app.use(express.static('.'));

app.listen(PORT, () => {
    console.log(`API Server running at http://localhost:${PORT}`);
    console.log(`API endpoint: http://localhost:${PORT}/api/results`);
});
