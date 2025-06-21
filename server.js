const fs = require('fs');
const https = require('https');
const express = require('express');

const app = express();

// SSL options
const options = {
  key: fs.readFileSync('security/server.key'),
  cert: fs.readFileSync('security/server.cert')
};

// Simple route
app.get('/', (req, res) => {
  res.send('Hello from HTTPS Express server!');
});

// Start HTTPS server
https.createServer(options, app).listen(3000, () => {
  console.log('Server running at https://localhost:3000');
});