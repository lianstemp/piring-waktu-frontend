Piring Waktu
===============

Piring Waktu adalah sebuah web aplikasi yang bertujuan menjadi platform AI-powered untuk mengeksplorasi sejarah dan cerita di balik kuliner Nusantara. Proyek ini menggabungkan antarmuka komunitas, fitur autentikasi sederhana, dan sebuah halaman asisten AI (Dapur AI) yang dapat dijadikan dasar untuk eksperimen lebih lanjut.

Fitur utama
-----------
- Halaman landing yang menampilkan hidangan unggulan dan informasi tentang proyek.
- Komponen UI modular (button, card, input, textarea, tabs) yang dibangun dengan Tailwind CSS.
- Halaman "Dapur AI" (`/dapur-ai`) sebagai mock asisten percakapan untuk menjelajahi resep dan sejarah kuliner.
- Halaman komunitas sederhana (`/komunitas`) beserta mekanisme review baru (tempat untuk pengembangan lebih lanjut).
- Autentikasi dasar (halaman login / logout / profile) sebagai titik awal integrasi otentikasi nyata.

Teknologi
---------
- Next.js (App Router)
- JSX (React components in .jsx / .js files)
- Tailwind CSS
- Komponen UI berada di folder `components/` (shadcn-style)
- Font: Geist via `next/font`

Struktur penting
----------------
- `app/` - route dan halaman utama aplikasi (App Router)
	- `app/page.jsx` - landing page
	- `app/dapur-ai/page.jsx` - halaman Dapur AI (client-side, mock chat)
	- `app/komunitas/` - halaman komunitas dan review
	- `app/login`, `app/profile`, `app/auth/` - halaman autentikasi / profil
- `components/` - komponen UI dan bagian halaman (header, footer, featured-dishes, dll.)
- `components/ui/` - komponen UI kecil yang dapat dipakai ulang (input, textarea, button, card, tabs)
- `lib/utils.js` - util helper (mis. `cn` untuk className)
- `lib/supabase/` - helper untuk integrasi Supabase (browser/server clients)
- `public/` - aset statis (logo, gambar, dsb.)

Menjalankan proyek (lokal)
-------------------------
Pastikan Anda sudah menginstall dependensi (npm / pnpm / yarn / bun). Contoh (npm):

```bash
npm install
npm run dev
```

Perintah penting di `package.json`:
- `dev` — jalankan Next.js dalam mode development
- `build` — bangun aplikasi untuk produksi
- `start` — jalankan server produksi setelah build
- `lint` — jalankan ESLint

Konfigurasi lingkungan
----------------------
- Salin file `.env.example` ke `.env` dan isi variabel yang diperlukan (mis. Supabase):

```
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

Catatan pengembangan
--------------------
- Proyek menggunakan komponen client-side (React) dengan ekstensi `.jsx` / `.js` — bukan TypeScript. Jika Anda mencari file sumber, periksalah `app/` dan `components/`.
- Komponen UI menggunakan variabel CSS di `app/globals.css` dan util `cn` di `lib/utils.js`.
- Integrasi Supabase terdapat di `lib/supabase/` (`client.js` untuk browser, `server.js` untuk server-side helpers).
- Proyek ini adalah starter/prototipe: beberapa fitur (penyimpanan resep penuh, autentikasi production-ready, API backend) masih memerlukan implementasi/penyesuaian.

Panduan kontribusi singkat
-------------------------
1. Fork repo dan buat branch fitur: `git checkout -b feature/nama-fitur`
2. Tambahkan perubahan dan test secara lokal
3. Buka pull request dengan deskripsi perubahan

Quality gates & tips
--------------------
- Pastikan linter: `npm run lint` sebelum mengirim PR.
- Ikuti pola komponen yang ada di `components/` dan gunakan util `cn` untuk kelas Tailwind.


Dapur AI — ringkasan fitur (flow & kontrak)
-----------------------------------------
Fitur "Dapur AI" (`/dapur-ai`) membantu pengguna menemukan resep berdasarkan bahan (teks) atau foto bahan.

Alur pengguna (singkat)
- Input: pengguna memasukkan daftar bahan (teks) atau mengunggah foto.
- Analisis: AI/servis mengidentifikasi bahan lalu mencocokkannya dengan kumpulan resep.
- Rekomendasi: tampilkan daftar rekomendasi dengan nama, asal, dan preview.
- Pilih: user membuka detail resep yang berisi nama, asal, sejarah singkat, bahan lengkap, langkah, gambar, dan tombol aksi (TTS, Simpan, Tandai Sudah Dimasak).

Integrasi komunitas
- Ketika pengguna menandai "Sudah Dimasak" dan mengirim foto/review, data tersebut bisa muncul di modul komunitas (`/komunitas`) untuk ditampilkan ke pengguna lain.

Catatan akhir
------------
Jika Anda ingin bantuan memperbarui README lebih lanjut (mis. menambahkan instruksi deploy, badge CI, atau contoh environment untuk Supabase), beri tahu saya dan saya akan menambahkannya.
