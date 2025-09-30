const express = require("express");
const router = express.Router();
const {showHome, showThree, showSkinning, showEditing} = require("../controllers/home");

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

module.exports = router;