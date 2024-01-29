const express = require('express');
const db = require("../utils/db");
const {mustBeAdmin, mustBeAuthenticated} = require("../utils/authentication");
const router = express.Router();

router.get('/getAppointments', mustBeAdmin, function (req, res) {
	let {startDate, endDate} = req.query;

	let clauses = [];
	let queryVariables = [];

	let queryFilter = "";

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

	db.query(`SELECT appointment.*, service.name as serviceName, client.name as clientName, appuser.name as assignedUserName
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
	}).catch(err => {
		console.log(err);
		res.json(err);
	});
});

router.get('/getAssignedAppointments', mustBeAuthenticated, function (req, res) {
	db.query("SELECT * FROM appointment WHERE assignedUser = ?", [req.tokenPayload.ID]).then(({result}) => {
		console.log(result);
		res.json(result);
	}).catch(err => {
		console.log(err);
		res.json(err);
	});
});

router.post('/addAppointment', mustBeAdmin, function (req, res) {
	db.query("INSERT INTO appointment(serviceID, clientID, assignedUser, price, timeStart, timeEnd, observations) VALUES(?, ?, ?, ?, ?, ?, ?)",
		[req.body.service, req.body.client, req.body.assignedUser, req.body.price, req.body.timeStart, req.body.timeEnd, req.body.observations]).then(({result}) => {
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
		[req.body.service, req.body.client, req.body.assignedUser, req.body.price, req.body.timeStart, req.body.timeEnd, req.body.observations, req.body.ID]).then(() => {
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
		console.log(result);
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
		console.log(result);
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
		console.log(result);
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

module.exports = router;
