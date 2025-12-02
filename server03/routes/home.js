const express = require("express");
const router = express.Router();
const {showHome, showThree, showSkinning, showEditing, showVerge3d} = require("../controllers/home");

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
    .route("/three_verge3d")
    .get(showVerge3d)

module.exports = router;