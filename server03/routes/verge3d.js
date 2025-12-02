const express = require("express");
const router = express.Router();
const showVerge3d = require("../controllers/verge3dControllers");

router
    .route("/")
    .get((req, res) => {
        res.status(200).send("Hello Verge 3d examples");
    })

router
    .route("/:id")
    .get(showVerge3d)

module.exports = router;