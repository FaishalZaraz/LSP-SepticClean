import React from 'react';
import { Link } from 'react-router-dom';
import { Clock, CheckCircle, Star } from 'lucide-react';
import { useData } from '../context/DataContext';

const Services: React.FC = () => {
  const { services } = useData();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      minimumFractionDigits: 0
    }).format(price);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="container mx-auto px-4">
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-800 mb-4">Layanan Kami</h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto">
            Pilih layanan yang sesuai dengan kebutuhan Anda. Semua layanan dilengkapi dengan 
            garansi dan dikerjakan oleh teknisi berpengalaman.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service) => (
            <div key={service.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
              <div className="relative">
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-48 object-cover"
                />
                <div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm font-semibold">
                  {formatPrice(service.price)}
                </div>
              </div>
              
              <div className="p-6">
                <h3 className="text-xl font-bold text-gray-800 mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                
                <div className="flex items-center space-x-4 mb-4 text-sm text-gray-500">
                  <div className="flex items-center space-x-1">
                    <Clock className="h-4 w-4" />
                    <span>{service.duration}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <Star className="h-4 w-4 text-yellow-500 fill-current" />
                    <span>4.9</span>
                  </div>
                </div>

                <div className="mb-6">
                  <h4 className="font-semibold text-gray-800 mb-2">Termasuk:</h4>
                  <ul className="space-y-1">
                    {service.features.map((feature, index) => (
                      <li key={index} className="flex items-center space-x-2 text-sm text-gray-600">
                        <CheckCircle className="h-4 w-4 text-green-500" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <Link
                  to={`/order?service=${service.id}`}
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors text-center block"
                >
                  Pesan Layanan Ini
                </Link>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-16 bg-blue-50 rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-gray-800 mb-4">Butuh Konsultasi?</h2>
          <p className="text-gray-600 mb-6">
            Tidak yakin layanan mana yang tepat? Hubungi tim ahli kami untuk konsultasi gratis.
          </p>
          <a
            href="tel:081234567890"
            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors inline-block"
          >
            Hubungi Sekarang
          </a>
        </div>
      </div>
    </div>
  );
};

export default Services;