-- Insert initial recipes data
INSERT INTO public.recipes (id, name, region, history, ingredients, steps, difficulty_level, prep_time_minutes, cook_time_minutes, servings, tags) VALUES
(
  'rendang-001',
  'Rendang Daging',
  'Minangkabau, Sumatera Barat',
  'Rendang adalah masakan tradisional dari Minangkabau yang telah masuk ke daftar 50 makanan terbaik dunia. Hidangan ini memiliki sejarah panjang sebagai warisan budaya kuliner Nusantara.',
  '["Daging sapi 1 kg", "Santan 1 liter", "Cabai merah 10 buah", "Bawang merah 8 siung", "Bawang putih 5 siung", "Kunyit 3 cm", "Jahe 3 cm", "Garam secukupnya"]',
  '["Potong daging menjadi ukuran sedang, cuci bersih dan tiriskan.", "Haluskan bumbu (cabai, bawang merah, bawang putih, kunyit, jahe) dan tumis hingga harum.", "Masukkan daging, aduk hingga berubah warna dan bumbu meresap.", "Tuang santan, masak dengan api kecil sambil sesekali diaduk hingga kuah menyusut dan bumbu meresap (beberapa jam untuk tekstur empuk).", "Tambahkan garam sesuai selera, masak hingga kuah mengental dan daging empuk."]',
  4,
  30,
  180,
  6,
  '["pedas", "tradisional", "daging", "santan"]'
),
(
  'gudeg-001',
  'Gudeg',
  'Yogyakarta, Jawa Tengah',
  'Gudeg adalah hidangan khas Yogyakarta yang terbuat dari nangka muda. Hidangan ini menjadi simbol kuliner Yogyakarta yang dipercaya telah ada sejak zaman Mataram Islam.',
  '["Nangka muda 2 kg", "Santan 1 liter", "Bawang merah 8 siung", "Bawang putih 5 siung", "Cabai merah 5 buah", "Kunyit 2 cm", "Garam secukupnya"]',
  '["Rebus nangka muda hingga empuk, tiriskan.", "Tumis bumbu halus hingga harum, masukkan nangka dan santan.", "Masak dengan api kecil selama beberapa jam hingga bumbu meresap dan warna kecokelatan khas gudeg muncul.", "Tambahkan garam sesuai selera, sajikan dengan sambal krecek dan lauk pelengkap."]',
  3,
  45,
  240,
  8,
  '["manis", "tradisional", "vegetarian", "santan"]'
),
(
  'sate-lilit-001',
  'Sate Lilit',
  'Bali',
  'Sate Lilit adalah makanan tradisional Bali yang terbuat dari daging cincang yang ditarik pada sebuah lidi. Makanan ini biasanya disajikan pada acara-acara khusus di Bali.',
  '["Daging babi giling 500g", "Kelapa parut 200g", "Bawang merah 5 siung", "Bawang putih 3 siung", "Cabai 3 buah", "Garam secukupnya", "Lidi"]',
  '["Campur daging cincang, kelapa parut, dan bumbu halus hingga rata.", "Ambil sedikit adonan dan lilitkan pada lidi hingga rata.", "Bakar sate di atas bara hingga matang dan berwarna kecokelatan.", "Sajikan hangat bersama sambal matah atau pelengkap lainnya."]',
  3,
  20,
  15,
  4,
  '["bakar", "tradisional", "daging", "pedas"]'
),
(
  'nasi-goreng-001',
  'Nasi Goreng',
  'Indonesia',
  'Nasi goreng adalah hidangan nasi yang digoreng dengan bumbu-bumbu khas Indonesia. Hidangan ini populer di seluruh nusantara dan sering disajikan sebagai menu sarapan atau makan malam sederhana.',
  '["Nasi putih 2 piring", "Telur 2 butir", "Bawang merah 3 siung", "Bawang putih 2 siung", "Kecap manis 2 sdm", "Garam & merica secukupnya"]',
  '["Panaskan minyak, tumis bawang putih dan bawang merah hingga harum.", "Masukkan telur, orak-arik hingga matang.", "Tambahkan nasi putih dan kecap manis, aduk rata.", "Bumbui dengan garam dan merica, masak hingga nasi tercampur rata dan sedikit kering."]',
  2,
  10,
  15,
  2,
  '["cepat", "mudah", "nasi", "telur"]'
),
(
  'soto-ayam-001',
  'Soto Ayam',
  'Indonesia',
  'Soto ayam adalah sup tradisional Indonesia yang menggunakan kaldu ayam berbumbu kuning. Terdapat banyak variasi soto di berbagai daerah di Indonesia.',
  '["Ayam 1 ekor", "Bawang merah 6 siung", "Bawang putih 4 siung", "Kunyit 4 cm", "Jahe 3 cm", "Serai 2 batang", "Garam & merica secukupnya"]',
  '["Rebus ayam hingga empuk, suwir-suwir dagingnya.", "Tumis bumbu halus (bawang, kunyit, jahe) hingga harum, masukkan ke dalam kaldu ayam.", "Tambahkan serai dan masak beberapa menit agar bumbu meresap.", "Sajikan dengan suwiran ayam, nasi atau lontong, dan pelengkap seperti daun bawang dan bawang goreng."]',
  3,
  20,
  60,
  4,
  '["sup", "tradisional", "ayam", "kuning"]'
);