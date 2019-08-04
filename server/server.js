require('./config/config');
const express = require('express');
const mongoose = require('mongoose');
const app = express();
const bodyParser = require('body-parser');
const routers = require('./routes/routers');


app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.use(routers);



app.listen(process.env.PORT, () => {
    console.log('Esuchando en el puerto: ', process.env.PORT);
});

mongoose.connect(process.env.URLDB, { useNewUrlParser: true, useCreateIndex: true }, (err, res) => {


    if (err) throw err;

    console.log('Base de datos online')
});

mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);