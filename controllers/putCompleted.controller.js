const db = require('../database/mysql');

function putCompleted(data){
	return db.obtenerDatosVenta(data).then((datos)=>{
		db.folioExiste(data.folio).then(item => {
            //Si el folio existe
			if (item[0].folioExiste === 1){
				db.putCompleted(datos);
			}
			else{
				
			}
		});
		// 
	})
}
module.exports = {
	putCompleted
}