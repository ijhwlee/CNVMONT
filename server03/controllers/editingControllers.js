const { console } = require("inspector");
const path = require("path");

// @desc model controller
// @route GET /editing/:id

const showEditing =  (req, res) => {
    //res.status(200).send(`Hello 3d models for ID:${req.params.id}`);
    const Title = req.params.id;
    //const modelPath = path.join(__dirname, 'public/model/free_1975_porsche_911_930_turbo.glb');
    //const modelPath = './model/free_1975_porsche_911_930_turbo.glb';
    const modelPathID = req.params.id;
    var showControl = req.params.control;
    if (showControl == 'none') {
        showControl = 'true';
    }
    let modelPath = '';
    if (modelPathID != 'blank') {
        modelPath = '/editing/'+modelPathID+'.glb';
    }
    else {
        modelPath = modelPathID;
    }
    console.log(`/controllers/editingControllders.js:showEditing: modelPath = ${modelPath}`);
    res.render("editingView", {title: Title, modelPath: modelPath, showControl: showControl});
};

module.exports = showEditing;