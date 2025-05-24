
# Tugas3_PPL

# Comic Manager API - Dokumentasi
![image](https://github.com/user-attachments/assets/72a062e2-7e6c-485b-83d2-32dfc302015c)



## Daftar Isi
- [Deskripsi](#deskripsi)
- [Fitur](#fitur)
- [Instalasi](#instalasi)
- [Penggunaan](#penggunaan)
- [Dokumentasi API](#dokumentasi-api)
- [Contoh Request & Response](#contoh-request--response)
- [Teknologi](#teknologi)
- [Kontribusi](#Contributor)
- [Lisensi](#lisensi)

## Deskripsi

Comic Manager API adalah sistem API sederhana untuk mengelola data komik yang dibangun dengan Node.js dan Express. API ini memungkinkan Anda untuk:

- Melihat daftar komik
- Melihat detail komik
- Menambahkan komik baru
- Memperbarui data komik
- Menghapus komik
- Mencari komik berdasarkan berbagai kriteria

API ini menggunakan file JSON sebagai penyimpanan data sederhana dan dilengkapi dengan antarmuka web interaktif.

## Fitur

✅ **Fitur Wajib:**
- 2 endpoint GET (melihat semua komik dan detail komik)
- 1 endpoint POST (menambahkan komik baru)
- Penyimpanan data dalam format JSON
- Data komik dengan minimal 3 atribut (implementasi memiliki 7 atribut)

✨ **Fitur Tambahan:**
- Endpoint PUT untuk mengupdate komik
- Endpoint DELETE untuk menghapus komik
- Endpoint pencarian dengan berbagai filter
- Antarmuka web interaktif
- Validasi input
- Error handling yang baik
- Respons dalam format JSON yang konsisten

## Instalasi

1. Clone repository ini:
```bash
git clone https://github.com/RiskaHaqikaSitumorang/Tugas3_PPL.git
cd Tugas3_PPL
```

2. Install dependencies:
```bash
npm install
```

3. Jalankan server:
```bash
node server.js
```

4. Buka browser dan akses:
```
http://localhost:4000
```

## Penggunaan

### Melalui Antarmuka Web
1. Buka `http://localhost:4000` di browser
2. Gunakan form untuk menambahkan komik baru
3. Gunakan fitur pencarian untuk mencari komik
4. Gunakan tombol edit dan delete untuk memodifikasi data

### Melalui API Langsung
Anda bisa mengakses API langsung menggunakan tools seperti Postman, cURL, atau dari aplikasi frontend.

Contoh request dengan cURL:
```bash
# Mendapatkan semua komik
curl http://localhost:4000/api/comics

# Menambahkan komik baru
curl -X POST -H "Content-Type: application/json" -d '{
  "title": "Naruto",
  "author": "Masashi Kishimoto",
  "publisher": "Shueisha",
  "genre": "Action",
  "releaseYear": 1999,
  "volumes": 72,
  "status": "Completed"
}' http://localhost:4000/api/comics
```

## Dokumentasi API

### Daftar Endpoint

| Method | Endpoint                | Deskripsi                          |
|--------|-------------------------|------------------------------------|
| GET    | /api/comics             | Mendapatkan semua komik            |
| GET    | /api/comics/:id         | Mendapatkan detail komik           |
| GET    | /api/comics/search      | Mencari komik dengan filter        |
| POST   | /api/comics             | Menambahkan komik baru             |
| PUT    | /api/comics/:id         | Memperbarui data komik             |
| DELETE | /api/comics/:id         | Menghapus komik                    |

### Detail Endpoint

#### GET /api/comics
Mendapatkan semua daftar komik.

**Response:**
```json
{
  "message": "Berhasil mengambil semua data komik",
  "data": [
    {
      "id": 1,
      "title": "One Piece",
      "author": "Eiichiro Oda",
      "publisher": "Shueisha",
      "genre": "Adventure",
      "releaseYear": 1997,
      "volumes": 100,
      "status": "Ongoing"
    }
  ]
}
```

#### GET /api/comics/:id
Mendapatkan detail satu komik berdasarkan ID.

**Response:**
```json
{
  "message": "Berhasil mengambil detail komik",
  "data": {
    "id": 1,
    "title": "One Piece",
    "author": "Eiichiro Oda",
    "publisher": "Shueisha",
    "genre": "Adventure",
    "releaseYear": 1997,
    "volumes": 100,
    "status": "Ongoing"
  }
}
```

#### POST /api/comics
Menambahkan komik baru.

**Request Body:**
```json
{
  "title": "Naruto",
  "author": "Masashi Kishimoto",
  "publisher": "Shueisha",
  "genre": "Action",
  "releaseYear": 1999,
  "volumes": 72,
  "status": "Completed"
}
```

**Response:**
```json
{
  "message": "Komik berhasil ditambahkan",
  "data": {
    "id": 2,
    "title": "Naruto",
    "author": "Masashi Kishimoto",
    "publisher": "Shueisha",
    "genre": "Action",
    "releaseYear": 1999,
    "volumes": 72,
    "status": "Completed"
  }
}
```

#### PUT /api/comics/:id
Memperbarui data komik.

**Request Body:**
```json
{
  "title": "Naruto Shippuden",
  "status": "Completed"
}
```

**Response:**
```json
{
  "message": "Komik berhasil diperbarui",
  "data": {
    "id": 2,
    "title": "Naruto Shippuden",
    "author": "Masashi Kishimoto",
    "publisher": "Shueisha",
    "genre": "Action",
    "releaseYear": 1999,
    "volumes": 72,
    "status": "Completed"
  }
}
```

#### DELETE /api/comics/:id
Menghapus komik.

**Response:**
```json
{
  "message": "Komik berhasil dihapus",
  "data": {
    "id": 2,
    "title": "Naruto Shippuden",
    "author": "Masashi Kishimoto",
    "publisher": "Shueisha",
    "genre": "Action",
    "releaseYear": 1999,
    "volumes": 72,
    "status": "Completed"
  }
}
```

#### GET /api/comics/search
Mencari komik dengan filter.

**Parameter Query:**
- `title`: Judul komik
- `author`: Penulis komik
- `publisher`: Penerbit komik
- `genre`: Genre komik
- `status`: Status komik

**Contoh Request:**
```
GET /api/comics/search?genre=Adventure
```

**Response:**
```json
{
  "message": "Hasil pencarian komik",
  "count": 1,
  "data": [
    {
      "id": 1,
      "title": "One Piece",
      "author": "Eiichiro Oda",
      "publisher": "Shueisha",
      "genre": "Adventure",
      "releaseYear": 1997,
      "volumes": 100,
      "status": "Ongoing"
    }
  ]
}
```


## Teknologi

- **Backend:**
  - Node.js
  - Express.js
- **Frontend:**
  - HTML5
  - CSS3
  - JavaScript
  - Bootstrap 5
- **Penyimpanan Data:**
  - JSON file

## Contributor
| No | Nama                         | NIM           |
|----|------------------------------|--------------|
| 1  | Berliani Utami               | 2208107010082 |
| 2  | Raihan Firyal                | 2208107010084 |
| 3  | Riska Haqika Situmorang      | 2208107010086 |

## Lisensi

MIT License


