const express = require("express");
const router = express.Router();
const showModel = require("../controllers/modelControllers");

router
    .route("/")
    .get((req, res) => {
        res.status(200).send("Hello 3d models");
    })

router
    .route("/:id")
    .get(showModel)

module.exports = router;