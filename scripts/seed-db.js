import { createService } from '../src/lib/database.js';

console.log('Seeding database with initial services...');

const initialServices = [
  {
    name: 'Sedot WC Standar',
    description: 'Layanan sedot WC untuk rumah tinggal dengan kapasitas standar. Cocok untuk septic tank ukuran kecil hingga menengah.',
    price: 150000,
    duration: '1-2 jam',
    image: 'https://images.pexels.com/photos/6195122/pexels-photo-6195122.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['Sedot limbah cair', 'Pembersihan dasar', 'Garansi 1 bulan', 'Peralatan standar']
  },
  {
    name: 'Sedot WC Premium',
    description: 'Layanan sedot WC lengkap dengan pembersihan menyeluruh dan disinfeksi. Termasuk pengecekan sistem perpipaan.',
    price: 250000,
    duration: '2-3 jam',
    image: 'https://images.pexels.com/photos/6195070/pexels-photo-6195070.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['Sedot limbah cair', 'Pembersihan menyeluruh', 'Disinfeksi', 'Garansi 3 bulan', 'Pengecekan pipa']
  },
  {
    name: 'Pembersihan Saluran Air',
    description: 'Layanan pembersihan saluran air dan got tersumbat menggunakan teknologi high pressure cleaning.',
    price: 100000,
    duration: '1 jam',
    image: 'https://images.pexels.com/photos/8486944/pexels-photo-8486944.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['Pembersihan saluran', 'Pengecekan pipa', 'High pressure cleaning', 'Garansi 2 minggu']
  },
  {
    name: 'Sedot WC Darurat 24/7',
    description: 'Layanan darurat sedot WC yang tersedia 24 jam sehari, 7 hari seminggu. Respon cepat dalam 1 jam.',
    price: 300000,
    duration: '1-2 jam',
    image: 'https://images.pexels.com/photos/5691659/pexels-photo-5691659.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['Layanan 24/7', 'Respon dalam 1 jam', 'Tim siaga darurat', 'Peralatan lengkap', 'Garansi 1 bulan']
  },
  {
    name: 'Pembersihan Grease Trap',
    description: 'Layanan khusus pembersihan grease trap untuk restoran, hotel, dan dapur komersial.',
    price: 200000,
    duration: '2-3 jam',
    image: 'https://images.pexels.com/photos/4099354/pexels-photo-4099354.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['Pembersihan grease trap', 'Pembuangan limbah minyak', 'Disinfeksi menyeluruh', 'Sertifikat kebersihan', 'Garansi 2 bulan']
  },
  {
    name: 'Perawatan Septic Tank',
    description: 'Layanan perawatan rutin septic tank termasuk penambahan bakteri pengurai dan pengecekan sistem.',
    price: 180000,
    duration: '1-2 jam',
    image: 'https://images.pexels.com/photos/5691658/pexels-photo-5691658.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['Penambahan bakteri pengurai', 'Pengecekan sistem', 'Pembersihan filter', 'Konsultasi perawatan', 'Garansi 6 bulan']
  },
  {
    name: 'Sedot WC Apartemen',
    description: 'Layanan khusus untuk apartemen dan gedung bertingkat dengan akses terbatas. Menggunakan peralatan compact.',
    price: 220000,
    duration: '2-3 jam',
    image: 'https://images.pexels.com/photos/6195123/pexels-photo-6195123.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['Peralatan compact', 'Akses gedung tinggi', 'Minimal gangguan', 'Pembersihan area kerja', 'Garansi 2 bulan']
  },
  {
    name: 'Instalasi Septic Tank Baru',
    description: 'Layanan instalasi septic tank baru dengan sistem modern dan ramah lingkungan.',
    price: 2500000,
    duration: '1-2 hari',
    image: 'https://images.pexels.com/photos/5691660/pexels-photo-5691660.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['Septic tank berkualitas', 'Sistem modern', 'Ramah lingkungan', 'Garansi 2 tahun', 'Sertifikat instalasi']
  },
  {
    name: 'Perbaikan Pipa Tersumbat',
    description: 'Layanan perbaikan dan pembersihan pipa tersumbat menggunakan teknologi CCTV inspection.',
    price: 150000,
    duration: '2-4 jam',
    image: 'https://images.pexels.com/photos/8486943/pexels-photo-8486943.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['CCTV inspection', 'Pembersihan dengan mesin', 'Perbaikan kebocoran', 'Laporan kondisi pipa', 'Garansi 3 bulan']
  },
  {
    name: 'Sedot WC Industri',
    description: 'Layanan sedot WC untuk kawasan industri dan pabrik dengan volume besar dan jadwal rutin.',
    price: 500000,
    duration: '3-5 jam',
    image: 'https://images.pexels.com/photos/6195121/pexels-photo-6195121.jpeg?auto=compress&cs=tinysrgb&w=800',
    features: ['Kapasitas besar', 'Jadwal rutin', 'Sertifikat lingkungan', 'Tim profesional', 'Garansi 6 bulan']
  }
];

try {
  initialServices.forEach(service => {
    createService(service);
  });
  console.log('Database seeded with initial services successfully!');
} catch (error) {
  console.log('Error seeding database:', error.message);
}