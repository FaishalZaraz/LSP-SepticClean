import React from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, Clock, Shield, Phone, Star, Users } from 'lucide-react';

const Home: React.FC = () => {
  const features = [
    {
      icon: <CheckCircle className="h-8 w-8 text-green-500" />,
      title: 'Layanan Profesional',
      description: 'Tim berpengalaman dengan peralatan modern dan standar kebersihan tinggi'
    },
    {
      icon: <Clock className="h-8 w-8 text-blue-500" />,
      title: 'Siap 24/7',
      description: 'Melayani panggilan darurat kapan saja, termasuk hari libur dan malam hari'
    },
    {
      icon: <Shield className="h-8 w-8 text-purple-500" />,
      title: 'Bergaransi',
      description: 'Semua layanan dilengkapi garansi untuk memastikan kepuasan pelanggan'
    }
  ];

  const stats = [
    { number: '1000+', label: 'Pelanggan Puas' },
    { number: '5+', label: 'Tahun Pengalaman' },
    { number: '24/7', label: 'Layanan Siaga' },
    { number: '100%', label: 'Garansi Puas' }
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-blue-800 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <h1 className="text-4xl lg:text-6xl font-bold mb-6 leading-tight">
                Solusi Terpercaya untuk
                <span className="text-yellow-300"> Sedot WC</span>
              </h1>
              <p className="text-xl mb-8 text-blue-100">
                Layanan profesional sedot WC dan pembersihan saluran air dengan teknologi modern. 
                Cepat, bersih, dan terpercaya untuk kebutuhan sanitasi Anda.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link
                  to="/order"
                  className="bg-yellow-400 text-blue-900 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-yellow-300 transition-colors text-center"
                >
                  Pesan Sekarang
                </Link>
                <a
                  href="tel:081234567890"
                  className="border-2 border-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-900 transition-colors text-center flex items-center justify-center space-x-2"
                >
                  <Phone className="h-5 w-5" />
                  <span>Hubungi Darurat</span>
                </a>
              </div>
            </div>
            <div className="relative">
              <img
                src="https://images.pexels.com/photos/6195122/pexels-photo-6195122.jpeg?auto=compress&cs=tinysrgb&w=800"
                alt="Layanan Sedot WC Profesional"
                className="rounded-lg shadow-2xl"
              />
              <div className="absolute -bottom-6 -left-6 bg-yellow-400 text-blue-900 p-4 rounded-lg shadow-lg">
                <div className="flex items-center space-x-2">
                  <Star className="h-6 w-6 fill-current" />
                  <div>
                    <div className="font-bold text-lg">4.9/5</div>
                    <div className="text-sm">Rating Pelanggan</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-16">
            <h2 className="text-3xl lg:text-4xl font-bold text-gray-800 mb-4">
              Mengapa Memilih SeptikClean?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Kami berkomitmen memberikan layanan terbaik dengan standar profesional tinggi
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
                <div className="mb-4">{feature.icon}</div>
                <h3 className="text-xl font-semibold mb-3 text-gray-800">{feature.title}</h3>
                <p className="text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <div key={index} className="text-center">
                <div className="text-4xl lg:text-5xl font-bold mb-2">{stat.number}</div>
                <div className="text-blue-200">{stat.label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-r from-green-500 to-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl lg:text-4xl font-bold mb-6">
            Butuh Layanan Sedot WC Sekarang?
          </h2>
          <p className="text-xl mb-8 max-w-2xl mx-auto">
            Jangan tunggu masalah semakin parah. Hubungi kami sekarang untuk mendapatkan 
            layanan cepat dan profesional.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/order"
              className="bg-white text-blue-600 px-8 py-4 rounded-lg font-semibold text-lg hover:bg-gray-100 transition-colors"
            >
              Pesan Online
            </Link>
            <a
              href="tel:081234567890"
              className="border-2 border-white px-8 py-4 rounded-lg font-semibold text-lg hover:bg-white hover:text-blue-600 transition-colors flex items-center justify-center space-x-2"
            >
              <Phone className="h-5 w-5" />
              <span>0812-3456-7890</span>
            </a>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;