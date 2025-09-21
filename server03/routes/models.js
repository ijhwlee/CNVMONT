const express = require("express");
const router = express.Router();
const showModel = require("../controllers/modelControllers");

router
    .route("/3dmodels")
    .get((req, res) => {
        res.status(200).send("Hello 3d models");
    })

router
    .route("/3dmodels/:id")
    .get(showModel)

module.exports = router;