const db = require('../database/mysql');
const respuesta = require ('../red/respuestas');

function putCancelled(req, res){
	try{
		return db.obtenerDatosVenta(req.params.folio).then((venta)=>{	
			try{
				if (venta[0].estatus !== 'cancelado'){
					db.putCancelled(venta);
					res.send({respuesta: 'Estatus actualizado a cancelado'});
				}
				else{
					res.send({respuesta: 'No se puede marcar como cancelada una venta cancelada'});
				}
				
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