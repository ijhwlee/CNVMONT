const express = require("express");
const router = express.Router();
const showVega3d = require("../controllers/vega3dControllers");

router
    .route("/")
    .get((req, res) => {
        res.status(200).send("Hello Vega 3d examples");
    })

router
    .route("/:id")
    .get(showVega3d)

module.exports = router;