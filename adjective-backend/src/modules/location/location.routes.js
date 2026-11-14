const router = require("express").Router();

const locationCtrl = require("./location.controller");

router.get("/nearby", locationCtrl.getNearbyLocations);

module.exports = router;