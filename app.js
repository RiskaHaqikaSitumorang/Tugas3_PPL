const express = require('express');
const app = express();
const port = 3000;

app.use(express.json());

// Route dasar untuk cek apakah server berjalan
app.get('/', (req, res) => {
    res.send('Selamat datang di Comic API!');
});

// Tambahkan route contoh yang bisa menyebabkan error
app.get('/error', (req, res) => {
    throw new Error('Contoh error dalam Comic API!');
});

// Sample data untuk komik
let comics = [
    {
        id: 1,
        title: "One Piece",
        author: "Eiichiro Oda",
        publisher: "Shueisha",
        genre: "Adventure, Fantasy",
        releaseYear: 1997,
        volumes: 105,
        status: "Ongoing"
    },
    {
        id: 2,
        title: "Naruto",
        author: "Masashi Kishimoto",
        publisher: "Shueisha",
        genre: "Action, Adventure",
        releaseYear: 1999,
        volumes: 72,
        status: "Completed"
    },
    {
        id: 3,
        title: "Attack on Titan",
        author: "Hajime Isayama",
        publisher: "Kodansha",
        genre: "Action, Drama, Horror",
        releaseYear: 2009,
        volumes: 34,
        status: "Completed"
    }
];

// GET all comics
app.get('/comics', (req, res) => {
    res.json({
        message: "Berhasil mengambil semua data komik",
        data: comics
    });
});

// GET single comic
app.get('/comics/:id', (req, res) => {
    const comic = comics.find(c => c.id === parseInt(req.params.id));
    if (!comic) {
        return res.status(404).json({ message: "Komik tidak ditemukan" });
    }
    res.json({
        message: "Berhasil mengambil detail komik",
        data: comic
    });
});

// Search comics with filters, sorting, and pagination
app.get('/comics/search', (req, res) => {
    const { title, author, publisher, genre, status, sort, limit } = req.query;
    let results = [...comics];
    
    // Apply filters
    if (title) {
        results = results.filter(c => c.title.toLowerCase().includes(title.toLowerCase()));
    }
    if (author) {
        results = results.filter(c => c.author.toLowerCase().includes(author.toLowerCase()));
    }
    if (publisher) {
        results = results.filter(c => c.publisher.toLowerCase().includes(publisher.toLowerCase()));
    }
    if (genre) {
        results = results.filter(c => c.genre.toLowerCase().includes(genre.toLowerCase()));
    }
    if (status) {
        results = results.filter(c => c.status.toLowerCase() === status.toLowerCase());
    }

    // Apply sorting
    if (sort) {
        const [field, order] = sort.split(':');
        results.sort((a, b) => {
            if (typeof a[field] === 'string') {
                return order === 'desc' 
                    ? b[field].localeCompare(a[field])
                    : a[field].localeCompare(b[field]);
            } else {
                return order === 'desc' 
                    ? b[field] - a[field]
                    : a[field] - b[field];
            }
        });
    }

    // Apply pagination
    if (limit) {
        results = results.slice(0, parseInt(limit));
    }

    if (results.length === 0) {
        return res.status(404).json({ message: "Tidak ada komik yang sesuai dengan kriteria pencarian" });
    }

    res.json({
        message: "Hasil pencarian komik",
        count: results.length,
        data: results
    });
});

// POST new comic
app.post('/comics', (req, res) => {
    const { title, author, publisher, genre, releaseYear, volumes, status } = req.body;
    
    // Validation
    if (!title || !author) {
        return res.status(400).json({ message: "Judul dan penulis wajib diisi" });
    }
    
    const newComic = {
        id: comics.length > 0 ? Math.max(...comics.map(c => c.id)) + 1 : 1,
        title,
        author,
        publisher: publisher || "Unknown",
        genre: genre || "Unknown",
        releaseYear: releaseYear || null,
        volumes: volumes || 0,
        status: status || "Unknown"
    };
    
    comics.push(newComic);
    res.status(201).json({
        message: "Komik berhasil ditambahkan",
        data: newComic
    });
});

// Bulk add comics
app.post('/comics/bulk', (req, res) => {
    if (!Array.isArray(req.body)) {
        return res.status(400).json({ message: "Request body harus berupa array komik" });
    }

    const newComics = req.body.map((comic) => {
        return {
            id: comics.length > 0 ? Math.max(...comics.map(c => c.id)) + 1 : 1,
            title: comic.title,
            author: comic.author,
            publisher: comic.publisher || "Unknown",
            genre: comic.genre || "Unknown",
            releaseYear: comic.releaseYear || null,
            volumes: comic.volumes || 0,
            status: comic.status || "Unknown"
        };
    });

    comics.push(...newComics);
    res.status(201).json({
        message: `${newComics.length} komik berhasil ditambahkan`,
        data: newComics
    });
});

// PUT update comic
app.put('/comics/:id', (req, res) => {
    const comic = comics.find(c => c.id === parseInt(req.params.id));
    if (!comic) {
        return res.status(404).json({ message: "Komik tidak ditemukan" });
    }

    const { title, author, publisher, genre, releaseYear, volumes, status } = req.body;
    
    comic.title = title || comic.title;
    comic.author = author || comic.author;
    comic.publisher = publisher || comic.publisher;
    comic.genre = genre || comic.genre;
    comic.releaseYear = releaseYear !== undefined ? releaseYear : comic.releaseYear;
    comic.volumes = volumes !== undefined ? volumes : comic.volumes;
    comic.status = status || comic.status;

    res.json({
        message: "Komik berhasil diperbarui",
        data: comic
    });
});

// PATCH update comic (partial update)
app.patch('/comics/:id', (req, res) => {
    const comic = comics.find(c => c.id === parseInt(req.params.id));
    if (!comic) {
        return res.status(404).json({ message: "Komik tidak ditemukan" });
    }

    // Update hanya field yang diberikan
    Object.keys(req.body).forEach(key => {
        if (comic.hasOwnProperty(key)) {
            comic[key] = req.body[key];
        }
    });

    res.json({
        message: "Komik berhasil diperbarui sebagian",
        data: comic
    });
});

// DELETE comic
app.delete('/comics/:id', (req, res) => {
    const comicIndex = comics.findIndex(c => c.id === parseInt(req.params.id));
    if (comicIndex === -1) {
        return res.status(404).json({ message: "Komik tidak ditemukan" });
    }

    const deletedComic = comics[comicIndex];
    comics.splice(comicIndex, 1);
    
    res.json({ 
        message: "Komik berhasil dihapus",
        data: deletedComic
    });
});

// Bulk delete comics
app.delete('/comics', (req, res) => {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids)) {
        return res.status(400).json({ message: "Harap berikan array ID" });
    }
    
    const initialLength = comics.length;
    const deletedComics = comics.filter(c => ids.includes(c.id));
    comics = comics.filter(c => !ids.includes(c.id));
    
    res.json({
        message: `${initialLength - comics.length} komik berhasil dihapus`,
        data: deletedComics
    });
});

// Get comic statistics
app.get('/stats', (req, res) => {
    const stats = {
        totalComics: comics.length,
        publisherCount: new Set(comics.map(c => c.publisher)).size,
        comicsByPublisher: comics.reduce((acc, comic) => {
            acc[comic.publisher] = (acc[comic.publisher] || 0) + 1;
            return acc;
        }, {}),
        comicsByStatus: comics.reduce((acc, comic) => {
            acc[comic.status] = (acc[comic.status] || 0) + 1;
            return acc;
        }, {}),
        genreDistribution: comics.reduce((acc, comic) => {
            const genres = comic.genre.split(', ');
            genres.forEach(g => {
                acc[g] = (acc[g] || 0) + 1;
            });
            return acc;
        }, {}),
        averageVolumes: comics.reduce((sum, comic) => sum + comic.volumes, 0) / comics.length,
        oldestComic: comics.reduce((oldest, comic) => 
            (comic.releaseYear < oldest.releaseYear || !oldest.releaseYear) ? comic : oldest, comics[0]),
        newestComic: comics.reduce((newest, comic) => 
            (comic.releaseYear > newest.releaseYear) ? comic : newest, comics[0])
    };
    
    res.json({ 
        message: "Statistik koleksi komik",
        data: stats 
    });
});

// Get volumes by decade
app.get('/volumes-by-decade', (req, res) => {
    const volumesByDecade = comics.reduce((acc, comic) => {
        if (comic.releaseYear) {
            const decade = Math.floor(comic.releaseYear / 10) * 10;
            acc[`${decade}s`] = (acc[`${decade}s`] || 0) + comic.volumes;
        }
        return acc;
    }, {});
    
    res.json({
        message: "Jumlah volume komik berdasarkan dekade",
        data: volumesByDecade
    });
});

// Middleware error handler harus ada di bagian paling bawah
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        message: "Terjadi kesalahan!",
        error: err.message
    });
});

// Handling uncaught exceptions
process.on('uncaughtException', (err) => {
    console.error('Uncaught Exception:', err);
});

app.listen(port, () => {
    console.log(`Server komik berjalan di http://localhost:${port}`);
});