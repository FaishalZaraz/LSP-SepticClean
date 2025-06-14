import Database from 'better-sqlite3';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

// Initialize database
const db = new Database('septic_service.db');

// JWT Secret
const JWT_SECRET = 'your-secret-key-change-in-production';

// Create tables
export const initializeDatabase = () => {
  // Users table
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      name TEXT NOT NULL,
      role TEXT DEFAULT 'customer',
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Services table
  db.exec(`
    CREATE TABLE IF NOT EXISTS services (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      description TEXT NOT NULL,
      price INTEGER NOT NULL,
      duration TEXT NOT NULL,
      image TEXT NOT NULL,
      features TEXT NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Orders table
  db.exec(`
    CREATE TABLE IF NOT EXISTS orders (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      service_id INTEGER NOT NULL,
      service_name TEXT NOT NULL,
      customer_name TEXT NOT NULL,
      customer_phone TEXT NOT NULL,
      customer_email TEXT,
      address TEXT NOT NULL,
      scheduled_date DATE NOT NULL,
      status TEXT DEFAULT 'requested',
      notes TEXT,
      total_price INTEGER NOT NULL,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (service_id) REFERENCES services (id)
    )
  `);

  console.log('Database tables created successfully');
};

// User operations
export const createUser = (email, password, name, role = 'customer') => {
  const hashedPassword = bcrypt.hashSync(password, 10);
  const stmt = db.prepare(`
    INSERT INTO users (email, password, name, role)
    VALUES (?, ?, ?, ?)
  `);
  return stmt.run(email, hashedPassword, name, role);
};

export const authenticateUser = (email, password) => {
  const stmt = db.prepare('SELECT * FROM users WHERE email = ?');
  const user = stmt.get(email);
  
  if (user && bcrypt.compareSync(password, user.password)) {
    const token = jwt.sign(
      { id: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '24h' }
    );
    return {
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role
      },
      token
    };
  }
  return null;
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (error) {
    return null;
  }
};

// Service operations
export const getAllServices = () => {
  const stmt = db.prepare('SELECT * FROM services ORDER BY created_at DESC');
  return stmt.all().map(service => ({
    ...service,
    features: JSON.parse(service.features)
  }));
};

export const getServiceById = (id) => {
  const stmt = db.prepare('SELECT * FROM services WHERE id = ?');
  const service = stmt.get(id);
  if (service) {
    service.features = JSON.parse(service.features);
  }
  return service;
};

export const createService = (serviceData) => {
  const stmt = db.prepare(`
    INSERT INTO services (name, description, price, duration, image, features)
    VALUES (?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(
    serviceData.name,
    serviceData.description,
    serviceData.price,
    serviceData.duration,
    serviceData.image,
    JSON.stringify(serviceData.features)
  );
};

export const updateService = (id, serviceData) => {
  const stmt = db.prepare(`
    UPDATE services 
    SET name = ?, description = ?, price = ?, duration = ?, image = ?, features = ?
    WHERE id = ?
  `);
  return stmt.run(
    serviceData.name,
    serviceData.description,
    serviceData.price,
    serviceData.duration,
    serviceData.image,
    JSON.stringify(serviceData.features),
    id
  );
};

export const deleteService = (id) => {
  const stmt = db.prepare('DELETE FROM services WHERE id = ?');
  return stmt.run(id);
};

// Order operations
export const getAllOrders = () => {
  const stmt = db.prepare('SELECT * FROM orders ORDER BY created_at DESC');
  return stmt.all();
};

export const getOrderById = (id) => {
  const stmt = db.prepare('SELECT * FROM orders WHERE id = ?');
  return stmt.get(id);
};

export const createOrder = (orderData) => {
  const stmt = db.prepare(`
    INSERT INTO orders (
      service_id, service_name, customer_name, customer_phone, 
      customer_email, address, scheduled_date, notes, total_price
    )
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
  `);
  return stmt.run(
    orderData.serviceId,
    orderData.serviceName,
    orderData.customerName,
    orderData.customerPhone,
    orderData.customerEmail,
    orderData.address,
    orderData.scheduledDate,
    orderData.notes,
    orderData.totalPrice
  );
};

export const updateOrderStatus = (id, status) => {
  const stmt = db.prepare('UPDATE orders SET status = ? WHERE id = ?');
  return stmt.run(status, id);
};

export const getOrdersByStatus = (status) => {
  const stmt = db.prepare('SELECT * FROM orders WHERE status = ? ORDER BY created_at DESC');
  return stmt.all(status);
};

// Initialize database on import
initializeDatabase();

export default db;