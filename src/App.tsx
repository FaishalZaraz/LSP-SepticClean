import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import Header from './components/Layout/Header';
import Footer from './components/Layout/Footer';
import ProtectedRoute from './components/ProtectedRoute';
import AdminLayout from './components/admin/AdminLayout';

// Pages
import Home from './pages/Home';
import Services from './pages/Services';
import Order from './pages/Order';
import Login from './pages/Login';
import Dashboard from './pages/admin/Dashboard';
import AdminServices from './pages/admin/Services';
import AdminOrders from './pages/admin/Orders';

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <Router>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<Login />} />
            
            {/* Routes with Header/Footer */}
            <Route path="/*" element={
              <div className="min-h-screen flex flex-col">
                <Header />
                <main className="flex-1">
                  <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/order" element={<Order />} />
                  </Routes>
                </main>
                <Footer />
              </div>
            } />

            {/* Admin Routes */}
            <Route path="/admin/*" element={
              <ProtectedRoute requireAdmin>
                <AdminLayout />
              </ProtectedRoute>
            }>
              <Route index element={<Dashboard />} />
              <Route path="services" element={<AdminServices />} />
              <Route path="orders" element={<AdminOrders />} />
            </Route>
          </Routes>
        </Router>
      </DataProvider>
    </AuthProvider>
  );
}

export default App;