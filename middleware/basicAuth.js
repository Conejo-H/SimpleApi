const auth = require('basic-auth');
const db = require('../database/mysql');

//Creamos nuestra función para usar Basic Authentication
const mwBasicAuth = async (req , res, next) => {

	const user = await auth(req);
	console.log(user);

	//Validamos el usuario
	if (typeof user.name !== 'undefined' && typeof user.pass !== 'undefined'){
		console.log(user.name, user.pass);
		db.obtenerCredencialesUsuario(user.name, user.pass).then(item =>{
			// console.log(`Este valor regresa la consulta de inicio de sesión:  ${item[0].encontrado}`);
			if (item[0].encontrado === 1 ){
				next();
			}
			else{
				console.log('Basic Auth: failed')
				res.statusCode = 401
				res.send('Access denied')
			}			
		});
	}
	else{
		res.send('Access denied')
	}
}

module.exports = mwBasicAuth;