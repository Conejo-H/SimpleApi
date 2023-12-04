const express = require('express');
const getUsersController = require('../controllers/getUsers.controller');
const respuesta = require ('../red/respuestas');

const router = express.Router();

router.get('/',getUsers);
async function getUsers(req, res){
	try{
		const items = await getUsersController.getUsers();
		respuesta.success(req, res, items, 200);	
	}
	catch(err){
		respuesta.error(res,res, err, 500);	
	}	
};


module.exports = router;