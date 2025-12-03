const express = require("express");
const passport = require('passport');
const router = express.Router();
const {showHome, showThree, showSkinning, showEditing, showVerge3d, showLogin} = require("../controllers/home");

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

router
    .route("/login")
    .get(showLogin)
    .post(passport.authenticate('local', {
            successRedirect: '/subscribed', // Redirect on successful login
            failureRedirect: '/login', // Redirect on failed login (can add flash messages here)
            }))

module.exports = router;