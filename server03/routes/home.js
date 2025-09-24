const express = require("express");
const router = express.Router();
const {showHome, showThree} = require("../controllers/home");

router
    .route("/")
    .get(showHome)

router
    .route("/three_examples")
    .get(showThree)

module.exports = router;