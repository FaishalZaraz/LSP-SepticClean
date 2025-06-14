import React, { createContext, useContext, useState, useEffect } from 'react';
import { Service, Order } from '../types';
import { servicesAPI, ordersAPI } from '../lib/api.js';

interface DataContextType {
  services: Service[];
  orders: Order[];
  addService: (service: Omit<Service, 'id' | 'createdAt'>) => Promise<void>;
  updateService: (id: string, service: Partial<Service>) => Promise<void>;
  deleteService: (id: string) => Promise<void>;
  addOrder: (order: Omit<Order, 'id' | 'createdAt'>) => Promise<void>;
  updateOrderStatus: (id: string, status: Order['status']) => Promise<void>;
  refreshData: () => Promise<void>;
  isLoading: boolean;
  error: string | null;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [services, setServices] = useState<Service[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const refreshData = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      // Load services from database
      const servicesResponse = await servicesAPI.getAll();
      if (servicesResponse.success && servicesResponse.data) {
        const formattedServices = servicesResponse.data.map((service: any) => ({
          id: service.id.toString(),
          name: service.name,
          description: service.description,
          price: parseInt(service.price),
          duration: service.duration,
          image: service.image,
          features: service.features || [],
          createdAt: service.created_at || new Date().toISOString()
        }));
        setServices(formattedServices);
        console.log('Services loaded from database:', formattedServices.length);
      } else {
        throw new Error('Failed to load services from database');
      }

      // Load orders from database
      const ordersResponse = await ordersAPI.getAll();
      if (ordersResponse.success && ordersResponse.data) {
        const formattedOrders = ordersResponse.data.map((order: any) => ({
          id: order.id.toString(),
          serviceId: order.service_id.toString(),
          serviceName: order.service_name,
          customerName: order.customer_name,
          customerPhone: order.customer_phone,
          customerEmail: order.customer_email || '',
          address: order.address,
          scheduledDate: order.scheduled_date,
          status: order.status as Order['status'],
          notes: order.notes || '',
          totalPrice: parseInt(order.total_price),
          createdAt: order.created_at || new Date().toISOString()
        }));
        setOrders(formattedOrders);
        console.log('Orders loaded from database:', formattedOrders.length);
      } else {
        console.log('No orders found or failed to load orders');
        setOrders([]);
      }

    } catch (error) {
      console.error('Error loading data from database:', error);
      setError('Gagal memuat data dari database. Pastikan XAMPP MySQL berjalan dan backend tersedia.');
      // Don't fallback to localStorage - show empty state instead
      setServices([]);
      setOrders([]);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    refreshData();
  }, []);

  const addService = async (serviceData: Omit<Service, 'id' | 'createdAt'>) => {
    try {
      setError(null);
      const response = await servicesAPI.create({
        ...serviceData,
        price: serviceData.price,
        features: serviceData.features
      });
      
      if (response.success) {
        console.log('Service created successfully');
        await refreshData(); // Refresh to get updated data from database
      } else {
        throw new Error(response.message || 'Failed to create service');
      }
    } catch (error) {
      console.error('Error adding service:', error);
      setError('Gagal menambah layanan. Pastikan database tersedia.');
      throw error;
    }
  };

  const updateService = async (id: string, serviceData: Partial<Service>) => {
    try {
      setError(null);
      const response = await servicesAPI.update(parseInt(id), {
        ...serviceData,
        price: serviceData.price,
        features: serviceData.features
      });
      
      if (response.success) {
        console.log('Service updated successfully');
        await refreshData(); // Refresh to get updated data from database
      } else {
        throw new Error(response.message || 'Failed to update service');
      }
    } catch (error) {
      console.error('Error updating service:', error);
      setError('Gagal mengupdate layanan. Pastikan database tersedia.');
      throw error;
    }
  };

  const deleteService = async (id: string) => {
    try {
      setError(null);
      const response = await servicesAPI.delete(parseInt(id));
      
      if (response.success) {
        console.log('Service deleted successfully');
        await refreshData(); // Refresh to get updated data from database
      } else {
        throw new Error(response.message || 'Failed to delete service');
      }
    } catch (error) {
      console.error('Error deleting service:', error);
      setError('Gagal menghapus layanan. Pastikan database tersedia.');
      throw error;
    }
  };

  const addOrder = async (orderData: Omit<Order, 'id' | 'createdAt'>) => {
    try {
      setError(null);
      const response = await ordersAPI.create({
        serviceId: orderData.serviceId,
        serviceName: orderData.serviceName,
        customerName: orderData.customerName,
        customerPhone: orderData.customerPhone,
        customerEmail: orderData.customerEmail,
        address: orderData.address,
        scheduledDate: orderData.scheduledDate,
        notes: orderData.notes,
        totalPrice: orderData.totalPrice
      });
      
      if (response.success) {
        console.log('Order created successfully');
        await refreshData(); // Refresh to get updated data from database
      } else {
        throw new Error(response.message || 'Failed to create order');
      }
    } catch (error) {
      console.error('Error adding order:', error);
      setError('Gagal menambah pesanan. Pastikan database tersedia.');
      throw error;
    }
  };

  const updateOrderStatus = async (id: string, status: Order['status']) => {
    try {
      setError(null);
      const response = await ordersAPI.updateStatus(parseInt(id), status);
      
      if (response.success) {
        console.log('Order status updated successfully');
        await refreshData(); // Refresh to get updated data from database
      } else {
        throw new Error(response.message || 'Failed to update order status');
      }
    } catch (error) {
      console.error('Error updating order status:', error);
      setError('Gagal mengupdate status pesanan. Pastikan database tersedia.');
      throw error;
    }
  };

  return (
    <DataContext.Provider value={{
      services,
      orders,
      addService,
      updateService,
      deleteService,
      addOrder,
      updateOrderStatus,
      refreshData,
      isLoading,
      error
    }}>
      {children}
    </DataContext.Provider>
  );
};