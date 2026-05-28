# Medeva - Room Category Management System

Aplikasi **Room Category Management** untuk rumah sakit/klinik dengan fitur **Role-Based Access Control**, built with **React 19 + Vite** (frontend) dan **Express 5** (backend).

**Repository**: https://github.com/caklem/Test_Medeva  
**Status**: Production Ready (In-Memory Mock Data)

---

## Fitur Utama

### Autentikasi & RBAC
- **JWT-based authentication** dengan token yang disimpan di localStorage
- **Role-based permissions**:
  - **Admin**: dapat create, read, update, delete kategori ruangan
  - **User**: hanya dapat read (view) data kategori ruangan
- Middleware untuk verifikasi token pada endpoint sensitif

### Manajemen Kategori Ruangan
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

### Responsive Design
- **Desktop** (≥1024px): Full layout dengan sidebar + list + detail panel
- **Tablet** (≥768px): Compact view
- **Mobile** (<768px): Optimized for small screens

### Database Schema (Relational)
- **klinik**: Informasi klinik/rumah sakit
- **users**: Pengguna dengan role-based permissions
- **kelas_ruangan**: Kategori ruangan (Jingga, Ocean Blue, Clover, dll)
- **kategori_ruangan**: Detail kategori ruangan dengan relasi ke kelas_ruangan

---

## Struktur Proyek

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

## Quick Start

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

### Verifikasi Aplikasi

1. Buka **http://localhost:5174** di browser
2. Login dengan:
   - **Admin**: `admin` / `123456`
   - **User**: `user` / `123456`
3. Masuk ke dashboard dan lihat list kategori ruangan
4. Klik "Tambah" untuk membuka form (admin only)
5. Klik kategori di list untuk lihat detail

---

## API Documentation

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

## Test Credentials

| Role | Username | Password | Akses |
|------|----------|----------|-------|
| **Admin** | `admin` | `123456` | Create, Read, Update, Delete |
| **User** | `user` | `123456` | Read Only |

### Permission Matrix

| Aksi | Admin | User |
|------|-------|------|
| GET /kategori-ruangan | Yes | Yes |
| GET /kategori-ruangan/:id | Yes | Yes |
| POST /kategori-ruangan | Yes | No |
| PUT /kategori-ruangan/:id | Yes | No |
| DELETE /kategori-ruangan/:id | Yes | No |

---

## Database Schema

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

## Technology Stack

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

## Frontend Features

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

## Configuration

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

## Development Workflow

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

## Production Checklist

- [ ] Replace in-memory arrays with real database (PostgreSQL/MongoDB)
- [ ] Implement password hashing (bcryptjs)
- [ ] Add environment-based API endpoint configuration
- [ ] Setup HTTPS and CORS whitelist
- [ ] Add comprehensive request/response logging
- [ ] Implement JWT refresh token flow
- [ ] Add rate limiting and input validation
- [ ] Setup error tracking and monitoring
- [ ] Configure CDN for static assets
- [ ] Add health check endpoints

---

## Troubleshooting

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

## Key Files Reference

| File | Purpose | Lines |
|------|---------|-------|
| [backend/app.js](backend/app.js) | Server setup & routing | ~35 |
| [backend/controllers/categoryControllers.js](backend/controllers/categoryControllers.js) | CRUD logic | ~150 |
| [frontend/src/App.jsx](frontend/src/App.jsx) | React routing | ~30 |
| [frontend/src/pages/Categories.jsx](frontend/src/pages/Categories.jsx) | Main dashboard | ~1000+ |
| [frontend/src/styles/Categories.css](frontend/src/styles/Categories.css) | Custom styling | ~600+ |

---

## Git Workflow

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

## Support & Documentation

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
