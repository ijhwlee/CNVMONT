const { console } = require("inspector");
const path = require("path");

// @desc model controller
// @route GET /3dmodels/:id

const showSkinning =  (req, res) => {
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
    if (modelPathID != 'cube' && modelPathID != 'capsule') {
        modelPath = '/skinning/'+modelPathID+'.glb';
    }
    else {
        modelPath = modelPathID;
    }
    console.log(`/controllers/skinningControllders.js:showModel: ModelPath = ${modelPath}`);
    res.render("skinningView", {title: Title, modelPath: modelPath, showControl: showControl});
};

module.exports = showSkinning;