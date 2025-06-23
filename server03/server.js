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

app.use(express.static(path.join(__dirname, 'public')));

https.createServer(options, app).listen(PORT, () => {
  console.log(`Server running at https://localhost:${PORT}`);
});