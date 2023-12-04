const config = require('./config');
const express = require('express');
const morgan = require('morgan');
// const db = require('./database/mysql');
const app = express();
const port = config.app.port;

app.use(morgan('start'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Rutas 
//Endpoint de GetUsers
app.get("/", (req, res) => {
	res.json("Hola Yadi");
});

//Rutas 
//Endpoint de GetUsers
const getUsersRoute = require('./routes/getUsers');
app.use("/api/v1/getEmployees", getUsersRoute);

const router = express.Router();

app.get('/usuarios',getUsers);
async function getUsers(req, res){
	try{
		const items = await db.getUsers();
		res.json(items);
	}
	catch(err){
		throw err;	
	}	
};


module.exports = router;

//Nos conectamos al puerto 8000
app.listen(port, ()=> console.log(`Escuchando al puerto ${port}`));