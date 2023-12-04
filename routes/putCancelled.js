const express = require('express');
const putCancelledController = require('../controllers/putCancelled.controller');
const respuesta = require ('../red/respuestas');

const router = express.Router();

router.put('/:folio/cancel',putCancelled);

async function putCancelled(req, res){
	try{

		const item = await putCancelledController.putCancelled(req.params);
		console.log(req.params);
		req.body = item;
		//respuesta.success(req, res, 'Cancelado', 200);
	}
	catch(err){
		respuesta.error(res,res, err, 500);
	}
};


module.exports = router;