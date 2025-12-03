const { Client } = require('pg');

const client = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'postgres',
  database: 'lab-accounts'
});

async function fixDatabase() {
  try {
    await client.connect();
    console.log('Connected to database');
    
    // Add missing columns to projects table one by one
    const columns = [
      'ALTER TABLE projects ADD COLUMN IF NOT EXISTS customer_id uuid',
      'ALTER TABLE projects ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP',
      'ALTER TABLE projects ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP',
      'ALTER TABLE projects ADD COLUMN IF NOT EXISTS description TEXT',
      'ALTER TABLE projects ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT \'planning\'',
      'ALTER TABLE projects ADD COLUMN IF NOT EXISTS actual_cost NUMERIC(18,2) DEFAULT 0',
      'ALTER TABLE projects ADD COLUMN IF NOT EXISTS estimated_revenue NUMERIC(18,2) DEFAULT 0',
      'ALTER TABLE projects ADD COLUMN IF NOT EXISTS actual_revenue NUMERIC(18,2) DEFAULT 0',
      'ALTER TABLE projects ADD COLUMN IF NOT EXISTS project_manager VARCHAR(200)',
      'ALTER TABLE projects ADD COLUMN IF NOT EXISTS notes TEXT'
    ];
    
    for (const sql of columns) {
      try {
        await client.query(sql);
        console.log('Executed:', sql);
      } catch (err) {
        console.log('Skipped (already exists):', sql);
      }
    }
    
    // Rename code column to project_code if it exists
    await client.query(`
      DO $$
      BEGIN
        IF EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'projects' AND column_name = 'code') THEN
          ALTER TABLE projects RENAME COLUMN code TO project_code;
        END IF;
      END $$;
    `);
    
    // Add foreign key constraint
    await client.query(`
      ALTER TABLE projects 
      ADD CONSTRAINT IF NOT EXISTS fk_projects_customer 
      FOREIGN KEY (customer_id) REFERENCES customers(id);
    `);
    
    console.log('Database schema updated successfully');
    
  } catch (error) {
    console.error('Error updating database:', error.message);
  } finally {
    await client.end();
  }
}

fixDatabase();