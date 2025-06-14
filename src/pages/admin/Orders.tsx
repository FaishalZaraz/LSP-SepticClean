import React, { useState } from 'react';
import { CheckCircle, XCircle, Clock, Eye, Phone, Mail, MapPin, Calendar } from 'lucide-react';
import { useData } from '../../context/DataContext';
import { Order } from '../../types';

const AdminOrders: React.FC = () => {
  const { orders, updateOrderStatus } = useData();
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [filterStatus, setFilterStatus] = useState<string>('all');

  const filteredOrders = orders.filter(order => {
    if (filterStatus === 'all') return true;
    return order.status === filterStatus;
  });

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      requested: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Menunggu' },
      approved: { bg: 'bg-blue-100', text: 'text-blue-800', label: 'Disetujui' },
      rejected: { bg: 'bg-red-100', text: 'text-red-800', label: 'Ditolak' },
      completed: { bg: 'bg-green-100', text: 'text-green-800', label: 'Selesai' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig];
    return (
      <span className={`px-3 py-1 rounded-full text-sm font-medium ${config.bg} ${config.text}`}>
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
      month: 'long',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatScheduledDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric',
      month: 'long',
      year: 'numeric'
    });
  };

  const handleStatusUpdate = (orderId: string, newStatus: Order['status']) => {
    updateOrderStatus(orderId, newStatus);
    if (selectedOrder && selectedOrder.id === orderId) {
      setSelectedOrder({ ...selectedOrder, status: newStatus });
    }
  };

  const statusCounts = {
    all: orders.length,
    requested: orders.filter(o => o.status === 'requested').length,
    approved: orders.filter(o => o.status === 'approved').length,
    rejected: orders.filter(o => o.status === 'rejected').length,
    completed: orders.filter(o => o.status === 'completed').length
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-800">Kelola Pesanan</h1>
        <p className="text-gray-600 mt-2">Kelola dan proses pesanan dari pelanggan</p>
      </div>

      {/* Status Filter */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex flex-wrap gap-4">
          {[
            { key: 'all', label: 'Semua', count: statusCounts.all },
            { key: 'requested', label: 'Menunggu', count: statusCounts.requested },
            { key: 'approved', label: 'Disetujui', count: statusCounts.approved },
            { key: 'rejected', label: 'Ditolak', count: statusCounts.rejected },
            { key: 'completed', label: 'Selesai', count: statusCounts.completed }
          ].map((filter) => (
            <button
              key={filter.key}
              onClick={() => setFilterStatus(filter.key)}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                filterStatus === filter.key
                  ? 'bg-blue-600 text-white'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {filter.label} ({filter.count})
            </button>
          ))}
        </div>
      </div>

      {/* Orders List */}
      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {filteredOrders.length > 0 ? (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Pelanggan
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Layanan
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Tanggal Pesan
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Jadwal
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Total
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-4 text-left text-sm font-medium text-gray-500 uppercase tracking-wider">
                    Aksi
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {filteredOrders.map((order) => (
                  <tr key={order.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-gray-900">{order.customerName}</div>
                        <div className="text-sm text-gray-500">{order.customerPhone}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{order.serviceName}</div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatDate(order.createdAt)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {formatScheduledDate(order.scheduledDate)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {formatPrice(order.totalPrice)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(order.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setSelectedOrder(order)}
                          className="text-blue-600 hover:text-blue-900"
                        >
                          <Eye className="h-4 w-4" />
                        </button>
                        {order.status === 'requested' && (
                          <>
                            <button
                              onClick={() => handleStatusUpdate(order.id, 'approved')}
                              className="text-green-600 hover:text-green-900"
                              title="Setujui"
                            >
                              <CheckCircle className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => handleStatusUpdate(order.id, 'rejected')}
                              className="text-red-600 hover:text-red-900"
                              title="Tolak"
                            >
                              <XCircle className="h-4 w-4" />
                            </button>
                          </>
                        )}
                        {order.status === 'approved' && (
                          <button
                            onClick={() => handleStatusUpdate(order.id, 'completed')}
                            className="text-purple-600 hover:text-purple-900"
                            title="Tandai Selesai"
                          >
                            <CheckCircle className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ) : (
          <div className="text-center py-12">
            <Clock className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 text-lg">
              {filterStatus === 'all' ? 'Belum ada pesanan' : `Tidak ada pesanan dengan status ${filterStatus}`}
            </p>
          </div>
        )}
      </div>

      {/* Order Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-gray-800">Detail Pesanan</h2>
                <button
                  onClick={() => setSelectedOrder(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-6">
              {/* Order Status */}
              <div className="flex items-center justify-between">
                <span className="text-lg font-semibold">Status Pesanan:</span>
                {getStatusBadge(selectedOrder.status)}
              </div>

              {/* Customer Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Informasi Pelanggan</h3>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{selectedOrder.customerName}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">{selectedOrder.customerPhone}</span>
                  </div>
                  {selectedOrder.customerEmail && (
                    <div className="flex items-center space-x-2">
                      <Mail className="h-4 w-4 text-gray-500" />
                      <span className="text-sm">{selectedOrder.customerEmail}</span>
                    </div>
                  )}
                  <div className="flex items-start space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500 mt-0.5" />
                    <span className="text-sm">{selectedOrder.address}</span>
                  </div>
                </div>
              </div>

              {/* Service Info */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Informasi Layanan</h3>
                <div className="space-y-2">
                  <div>
                    <span className="font-medium">Layanan:</span> {selectedOrder.serviceName}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-sm">
                      Jadwal: {formatScheduledDate(selectedOrder.scheduledDate)}
                    </span>
                  </div>
                  <div>
                    <span className="font-medium">Total Harga:</span> {formatPrice(selectedOrder.totalPrice)}
                  </div>
                </div>
              </div>

              {/* Notes */}
              {selectedOrder.notes && (
                <div className="bg-yellow-50 rounded-lg p-4">
                  <h3 className="font-semibold text-gray-800 mb-2">Catatan Tambahan</h3>
                  <p className="text-sm text-gray-700">{selectedOrder.notes}</p>
                </div>
              )}

              {/* Order Timeline */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-800 mb-3">Timeline Pesanan</h3>
                <div className="text-sm text-gray-600">
                  <p>Pesanan dibuat: {formatDate(selectedOrder.createdAt)}</p>
                </div>
              </div>

              {/* Action Buttons */}
              {selectedOrder.status === 'requested' && (
                <div className="flex space-x-4">
                  <button
                    onClick={() => handleStatusUpdate(selectedOrder.id, 'approved')}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <CheckCircle className="h-5 w-5" />
                    <span>Setujui Pesanan</span>
                  </button>
                  <button
                    onClick={() => handleStatusUpdate(selectedOrder.id, 'rejected')}
                    className="flex-1 bg-red-600 text-white py-3 rounded-lg font-semibold hover:bg-red-700 transition-colors flex items-center justify-center space-x-2"
                  >
                    <XCircle className="h-5 w-5" />
                    <span>Tolak Pesanan</span>
                  </button>
                </div>
              )}

              {selectedOrder.status === 'approved' && (
                <button
                  onClick={() => handleStatusUpdate(selectedOrder.id, 'completed')}
                  className="w-full bg-purple-600 text-white py-3 rounded-lg font-semibold hover:bg-purple-700 transition-colors flex items-center justify-center space-x-2"
                >
                  <CheckCircle className="h-5 w-5" />
                  <span>Tandai Selesai</span>
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminOrders;