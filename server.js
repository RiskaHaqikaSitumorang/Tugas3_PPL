const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const port = 4000;

app.use(express.json());
app.use(express.static('public'));

// Fungsi untuk membaca data comics dari comics.json
function readComicsData() {
    try {
        const data = fs.readFileSync(path.join(__dirname, 'comics.json'), 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.error('Error membaca file comics.json:', error);
        return { comics: [] };
    }
}

// Fungsi untuk menulis data comics ke comics.json
function writeComicsData(data) {
    try {
        fs.writeFileSync(
            path.join(__dirname, 'comics.json'),
            JSON.stringify(data, null, 2),
            'utf8'
        );
        return true;
    } catch (error) {
        console.error('Error menulis file comics.json:', error);
        return false;
    }
}

// Tampilkan halaman utama dengan UI
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Route dasar untuk cek apakah server berjalan
app.get('/api', (req, res) => {
    res.send('Selamat datang di Comic API!');
});

// GET all comics
app.get('/api/comics', (req, res) => {
    const data = readComicsData();
    res.json({
        message: "Berhasil mengambil semua data komik",
        data: data.comics
    });
});

// GET single comic
app.get('/api/comics/:id', (req, res) => {
    const data = readComicsData();
    const comic = data.comics.find(c => c.id === parseInt(req.params.id));
    if (!comic) {
        return res.status(404).json({ message: "Komik tidak ditemukan" });
    }
    res.json({
        message: "Berhasil mengambil detail komik",
        data: comic
    });
});

// Search comics with filters
app.get('/api/comics/search', (req, res) => {
    const { title, author, publisher, genre, status } = req.query;
    const data = readComicsData();
    let results = [...data.comics];

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
app.post('/api/comics', (req, res) => {
    const { title, author, publisher, genre, releaseYear, volumes, status } = req.body;

    // Validation
    if (!title || !author) {
        return res.status(400).json({ message: "Judul dan penulis wajib diisi" });
    }

    const data = readComicsData();

    const newComic = {
        id: data.comics.length > 0 ? Math.max(...data.comics.map(c => c.id)) + 1 : 1,
        title,
        author,
        publisher: publisher || "Unknown",
        genre: genre || "Unknown",
        releaseYear: releaseYear || null,
        volumes: volumes || 0,
        status: status || "Unknown"
    };

    data.comics.push(newComic);

    if (writeComicsData(data)) {
        res.status(201).json({
            message: "Komik berhasil ditambahkan",
            data: newComic
        });
    } else {
        res.status(500).json({ message: "Gagal menyimpan data komik" });
    }
});

// PUT update comic
app.put('/api/comics/:id', (req, res) => {
    const data = readComicsData();
    const comicIndex = data.comics.findIndex(c => c.id === parseInt(req.params.id));

    if (comicIndex === -1) {
        return res.status(404).json({ message: "Komik tidak ditemukan" });
    }

    const { title, author, publisher, genre, releaseYear, volumes, status } = req.body;

    data.comics[comicIndex] = {
        ...data.comics[comicIndex],
        title: title || data.comics[comicIndex].title,
        author: author || data.comics[comicIndex].author,
        publisher: publisher || data.comics[comicIndex].publisher,
        genre: genre || data.comics[comicIndex].genre,
        releaseYear: releaseYear !== undefined ? releaseYear : data.comics[comicIndex].releaseYear,
        volumes: volumes !== undefined ? volumes : data.comics[comicIndex].volumes,
        status: status || data.comics[comicIndex].status
    };

    if (writeComicsData(data)) {
        res.json({
            message: "Komik berhasil diperbarui",
            data: data.comics[comicIndex]
        });
    } else {
        res.status(500).json({ message: "Gagal menyimpan data komik" });
    }
});

// DELETE comic
app.delete('/api/comics/:id', (req, res) => {
    const data = readComicsData();
    const comicIndex = data.comics.findIndex(c => c.id === parseInt(req.params.id));

    if (comicIndex === -1) {
        return res.status(404).json({ message: "Komik tidak ditemukan" });
    }

    const deletedComic = data.comics[comicIndex];
    data.comics.splice(comicIndex, 1);

    if (writeComicsData(data)) {
        res.json({
            message: "Komik berhasil dihapus",
            data: deletedComic
        });
    } else {
        res.status(500).json({ message: "Gagal menyimpan data komik" });
    }
});

// Middleware error handler
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