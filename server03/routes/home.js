const express = require("express");
const router = express.Router();
const {showHome, showThree, showSkinning} = require("../controllers/home");

router
    .route("/")
    .get(showHome)

router
    .route("/three_examples")
    .get(showThree)

router
    .route("/three_skinning")
    .get(showSkinning)

module.exports = router;