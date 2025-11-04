export const mockRecipes = {
  rendang: {
    id: "rendang",
    name: "Rendang Daging",
    region: "Minangkabau, Sumatera Barat",
    history:
      "Rendang adalah masakan tradisional dari Minangkabau yang telah masuk ke daftar 50 makanan terbaik dunia. Hidangan ini memiliki sejarah panjang sebagai warisan budaya kuliner Nusantara.",
    ingredients: [
      "Daging sapi 1 kg",
      "Santan 1 liter",
      "Cabai merah 10 buah",
      "Bawang merah 8 siung",
      "Bawang putih 5 siung",
      "Kunyit 3 cm",
      "Jahe 3 cm",
      "Garam secukupnya",
    ],
    steps: [
      "Potong daging menjadi ukuran sedang, cuci bersih dan tiriskan.",
      "Haluskan bumbu (cabai, bawang merah, bawang putih, kunyit, jahe) dan tumis hingga harum.",
      "Masukkan daging, aduk hingga berubah warna dan bumbu meresap.",
      "Tuang santan, masak dengan api kecil sambil sesekali diaduk hingga kuah menyusut dan bumbu meresap (beberapa jam untuk tekstur empuk).",
      "Tambahkan garam sesuai selera, masak hingga kuah mengental dan daging empuk.",
    ],
  },
  gudeg: {
    id: "gudeg",
    name: "Gudeg",
    region: "Yogyakarta, Jawa Tengah",
    history:
      "Gudeg adalah hidangan khas Yogyakarta yang terbuat dari nangka muda. Hidangan ini menjadi simbol kuliner Yogyakarta yang dipercaya telah ada sejak zaman Mataram Islam.",
    ingredients: [
      "Nangka muda 2 kg",
      "Santan 1 liter",
      "Bawang merah 8 siung",
      "Bawang putih 5 siung",
      "Cabai merah 5 buah",
      "Kunyit 2 cm",
      "Garam secukupnya",
    ],
    steps: [
      "Rebus nangka muda hingga empuk, tiriskan.",
      "Tumis bumbu halus hingga harum, masukkan nangka dan santan.",
      "Masak dengan api kecil selama beberapa jam hingga bumbu meresap dan warna kecokelatan khas gudeg muncul.",
      "Tambahkan garam sesuai selera, sajikan dengan sambal krecek dan lauk pelengkap.",
    ],
  },
  satay: {
    id: "satay",
    name: "Sate Lilit",
    region: "Bali",
    history:
      "Sate Lilit adalah makanan tradisional Bali yang terbuat dari daging cincang yang ditarik pada sebuah lidi. Makanan ini biasanya disajikan pada acara-acara khusus di Bali.",
    ingredients: [
      "Daging babi giling 500g",
      "Kelapa parut 200g",
      "Bawang merah 5 siung",
      "Bawang putih 3 siung",
      "Cabai 3 buah",
      "Garam secukupnya",
      "Lidi",
    ],
    steps: [
      "Campur daging cincang, kelapa parut, dan bumbu halus hingga rata.",
      "Ambil sedikit adonan dan lilitkan pada lidi hingga rata.",
      "Bakar sate di atas bara hingga matang dan berwarna kecokelatan.",
      "Sajikan hangat bersama sambal matah atau pelengkap lainnya.",
    ],
  },
  "nasi-goreng": {
    id: "nasi-goreng",
    name: "Nasi Goreng",
    region: "Indonesia",
    history:
      "Nasi goreng adalah hidangan nasi yang digoreng dengan bumbu-bumbu khas Indonesia. Hidangan ini populer di seluruh nusantara dan sering disajikan sebagai menu sarapan atau makan malam sederhana.",
    ingredients: [
      "Nasi putih 2 piring",
      "Telur 2 butir",
      "Bawang merah 3 siung",
      "Bawang putih 2 siung",
      "Kecap manis 2 sdm",
      "Garam & merica secukupnya",
    ],
    steps: [
      "Panaskan minyak, tumis bawang putih dan bawang merah hingga harum.",
      "Masukkan telur, orak-arik hingga matang.",
      "Tambahkan nasi putih dan kecap manis, aduk rata.",
      "Bumbui dengan garam dan merica, masak hingga nasi tercampur rata dan sedikit kering.",
    ],
  },
  soto: {
    id: "soto",
    name: "Soto Ayam",
    region: "Indonesia",
    history:
      "Soto ayam adalah sup tradisional Indonesia yang menggunakan kaldu ayam berbumbu kuning. Terdapat banyak variasi soto di berbagai daerah di Indonesia.",
    ingredients: [
      "Ayam 1 ekor",
      "Bawang merah 6 siung",
      "Bawang putih 4 siung",
      "Kunyit 4 cm",
      "Jahe 3 cm",
      "Serai 2 batang",
      "Garam & merica secukupnya",
    ],
    steps: [
      "Rebus ayam hingga empuk, suwir-suwir dagingnya.",
      "Tumis bumbu halus (bawang, kunyit, jahe) hingga harum, masukkan ke dalam kaldu ayam.",
      "Tambahkan serai dan masak beberapa menit agar bumbu meresap.",
      "Sajikan dengan suwiran ayam, nasi atau lontong, dan pelengkap seperti daun bawang dan bawang goreng.",
    ],
  },
}

export const mockLists = [
  { id: "rendang", name: "Rendang Daging", region: "Minangkabau" },
  { id: "gudeg", name: "Gudeg", region: "Yogyakarta" },
  { id: "satay", name: "Sate Lilit", region: "Bali" },
]