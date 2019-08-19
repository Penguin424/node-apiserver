// Verificar token

const jwt = require('jsonwebtoken'); // Libreria que se encarga de generear o validar tokens

let verificaToken = (req, res, next) => { //Declaracion de funcion
    let token = req.get('token'); // Requiere el token generado por medio de los paramatros

    jwt.verify(token, process.env.SEED, (err, decoded) => { // Verficia token otorgado
        if (err) return res.status(401).json({ ok: false, err });

        req.usuario = decoded.usuario; //Compara el token requerido con la informacion del usuario y los verifica
        next(); //Hace que toda la logica dentro del controlador continue despues de implemetar este middleware
    });

}

let verificaRole = (req, res, next) => { //Declaracion de funcion
    let usuario = req.usuario;

    if (usuario.role === 'ADMIN_ROLE') { // Verifica que el rol de usuaario sea admin para ejecutar ciertos procesos
        next(); //Hace que toda la logica dentro del controlador continue despues de implemetar este middleware
    } else {
        return res.status(401).json({ ok: false, err });
    }
}

//Verficacion de token para imagenes
let tokenIMG = (req, res, next) => {

    let token = req.query.token;


    jwt.verify(token, process.env.SEED, (err, decoded) => { // Verficia token otorgado
        if (err) return res.status(401).json({ ok: false, err });

        req.usuario = decoded.usuario; //Compara el token requerido con la informacion del usuario y los verifica
        next(); //Hace que toda la logica dentro del controlador continue despues de implemetar este middleware
    });

}

module.exports = { verificaToken, verificaRole, tokenIMG }; // Exporta los middlewares