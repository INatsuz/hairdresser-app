const express = require('express');
const fs = require('fs');
const path = require('path');
const db = require("../utils/db");
const {mustBeAdmin, mustBeAuthenticated} = require("../utils/authentication");
const router = express.Router();
const multer = require('multer')

const upload = multer({
	storage: multer.diskStorage(
		{
			destination: function (req, file, cb) {
				const path = `${__dirname}/../files/${req.body.clientId}`;
				fs.mkdirSync(path, {recursive: true});
				cb(null, path);
			},
			filename: (req, file, cb) => {
				cb(null, file.originalname);
			}
		}
	)
});

router.get('/getAppointments', mustBeAdmin, function (req, res) {
	let {startDate, endDate} = req.query;

	let clauses = [];
	let queryVariables = [];

	let queryFilter = "";

	if (startDate) {
		clauses.push("appointment.timeStart >= ?");
		queryVariables.push(new Date(req.query.startDate));
	}

	if (endDate) {
		clauses.push("appointment.timeEnd < ?");
		queryVariables.push(new Date(req.query.endDate));
	}

	if (clauses.length > 0) {
		queryFilter = "WHERE " + clauses.join(" AND ");
	}

	db.query(`SELECT appointment.*, service.name as serviceName, service.color, client.name as clientName, appuser.name as assignedUserName
					FROM appointment 
					LEFT JOIN service 
					ON service.ID = appointment.serviceID
					LEFT JOIN client
					ON client.ID = appointment.clientID
					LEFT JOIN appuser
					ON appuser.ID = appointment.assignedUser
					${queryFilter}
					ORDER BY appointment.timeStart ${!startDate && endDate ? "DESC" : "ASC"}
					`, [...queryVariables]).then(({result}) => {
		res.json(result);
		console.log(result[result.length - 1]);
	}).catch(err => {
		console.log(err);
		res.json(err);
	});
});

router.get('/getMarkedDates', mustBeAdmin, function (req, res) {
	let {startDate, endDate, timezone} = req.query;

	if (!timezone) {
		res.status(400).json({err: 'Timezone is required'});
	}

	let clauses = [];
	let queryVariables = [];

	let queryFilter = "";

	queryVariables.push(req.query.timezone);

	if (startDate) {
		clauses.push("appointment.timeStart >= STR_TO_DATE(?, '%Y-%m-%dT%T.000Z')");
		queryVariables.push(req.query.startDate);
	}

	if (endDate) {
		clauses.push("appointment.timeEnd < STR_TO_DATE(?, '%Y-%m-%dT%T.000Z')");
		queryVariables.push(req.query.endDate);
	}

	if (clauses.length > 0) {
		queryFilter = "WHERE " + clauses.join(" AND ");
	}

	db.query(`SELECT ID, DATE(CONVERT_TZ(timeStart, 'UTC', ?)) as convertedTime
					${queryFilter}
					FROM appointment
					GROUP BY convertedTime
					`, [...queryVariables]).then(({result}) => {
		res.json(result);
		console.log(result[result.length - 1].convertedTime);
	}).catch(err => {
		console.log(err);
		res.json(err);
	});
});

router.get('/getAssignedAppointments', mustBeAuthenticated, function (req, res) {
	db.query("SELECT * FROM appointment WHERE assignedUser = ?", [req.tokenPayload.ID]).then(({result}) => {
		res.json(result);
	}).catch(err => {
		console.log(err);
		res.json(err);
	});
});

router.post('/addAppointment', mustBeAdmin, function (req, res) {
	db.query("INSERT INTO appointment(serviceID, clientID, assignedUser, price, timeStart, timeEnd, observations) VALUES(?, ?, ?, ?, ?, ?, ?)",
		[req.body.service, req.body.client, req.body.assignedUser, req.body.price, new Date(req.body.timeStart), new Date(req.body.timeEnd), req.body.observations]).then(({result}) => {
		res.status(200).send("Added new assignment successfully");
		console.log("Added new assignment successfully");
	}).catch(err => {
		res.status(400).send("Failed to add new assignment");
		console.log("Failed to add new assignment");
		console.log(err);
	});
});

router.put("/editAppointment", mustBeAdmin, function (req, res) {
	db.query("UPDATE appointment SET serviceID = ?, clientID = ?, assignedUser = ?, price = ?, timeStart = ?, timeEnd = ?, observations = ? WHERE ID = ?",
		[req.body.service, req.body.client, req.body.assignedUser, req.body.price, new Date(req.body.timeStart), new Date(req.body.timeEnd), req.body.observations, req.body.ID]).then(() => {
		res.status(200).send("Edited appointment successfully");
		console.log("Edited appointment successfully");
	}).catch(err => {
		res.status(400).send("Failed to edit appointment");
		console.log("Failed to edit appointment");
		console.log(err);
	});
});

router.delete("/deleteAppointment/:ID", mustBeAdmin, function (req, res) {
	db.query("DELETE FROM appointment WHERE ID = ?", [req.params.ID]).then(() => {
		res.status(200).send("Deleted appointment successfully");
		console.log("Deleted appointment successfully");
	}).catch(err => {
		res.status(400).send("Failed to delete appointment");
		console.log("Failed to delete appointment");
		console.log(err);
	});
});

router.get('/getClients', mustBeAdmin, function (req, res) {
	db.query("SELECT * FROM client").then(({result}) => {
		res.status(200).json(result);
	}).catch(err => {
		res.status(400);
		console.log(err);
		res.json(err);
	});
});

router.post('/addClient', mustBeAdmin, function (req, res) {
	req.body.phone = req.body.phone.replace(/ /g, "");

	db.query("INSERT INTO client(name, phone, email, birthday, nif, address, observations) VALUES(?, ?, ?, ?, ?, ?, ?)", [req.body.name, req.body.phone, req.body.email, req.body.birthday, req.body.nif, req.body.address, req.body.observations]).then(() => {
		res.status(200).send("Added new client successfully");
		console.log("Added new client successfully");
	}).catch(err => {
		res.status(400).send("Failed to add new client");
		console.log("Failed to add new client");
		console.log(err);
	});
});

router.put("/editClient", mustBeAdmin, function (req, res) {
	req.body.phone = req.body.phone.replace(/ /g, "");

	db.query("UPDATE client SET name = ?, phone = ?, email = ?, birthday = ?, nif = ?, address = ?, observations = ? WHERE ID = ?", [req.body.name, req.body.phone, req.body.email, req.body.birthday, req.body.nif, req.body.address, req.body.observations, req.body.ID]).then(() => {
		res.status(200).send("Edited client successfully");
		console.log("Edited client successfully");
	}).catch(err => {
		res.status(400).send("Failed to edit client");
		console.log("Failed to edit client");
		console.log(err);
	});
});

router.delete("/deleteClient/:ID", mustBeAdmin, function (req, res) {
	db.query("DELETE FROM client WHERE ID = ?", [req.params.ID]).then(() => {
		res.status(200).send("Deleted client successfully");
		console.log("Deleted client successfully");
	}).catch(err => {
		res.status(400).send("Failed to delete client");
		console.log("Failed to delete client");
		console.log(err);
	});
});

router.get('/getServices', mustBeAdmin, function (req, res) {
	db.query("SELECT * FROM service").then(({result}) => {
		res.status(200).json(result);
	}).catch(err => {
		res.status(400);
		console.log(err);
		res.json(err);
	});
});

router.post('/addService', mustBeAdmin, function (req, res) {
	db.query("INSERT INTO service(name, price, estimatedTime, color) VALUES(?, ?, ?, ?)", [req.body.name, req.body.price, req.body.estimatedTime, req.body.color]).then(() => {
		res.status(200).send("Added new service successfully");
		console.log("Added new service successfully");
	}).catch(err => {
		res.status(400).send("Failed to add new service");
		console.log("Failed to add new service");
		console.log(err);
	});
});

router.put("/editService", mustBeAdmin, function (req, res) {
	db.query("UPDATE service SET name = ?, price = ?, estimatedTime = ?, color = ? WHERE ID = ?", [req.body.name, req.body.price, req.body.estimatedTime, req.body.color, req.body.ID]).then(() => {
		res.status(200).send("Edited service successfully");
		console.log("Edited service successfully");
	}).catch(err => {
		res.status(400).send("Failed to edit service");
		console.log("Failed to edit service");
		console.log(err);
	});
});

router.delete("/deleteService/:ID", mustBeAdmin, function (req, res) {
	db.query("DELETE FROM service WHERE ID = ?", [req.params.ID]).then(() => {
		res.status(200).send("Deleted service successfully");
		console.log("Deleted service successfully");
	}).catch(err => {
		res.status(400).send("Failed to delete service");
		console.log("Failed to delete service");
		console.log(err);
	});
});

router.get("/getUsers", mustBeAdmin, function (req, res) {
	db.query("SELECT ID, username, name, userType, notificationToken FROM appuser").then(({result}) => {
		res.status(200).json(result);
	}).catch(err => {
		res.status(400);
		console.log(err);
		res.json(err);
	});
});

router.delete("/deleteUser/:ID", mustBeAdmin, function (req, res) {
	db.query("DELETE FROM appuser WHERE ID = ?", [req.params.ID]).then(() => {
		res.status(200).send("Deleted user successfully");
		console.log("Deleted user successfully");
	}).catch(err => {
		res.status(400).send("Failed to delete user");
		console.log("Failed to delete user");
		console.log(err);
	});
});

router.post("/saveClientFile", upload.single('file'), mustBeAdmin, function (req, res, next) {
	// Checks if all information necessary is given (client ID and the file)
	if (!req.body.clientId || !req.file) {
		res.status(400);
	}

	const relativePath = path.relative(__dirname + "/..", req.file.path);
	console.log(relativePath);

	db.query("INSERT INTO clientFiles VALUES (NULL, ?, ?)", [req.body.clientId, relativePath]).then(() => {
		res.status(201).send("File saved successfully");
	}).catch(err => {
		console.log(err);
		res.status(400).send("Failed to save file");
	});
});

router.get("/getClientFiles", mustBeAdmin, function (req, res, next) {
	db.query("SELECT * FROM clientFiles WHERE clientID = ?", [req.query.clientID]).then(({result}) => {
		console.log(result);
		res.status(200).json(result);
	}).catch(err => {
		console.log(err);
		res.status(400).send("Couldn't get client files");
	});
});

router.delete("/deleteClientFile", mustBeAdmin, function (req, res, next) {
	db.query("SELECT * FROM clientFiles WHERE ID = ?", [req.query.ID]).then(({result}) => {
		if (result.length > 0) {
			fs.rmSync(path.resolve(__dirname + "/../" + result[0].file));

			db.query("DELETE FROM clientFiles WHERE ID = ?", [req.query.ID]).then(({result}) => {
				console.log(result);
				res.status(200).send("Deleted file successfully");
			}).catch(err => {
				console.log(err);
				res.status(400).send("Couldn't delete file");
			});
		} else {
			res.status(400).send("Couldn't delete file");
		}
	}).catch(err => {
		console.log(err);
		res.status(400).send("Couldn't delete file");
	});
});

router.put("/renameClientFile", mustBeAdmin, function (req, res, next) {
	db.query("SELECT * FROM clientFiles WHERE ID = ?", [req.body.ID]).then(({result}) => {
		if (result.length > 0) {
			console.log(result[0]);
			const newPath = path.relative(__dirname + "/..", result[0].file.slice(0, result[0].file.lastIndexOf("/") + 1) + req.body.newFilename + result[0].file.slice(result[0].file.lastIndexOf(".")));
			console.log(newPath);

			fs.renameSync(path.resolve(__dirname + "/../" + result[0].file), path.resolve(__dirname + "/../" + newPath));
			db.query("UPDATE clientFiles SET file = ? WHERE ID = ?", [newPath, req.body.ID]).then(({result}) => {
				console.log(result);
				res.status(200).send("Renamed file successfully");
			}).catch(err => {
				console.log(err);
				res.status(400).send("Couldn't rename file");
			});
		} else {
			res.status(400).send("Couldn't rename file");
		}
	}).catch(err => {
		console.log(err);
		res.status(400).send("Couldn't rename file");
	});
});

module.exports = router;
