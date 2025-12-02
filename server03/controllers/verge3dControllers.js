const { console } = require("inspector");
const path = require("path");

// @desc model controller
// @route GET /vega3d/:id

const showVerge3d =  (req, res) => {
    //res.status(200).send(`Hello 3d models for ID:${req.params.id}`);
    const Title = req.params.id;
    //const modelPath = path.join(__dirname, 'public/model/free_1975_porsche_911_930_turbo.glb');
    //const modelPath = './model/free_1975_porsche_911_930_turbo.glb';
    const modelPathID = req.params.id;
    let modelPath = modelPathID/modelPathID+'.html';
    let fileName = modelPathID+'.html';
    console.log(`/controllers/verge3dControllders.js:showVerge3d: ModelPath = ${modelPath}`);
    res.sendFile(path.join(__dirname, '..', 'public', 'verge3d', modelPathID, fileName));
};

module.exports = showVerge3d;