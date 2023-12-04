const config = require('./config');
const express = require('express');
const morgan = require('morgan');
const db = require('./database/mysql');
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

// app.get("/usuarios", (req, res) => {
// 	res.send(db.getUsers());
// });

//Rutas 
//Endpoint de GetUsers
const getUsersRoute = require('./routes/getUsers');
app.use("/api/v1/getEmployees", getUsersRoute);

// //Endpoint de GetTransactions
// const getTransactionsRoute = require('./routes/getTransactions');
// app.use("/api/v1/getTransactions", getTransactionsRoute);

// //Endpoint de PostCancelled
// const putCancelledRoute = require('./routes/putCancelled');
// app.use("/api/v1/payments", putCancelledRoute);

// //Endpoint de PostCompleted
// const putCompletedRoute = require('./routes/putCompleted');
// app.use("/api/v1/payments", putCompletedRoute);

//Nos conectamos al puerto 8000
app.listen(port, ()=> console.log(`Escuchando al puerto ${port}`));