-- PostgreSQL table creation script for Quina results
-- Run this in your PostgreSQL database (Railway will provide a SQL editor)

CREATE TABLE IF NOT EXISTS quina_results (
    id SERIAL PRIMARY KEY,
    draw_number INTEGER UNIQUE NOT NULL,
    date TEXT NOT NULL,
    numbers TEXT NOT NULL,  -- JSON array: "[23, 41, 46, 58, 66]"
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_draw_number ON quina_results(draw_number DESC);

-- Sample data (optional - remove after testing)
INSERT INTO quina_results (draw_number, date, numbers) 
VALUES 
    (6907, '19th December 2025', '[23, 41, 46, 58, 66]'),
    (6906, '18th December 2025', '[5, 32, 51, 55, 56]')
ON CONFLICT (draw_number) DO NOTHING;

-- Verify table structure
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'quina_results';

