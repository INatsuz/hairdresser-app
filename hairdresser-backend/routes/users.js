const express = require('express');
const bcrypt = require('bcrypt');
const router = express.Router();
const {
	verifyLoginAndGenerateTokens,
	verifyToken,
	generateTokens,
	mustBeAuthenticated,
	USER_TYPES,
	mustBeAdmin,
	generateResourceToken
} = require("../utils/authentication");
const db = require('../utils/db');

const SALT_ROUNDS = 10;

// Login POST method
router.post('/login', function (req, res, next) {
	verifyLoginAndGenerateTokens(req.body.username, req.body.password).then(({accessToken, refreshToken, payload}) => {
		let date = new Date();
		date.setTime(date.getTime() + 2 * 60 * 60 * 1000);

		res.cookie("jwt", `Bearer ${accessToken}`, {
			secure: true,
			httpOnly: true,
			expires: date,
			sameSite: "none"
		});

		res.status(200).json({accessToken: accessToken, refreshToken: refreshToken, user: payload});

		if (req.body.notificationToken) {
			db.query(`UPDATE appuser SET notificationToken = ? WHERE username = ?`, [req.body.notificationToken, req.body.username]).then(() => {
				console.log("Updated notification token on login for " + req.body.username);
			}).catch(err => {
				console.log(err);
			});
		}
	}).catch(err => {
		console.log(err);
		res.status(401).json({err: "Wrong credentials"});
	});
});

router.post('/register', mustBeAdmin, function (req, res, next) {
	let {username, password, name, userType} = req.body
	bcrypt.hash(password, SALT_ROUNDS, function (err, hash) {
		db.query(`INSERT INTO appuser(username, password, name, userType) 
					VALUES (?, ?, ?, ?)`, [username, hash, name, userType]).then(({result, fields}) => {
			res.status(200).send("Account created successfully");
		}).catch(err => {
			console.log(err.code);
			res.status(400).json({err: "Couldn't register you"});
		});
	});
});

router.post("/renew", function (req, res, next) {
	let {refreshToken: token} = req.body;
	if (token) {
		verifyToken(token).then(payload => {
			if (!payload.isRefreshToken) res.status(401).json("Could not renew token");

			let newPayload = {ID: payload.ID};
			generateTokens(newPayload).then(tokens => {
				res.status(200).json({...tokens, user: newPayload});
			}).catch(err => {
				console.log(err);
				res.status(401).json({err: "Could not renew token"});
			});
		}).catch(err => {
			console.log(err);
			res.status(401).json({err: "Could not renew token"});
		});
	} else {
		res.status(401).json("Could not renew token");
	}
});

router.get("/checkLogin", mustBeAuthenticated, function (req, res, next) {
	db.query("SELECT * FROM appuser WHERE ID = ?", [req.tokenPayload.ID]).then(({result: user, fields}) => {
		res.status(200).json({
			"loggedIn": true,
			user: {
				ID: req.tokenPayload.ID,
				username: user[0].username,
				name: user[0].name,
				userType: user[0].userType
			}
		});
	});
});

router.get("/logout", mustBeAuthenticated, function (req, res, next) {
	db.query("SELECT * FROM appuser WHERE ID = ?", [req.tokenPayload.ID]).then(({result: user, fields}) => {
		res.clearCookie("jwt", {
			secure: true,
			httpOnly: true,
			sameSite: "none"
		});

		res.status(200).json({
			"loggedIn": false
		});
	});
});

router.get("/getUserData", mustBeAuthenticated, function (req, res, next) {
	let {token} = req.query;

	verifyToken(token).then(payload => {
		console.log(payload.ID);
		db.query("SELECT * FROM appuser WHERE ID = ?", [payload.ID]).then(({result: user, fields}) => {
			console.log(user);
			if (user) {
				let userData = {
					ID: user[0].ID,
					username: user[0].username,
					userType: user[0].userType,
					name: user[0].name,
				};

				res.status(200).json(userData);
			}
		});
	}).catch(err => {
		console.log(err);
	});
});

router.get("/getResourceToken", mustBeAdmin, function (req, res) {
	generateResourceToken(req.query.ID).then(r => {
		res.status(200).json(r);
	}).catch(err => {
		console.log(err);
		res.status(400).json({err: "Could not generate resource token"});
	});
});

router.get('/create_debug_user', mustBeAdmin, function (req, res) {
	let username = "INatsuz";
	let password = "25.09.1999";
	let name = "Vasco Raminhos";
	let userType = USER_TYPES.ADMIN

	bcrypt.hash(password, SALT_ROUNDS, function (err, hash) {
		if (err) {
			res.status(400).json({err: "Couldn't register you"});
		}

		db.query("INSERT INTO appuser(username, password, name, userType) VALUES (?, ?, ?, ?)",
			[username, hash, name, userType]).then(({result, fields}) => {
			res.status(200).send("Account created successfully");
		}).catch(err => {
			console.log(err.code);
			res.status(400).json({err: "Couldn't register you"});
		});
	});
});

module.exports = router;
