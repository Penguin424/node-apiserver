///============
///puerto
///============

process.env.PORT = process.env.PORT || 3000;

///============
///Etorno 
///============

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';

///============
///Vencimiento token
///============
process.env.CADUCIDAD_TOKEN = '48h';

///============
///SEDD TOKEN
///============
process.env.SEED = process.env.SEED || 'este - es - el - seed - desarrollo';

///============
///Base de datos
///============

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = process.env.MONGO_URI;
}
process.env.URLDB = urlDB;

///============
///Google client Id
///============

process.env.CLIENT_ID = process.env.CLIENT_ID || '936602344714-tvv2sc0q4vqci57snkue4n721rndd10f.apps.googleusercontent.com';