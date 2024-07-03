const db = require('./db');
const bcrypt = require('bcrypt');
const jwt = require("jsonwebtoken");

const JWT_SECRET = "cdFdvoPUkkjuJmTJiSGk4xGGf1tc15qp";
const RESOURCE_JWT_SECRET = "64mYEdrGkO3VTrmLxU9DSDGAzFLd1IMn";

const ACCESS_TOKEN_DURATION = "2h";
const REFRESH_TOKEN_DURATION = "7d";
const RESOURCE_TOKEN_DURATION = "5m";

const USER_TYPES = {ADMIN: 'ADMIN', HAIRDRESSER: 'HAIRDRESSER'}

function verifyLoginCredentials(username, password, ...types) {
	let userTypeFilters = [];
	let typeFilterParams = [];

	types.forEach(type => {
		userTypeFilters.push("userType = ?");
		typeFilterParams.push(type);
	});

	let userTypeFilter = ` AND (${userTypeFilters.join(" OR ")})`;

	let query = "SELECT ID, username, name, password, userType FROM appuser WHERE username = ?" + (types.length > 0 ? userTypeFilter : "");
	let params = (types.length > 0 ? [username, ...typeFilterParams] : [username]);

	return new Promise((resolve, reject) => {
		db.query(query, params).then(({result}) => {
			console.log(result);
			if (result.length === 0) {
				reject("No results found in db");
				return;
			}

			bcrypt.compare(password, result[0].password, function (err, isEqual) {
				if (err) {
					console.log(err);
					reject(err);
					return;
				}

				if (!isEqual) {
					reject("Wrong credentials");
				}

				resolve(result[0]);
			});
		}).catch(err => {
			reject(err);
		});
	});
}

function verifyLoginAndGenerateTokens(username, password, ...types) {
	return new Promise((resolve, reject) => {
		verifyLoginCredentials(username, password, ...types).then(result => {
			let payload = {
				ID: result.ID,
				username: result.username,
				name: result.name,
				userType: result.userType
			};

			generateTokens(payload).then(tokens => {
				resolve({...tokens, payload: payload});
			}).catch(err => {
				reject(err);
			});
		}).catch(err => {
			reject(err);
		});
	});
}

function verifyToken(accessToken) {
	return new Promise((resolve, reject) => {
		jwt.verify(accessToken, JWT_SECRET, {}, function (err, payload) {
			if (err) {
				reject(err);
				return;
			}

			resolve(payload);
		});
	});
}

function generateTokens(payload) {
	return new Promise(function (resolve, reject) {
		jwt.sign(payload, JWT_SECRET, {expiresIn: ACCESS_TOKEN_DURATION}, function (err, accessToken) {
			if (err) {
				console.log(err);
				reject(err);
			}

			jwt.sign({
				...payload,
				isRefreshToken: true
			}, JWT_SECRET, {expiresIn: REFRESH_TOKEN_DURATION}, function (err, refreshToken) {
				if (err) {
					console.log(err);
					reject(err);
				}

				resolve({accessToken, refreshToken});
			});
		});
	});
}

function generateResourceToken(fileID) {
	let payload = {
		isResourceToken: true,
		fileID: fileID
	};

	return new Promise(function (resolve, reject) {
		jwt.sign(payload, RESOURCE_JWT_SECRET, {expiresIn: RESOURCE_TOKEN_DURATION}, function (err, resourceToken) {
			if (err) {
				console.log(err);
				reject(err);
			}

			resolve({resourceToken});
		});
	});
}

function refreshAccessToken(refreshToken) {
	return new Promise((resolve, reject) => {
		verifyToken(refreshToken).then(payload => {
			generateTokens(payload).then(tokens => {
				resolve(tokens);
			}).catch(err => {
				reject(err);
			});
		}).catch(err => {
			reject(err);
		});
	});
}

function extractTokenFromRequest(req, res) {
	let auth;

	if (req.cookies.jwt) {
		auth = req.cookies.jwt;
	} else {
		auth = req.header("Authorization");
	}

	if (!auth) {
		res.status(401).json({err: "Unauthorized"});
		return;
	}

	if (!auth.startsWith("Bearer ")) {
		res.status(401).json({err: "Unauthorized"});
		return;
	}
	return auth.slice(7);
}

function mustBeAuthenticated(req, res, next) {
	let accessToken = extractTokenFromRequest(req, res);

	jwt.verify(accessToken, JWT_SECRET, {}, function (err, payload) {
		if (err) {
			res.status(401).json({err: "Unauthorized"});
			return;
		}

		if (payload.isRefreshToken) {
			res.status(401).json({err: "Unauthorized"});
			return;
		}

		req.tokenPayload = payload;
		next();
	});
}

function mustBeAdmin(req, res, next) {
	let accessToken = extractTokenFromRequest(req, res);

	jwt.verify(accessToken, JWT_SECRET, {}, function (err, payload) {
		if (err) {
			res.status(401).json({err: "Unauthorized"});
			return;
		}

		db.query(`SELECT userType FROM appuser WHERE ID = ?`, [payload.ID]).then(({result}) => {
			if (result[0].userType !== USER_TYPES.ADMIN) {
				res.status(403).json({err: "Not an admin"});
			} else {
				next();
			}
		}).catch(err => {
			console.log(err);
			res.status(401).json({err: "Couldn't verify your permissions"});
		});


		req.tokenPayload = payload;
	});
}

function mustHaveResourceToken(req, res, next) {
	let resourceToken = req.query.t;

	if (!resourceToken) {
		resourceToken = extractTokenFromRequest(req, res);
	}

	jwt.verify(resourceToken, RESOURCE_JWT_SECRET, {}, function (err, payload) {
		if (err) {
			res.status(401).json({err: "Unauthorized"});
		} else {
			db.query("SELECT * FROM clientFiles WHERE ID = ?", [payload.fileID]).then(({result}) => {
				const decodedUrl = req.originalUrl.slice(1, req.originalUrl.lastIndexOf("/") + 1) + decodeURIComponent(req.originalUrl.slice(req.originalUrl.lastIndexOf("/") + 1, req.originalUrl.indexOf("?")));
				console.log(req.originalUrl.slice(req.originalUrl.lastIndexOf("/") + 1, req.originalUrl.indexOf("?")));
				console.log(decodedUrl);

				if (result.length > 0) {
					if (result[0].file === decodedUrl) {
						req.tokenPayload = payload;
						next();
					} else {
						console.log("Wrong file url");
						res.status(401).json({err: "Couldn't verify your permissions"});
					}
				} else {
					console.log("No client file results found for your token");
					res.status(401).json({err: "Couldn't verify your permissions"});
				}
			}).catch(err => {
				console.log(err);
				res.status(401).json({err: "Couldn't verify your permissions"});
			});
		}
	});
}

module.exports.ACCESS_TOKEN_DURATION = ACCESS_TOKEN_DURATION
module.exports.REFRESH_TOKEN_DURATION = REFRESH_TOKEN_DURATION
module.exports.USER_TYPES = USER_TYPES;
module.exports.verifyLoginCredentials = verifyLoginCredentials;
module.exports.verifyLoginAndGenerateTokens = verifyLoginAndGenerateTokens;
module.exports.verifyToken = verifyToken;
module.exports.generateTokens = generateTokens;
module.exports.generateResourceToken = generateResourceToken;
module.exports.mustBeAuthenticated = mustBeAuthenticated;
module.exports.mustBeAdmin = mustBeAdmin;
module.exports.mustHaveResourceToken = mustHaveResourceToken;
