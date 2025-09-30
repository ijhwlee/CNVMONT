const express = require("express");
const router = express.Router();
const showEditing = require("../controllers/editingControllers");

router
    .route("/")
    .get((req, res) => {
        res.status(200).send("Hello 3d Editing");
    })

router
    .route("/:id/:control")
    .get(showEditing)

module.exports = router;