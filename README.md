# Piring Waktu Frontend

Platform AI-powered untuk mengeksplorasi sejarah dan cerita di balik kuliner Nusantara. Aplikasi web modern yang menggabungkan asisten AI kuliner, komunitas pengguna, dan sistem autentikasi terintegrasi dengan Supabase.

## ✨ Fitur Utama

- **🏠 Landing Page** - Halaman utama dengan featured dishes dan informasi proyek
- **🤖 Dapur AI** - Asisten AI kuliner dengan kemampuan:
  - Chat streaming real-time dengan AI
  - Upload dan analisis gambar makanan/bahan
  - Rekomendasi resep berdasarkan bahan yang tersedia
  - Detail resep lengkap dengan sejarah dan langkah memasak
  - Sistem save dan mark as cooked untuk resep
- **👥 Komunitas** - Platform berbagi pengalaman memasak dan review resep
- **🔐 Autentikasi** - Sistem login/logout terintegrasi dengan Supabase Auth
- **👤 Profile** - Halaman profil pengguna dengan riwayat aktivitas

## 🛠 Teknologi

- **Next.js 16** (App Router) - React framework
- **React 19** - UI library
- **Tailwind CSS 4** - Styling framework
- **Radix UI** - Headless UI components
- **Supabase** - Backend as a Service (auth, database)
- **Vercel AI SDK** - AI integration utilities
- **Lucide React** - Icon library

## 📁 Struktur Proyek

```
app/
├── page.jsx                 # Landing page
├── layout.jsx              # Root layout
├── globals.css             # Global styles
├── dapur-ai/
│   └── page.jsx            # AI culinary assistant
├── komunitas/
│   └── page.jsx            # Community page
├── login/
│   └── page.jsx            # Login page
├── profile/
│   └── page.jsx            # User profile
└── auth/
    ├── callback/           # Auth callback
    ├── logout/             # Logout handler
    └── auth-code-error/    # Auth error handler

components/
├── ui/                     # Reusable UI components
│   ├── button.jsx
│   ├── card.jsx
│   ├── dialog.jsx
│   ├── input.jsx
│   └── ...
├── dapur-ai/              # Dapur AI specific components
│   ├── chat-header.jsx
│   ├── chat-input.jsx
│   ├── chat-messages.jsx
│   ├── recipe-card.jsx
│   ├── sidebar.jsx
│   └── ...
├── komunitas/             # Community components
├── header.jsx             # Main navigation
├── footer.jsx             # Site footer
└── featured-dishes.jsx    # Landing page dishes

lib/
├── utils.js               # Utility functions
└── supabase/             # Supabase integration
    ├── client.js         # Browser client
    └── server.js         # Server client
```

## 🚀 Quick Start

1. **Install dependencies:**
```bash
npm install
# atau
bun install
```

2. **Setup environment:**
```bash
cp .env.example .env
```

Isi variabel environment yang diperlukan:
```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
NEXT_PUBLIC_API_URL=http://localhost:8000
```

3. **Run development server:**
```bash
npm run dev
# atau
bun dev
```

Aplikasi akan berjalan di `http://localhost:3000`

## 📜 Available Scripts

- `dev` - Jalankan development server
- `build` - Build aplikasi untuk produksi
- `start` - Jalankan production server
- `lint` - Jalankan ESLint

## 🎨 UI Components

Proyek menggunakan komponen UI yang dibangun dengan Radix UI dan Tailwind CSS:

- **Form Components**: Input, Textarea, Select, Switch
- **Layout Components**: Card, Dialog, Tabs
- **Navigation**: Dropdown Menu, Navigation Menu
- **Feedback**: Toast, Progress, Alert Dialog
- **Data Display**: Avatar, Badge, Separator

Semua komponen menggunakan `cn()` utility untuk class merging dan mendukung dark mode.

## 🔗 Integrasi Backend

Frontend berkomunikasi dengan backend melalui:

- **Chat API**: Streaming chat dengan AI (`/api/chat/stream`)
- **Image Upload**: Upload gambar untuk analisis (`/api/chat/upload-image`)
- **Authentication**: JWT token dari Supabase Auth

## 🌟 Fitur Dapur AI

### Chat Interface
- Real-time streaming responses dari AI
- Support untuk upload multiple images
- Message history dengan session management
- Typing indicators dan loading states

### Recipe Management
- Save/unsave recipes
- Mark recipes as cooked dengan foto dan notes
- Recipe detail modal dengan informasi lengkap
- Recipe recommendations berdasarkan bahan

### Image Analysis
- Upload gambar bahan makanan
- AI analysis untuk identifikasi bahan
- Rekomendasi resep berdasarkan gambar

## 🤝 Contributing

1. Fork repository
2. Create feature branch: `git checkout -b feature/nama-fitur`
3. Commit changes: `git commit -m 'Add some feature'`
4. Push to branch: `git push origin feature/nama-fitur`
5. Submit pull request

## 📝 Development Notes

- Gunakan `npm run lint` sebelum commit
- Follow existing component patterns di `components/`
- Gunakan `cn()` utility untuk Tailwind classes
- Test responsive design di berbagai device sizes
- Pastikan accessibility compliance

## 🔧 Environment Variables

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Backend API
NEXT_PUBLIC_API_URL=http://localhost:8000
```