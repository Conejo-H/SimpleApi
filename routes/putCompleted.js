const express = require('express');
const putCompletedController = require('../controllers/putCompleted.controller');
const respuesta = require ('../red/respuestas');
const router = express.Router();

router.put('/:folio/complete',putCompleted);

async function putCompleted(req, res, next){
	try{
		const items = await putCompletedController.putCompleted(req.params);
		respuesta.success(req, res, 'Venta completada', 200);
	}
	catch(err){
		respuesta.error(res,res, err, 500);	
	}	
};


module.exports = router;