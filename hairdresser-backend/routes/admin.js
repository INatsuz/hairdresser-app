const express = require('express');
const path = require("path");
const router = express.Router();

/* GET home page. */
router.get('/{*admin}', function (req, res, next) {
	res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = router;
