const express = require('express');
const morgan = require('morgan');
const app = express();
const port = 3000;

app.use(morgan('start'));
app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Rutas 
//Endpoint de GetUsers
app.get("/", (req, res) => {
	res.json("Hola Yadi");
});

//Nos conectamos al puerto 8000
app.listen(port, ()=> console.log(`Escuchando al puerto ${port}`));