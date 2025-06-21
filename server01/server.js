const fs = require('fs');
const https = require('https');
const express = require('express');
const path = require('path');

const app = express();
const PORT = 3000;

// SSL options
const options = {
  key: fs.readFileSync('security/server.key'),
  cert: fs.readFileSync('security/server.cert')
};

public_key = fs.readFileSync('security/server.key');
private_key = fs.readFileSync('security/server.cert');

// Serve static files
app.use(express.static(path.join(__dirname, 'public')));

// Simple route
//app.get('/', (req, res) => {
//  res.send('Hello from HTTPS Express server!');
//});

// Serve main HTML
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'views/index.html'));
});

// Start HTTPS server
https.createServer(options, app).listen(PORT, () => {
  console.log(`Server running at https://localhost:${PORT}`);
  //console.log(`public key : ${public_key}`);
  //console.log(`private key : ${private_key}`);
});