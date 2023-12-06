const db = require('../database/mysql');
const respuesta = require ('../red/respuestas');

function putCancelled(req, res){
	try{
		return db.obtenerDatosVenta(req.params.folio).then((venta)=>{
			
			try{
				console.log(venta[0].folio);
				db.putCancelled(venta);
				res.send({respuesta: 'Estatus actualizado a cancelado'});
			}
			catch{
				res.send({respuesta: 'Folio no encontrado'});
			}
		})
	}
	catch(err){
		res.status(200).send({mensaje: 'Ingrese un folio válido'});	
	}
}

module.exports = {
	putCancelled
}