const { console } = require("inspector");
const path = require("path");
const fs = require("fs");

// @desc index controller
// @route GET /
async function listFiles(modelPath) {
  try {
    const entries = await fs.readdir(modelPath);
    const files = entries
        .filter(entry => entry.isFile())
        .map(entry => entry.name)
    console.log('Files:', files);
    return files;
  } catch (err) {
    console.error(`Error reading directory(${modelPath}):`, err);
    return [];
  }
}

const showHome =  (req, res) => {
    const modelPath = path.join(__dirname, '../public/model');
    fs.readdir(modelPath, (err, files) => {
        if(err) {
            console.err('Error reading directory: ', err);
            return;
        }
        else {
            files.forEach((file, index, files) => {
                const name = file.split('.')[0];
                files[index] = '/3dmodels/'+name;
            })
            res.render("index", {modelList: files});
        }
    })
};

module.exports = showHome;