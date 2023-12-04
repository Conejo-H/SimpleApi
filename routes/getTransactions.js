const express = require('express');
const getTransactionsController = require('../controllers/getTransactions.controller');
const respuesta = require ('../red/respuestas');

const router = express.Router();

router.get('/',getTransactions);
async function getTransactions(req, res){
	try{
		const items = await getTransactionsController.getTransactions();
		respuesta.success(req, res, items, 200);	
	}
	catch(err){
		respuesta.error(res, res, err, 500);	
	}	
};

module.exports = router;