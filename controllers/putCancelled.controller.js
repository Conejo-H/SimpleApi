const db = require('../database/mysql');

function putCancelled(folio){
	return db.obtenerDatosVenta(folio).then((datos)=>{
		db.folioExiste(folio.folio).then( item => {
            //Si el folio existe
			if (item[0].folioExiste === 1){
				db.putCancelled(datos);
			}
			else{
			}
		});
	})
}

module.exports = {
	putCancelled
}