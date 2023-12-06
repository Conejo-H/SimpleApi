const db = require('../database/mysql');
const respuesta = require ('../red/respuestas');

function putCompleted(req, res){
	try{
		return db.obtenerDatosVenta(req.params.folio).then((items)=>{
			try{
				db.putCompleted(items);
				res.send({respuesta: 'Estatus actualizado a completado'});
			}
			catch{
				res.send({respuesta: 'Folio no encontrado'});	
			}
	
		})
	}
	catch(err){
		respuesta.error(res,res, err, 500);
	}
}
module.exports = {
	putCompleted
}