# 🏥 Medeva - Room Category Management System

Aplikasi **Room Category Management** untuk rumah sakit/klinik dengan fitur **Role-Based Access Control**, built with **React 19 + Vite** (frontend) dan **Express 5** (backend).

**GitHub**: https://github.com/caklem/Test_Medeva  
**Status**: ✅ Production Ready (In-Memory Mock Data)

---

## 🎯 Fitur Utama

### ✅ Autentikasi & RBAC
- **JWT-based authentication** dengan token yang disimpan di localStorage
- **Role-based permissions**:
  - **Admin**: dapat create, read, update, delete kategori ruangan
  - **User**: hanya dapat read (view) data kategori ruangan
- Middleware untuk verifikasi token pada endpoint sensitif

### ✅ Manajemen Kategori Ruangan
- **List Kategori**: Tampilan grid dengan pagination dan search
- **Filter Status**: Filter by status (Semua, Aktif, Non-Aktif)
- **Tambah Kategori**: Form inline di panel kanan untuk menambah kategori (admin only)
- **Detail View**: Panel kanan menampilkan detail kategori yang dipilih
- **Form Fields**:
  - Nama/Nomor Ruangan (required)
  - Kelas Ruangan (Jingga, Ocean Blue, Clover)
  - Harga Ruangan
  - Fasilitas (AC, TV, WiFi, Kamar Mandi, dll) - 8 checkboxes
  - Jenis Kelamin (Semua, Laki-laki, Perempuan)
  - Usia (Semua, Anak, Dewasa)
  - Penyakit (Infeksius, Non-Infeksius)

### ✅ Responsive Design
- **Desktop** (≥1024px): Full layout dengan sidebar + list + detail panel
- **Tablet** (≥768px): Compact view
- **Mobile** (<768px): Optimized for small screens

### ✅ Database Schema (Relational)
- **klinik**: Informasi klinik/rumah sakit
- **users**: Pengguna dengan role-based permissions
- **kelas_ruangan**: Kategori ruangan (Jingga, Ocean Blue, Clover, dll)
- **kategori_ruangan**: Detail kategori ruangan dengan relasi ke kelas_ruangan

---

## 📁 Struktur Proyek

```
Test-Medeva/
├── backend/
│   ├── app.js                      # Express server entry point
│   ├── .env                        # Environment variables
│   ├── package.json
│   │
│   ├── controllers/
│   │   ├── authControllers.js      # Login logic
│   │   └── categoryControllers.js  # CRUD kategori ruangan
│   │
│   ├── routes/
│   │   ├── authRoutes.js           # POST /api/auth/login
│   │   └── categoryRoutes.js       # CRUD endpoints
│   │
│   ├── middleware/
│   │   ├── authMiddleware.js       # JWT verification
│   │   └── roleMiddleware.js       # RBAC enforcement (isAdmin)
│   │
│   └── data/                       # In-memory mock data
│       ├── klinik.js               # Master clinic data
│       ├── users.js                # User accounts (admin, user)
│       ├── kelas_ruangan.js        # Room classes
│       └── categories.js           # Room categories
│
└── frontend/
    ├── vite.config.js              # Vite config dengan alias & proxy
    ├── eslint.config.js            # ESLint flat config v10
    ├── package.json
    ├── index.html
    │
    └── src/
        ├── main.jsx                # React entry point
        ├── App.jsx                 # Router setup (Login, Dashboard)
        ├── pages/
        │   ├── login.jsx           # Login page
        │   └── Categories.jsx      # Main dashboard
        │
        ├── services/
        │   └── api.js              # Axios instance dengan interceptors
        │
        ├── styles/
        │   ├── index.css
        │   ├── App.css
        │   └── Categories.css      # Custom CSS (600+ lines)
        │
        └── components/ui/
            ├── button.jsx
            ├── input.jsx
            ├── checkbox.jsx
            └── label.jsx
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js v18+ 
- npm atau yarn
- Git

### Backend Setup

```bash
cd backend
npm install

# Environment sudah di-configure, cek .env
cat .env

# Start server dengan auto-reload
npm run dev
```

**Output:**
```
Server running on port 3000
```

### Frontend Setup (Terminal Baru)

```bash
cd frontend
npm install

# Start development server
npm run dev
```

**Output:**
```
VITE v8.0.14 ready in 293 ms
  ➜  Local:   http://localhost:5174/
```

### ✅ Verifikasi Aplikasi

1. Buka **http://localhost:5174** di browser
2. Login dengan:
   - **Admin**: `admin` / `123456`
   - **User**: `user` / `123456`
3. Masuk ke dashboard dan lihat list kategori ruangan
4. Klik "Tambah" untuk membuka form (admin only)
5. Klik kategori di list untuk lihat detail

---

## 📚 API Documentation

### Base URL
```
http://localhost:3000/api
```

### Authentication

#### POST `/auth/login`
Login dan dapatkan JWT token.

**Request:**
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"123456"}'
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "nama_lengkap": "Admin Medeva",
    "is_admin": true
  }
}
```

**Error (401 Unauthorized):**
```json
{
  "success": false,
  "message": "Username atau password salah"
}
```

---

### Kategori Ruangan Endpoints

#### GET `/kategori-ruangan`
Dapatkan daftar kategori ruangan dengan pagination & filter.

**Request:**
```bash
curl -X GET "http://localhost:3000/api/kategori-ruangan?page=1&perPage=5&search=&status=semua" \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Query Parameters:**

| Parameter | Type | Default | Description |
|-----------|------|---------|-------------|
| page | number | 1 | Halaman ke-n |
| perPage | number | 5 | Item per halaman |
| search | string | "" | Cari by nama_ruangan |
| status | string | "semua" | "semua", "aktif", "non-aktif" |

**Response (200 OK):**
```json
{
  "success": true,
  "page": 1,
  "perPage": 5,
  "totalData": 3,
  "totalPage": 1,
  "data": [
    {
      "id": 1,
      "id_klinik": 1,
      "id_kelas_ruangan": 1,
      "jenis_kelamin": "Perempuan",
      "usia": "Dewasa",
      "penyakit": "Non-Infeksius",
      "nama_ruangan": "Ruangan ABC",
      "harga_ruangan": 500000,
      "fasilitas_ruangan": {
        "ac": true,
        "tv": true,
        "wifi": true
      },
      "is_active": false,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

---

#### GET `/kategori-ruangan/:id`
Dapatkan detail kategori ruangan by ID.

**Request:**
```bash
curl -X GET http://localhost:3000/api/kategori-ruangan/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "data": { /* kategori object */ }
}
```

**Error (404 Not Found):**
```json
{
  "success": false,
  "message": "Kategori ruangan tidak ditemukan"
}
```

---

#### POST `/kategori-ruangan` (**Admin Only**)
Tambah kategori ruangan baru.

**Request:**
```bash
curl -X POST http://localhost:3000/api/kategori-ruangan \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "id_kelas_ruangan": 1,
    "jenis_kelamin": "Perempuan",
    "usia": "Dewasa",
    "penyakit": "Non-Infeksius",
    "nama_ruangan": "Ruangan Baru",
    "harga_ruangan": 500000,
    "fasilitas_ruangan": {
      "ac": true,
      "tv": true,
      "wifi": false
    }
  }'
```

**Response (201 Created):**
```json
{
  "success": true,
  "message": "Kategori ruangan berhasil ditambahkan",
  "data": { /* created kategori */ }
}
```

---

#### PUT `/kategori-ruangan/:id` (**Admin Only**)
Update kategori ruangan (partial update).

**Request:**
```bash
curl -X PUT http://localhost:3000/api/kategori-ruangan/1 \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "nama_ruangan": "Updated Name",
    "harga_ruangan": 600000,
    "is_active": true
  }'
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Kategori ruangan berhasil diupdate",
  "data": { /* updated kategori */ }
}
```

---

#### DELETE `/kategori-ruangan/:id` (**Admin Only**)
Hapus kategori ruangan.

**Request:**
```bash
curl -X DELETE http://localhost:3000/api/kategori-ruangan/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

**Response (200 OK):**
```json
{
  "success": true,
  "message": "Kategori ruangan berhasil dihapus",
  "data": { /* deleted kategori */ }
}
```

---

## 🔐 Test Credentials

| Role | Username | Password | Akses |
|------|----------|----------|-------|
| **Admin** | `admin` | `123456` | Create, Read, Update, Delete |
| **User** | `user` | `123456` | Read Only |

### Permission Matrix

| Aksi | Admin | User |
|------|-------|------|
| GET /kategori-ruangan | ✅ | ✅ |
| GET /kategori-ruangan/:id | ✅ | ✅ |
| POST /kategori-ruangan | ✅ | ❌ |
| PUT /kategori-ruangan/:id | ✅ | ❌ |
| DELETE /kategori-ruangan/:id | ✅ | ❌ |

---

## 🗄️ Database Schema

### klinik
```javascript
{
  id: 1,
  nama: "Klinik Sjamsudin Noor",
  alamat: "Banjarmasin",
  kode_auth: "MEDEVA-AUTH-2026",
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z"
}
```

### users
```javascript
{
  id: 1,
  id_klinik: 1,
  nama_lengkap: "Admin Medeva",
  email: "admin@medeva.com",
  username: "admin",
  password: "123456",  // plaintext untuk development
  is_admin: true,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z"
}
```

### kelas_ruangan
```javascript
// Available classes
[
  { id: 1, id_klinik: 1, nama_kelas: "Jingga", is_active: true },
  { id: 2, id_klinik: 1, nama_kelas: "Ocean Blue", is_active: true },
  { id: 3, id_klinik: 1, nama_kelas: "Clover", is_active: true }
]
```

### kategori_ruangan
```javascript
{
  id: 1,
  id_klinik: 1,
  id_kelas_ruangan: 1,
  jenis_kelamin: "Perempuan",
  usia: "Dewasa",
  penyakit: "Non-Infeksius",
  nama_ruangan: "Ruangan ABC",
  harga_ruangan: 500000,
  fasilitas_ruangan: {
    ac: true,
    tv: true,
    wifi: true,
    kamar_mandi: true,
    kulkas: false,
    kasur_single: true,
    kasur_double: false,
    toiletries: true
  },
  is_active: false,
  created_at: "2026-01-01T00:00:00.000Z",
  updated_at: "2026-01-01T00:00:00.000Z"
}
```

---

## 🛠️ Technology Stack

### Frontend
- **React** 19.2.6 - UI library
- **Vite** 8.0.12 - Build tool & dev server (HMR)
- **React Router** 7.15.1 - Client-side routing
- **Axios** 1.16.1 - HTTP client with interceptors
- **Tailwind CSS** 3.4.19 - Utility CSS
- **Lucide React** 1.16.0 - Icon library
- **ESLint** 10.3.0 - Code linting (flat config)

### Backend
- **Express** 5.0.0 - Web framework
- **Node.js** 18+ - Runtime
- **jsonwebtoken** 9.0.3 - JWT generation
- **dotenv** - Environment variables
- **cors** - Cross-origin requests
- **nodemon** - Auto-reload development

### Data
- **In-Memory** - Mock data storage (JavaScript arrays)
- Ready to migrate: PostgreSQL, MongoDB, SQLite

---

## 🎨 Frontend Features

### Pages

#### `/` - Login Page
- Form: username, password, klinik ID, reCAPTCHA
- JWT token storage & localStorage persistence
- Auto-redirect ke `/dashboard` after login

#### `/dashboard` - Categories Management

**Left Panel (Kategori List)**:
- Status filter: Semua / Aktif / Non-Aktif
- Search by nama_ruangan
- Pagination (5 items default)
- Click untuk select & view detail
- Nomer urut otomatis

**Right Panel (Detail / Form)**:
- **Detail Mode**: Display kategori details saat dipilih
- **Form Mode**: Inline form untuk tambah kategori
- **Empty State**: Guidance text saat tidak ada selection

**Header**:
- Klinik name (Klinik Sjamsudin Noor)
- Logo & branding (Medeva Mint)
- Notification bell icon
- User profile section
- Logout button

**Sidebar**:
- Navigation icon (Rawat Inap)
- Menu structure ready for expansion

### Styling
- **Custom CSS** (Categories.css) dengan semantic naming
- **Tailwind** untuk layout responsiveness
- **Color Scheme**:
  - Primary: Teal (#4DC9C1)
  - Accent: Gold (#FFD700)
  - Action: Blue (#4AABF0)
  - Status: Green (Aktif), Gray (Non-Aktif)

---

## ⚙️ Configuration

### Backend (.env)
```env
PORT=3000
JWT_SECRET=medeva_secret_key
NODE_ENV=development
```

### Frontend (vite.config.js)
```javascript
// Alias
@ → src/

// Proxy
/api → http://localhost:3000/api

// React plugin
@vitejs/plugin-react
```

---

## 🔄 Development Workflow

### Terminal 1 (Backend)
```bash
cd backend
npm run dev

# Output:
# Server running on port 3000
```

### Terminal 2 (Frontend)
```bash
cd frontend
npm run dev

# Output:
# VITE ready at http://localhost:5174/
```

### Hot Reload
- **Backend**: Nodemon watches for file changes
- **Frontend**: Vite HMR with instant updates

---

## 📝 Production Checklist

- [ ] Replace in-memory arrays with real database
- [ ] Implement password hashing (bcryptjs)
- [ ] Add environment-based API endpoint config
- [ ] Setup HTTPS & CORS whitelist
- [ ] Add request/response logging
- [ ] Implement refresh token flow
- [ ] Add rate limiting & validation
- [ ] Setup error tracking (Sentry, etc.)
- [ ] Configure CDN for static assets
- [ ] Add monitoring & health checks

---

## 🐛 Troubleshooting

### Backend Won't Start
```bash
# Check port 3000 is free
netstat -ano | findstr :3000

# Kill process on Windows
taskkill /PID <PID> /F

# Restart
cd backend && npm run dev
```

### Frontend Can't Reach API
- Verify backend running: `http://localhost:3000`
- Check vite.config.js proxy setup
- Clear cache: `Ctrl+Shift+Delete` then restart

### Login Issues
```javascript
// Check localStorage for token
localStorage.getItem('token')

// Verify token format
// Should start with: "eyJ..."
```

### Port Already in Use
- Frontend auto-tries next port (5174, 5175, etc.)
- Backend: Change PORT in `.env` file

---

## 📖 Key Files Reference

| File | Purpose | Lines |
|------|---------|-------|
| [backend/app.js](backend/app.js) | Server setup & routing | ~35 |
| [backend/controllers/categoryControllers.js](backend/controllers/categoryControllers.js) | CRUD logic | ~150 |
| [frontend/src/App.jsx](frontend/src/App.jsx) | React routing | ~30 |
| [frontend/src/pages/Categories.jsx](frontend/src/pages/Categories.jsx) | Main dashboard | ~1000+ |
| [frontend/src/styles/Categories.css](frontend/src/styles/Categories.css) | Custom styling | ~600+ |

---

## 🤝 Git Workflow

### View History
```bash
git log --oneline -10
```

### Make Changes
```bash
git add .
git commit -m "feat: add new feature"
git push origin main
```

### Push to GitHub
```bash
# Already configured at origin
git push
```

---

## 📞 Support & Documentation

### Check Logs
1. **Backend**: Terminal where `npm run dev` runs
2. **Frontend**: Browser DevTools (F12 → Console)
3. **Network**: Browser DevTools (F12 → Network tab)

### API Testing
- Use cURL examples above
- Or use Postman: https://www.postman.com/
- Import endpoints from this README

---

**Last Updated**: May 28, 2026  
**Repository**: https://github.com/caklem/Test_Medeva  
**Author**: Medeva Development Team  
**License**: All rights reserved


---

## Struktur Proyek

```
Test-Medeva/
├── backend/                    # Express.js server
│   ├── app.js                 # Main server file
│   ├── package.json
│   ├── .env
│   ├── controllers/           # Business logic
│   │   ├── authControllers.js
│   │   └── categoryControllers.js
│   ├── routes/                # API endpoints
│   │   ├── authRoutes.js
│   │   └── categoryRoutes.js
│   ├── middleware/            # Custom middleware
│   │   ├── authMiddleware.js  # JWT verification
│   │   └── roleMiddleware.js  # RBAC enforcement
│   └── data/                  # Mock data (in-memory)
│       ├── users.js
│       ├── klinik.js
│       ├── kelas_ruangan.js
│       └── categories.js
│
└── frontend/                   # React.js + Vite
    ├── vite.config.js
    ├── package.json
    ├── index.html
    ├── eslint.config.js
    ├── src/
    │   ├── main.jsx
    │   ├── App.jsx
    │   ├── pages/
    │   │   ├── login.jsx
    │   │   └── Categories.jsx
    │   ├── services/
    │   │   └── api.js        # Axios API client
    │   ├── styles/
    │   │   └── Categories.css
    │   └── components/
    │       └── ui/           # UI component wrappers
```

---

## Setup & Installation

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Create `.env` file**:
   ```env
   PORT=3000
   JWT_SECRET=medeva_secret_key
   NODE_ENV=development
   ```

4. **Start development server**:
   ```bash
   npm run dev
   ```
   Server akan berjalan di `http://localhost:3000`

### Frontend Setup

1. **Navigate to frontend directory** (di terminal baru):
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Start development server**:
   ```bash
   npm run dev
   ```
   Aplikasi akan accessible di `http://localhost:5173`

---

## Environment Variables

### Backend (.env)
```env
PORT=3000
JWT_SECRET=medeva_secret_key
NODE_ENV=development
```

### Frontend (vite.config.js - proxy)
Sudah dikonfigurasi untuk forward API calls ke backend:
```javascript
proxy: {
  '/api': 'http://localhost:3000'
}
```

---

## API Endpoints

### Authentication

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| POST | `/api/auth/login` | ❌ | - | Login dengan username/password |

**Request Body**:
```json
{
  "username": "admin",
  "password": "123456"
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Login berhasil",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "username": "admin",
    "nama_lengkap": "Admin Medeva",
    "is_admin": true
  }
}
```

### Kategori Ruangan

| Method | Endpoint | Auth | Role | Description |
|--------|----------|------|------|-------------|
| GET | `/api/kategori-ruangan` | ✅ | User/Admin | Get daftar ruangan (dengan pagination & filter) |
| GET | `/api/kategori-ruangan/:id` | ✅ | User/Admin | Get detail ruangan by ID |
| POST | `/api/kategori-ruangan` | ✅ | **Admin** | Create ruangan baru |
| PUT | `/api/kategori-ruangan/:id` | ✅ | **Admin** | Update ruangan |
| DELETE | `/api/kategori-ruangan/:id` | ✅ | **Admin** | Delete ruangan |

#### GET /api/kategori-ruangan (List dengan pagination & filter)

**Query Parameters**:
```
?page=1&perPage=5&search=ruangan&status=semua
```

- `page`: Halaman (default: 1)
- `perPage`: Item per halaman (default: 5)
- `search`: Cari berdasarkan `nama_ruangan`
- `status`: Filter by status (`semua`, `aktif`, `non-aktif`)

**Response (200 OK)**:
```json
{
  "success": true,
  "page": 1,
  "perPage": 5,
  "totalData": 3,
  "totalPage": 1,
  "data": [
    {
      "id": 1,
      "id_klinik": 1,
      "id_kelas_ruangan": 1,
      "jenis_kelamin": "Perempuan",
      "usia": "Dewasa",
      "penyakit": "Non-Infeksius",
      "nama_ruangan": "Ruangan ABC",
      "harga_ruangan": 500000,
      "fasilitas_ruangan": { "ac": true },
      "is_active": false,
      "created_at": "2026-01-01T00:00:00.000Z",
      "updated_at": "2026-01-01T00:00:00.000Z"
    }
  ]
}
```

#### POST /api/kategori-ruangan (Create)

**Request Body**:
```json
{
  "id_kelas_ruangan": 1,
  "jenis_kelamin": "Perempuan",
  "usia": "Dewasa",
  "penyakit": "Non-Infeksius",
  "nama_ruangan": "Ruangan ABC",
  "harga_ruangan": 500000,
  "fasilitas_ruangan": { "ac": true, "tv": true }
}
```

**Response (201 Created)**:
```json
{
  "success": true,
  "message": "Kategori ruangan berhasil ditambahkan",
  "data": { ...ruangan created }
}
```

#### PUT /api/kategori-ruangan/:id (Update)

**Request Body** (partial update):
```json
{
  "nama_ruangan": "Ruangan ABC Updated",
  "harga_ruangan": 600000,
  "is_active": true
}
```

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Kategori ruangan berhasil diupdate",
  "data": { ...ruangan updated }
}
```

#### DELETE /api/kategori-ruangan/:id (Delete)

**Response (200 OK)**:
```json
{
  "success": true,
  "message": "Kategori ruangan berhasil dihapus",
  "data": { ...ruangan deleted }
}
```

---

## Hardcoded Test Credentials

### Admin Account
- **Username**: `admin`
- **Password**: `123456`
- **Role**: Admin (dapat create/edit/delete)

### User Account
- **Username**: `user`
- **Password**: `123456`
- **Role**: User (hanya bisa baca)

---

## Database Schema

### Data Structure (In-Memory)

#### users
```javascript
{
  id: 1,
  id_klinik: 1,
  nama_lengkap: "Admin Medeva",
  email: "admin@medeva.com",
  username: "admin",
  password: "123456",
  is_admin: true,
  created_at: Date,
  updated_at: Date
}
```

#### klinik
```javascript
{
  id: 1,
  nama: "Klinik Sjamsudin Noor",
  alamat: "Banjarmasin",
  kode_auth: "MEDEVA-AUTH-2026",
  created_at: Date,
  updated_at: Date
}
```

#### kelas_ruangan
```javascript
{
  id: 1,
  id_klinik: 1,
  nama_kelas: "Jingga",
  is_active: true,
  created_at: Date,
  updated_at: Date
}
```

#### kategori_ruangan
```javascript
{
  id: 1,
  id_klinik: 1,
  id_kelas_ruangan: 1,
  jenis_kelamin: "Perempuan",
  usia: "Dewasa",
  penyakit: "Non-Infeksius",
  nama_ruangan: "Ruangan ABC",
  harga_ruangan: 500000,
  fasilitas_ruangan: { ac: true, tv: true },
  is_active: false,
  created_at: Date,
  updated_at: Date
}
```

---

## Frontend Integration

### API Client Setup

File: `frontend/src/services/api.js`

```javascript
import axios from 'axios';

const API_BASE_URL = 'http://localhost:3000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
});

// Add JWT token to requests
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

### Usage Example (React Component)

```javascript
import api from '@/services/api';

// Get list kategori
const response = await api.get('/kategori-ruangan', {
  params: {
    page: 1,
    perPage: 5,
    search: 'ruangan',
    status: 'aktif'
  }
});

// Create kategori (Admin only)
await api.post('/kategori-ruangan', {
  nama_ruangan: 'Ruangan Baru',
  id_kelas_ruangan: 1,
  // ... other fields
});

// Update kategori (Admin only)
await api.put(`/kategori-ruangan/${id}`, {
  nama_ruangan: 'Updated Name',
  is_active: true
});

// Delete kategori (Admin only)
await api.delete(`/kategori-ruangan/${id}`);
```

---

## Testing the API

### Using cURL

**Login**:
```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"123456"}'
```

**Get Kategori List**:
```bash
curl -X GET "http://localhost:3000/api/kategori-ruangan?page=1&perPage=5" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Create Kategori**:
```bash
curl -X POST http://localhost:3000/api/kategori-ruangan \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "id_kelas_ruangan": 1,
    "nama_ruangan": "Test Room",
    "jenis_kelamin": "Perempuan",
    "usia": "Dewasa",
    "penyakit": "Non-Infeksius",
    "harga_ruangan": 500000
  }'
```

---

## Architecture & Design Decisions

### Backend Architecture
- **Layered Architecture**: Routes → Controllers → Data
- **Middleware Pattern**: Auth & RBAC enforcement via middleware
- **In-Memory Data**: Mock data stored in JavaScript arrays (resets on server restart)
- **JWT-based Auth**: Stateless authentication with Bearer token

### Frontend Architecture
- **Component-based**: React with functional components & hooks
- **API Service Layer**: Centralized axios instance in `services/api.js`
- **State Management**: React hooks (useState, useEffect)
- **Responsive Design**: CSS-based layout with media queries

### Trade-offs
| Aspect | Current | Trade-off |
|--------|---------|-----------|
| **Database** | In-memory JS arrays | No persistence; data resets on restart |
| **Auth** | JWT with hardcoded users | Demo-friendly; not production-ready |
| **Validation** | Backend basic checks | Frontend should use Yup for better UX |
| **Error Handling** | Generic middleware | Can be extended per endpoint |
| **CORS** | Permissive (`cors()`) | Should restrict to known origins in prod |

---

## Development Workflow

### Running Both Servers

**Terminal 1 (Backend)**:
```bash
cd backend
npm run dev
```

**Terminal 2 (Frontend)**:
```bash
cd frontend
npm run dev
```

Then open browser to `http://localhost:5173`

### Making Changes

- **Backend changes**: Auto-reload with nodemon
- **Frontend changes**: Hot Module Reload (HMR) with Vite
- **Database changes**: Edit files in `backend/data/` and restart server

---

## Next Steps / Future Enhancements

- [ ] Replace in-memory data with PostgreSQL/MongoDB
- [ ] Add Yup validation in frontend forms
- [ ] Implement password hashing (bcryptjs)
- [ ] Add more comprehensive error handling
- [ ] Write unit & integration tests
- [ ] Add request logging & monitoring
- [ ] Implement refresh token flow
- [ ] Add audit logs for data changes

---

## Troubleshooting

### Backend won't start
- Check if port 3000 is already in use
- Ensure `.env` file exists with `JWT_SECRET`
- Try: `npm install` then `npm run dev`

### Frontend can't reach backend
- Ensure backend is running on http://localhost:3000
- Check vite.config.js proxy configuration
- Clear browser cache & restart dev server

### Login fails
- Use credentials: `admin` / `123456` or `user` / `123456`
- Check localStorage for token: `localStorage.getItem('token')`

---

## Contact & Support

For issues or questions, refer to:
- Backend logs: Check terminal where `npm run dev` is running
- Frontend logs: Browser DevTools Console (F12)
- API endpoints: See **API Endpoints** section above
