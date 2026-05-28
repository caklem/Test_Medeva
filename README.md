# Test-Medeva: Room Category Management System

Aplikasi manajemen kategori ruangan rumah sakit built with **React.js** (frontend) dan **Express.js** (backend).

## Fitur Utama

- ✅ **Authentication**: JWT-based login system dengan hardcoded credentials
- ✅ **Role-Based Access Control (RBAC)**: Admin dapat create/edit, User hanya bisa baca
- ✅ **Pagination & Search**: List ruangan dengan filter dan pencarian nama
- ✅ **Form Validation**: Validasi di level frontend (siap untuk Yup integration)
- ✅ **Responsive Design**: Desktop, Tablet, Mobile (mengikuti Figma design)

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
