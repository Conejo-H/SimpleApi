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

//Consultamos todos los usuarios de la base de datos
function getUsers(){
	return new Promise((resolve,reject) => {
		connection.query(`SELECT user_id, CONCAT(firstname, ' ' , lastname) AS fullname FROM users;`, (error, result) =>{
			if(error) return reject(error);
			resolve(result);
		})
	});
}

//Consultamos todas las transacciones de la base de datos
function getTransactions(){
	return new Promise((resolve,reject) => {
		connection.query(`SELECT folio as idTransaccion, total as precio, SUBSTRING(fecha, 1, 10) as fecha, tipopago, estacion  AS mostrador, sucursal as tienda, cajero as vendedor, estatus FROM detventas;`, (error, result) =>{
			if(error) return reject(error);
			resolve(result);
		})
	});
}

//Obtenemos toda la información de una venta específica
function obtenerDatosVenta(data){
	return new Promise((resolve,reject) => {
			connection.query(`SELECT id, folio, tipopago, efectivo, targeta, monedero, total, cliente, sucursal, pagocon, cambio, SUBSTRING(fecha, 1, 10) as fecha, cajero, descuento, cantidaddescuento, turno, saldocliente, clientecredito, estacion, foliocorte, dolares, estatus FROM detventas WHERE folio = '${data.folio}'`, (error, result) =>{
			if(error) return reject(error);
			resolve(result);
			})
	}); 
}

//Si el estatus de una venta es diferente a cancelado, realizamos la cancelación
function putCancelled(data){
	return new Promise((resolve,reject) => {
			if (data[0].estatus !== 'cancelado'){
				connection.query(`UPDATE detventas SET estatus = 'cancelado'  WHERE folio = '${data[0].folio}' ;`, (error, result) =>{
				if(error) return reject(error);
				resolve(result);
				pasarVentaACancelacion(data);
				})
			}
	});
}

//Todos los datos de una venta son tranferidos a la tabla de cancelaciones sin eliminarlos de la tabla detventas
function pasarVentaACancelacion(data){
	const date = new Date();
	let hour = date.getHours() + ":" + date.getMinutes() + ":" + date.getSeconds();
	console.log(hour);
	return new Promise((resolve,reject) => {
		connection.query(`INSERT INTO cancelaciones (id, folio, producto, cantidad, precio, costo, fecha, hora, motivo, cajero, turno, importe, sucursal, estacion, foliocorte) VALUES (NULL, '${data[0].folio}', '', '', '', '', '${data[0].fecha}', '${hour}', '', '${data[0].cajero}', '${data[0].turno}', '${data[0].total}', '${data[0].sucursal}', '${data[0].estacion}', '${data[0].foliocorte}');`,
	  	(err, result) => {
	    	if (err) throw err;
	  	});

	});
}

//Recibimos la información de una venta y actualizamos su estado a COMPLETADO
function putCompleted(data){
	return new Promise((resolve,reject) => {
		console.log(data[0].folio);
		if(data[0].estatus === '' ){
			connection.query(`UPDATE detventas SET estatus = 'completado'  WHERE folio = '${data[0].folio}' ;`, (error, result) =>{
			if(error) return reject(error);
			resolve(result);
			})
		}
	});
}

function folioExiste(data){
	return new Promise((resolve,reject) => {
			connection.query(`SELECT EXISTS ( SELECT folio FROM detventas WHERE folio = '${data}') AS folioExiste ;`, (error, result) =>{
			if(error) return reject(error);
			resolve(result);
		})
	});
}

//Comprobamos si el usuario y contraseña la autenticación existen en la base de datos
function obtenerCredencialesUsuario(username, password){
	return new Promise((resolve,reject) => {
		connection.query(`SELECT EXISTS(SELECT user_email, user_password_hash FROM users WHERE user_email = '${username}' AND user_password_hash =  '${password}') AS encontrado;`, (error, result) =>{
			if(error) return reject(error);
			resolve(result);
		})
	});
}

module.exports = {
	getUsers,
	getTransactions,
	obtenerDatosVenta,
	putCancelled,
	pasarVentaACancelacion,
	putCompleted,
	obtenerCredencialesUsuario,
	folioExiste
}