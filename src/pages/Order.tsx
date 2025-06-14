import React, { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Calendar, MapPin, Phone, Mail, User, FileText } from 'lucide-react';
import { useData } from '../context/DataContext';

const Order: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { services, addOrder } = useData();
  
  const [selectedServiceId, setSelectedServiceId] = useState(searchParams.get('service') || '');
  const [formData, setFormData] = useState({
    customerName: '',
    customerPhone: '',
    customerEmail: '',
    address: '',
    scheduledDate: '',
    notes: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const selectedService = services.find(s => s.id === selectedServiceId);

  useEffect(() => {
    // Set minimum date to tomorrow
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    const minDate = tomorrow.toISOString().split('T')[0];
    
    const dateInput = document.getElementById('scheduledDate') as HTMLInputElement;
    if (dateInput) {
      dateInput.min = minDate;
    }
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedService) return;

    setIsSubmitting(true);

    try {
      addOrder({
        serviceId: selectedService.id,
        serviceName: selectedService.name,
        customerName: formData.customerName,
        customerPhone: formData.customerPhone,
        customerEmail: formData.customerEmail,
        address: formData.address,
        scheduledDate: formData.scheduledDate,
        status: 'requested',
        notes: formData.notes,
        totalPrice: selectedService.price
      });

      // Show success message and redirect
      alert('Pesanan berhasil dikirim! Kami akan menghubungi Anda segera untuk konfirmasi.');
      navigate('/');
    } catch (error) {
      alert('Terjadi kesalahan. Silakan coba lagi.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4 max-w-4xl">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Pesan Layanan</h1>
          <p className="text-xl text-gray-600">
            Isi formulir di bawah ini untuk memesan layanan kami
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Form */}
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-2xl font-bold text-gray-800 mb-6">Detail Pemesanan</h2>
            
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Service Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Pilih Layanan *
                </label>
                <select
                  value={selectedServiceId}
                  onChange={(e) => setSelectedServiceId(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                >
                  <option value="">Pilih layanan...</option>
                  {services.map(service => (
                    <option key={service.id} value={service.id}>
                      {service.name} - {formatPrice(service.price)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Customer Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <User className="inline h-4 w-4 mr-1" />
                  Nama Lengkap *
                </label>
                <input
                  type="text"
                  name="customerName"
                  value={formData.customerName}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Phone */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Phone className="inline h-4 w-4 mr-1" />
                  Nomor Telepon *
                </label>
                <input
                  type="tel"
                  name="customerPhone"
                  value={formData.customerPhone}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Mail className="inline h-4 w-4 mr-1" />
                  Email
                </label>
                <input
                  type="email"
                  name="customerEmail"
                  value={formData.customerEmail}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Address */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <MapPin className="inline h-4 w-4 mr-1" />
                  Alamat Lengkap *
                </label>
                <textarea
                  name="address"
                  value={formData.address}
                  onChange={handleInputChange}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Scheduled Date */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Calendar className="inline h-4 w-4 mr-1" />
                  Tanggal Pelayanan *
                </label>
                <input
                  type="date"
                  id="scheduledDate"
                  name="scheduledDate"
                  value={formData.scheduledDate}
                  onChange={handleInputChange}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <FileText className="inline h-4 w-4 mr-1" />
                  Catatan Tambahan
                </label>
                <textarea
                  name="notes"
                  value={formData.notes}
                  onChange={handleInputChange}
                  rows={3}
                  placeholder="Informasi tambahan yang perlu kami ketahui..."
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              <button
                type="submit"
                disabled={isSubmitting || !selectedService}
                className="w-full bg-blue-600 text-white py-4 rounded-lg font-semibold hover:bg-blue-700 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? 'Mengirim Pesanan...' : 'Kirim Pesanan'}
              </button>
            </form>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            {selectedService && (
              <div className="bg-white rounded-xl shadow-lg p-8">
                <h3 className="text-xl font-bold text-gray-800 mb-4">Ringkasan Pesanan</h3>
                
                <div className="space-y-4">
                  <img
                    src={selectedService.image}
                    alt={selectedService.name}
                    className="w-full h-32 object-cover rounded-lg"
                  />
                  
                  <div>
                    <h4 className="font-semibold text-gray-800">{selectedService.name}</h4>
                    <p className="text-gray-600 text-sm mt-1">{selectedService.description}</p>
                  </div>

                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <span className="text-gray-600">Harga Layanan:</span>
                      <span className="font-semibold text-lg">{formatPrice(selectedService.price)}</span>
                    </div>
                  </div>

                  <div className="bg-blue-50 p-4 rounded-lg">
                    <h5 className="font-semibold text-blue-800 mb-2">Termasuk dalam layanan:</h5>
                    <ul className="space-y-1">
                      {selectedService.features.map((feature, index) => (
                        <li key={index} className="text-sm text-blue-700">• {feature}</li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}

            <div className="bg-green-50 rounded-xl p-6">
              <h3 className="text-lg font-semibold text-green-800 mb-3">Informasi Penting</h3>
              <ul className="space-y-2 text-sm text-green-700">
                <li>• Konfirmasi pesanan akan dikirim via WhatsApp/telepon</li>
                <li>• Pembayaran dilakukan setelah layanan selesai</li>
                <li>• Tersedia layanan darurat 24/7</li>
                <li>• Garansi sesuai paket yang dipilih</li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Order;