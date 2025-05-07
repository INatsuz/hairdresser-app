const mariadb = require("mariadb");

console.log("test");

const pool = mariadb.createPool({
	connectionLimit: 10,
	host: process.env.DB_HOST,
	user: process.env.DB_USERNAME,
	password: process.env.DB_PASSWORD,
	database: 'fisiodesporto',
	timezone: 'Z',
	charset: 'utf8mb4'
});

function query(query, params, callback) {
	return new Promise(function (resolve, reject) {
		pool.getConnection().then(conn => {
			conn.query(query, params).then(rows => {
				conn.end();
				if (callback) {
					callback(rows);
				}

				resolve({result: rows});
			}).catch(err => {
				reject(err);
			});
		}).catch(err => {
			reject(err);
		});
	});
}

module.exports.query = query;
