const express = require('express');
const app = express();
const Usuario = require('../models/usuario');
const bcrypt = require('bcrypt');
const _ = require('underscore');
const jwt = require('jsonwebtoken');


const controller = {
    obtenerUsuario: function(req, res) {

        let desde = parseInt(req.get('desde') || 0);
        let limite = parseInt(req.get('limite') || 5);


        Usuario.find({ estado: true }, 'nombre email role estado google img')
            .skip(desde)
            .limit(limite)
            .exec((err, usuarioDB) => {
                if (err) {
                    return res.status(400).json({
                        ok: false,
                        err
                    });
                }

                Usuario.countDocuments({ estado: true }, (err, conteo) => {

                    // if (usuarioDB.estado === true) {
                    res.json({ ok: true, usuarioDB, cuantos: conteo })
                        //}


                });



            });
    },

    crearUsuario: function(req, res) {
        let body = req.body;

        let usuario = new Usuario({
            nombre: body.nombre,
            email: body.email,
            password: bcrypt.hashSync(body.password, 10),
            role: body.role
        });

        usuario.save((err, usuarioDb) => {
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

    actualizarUsuario: function(req, res) {
        let body = _.pick(req.body, ['nombre', 'email', 'img', 'role', 'estado']);
        let id = req.params.id
        Usuario.findByIdAndUpdate(id, body, { new: true, runValidators: true, context: 'query' }, (err, userDB) => {

            if (err) {

                return res.status(400).json({ ok: false, err });
            }

            res.json({ ok: true, usuario: userDB });


        });
    },

    borrarUsuario: function(req, res) {
        let id = req.params.id;

        Usuario.findByIdAndUpdate(id, { estado: false }, { new: true, runValidators: true, context: 'query' }, (err, userDB) => {
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

    login: (req, res) => {

        let body = req.body;

        Usuario.findOne({ email: body.email }, (err, userDB) => {

            if (err) {
                return res.status(500).json({ ok: false, err })
            }

            if (!userDB) {
                return res.status(400).json({ ok: false, err: { message: '(Usuario) o contraseña incorrectos' } })
            }

            if (!bcrypt.compareSync(body.password, userDB.password)) {
                return res.status(400).json({ ok: false, err: { message: 'Usuario o (contraseña) incorrectos' } })

            }

            let token = jwt.sign({ usuario: userDB }, process.env.SEED, { expiresIn: process.env.CADUCIDAD_TOKEN });

            res.json({ ok: true, usuario: userDB, token });

            console.log(token);



        });

    }

}

module.exports = { controller }