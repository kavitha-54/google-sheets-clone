const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Simple storage for spreadsheets
let sheets = {};

// Save spreadsheet data
app.post('/save', (req, res) => {
    const { id, data } = req.body;
    sheets[id] = data;
    res.status(200).send({ message: 'Spreadsheet saved successfully!' });
});

// Load spreadsheet data
app.get('/load/:id', (req, res) => {
    const { id } = req.params;
    if (!sheets[id]) {
        return res.status(404).send({ message: 'Spreadsheet not found!' });
    }
    res.status(200).send({ data: sheets[id] });
});

app.listen(PORT, () => {
    console.log(`✅ Server running on http://localhost:${PORT}`);
});
