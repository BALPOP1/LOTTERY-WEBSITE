/**
 * Helper script to create the quina_results table
 * Run this once: node create-table.js
 */

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('./quina.db');

console.log('Creating quina_results table...\n');

db.serialize(() => {
    // Create table
    db.run(`
        CREATE TABLE IF NOT EXISTS quina_results (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            drawNumber INTEGER UNIQUE NOT NULL,
            date TEXT NOT NULL,
            numbers TEXT NOT NULL,
            createdAt DATETIME DEFAULT CURRENT_TIMESTAMP
        )
    `, (err) => {
        if (err) {
            console.error('Error creating table:', err.message);
            db.close();
            return;
        }
        console.log('✅ Table "quina_results" created successfully!');
        console.log('\nTable structure:');
        console.log('  - id: INTEGER (primary key)');
        console.log('  - drawNumber: INTEGER (unique, required)');
        console.log('  - date: TEXT (required)');
        console.log('  - numbers: TEXT (JSON array, e.g. "[23, 41, 46, 58, 66]")');
        console.log('  - createdAt: DATETIME (auto)');
        
        // Insert sample data for testing
        const sampleData = [
            { drawNumber: 6907, date: '19th December 2025', numbers: JSON.stringify([23, 41, 46, 58, 66]) },
            { drawNumber: 6906, date: '18th December 2025', numbers: JSON.stringify([5, 32, 51, 55, 56]) }
        ];
        
        const stmt = db.prepare('INSERT OR IGNORE INTO quina_results (drawNumber, date, numbers) VALUES (?, ?, ?)');
        sampleData.forEach(data => {
            stmt.run(data.drawNumber, data.date, data.numbers);
        });
        stmt.finalize();
        
        console.log('\n✅ Sample data inserted (if table was empty)');
        console.log('\nYour scraper program should insert data like this:');
        console.log('INSERT INTO quina_results (drawNumber, date, numbers) VALUES (6908, "20th December 2025", "[1, 2, 3, 4, 5]");');
        
        db.close();
    });
});

