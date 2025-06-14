# XAMPP MySQL Setup Guide

## 📋 Setup Instructions

### 1. Install XAMPP
- Download and install XAMPP from https://www.apachefriends.org/
- Start Apache and MySQL services from XAMPP Control Panel

### 2. Create Database
1. Open phpMyAdmin (http://localhost/phpmyadmin)
2. Create a new database named `septic_service`
3. Import the SQL schema from `database/schema.sql`

### 3. Setup Backend Files
1. Copy the `backend` folder to your XAMPP `htdocs` directory
2. The structure should be: `C:\xampp\htdocs\septic-service\backend\`

### 4. Configure API URL
In `src/lib/api.js`, update the API_BASE_URL if needed:
```javascript
const API_BASE_URL = 'http://localhost/septicclean/backend/api';
```

### 5. Test the Setup
1. Start XAMPP (Apache + MySQL)
2. Visit: http://localhost/septic-service/backend/api/services.php
3. You should see a JSON response with services data

## 🔐 Default Admin Login
- **Email:** admin@septictank.com
- **Password:** admin123

## 📁 File Structure
```
C:\xampp\htdocs\septic-service\
├── backend/
│   ├── config/
│   │   └── database.php
│   └── api/
│       ├── auth.php
│       ├── services.php
│       └── orders.php
└── database/
    └── schema.sql
```

## 🚀 Features
- ✅ MySQL Database Integration
- ✅ PHP REST API Backend
- ✅ User Authentication with JWT
- ✅ CRUD Operations for Services
- ✅ Order Management System
- ✅ CORS Support for React Frontend
- ✅ Password Hashing with bcrypt
- ✅ Error Handling & Validation

## 🔧 API Endpoints

### Authentication
- `POST /auth.php` - User login

### Services
- `GET /services.php` - Get all services
- `POST /services.php` - Create new service
- `PUT /services.php` - Update service
- `DELETE /services.php` - Delete service

### Orders
- `GET /orders.php` - Get all orders
- `POST /orders.php` - Create new order
- `PUT /orders.php` - Update order status

## 🛠️ Troubleshooting

### CORS Issues
If you encounter CORS errors, make sure:
1. Apache is running in XAMPP
2. The API files have proper CORS headers
3. The API_BASE_URL in `src/lib/api.js` is correct

### Database Connection Issues
1. Check if MySQL is running in XAMPP
2. Verify database credentials in `backend/config/database.php`
3. Ensure the `septic_service` database exists

### API Not Working
1. Check Apache error logs in XAMPP
2. Verify file permissions
3. Test API endpoints directly in browser
