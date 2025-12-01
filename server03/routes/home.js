const express = require("express");
const router = express.Router();
const {showHome, showThree, showSkinning, showEditing, showVega3d} = require("../controllers/home");

router
    .route("/")
    .get(showHome)

router
    .route("/three_examples")
    .get(showThree)

router
    .route("/three_skinning")
    .get(showSkinning)

router
    .route("/three_editing")
    .get(showEditing)

router
    .route("/three_vega3d")
    .get(showVega3d)

module.exports = router;