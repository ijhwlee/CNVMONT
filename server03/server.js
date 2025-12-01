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
app.use("/", require("./routes/home"));
app.use("/3dmodels", require("./routes/models"));
app.use("/skinning", require("./routes/skinning"));
app.use("/editing", require("./routes/editing"));
app.use("/vega3d", require("./routes/vega3d"));

https.createServer(options, app).listen(PORT, () => {
  console.log(`Server running at https://localhost:${PORT}`);
});