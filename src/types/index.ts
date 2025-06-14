export interface Service {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: string;
  image: string;
  features: string[];
  createdAt: string;
}

export interface Order {
  id: string;
  serviceId: string;
  serviceName: string;
  customerName: string;
  customerPhone: string;
  customerEmail: string;
  address: string;
  scheduledDate: string;
  status: 'requested' | 'approved' | 'rejected' | 'completed';
  notes?: string;
  totalPrice: number;
  createdAt: string;
}

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'customer';
}