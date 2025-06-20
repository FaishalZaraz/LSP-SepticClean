import React from 'react';
import { Droplets, Phone, Mail, MapPin } from 'lucide-react';

const Footer: React.FC = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 text-xl font-bold mb-4">
              <Droplets className="h-8 w-8 text-blue-400" />
              <span>SepticClean</span>
            </div>
            <p className="text-gray-300 mb-4">
              Layanan profesional sedot WC dan pembersihan saluran air dengan teknologi modern 
              dan tim berpengalaman. Melayani 24/7 untuk kebutuhan darurat Anda.
            </p>
            <div className="flex space-x-4">
              <div className="bg-blue-600 p-2 rounded-full">
                <Phone className="h-5 w-5" />
              </div>
              <div className="bg-blue-600 p-2 rounded-full">
                <Mail className="h-5 w-5" />
              </div>
              <div className="bg-blue-600 p-2 rounded-full">
                <MapPin className="h-5 w-5" />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Layanan</h3>
            <ul className="space-y-2 text-gray-300">
              <li>Sedot WC Standar</li>
              <li>Sedot WC Premium</li>
              <li>Pembersihan Saluran</li>
              <li>Layanan Darurat 24/7</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-4">Kontak</h3>
            <div className="space-y-2 text-gray-300">
              <div className="flex items-center space-x-2">
                <Phone className="h-4 w-4" />
                <span>0812-3456-7890</span>
              </div>
              <div className="flex items-center space-x-2">
                <Mail className="h-4 w-4" />
                <span>info@septicclean.com</span>
              </div>
              <div className="flex items-center space-x-2">
                <MapPin className="h-4 w-4" />
                <span>Jakarta, Indonesia</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-gray-400">
          <p>&copy; {new Date().getFullYear()} SepticClean. Semua hak dilindungi.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;