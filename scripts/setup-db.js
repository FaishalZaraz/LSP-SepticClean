import { initializeDatabase, createUser } from '../src/lib/database.js';

console.log('Setting up database...');

// Initialize database tables
initializeDatabase();

// Create admin user
try {
  createUser('admin@septictank.com', 'admin123', 'Admin', 'admin');
  console.log('Admin user created successfully');
} catch (error) {
  console.log('Admin user already exists or error:', error.message);
}

console.log('Database setup completed!');