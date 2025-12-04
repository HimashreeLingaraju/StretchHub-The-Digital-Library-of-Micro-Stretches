const express = require('express');
const fs = require('fs');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.static(path.join(__dirname, '../frontend')));
app.use(express.json());

// Load stretches
let stretches = JSON.parse(fs.readFileSync(path.join(__dirname, 'stretches.json')));

// API: get all stretches
app.get('/api/stretches', (req, res) => {
    res.json(stretches);
});

// API: get random stretch
app.get('/api/stretches/random', (req, res) => {
    const random = stretches[Math.floor(Math.random() * stretches.length)];
    res.json(random);
});

// API: filter by category or query
app.get('/api/stretches/search', (req, res) => {
    const q = (req.query.q || '').toLowerCase();
    const cat = (req.query.cat || 'all').toLowerCase();
    const filtered = stretches.filter(s => {
        const inCat = (cat === 'all') || (s.cat.toLowerCase() === cat);
        const inQ = !q || s.name.toLowerCase().includes(q) || s.desc.toLowerCase().includes(q);
        return inCat && inQ;
    });
    res.json(filtered);
});

app.listen(PORT, () => console.log(`Server running at http://localhost:${PORT}`));
