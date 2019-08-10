require('./config/config'); // EJECUTA LAS CONFIGURACIONES  
const express = require('express'); //Framework
const mongoose = require('mongoose'); // Base de datos libreria
const app = express(); // Ejecucion de los middle wares o de la app dependiendo del uso 
const bodyParser = require('body-parser'); // Intermediario para poder requerir los parametros de las peticiones como el body o los headers
const routers = require('./routes/routers'); // Rutas de peticiones 
const path = require('path');

//MIDDLE WARES 
// Decodificaion de los datos para las peticiones
app.use(bodyParser.urlencoded({ extended: false }));
// Convercion a formato JSON
app.use(bodyParser.json());
// Implementacion de la rutas exportadas 
app.use(routers);
//Hablitiar public
app.use(express.static(path.resolve(__dirname, '../public')));



// Levantamiento del servidor 
app.listen(process.env.PORT, () => {
    console.log('Esuchando en el puerto: ', process.env.PORT);
});

// Coneccion a la base de datos 
mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => { // Segundo parametro es opcional o recomendado de mongo db no se que haga en realidad 


    if (err) throw err;

    console.log('Base de datos online')
});

// Parametros recomentados para por mongoose
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);