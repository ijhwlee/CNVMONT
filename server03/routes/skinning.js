const express = require("express");
const router = express.Router();
const showSkinning = require("../controllers/skinningControllers");

router
    .route("/")
    .get((req, res) => {
        res.status(200).send("Hello 3d Skinning Blending");
    })

router
    .route("/:id/:control")
    .get(showSkinning)

module.exports = router;