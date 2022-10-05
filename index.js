const express = require('express');
const path = require('path');
const app = express();
const port = 3000;

app.get('/', (req, res) => {
    console.log('GET call');
    res.sendFile(path.join(__dirname, '/client/index.html'));
});