const mysql = require('mysql');
const config = require('../config');

const dbconfig = {
	host: config.mysql.host,
	user: config.mysql.user,
	// port: config.mysql.db_port,
	password: config.mysql.password,
	database: config.mysql.database
}

let connection;
function connectSql(){
	connection = mysql.createConnection(dbconfig);
	connection.connect((err) => {
		if(err){
			console.log(err.code);
			console.log(err.fatal);
		}else{
			console.log("Base de datos conectada");
		}
	});

	connection.on('error', err => {
		console.log( '[db err]', err);
		if (err.code === 'PROTOCOL_CONNECTION_LOST') {
			connectSql();
		}else{
			throw err;
		}
	});
}

connectSql();

function getUsers(){
	return new Promise((resolve,reject) => {
		connection.query(`SELECT user_id, CONCAT(firstname, ' ' , lastname) AS fullname FROM users;`, (error, result) =>{
			if(error) return reject(error);
			resolve(result);
		})
	});
}

module.exports = {
	getUsers
}