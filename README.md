# Tugas3_PPL

# API Karakter Komik

Ini adalah API RESTful yang dibangun dengan Node.js dan Express.js yang memungkinkan Anda mengelola koleksi karakter komik. API ini menyediakan fungsionalitas untuk melihat, mencari, menambahkan, memperbarui, dan menghapus karakter, serta mengakses statistik tentang karakter dalam database.

## Fitur Utama

### Manajemen Karakter
- `GET /characters` - Menampilkan semua karakter yang tersedia
- `GET /characters/:id` - Mengambil detail karakter berdasarkan ID
- `POST /characters` - Menambahkan karakter baru ke daftar
- `PUT /characters/:id` - Mengupdate karakter berdasarkan ID
- `DELETE /characters/:id` - Menghapus karakter berdasarkan ID
- `POST /characters/bulk` - Menambahkan banyak karakter sekaligus
- `DELETE /characters` - Menghapus beberapa karakter berdasarkan array ID

### Pencarian & Filter
- `GET /characters/search` - Mencari karakter berdasarkan nama, penerbit, atau kekuatan
  - Fitur tambahan pada pencarian:
    - Sorting: `?sort=name:asc` atau `?sort=publisher:desc`
    - Pagination: `?limit=5` untuk membatasi jumlah hasil

### Statistik Karakter
- `GET /stats` - Mengembalikan statistik, seperti:
  - Total karakter
  - Jumlah penerbit unik
  - Distribusi karakter berdasarkan penerbit dan kekuatan
  - Penerbit yang paling banyak muncul

### Error Handling & Middleware
- Middleware menangani error global (500 Internal Server Error)
- `uncaughtException` untuk menangani error tak terduga agar server tetap berjalan

## Penggunaan API

### Mendapatkan Semua Karakter

**Request:**
```
GET /characters
```

**Response:**
```json
{
  "data": [
    {
      "id": 1,
      "name": "Batman",
      "publisher": "DC Comics",
      "power": "Kecerdasan, Bela Diri"
    },
    {
      "id": 2,
      "name": "Spider-Man",
      "publisher": "Marvel",
      "power": "Spider Sense, Panjat Dinding"
    }
  ]
}
```

### Mencari Karakter dengan Filter

**Request:**
```
GET /characters/search?name=Batman
```

**Response:**
```json
{
  "count": 1,
  "data": [
    {
      "id": 1,
      "name": "Batman",
      "publisher": "DC Comics",
      "power": "Kecerdasan, Bela Diri"
    }
  ]
}
```

### Menambahkan Karakter Baru

**Request:**
```
POST /characters
Content-Type: application/json
```

**Body:**
```json
{
  "name": "Wonder Woman",
  "publisher": "DC Comics",
  "power": "Kekuatan Super, Terbang"
}
```

**Response:**
```json
{
  "message": "Karakter berhasil dibuat",
  "data": {
    "id": 3,
    "name": "Wonder Woman",
    "publisher": "DC Comics",
    "power": "Kekuatan Super, Terbang"
  }
}
```

### Mengupdate Karakter

**Request:**
```
PUT /characters/3
Content-Type: application/json
```

**Body:**
```json
{
  "power": "Kekuatan Super, Terbang, Lasso of Truth"
}
```

**Response:**
```json
{
  "message": "Karakter berhasil diperbarui",
  "data": {
    "id": 3,
    "name": "Wonder Woman",
    "publisher": "DC Comics",
    "power": "Kekuatan Super, Terbang, Lasso of Truth"
  }
}
```

### Menghapus Karakter

**Request:**
```
DELETE /characters/3
```

**Response:**
```json
{
  "message": "Karakter berhasil dihapus"
}
```

### Mendapatkan Statistik Karakter

**Request:**
```
GET /stats
```

**Response:**
```json
{
  "data": {
    "totalCharacters": 2,
    "publisherCount": 2,
    "charactersByPublisher": {
      "DC Comics": 1,
      "Marvel": 1
    },
    "powerDistribution": {
      "Kecerdasan, Bela Diri": 1,
      "Spider Sense, Panjat Dinding": 1
    },
    "mostPopularPublisher": "DC Comics"
  }
}
```

## Detail Implementasi

API ini adalah REST API sederhana menggunakan Node.js dan Express.js untuk mengelola daftar karakter komik. API ini memungkinkan pengguna untuk menampilkan, mencari, menambah, mengupdate, dan menghapus karakter. Selain itu, API ini juga menyediakan fitur statistik terkait karakter komik yang ada dalam database sementara (array characters).

Server berjalan pada port 3000 dan menangani berbagai request HTTP, seperti GET, POST, PUT, dan DELETE. API ini juga dilengkapi dengan error handling dan fitur tambahan seperti sorting, filtering, dan pagination dalam pencarian karakter.


## Kesimpulan

API Karakter Komik ini adalah API RESTful yang fleksibel dan dapat digunakan untuk mengelola data karakter komik. Dengan operasi CRUD, fungsi pencarian, filtering, sorting, pagination, dan statistik, API ini cocok untuk proyek latihan atau sebagai dasar untuk pengembangan lebih lanjut. 🦸‍♂️🦸‍♀️
