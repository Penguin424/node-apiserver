///============
///puerto
///============

process.env.PORT = process.env.PORT || 3000;

///============
///Etorno 
///============

process.env.NODE_ENV = process.env.NODE_ENV || 'dev';


///============
///Base de datos
///============

let urlDB;

if (process.env.NODE_ENV === 'dev') {
    urlDB = 'mongodb://localhost:27017/cafe'
} else {
    urlDB = 'mongodb+srv://Penguin424:FJA1Dr5tTyFGT6ZW@cluster0-ajy2p.mongodb.net/test'
}
process.env.URLDB = urlDB;