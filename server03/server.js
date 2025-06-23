const fs = require('fs');
const https = require('https');
const express = require('express');
const path = require('path');
const app = express();

const PORT = 3000;

// SSL options
//const options = {
//  key: fs.readFileSync('security/server.key'),
//  cert: fs.readFileSync('security/server.cert')
//};
const options = {
  pfx: fs.readFileSync('security/_.inje.ac.kr.pfx'),
  passphrase: 'LHY20250204' // if your .pfx file is password-protected
};

app.use(express.static(path.join(__dirname, 'public')));

https.createServer(options, app).listen(PORT, () => {
  console.log(`Server running at https://localhost:${PORT}`);
});