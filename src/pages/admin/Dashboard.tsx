import React from 'react';
import { BarChart3, Users, Package, TrendingUp, Calendar, CheckCircle, Clock, XCircle, AlertCircle } from 'lucide-react';
import { useData } from '../../context/DataContext';

const Dashboard: React.FC = () => {
  const { services, orders, isLoading, error, refreshData } = useData();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Memuat data dari database...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="bg-red-50 border border-red-200 rounded-xl p-8 max-w-md text-center">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-bold text-red-800 mb-2">Error Database</h2>
          <p className="text-red-700 mb-4">{error}</p>
          <button
            onClick={refreshData}
            className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition-colors"
          >
            Coba Lagi
          </button>
        </div>
      </div>
    );
  }

  const stats = [
    {
      title: 'Total Layanan',
      value: services.length,
      icon: <Package className="h-8 w-8" />,
      color: 'bg-blue-500',
      change: '+2 bulan ini'
    },
    {
      title: 'Total Pesanan',
      value: orders.length,
      icon: <Users className="h-8 w-8" />,
      color: 'bg-green-500',
      change: `+${orders.filter(o => {
        const orderDate = new Date(o.createdAt);
        const thisMonth = new Date();
        return orderDate.getMonth() === thisMonth.getMonth();
      }).length} bulan ini`
    },
    {
      title: 'Pesanan Pending',
      value: orders.filter(o => o.status === 'requested').length,
      icon: <Clock className="h-8 w-8" />,
      color: 'bg-yellow-500',
      change: 'Perlu perhatian'
    },
    {
      title: 'Pesanan Selesai',
      value: orders.filter(o => o.status === 'completed').length,
      icon: <CheckCircle className="h-8 w-8" />,
      color: 'bg-purple-500',
      change: 'Bulan ini'
    }
  ];

  const recentOrders = orders
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
    .slice(0, 5);

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      requested: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Menunggu' },
      approved: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Disetujui' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Ditolak' },
      completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Selesai' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    );
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'short',
      year: 'numeric'
    });
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-800">Dashboard Admin</h1>
          <p className="text-gray-600 mt-2">Selamat datang di panel admin SepticClean</p>
        </div>
        <button
          onClick={refreshData}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
        >
          Refresh Data
        </button>
      </div>

      {/* Database Status */}
      <div className="bg-green-50 border border-green-200 rounded-xl p-4">
        <div className="flex items-center space-x-2">
          <CheckCircle className="h-5 w-5 text-green-600" />
          <span className="text-green-800 font-medium">Database Terhubung</span>
          <span className="text-green-600 text-sm">
            - {services.length} layanan, {orders.length} pesanan dimuat dari MySQL
          </span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl shadow-lg p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                <p className="text-3xl font-bold text-gray-800 mt-2">{stat.value}</p>
                <p className="text-sm text-gray-500 mt-1">{stat.change}</p>
              </div>
              <div className={`${stat.color} text-white p-3 rounded-lg`}>
                {stat.icon}
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* Recent Orders */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Pesanan Terbaru</h2>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {recentOrders.length > 0 ? (
              recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-800">{order.customerName}</h3>
                    <p className="text-sm text-gray-600">{order.serviceName}</p>
                    <p className="text-xs text-gray-500">{formatDate(order.createdAt)}</p>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{formatPrice(order.totalPrice)}</p>
                    {getStatusBadge(order.status)}
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">Belum ada pesanan di database</p>
            )}
          </div>
        </div>

        {/* Service Overview */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-800">Layanan Tersedia</h2>
            <Package className="h-5 w-5 text-gray-400" />
          </div>
          
          <div className="space-y-4">
            {services.length > 0 ? (
              services.map((service) => (
                <div key={service.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-3">
                    <img
                      src={service.image}
                      alt={service.name}
                      className="w-12 h-12 object-cover rounded-lg"
                    />
                    <div>
                      <h3 className="font-semibold text-gray-800">{service.name}</h3>
                      <p className="text-sm text-gray-600">{service.duration}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-semibold text-gray-800">{formatPrice(service.price)}</p>
                    <p className="text-xs text-gray-500">
                      {orders.filter(o => o.serviceId === service.id).length} pesanan
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-gray-500 text-center py-8">Belum ada layanan di database</p>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-gradient-to-r from-blue-500 to-purple-600 rounded-xl p-8 text-white">
        <h2 className="text-2xl font-bold mb-4">Aksi Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
            <Package className="h-8 w-8 mx-auto mb-2" />
            <h3 className="font-semibold">Kelola Layanan</h3>
            <p className="text-sm opacity-90">Tambah atau edit layanan</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
            <Users className="h-8 w-8 mx-auto mb-2" />
            <h3 className="font-semibold">Kelola Pesanan</h3>
            <p className="text-sm opacity-90">Proses pesanan masuk</p>
          </div>
          <div className="bg-white bg-opacity-20 rounded-lg p-4 text-center">
            <TrendingUp className="h-8 w-8 mx-auto mb-2" />
            <h3 className="font-semibold">Lihat Laporan</h3>
            <p className="text-sm opacity-90">Analisis performa</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;