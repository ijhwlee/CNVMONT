const { console } = require("inspector");
const path = require("path");

// @desc model controller
// @route GET /3dmodels/:id

const showModel =  (req, res) => {
    //res.status(200).send(`Hello 3d models for ID:${req.params.id}`);
    const Title = req.params.id;
    //const modelPath = path.join(__dirname, 'public/model/free_1975_porsche_911_930_turbo.glb');
    //const modelPath = './model/free_1975_porsche_911_930_turbo.glb';
    const modelPathID = req.params.id;
    let modelPath = '';
    if (modelPathID != 'cube' && modelPathID != 'capsule') {
        modelPath = '/model/'+modelPathID+'.glb';
    }
    else {
        modelPath = modelPathID;
    }
    console.log(`/controllers/modelControllders.js:showModel: ModelPath = ${modelPath}`);
    res.render("modelView", {title: Title, modelPath: modelPath});
};

module.exports = showModel;