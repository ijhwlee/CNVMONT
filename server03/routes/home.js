const express = require("express");
const router = express.Router();
const showHome = require("../controllers/home");

router
    .route("/")
    .get(showHome)

module.exports = router;