const fs = require('fs');
const https = require('https');
const express = require('express');
const path = require('path');
const app = express();
app.set("view engine", "ejs");
app.set("views", "./views");

const PORT = 3000;

// SSL options
const options = {
  key: fs.readFileSync('security/cnvmont.key'),
  cert: fs.readFileSync('security/cnvmont.cert')
};

app.use(express.static(path.join(__dirname, 'public')));
app.use("/", require("./routes/models"));

https.createServer(options, app).listen(PORT, () => {
  console.log(`Server running at https://localhost:${PORT}`);
});