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

const showSkinning =  (req, res) => {
    const modelPath = path.join(__dirname, '../public/skinning');
    fs.readdir(modelPath, (err, files) => {
        if(err) {
            console.err('Error reading directory: ', err);
            return;
        }
        else {
            files.forEach((file, index, files) => {
                const name = file.split('.')[0];
                files[index] = '/skinning/'+name;
            })
            res.render("skinning", {skinningList: files});
        }
    })
};

const showEditing =  (req, res) => {
    const modelPath = path.join(__dirname, '../public/model');
    fs.readdir(modelPath, (err, files) => {
        if(err) {
            console.err('Error reading directory: ', err);
            return;
        }
        else {
            files.forEach((file, index, files) => {
                const name = file.split('.')[0];
                files[index] = '/editing/'+name;
            })
            files.unshift('/editing/blank');
            res.render("editing", {editingList: files});
        }
    })
};

const showThree =  (req, res) => {
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
            file = '/model/sketchfab_3d_editor_challenge_littlest_tokyo.glb'
            res.render("three_examples", {title: 'THREE little Tokyo', modelPath: file});
        }
    })
};

module.exports = {showHome, showThree, showSkinning, showEditing};