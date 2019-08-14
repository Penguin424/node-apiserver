const express = require('express'); //frame work
const app = express(); // app para midelle wares
const Usuario = require('../models/usuario'); //Escema usado para la base de datos 
const bcrypt = require('bcrypt'); //Encriptador de contrseñas
const _ = require('underscore'); // Seleccionador de ṕarametros para actualizar
const jwt = require('jsonwebtoken'); // Generador de tokens para validacion 



const { OAuth2Client } = require('google-auth-library');
const client = new OAuth2Client(process.env.CLIENT_ID);





//cONFIGURACIONES DE GOOGLE 
async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID // Specify the CLIENT_ID of the app that accesses the backend
            // Or, if multiple clients access the backend:
            //[CLIENT_ID_1, CLIENT_ID_2, CLIENT_ID_3]
    });
    const payload = ticket.getPayload();

    return {
        nombre: payload.name,
        email: payload.email,
        img: payload.picture,
        google: true
    }
}






const controller = { // Controller es el JSON utilizado para guardar la logica en los servicios que brinda la api
    obtenerUsuario: function(req, res) {

        let desde = parseInt(req.get('desde') || 0); // Variable que require elementos opcionales para inciar los valores o usuairos que quieran ser mostrados
        let limite = parseInt(req.get('limite') || 5); // Varbiable que requiere elemeto para mostrar hasta donde quieren ser mostrados llos usuarios 


        Usuario.find({ estado: true }, 'nombre email role estado google img') // {estado: true} muestra solo los usuarios con estado igual a true y el siguiente parametro muestra solo los values dentro del archivo JSON
            .skip(desde) // incia la busqueda desde el numero indicado
            .limit(limite) // Termina la busqueda desde el numero indicado
            .exec((err, usuarioDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                //Cuenta los arcvhicos JSON retornados y los muestra teniendo un indicador por debajo de toda la respuesta
                Usuario.countDocuments({ estado: true }, (err, conteo) => {

                    // if (usuarioDB.estado === true) {
                    res.json({ ok: true, usuarioDB, cuantos: conteo })
                        //}


                });



            });
    },
    //Crea un usuario en la base de datps 
    crearUsuario: function(req, res) {
        let body = req.body;

        let usuario = new Usuario({
            nombre: body.nombre,
            email: body.email,
            password: bcrypt.hashSync(body.password, 10), //Incripta la contrseña con una cantidad de 10 vueltas
            role: body.role
        });

        usuario.save((err, usuarioDb) => { // Guarda y crea el usuario en la base de datps
            if (err) {
                return res.status(400).json({
                    ok: false,
                    err
                });
            }

            //usuarioDb.password = null

            res.json({
                ok: true,
                usuario: usuarioDb
            });

        });
    },

    actualizarUsuario: function(req, res) { // Actualiza el usuarios _.pick(solo deja actualizar los parametros dentro del array new: True manda la info del archivo modificado runValidators ejecuta las validaciones implementadas en el Schema
        let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
        let id = req.params.id
        Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, userDB) => {

            if (err) {

                return res.status(400).json({ ok: false, err });
            }

            res.json({ ok: true, usuario: userDB });


        });
    },
    // Borra un usuario de la base dedatos pero en relidad solo cambia su estado a false para luego no perder informacion valiosa el segundo parametro {estadp: false} es el que se encarga de hacerlo
    borrarUsuario: function(req, res) {
        let id = req.params.id;

        Usuario.findByIdAndUpdate(id, { estado: false }, { new: true, runValidators: true, context: 'query' }, (err, userDB) => { // primer parametro pide el id del usuario segundo modifica lo que tendra que ser modificado y tercero aplica las validaciones antes aplicadas
            if (err) {
                return res.status(400).json({ ok: false, err })
            }

            if (!userDB) {

                return res.status(400).json({
                    ok: false,
                    err: {
                        message: 'usuario no encontrado'
                    }
                })
            }


            res.json({ ok: true, usuario: userDB });

        });
    },

    // Es el login con la auto identifiacion de los datos
    login: (req, res) => {

        let body = req.body;

        Usuario.findOne({ email: body.email }, (err, userDB) => { // Coge el email del usuario y lo busca en la base de datos

            if (err) {
                return res.status(500).json({ ok: false, err })
            }

            if (!userDB) {
                return res.status(400).json({ ok: false, err: { message: '(Usuario) o contraseña incorrectos' } })
            }

            if (!bcrypt.compareSync(body.password, userDB.password)) { //Compara la contraseña del usuario con la contraseña proporcionada la funcion solo hace eso mas facil para no tener que desencriptar la contraseña
                return res.status(400).json({ ok: false, err: { message: 'Usuario o (contraseña) incorrectos' } })

            }

            let token = jwt.sign({ usuario: userDB }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }); //Gnera el token para la validacion de los procesos al momento de loggear

            res.json({ ok: true, usuario: userDB, token });

        });

    },

    google: async(req, res) => {

        let token = req.body.idtoken;


        let googleUser = await verify(token)
            .catch(e => {
                return res.status(403).json({
                    ok: false,
                    err: e
                });
            });

        Usuario.findOne({ email: googleUser.email }, (err, usuarioDB) => {

            if (err) {
                return res.status(500).json({ ok: false, err })
            }

            if (usuarioDB) {

                if (usuarioDB.google === false) {
                    return res.status(400).json({ ok: false, err: { message: 'Debe de usar su autentificacion normal' } })
                } else {
                    let token = jwt.sign({ usuario: usuarioDB },
                        process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN }); //Gnera el token para la validacion de los procesos al momento de loggear

                    return res.json({
                        ok: true,
                        usuarios: usuarioDB,
                        token
                    })
                }
            } else {
                // si el usuario no existe en nuestra base de datos

                let usuario = new Usuario({
                    nombre: googleUser.nombre,
                    email: googleUser.email,
                    img: googleUser.img,
                    google: googleUser.google,
                    password: ':)'
                });



                usuario.save((err, userDB) => {
                    if (err) {
                        return res.status(400).json({
                            ok: false,
                            err
                        });
                    }

                    let token = jwt.sign({ usuario: userDB },
                        process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

                    //usuarioDb.password = null

                    res.json({
                        ok: true,
                        usuarios: userDB,
                        token
                    });
                })

            }


        })


    }

}

module.exports = { controller } // Exporta los controladores para luego ser agreagdos en las rutas