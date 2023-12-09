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
	
	// var currentDateObj = new Date();

	// //Obtenemos la zona horaria del usuario
	// var timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
	// // console.log(timezone);
	// //Obtenemos la diferencia de hora entre el servidor y la computadora en minutos
	// var diffTZ = currentDateObj.getTimezoneOffset();
	// //Obtenemos la diferencia de hora entre el servidor y la computadora en horas
	// var difHoras = parseInt(diffTZ)/60;
	// // console.log(difHoras);
	// //Obtenemos la hora del servidor
	// var numberOfMlSeconds = currentDateObj.getTime();
	// //obtenemos la cantidad de milisegundos en una hora
	// var addMlSeconds = 60 * 60000;
	// //obtenemos la diferencia de hora entre servidor y usuario en milisegundos
	// var totalDifMilisegundos = addMlSeconds * difHoras;
	// //Restamos los milisegundos a la hora del servidor para obtener la hora del usuario
	// let userTime = new Date(numberOfMlSeconds - totalDifMilisegundos);
	// // console.log(currentDateObj);
	// console.log(userTime);
	// // console.log(currentDateObj.toString());
	// console.log(userTime.getTime());
	return new Promise((resolve,reject) => {
		connection.query( `SELECT user_id, CONCAT(firstname, ' ' , lastname) AS fullname FROM users; `, (error, result) =>{
			if(error) return reject(error);
			resolve(result);
		})
	});
}

//Consultamos todas las transacciones de la base de datos
function getTransactions(){
	return new Promise((resolve,reject) => {
		connection.query( `SELECT folio as idTransaccion, total as precio, SUBSTRING(fecha, 1, 10) as fecha, tipopago, estacion  AS mostrador, sucursal as tienda, cajero as vendedor, estatus FROM detventas; `, (error, result) =>{
			if(error) return reject(error);
			resolve(result);
		})
	});
}

//Obtenemos toda la información de una venta específica
function obtenerDatosVenta(folio){
	return new Promise((resolve,reject) => {
			connection.query(`SELECT id, folio, tipopago, efectivo, targeta, monedero, total, cliente, sucursal, pagocon, SUBSTRING(fecha, 1, 10) as fecha, cajero, descuento, cantidaddescuento, turno, saldocliente, clientecredito, estacion, foliocorte, dolares, estatus FROM detventas WHERE folio = '${folio}' `, (error, result) =>{
			if(error) return reject(error);
			resolve(result);
			})
	}); 
}

//Si el estatus de una venta es diferente a cancelado, realizamos la cancelación
function putCancelled(venta){
	return new Promise((resolve,reject) => {
		connection.query( `UPDATE detventas SET estatus = 'cancelado'  WHERE folio = '${venta[0].folio}' ; `, (error, result) =>{
		if(error) return reject(error);
		resolve(result);
		pasarVentaACancelacion(venta);
		})
	});
}

//Todos los datos de una venta son tranferidos a la tabla de cancelaciones sin eliminarlos de la tabla detventas
function pasarVentaACancelacion(data){
	var zonaHoraria = Intl.DateTimeFormat().resolvedOptions().timeZone;
	console.log(zonaHoraria);

	var today = new Date();
	var ahora = today.toISOString();
	ahora = ahora.substring(0,22);
	var hora = ahora.slice(11,19);
	console.log(hora);
	// var fecha = new Date().now();
	// console.log(fecha);
	// var fechaCadena = fecha.toString;
	// console.log(fechaCadena);
	// var horaCadena = fechaCadena.slice(17,24);
	// console.log(horaCadena);

	// let hour = fecha.getHours() + ":" + fecha.getMinutes() + ":" + fecha.getSeconds();
	// console.log(hour);

	return new Promise((resolve,reject) => {
		connection.query( `INSERT INTO cancelaciones (id, folio, producto, cantidad, precio, costo, fecha, zona_horaria, hora, motivo, cajero, turno, importe, sucursal, estacion, foliocorte) VALUES (NULL, '${data[0].folio}', '', '', '', '', '${data[0].fecha}', '${zonaHoraria}' , '${ahora}', '', '${data[0].cajero}', '${data[0].turno}', '${data[0].total}', '${data[0].sucursal}', '${data[0].estacion}', '${data[0].foliocorte}'); `,
	  	(err, result) => {
	    	if (err) throw err;
	  	});

	});
}

//Recibimos la información de una venta y actualizamos su estado a COMPLETADO
function putCompleted(venta){
	console.log(venta[0].folio);
	return new Promise((resolve,reject) => {
		// if(venta[0].estatus === ''  ){
			console.log('entramos al update')
			connection.query( `UPDATE detventas SET estatus = 'completado'  WHERE folio = '${venta[0].folio}' ;`, (error, result) =>{
			if(error) return reject(error);
			resolve(result);
			})
		// }
		// else{
		// 	console.log('El estatus no se puede marcar como completado');
		// }
	});
}

//Comprobamos si el usuario y contraseña la autenticación existen en la base de datos
function obtenerCredencialesUsuario(username, password){
	return new Promise((resolve,reject) => {
		connection.query( `SELECT EXISTS(SELECT user_email, user_password_hash FROM users WHERE user_email = '${username}' AND user_password_hash =  '${password}') AS encontrado; `, (error, result) =>{
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
	obtenerCredencialesUsuario
}